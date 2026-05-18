import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const allTypes = [
  'normal','fire','water','electric','grass','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'
];

const typeColorHex = {
  normal:'#A8A77A', fire:'#EE8130', water:'#6390F0', electric:'#F7D02C',
  grass:'#7AC74C', ice:'#96D9D6', fighting:'#C22E28', poison:'#A33EA1',
  ground:'#E2BF65', flying:'#A98FF3', psychic:'#F95587', bug:'#A6B91A',
  rock:'#B6A136', ghost:'#735797', dragon:'#6F35FC', dark:'#705746',
  steel:'#B7B7CE', fairy:'#D685AD'
};

export default function TypeChart() {
  const { t } = useLanguage();
  const [typeData, setTypeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      const data = {};
      const promises = allTypes.map(async (type) => {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const json = await res.json();
        data[type] = json.damage_relations;
      });
      await Promise.all(promises);
      setTypeData(data);
      setLoading(false);
    };
    fetchTypes();
  }, []);

  const getMultiplier = (attackType, defenseType) => {
    if (!typeData[attackType]) return 1;
    const rel = typeData[attackType];
    if (rel.double_damage_to.some(t => t.name === defenseType)) return 2;
    if (rel.half_damage_to.some(t => t.name === defenseType)) return 0.5;
    if (rel.no_damage_to.some(t => t.name === defenseType)) return 0;
    return 1;
  };

  const getCellColor = (mult) => {
    if (mult === 2) return 'bg-green-500 text-white';
    if (mult === 0.5) return 'bg-red-400 text-white';
    if (mult === 0) return 'bg-slate-900 text-slate-400';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-400';
  };

  const getCellLabel = (mult) => {
    if (mult === 2) return '2×';
    if (mult === 0.5) return '½';
    if (mult === 0) return '0';
    return '1';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">
          ⚡ {t('typeChart') || 'Tabla de Tipos'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          {t('typeChartDesc') || 'Filas = Atacante, Columnas = Defensor'}
        </p>
        <div className="flex justify-center gap-4 mt-3 text-xs font-bold">
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-green-500 inline-block"></span> 2× Super Efectivo</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-red-400 inline-block"></span> ½ No Efectivo</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-slate-900 inline-block"></span> 0 Inmune</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="min-w-max border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-200 dark:bg-slate-900 p-1 text-[9px] font-black text-slate-500 w-16">
                ATK↓ DEF→
              </th>
              {allTypes.map(type => (
                <th key={type} className="p-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[8px] font-black uppercase leading-tight"
                    style={{ backgroundColor: typeColorHex[type] }}
                  >
                    {type.slice(0, 3)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTypes.map(atkType => (
              <tr key={atkType}>
                <td className="sticky left-0 z-10 bg-slate-100 dark:bg-slate-900 p-1">
                  <div 
                    className="w-16 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-black uppercase"
                    style={{ backgroundColor: typeColorHex[atkType] }}
                  >
                    {t(`types.${atkType}`).slice(0, 5)}
                  </div>
                </td>
                {allTypes.map(defType => {
                  const mult = getMultiplier(atkType, defType);
                  const isHovered = hoveredCell?.atk === atkType && hoveredCell?.def === defType;
                  return (
                    <td 
                      key={defType} 
                      className="p-0.5"
                      onMouseEnter={() => setHoveredCell({ atk: atkType, def: defType })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className={`w-10 h-8 rounded flex items-center justify-center text-xs font-black transition-transform ${getCellColor(mult)} ${isHovered ? 'scale-125 ring-2 ring-white shadow-lg z-10 relative' : ''}`}>
                        {getCellLabel(mult)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hoveredCell && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-sm font-bold z-50">
          <span className="capitalize" style={{ color: typeColorHex[hoveredCell.atk] }}>{hoveredCell.atk}</span>
          {' → '}
          <span className="capitalize" style={{ color: typeColorHex[hoveredCell.def] }}>{hoveredCell.def}</span>
          {': '}
          <span className={getMultiplier(hoveredCell.atk, hoveredCell.def) === 2 ? 'text-green-500' : getMultiplier(hoveredCell.atk, hoveredCell.def) < 1 ? 'text-red-500' : 'text-slate-500'}>
            {getCellLabel(getMultiplier(hoveredCell.atk, hoveredCell.def))}
          </span>
        </div>
      )}
    </div>
  );
}
