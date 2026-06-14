import React from 'react';
import Header from './components/Header';
import EcosystemCanvas from './components/EcosystemCanvas';
import SmartNudge from './components/SmartNudge';
import CompositionChart from './components/CompositionChart';
import TabbedControls from './components/TabbedControls';
import ActionLedger from './components/ActionLedger';
import ReferenceLibrary from './components/ReferenceLibrary';
import { useTelemetry } from './hooks/useTelemetry';

/**
 * App - Root Orchestrator Entry Point for EcoSphere
 * Mounts modular UI panels and binds them to the custom useTelemetry state hook.
 */
export default function App() {
  const {
    activeTab,
    setActiveTab,
    telemetry,
    results,
    ledger,
    nudge,
    nudgeLoading,
    apiError,
    handleModifyTelemetry,
    handleReset,
    handleRefreshNudge
  } = useTelemetry();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans antialiased">
      {/* App Navigation Header */}
      <Header handleReset={handleReset} />

      {/* Main Core Dashboard Grid Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Ecosystem Map Graphic Canvas */}
        <EcosystemCanvas results={results} />

        {/* Right Side: Analytical Controls and Smart Advisor */}
        <section role="region" aria-label="Contextual Tracker" className="lg:col-span-7 flex flex-col space-y-6">
          {apiError && (
            <div 
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between" 
              role="alert"
            >
              <span>{apiError}</span>
              <button 
                onClick={handleRefreshNudge} 
                className="font-bold underline tracking-wide focus:outline-none"
              >
                Sync
              </button>
            </div>
          )}

          {/* AI Advisor Panel */}
          <SmartNudge 
            nudge={nudge} 
            nudgeLoading={nudgeLoading} 
            handleRefreshNudge={handleRefreshNudge} 
          />

          {/* Footprint Radial Distribution Composition Chart */}
          <CompositionChart results={results} />

          {/* User habit control tab containers */}
          <TabbedControls
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            telemetry={telemetry}
            handleModifyTelemetry={handleModifyTelemetry}
          />
        </section>

        {/* Chronological System Journal */}
        <ActionLedger ledger={ledger} />

        {/* Localized environmental reference library */}
        <ReferenceLibrary />
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500 mt-12 font-medium">
        <p>
          © 2026 EcoSphere. Orchestrated via Advanced Prompt-Driven Engineering for PromptWars Challenge 3. 
          Optimized for Carbon Footprint Awareness & Behavioral Nudging.
        </p>
      </footer>
    </div>
  );
}