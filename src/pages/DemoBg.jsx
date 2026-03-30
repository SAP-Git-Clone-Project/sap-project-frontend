import React, { useState } from 'react';
import FluidBackground from '@/components/background/FluidBackground';

const DemoPage = () => {
  // State to toggle roles so you can see the background change live
  const [role, setRole] = useState('user');

  return (
    <FluidBackground>
      {/* Main Wrapper */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        
        {/* Navigation / Role Switcher */}
        <nav className="fixed top-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 flex gap-4 z-50">
          {['user', 'premium', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`capitalize transition-all duration-300 text-sm font-medium ${
                role === r ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </nav>

        {/* Hero Card */}
        <main className="max-w-4xl w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl text-center">
          <header className="space-y-4">
            <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-xs font-semibold tracking-widest uppercase text-blue-400 border border-blue-500/30">
              Personalized UI Engine
            </span>
            
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Fluid</span> Design
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              The background isn't just a video—it's a living physics simulation reacting to your 
              <strong> {role}</strong> status and mouse movements in real-time.
            </p>
          </header>

          {/* Interactive Feature Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-blue-400 font-bold mb-2">Role Aware</h3>
              <p className="text-sm text-slate-400">Physics, speed, and density change based on user tier.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-purple-400 font-bold mb-2">Interactive</h3>
              <p className="text-sm text-slate-400">Blobs are magnetically attracted to your cursor movements.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-orange-400 font-bold mb-2">Universal</h3>
              <p className="text-sm text-slate-400">One single component that supports any child content.</p>
            </div>
          </section>

          {/* CTA Button */}
          <div className="mt-12">
            <button className="px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-blue-400 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Get Started Now
            </button>
          </div>
        </main>

        {/* Footer Hint */}
        <footer className="mt-8 text-slate-500 text-sm">
          Scroll down or move your mouse to see the "Gooey" effect in action.
        </footer>
      </div>
    </FluidBackground>
  );
};

export default DemoPage;