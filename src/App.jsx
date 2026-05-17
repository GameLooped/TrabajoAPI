import React from 'react';
import './index.css';

function App() {
  return (
    <>
      <nav className="navbar glass">
        <div className="logo">NexusTech</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="btn btn-outline">Sign In</button>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <div className="badge">🚀 Introducing NexusTech 2.0</div>
          <h1 className="title">
            Build the future with <span>stunning JSX pages</span>
          </h1>
          <p className="subtitle">
            Experience next-generation web development. We provide tools to create beautiful, responsive, and blazing-fast applications that your users will love.
          </p>
          <div className="cta-group">
            <button className="btn btn-primary">
              Get Started Free
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="btn btn-outline">View Documentation</button>
          </div>
        </div>
      </main>

      <section className="features" id="features">
        <div className="feature-card glass">
          <div className="feature-icon">✨</div>
          <h3 className="feature-title">Premium Design</h3>
          <p className="feature-desc">Crafted with modern aesthetics, glassmorphism, and beautiful typography to impress your users at first sight.</p>
        </div>
        <div className="feature-card glass">
          <div className="feature-icon">⚡️</div>
          <h3 className="feature-title">Lightning Fast</h3>
          <p className="feature-desc">Powered by Vite and React, ensuring rapid development cycles and incredibly fast load times for production.</p>
        </div>
        <div className="feature-card glass">
          <div className="feature-icon">🛡️</div>
          <h3 className="feature-title">Rock Solid</h3>
          <p className="feature-desc">Built on reliable foundations and best practices to guarantee a robust, scalable, and maintainable codebase.</p>
        </div>
      </section>
    </>
  );
}

export default App;
