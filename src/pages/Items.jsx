import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ItemCard from '../components/ItemCard';
import { Search } from 'lucide-react';

export default function Items() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchItems(0);
  }, []);

  const fetchItems = async (currentOffset) => {
    try {
      if (currentOffset === 0) setLoading(true);
      else setIsLoadingMore(true);

      const res = await fetch(`https://pokeapi.co/api/v2/item?limit=50&offset=${currentOffset}`);
      const data = await res.json();
      
      const itemPromises = data.results.map(async (item) => {
        const itemRes = await fetch(item.url);
        return itemRes.json();
      });

      const newItems = await Promise.all(itemPromises);
      
      setItems(prev => {
        const existingIds = new Set(prev.map(i => i.id));
        const filteredNew = newItems.filter(i => !existingIds.has(i.id));
        return [...prev, ...filteredNew];
      });
      
      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("Error fetching Items:", error);
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredItems(items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const handleLoadMore = () => {
    const newOffset = offset + 50;
    setOffset(newOffset);
    fetchItems(newOffset);
  };

  return (
    <div>
      <div className="sticky top-20 z-40 mb-8 transition-all">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
              placeholder={t('items') + "..."}
            />
          </div>
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 font-medium text-lg">
              No items found.
            </div>
          )}
        </div>
      )}

      {!loading && filteredItems.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="bg-slate-800 hover:bg-slate-900 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 disabled:opacity-70 flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                {t('loading')}
              </>
            ) : (
              t('loadMore') || 'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
