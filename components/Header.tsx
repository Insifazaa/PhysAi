
import React from 'react';
import { LogoIcon, GlobeAltIcon, LockClosedIcon, WifiSlashIcon } from './icons';
import type { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  isOffline: boolean;
  setIsOffline: (isOffline: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, isOffline, setIsOffline }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-slate-900 tracking-tight leading-tight">
                Project Psyche-Journey
              </span>
              <span className="text-xs text-slate-600 leading-tight">Codename: Decision OS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" title="Simulate Offline-First Capability">
                <WifiSlashIcon className={`h-5 w-5 ${isOffline ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className={`text-xs font-medium ${isOffline ? 'text-slate-800' : 'text-slate-500'}`}>Offline Mode</span>
                 <button
                    type="button"
                    onClick={() => setIsOffline(!isOffline)}
                    className={`${isOffline ? 'bg-orange-500' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                    role="switch"
                    aria-checked={isOffline}
                >
                    <span
                    aria-hidden="true"
                    className={`${isOffline ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                </button>
            </div>
             <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="relative group flex items-center gap-1 text-slate-600" title="End-to-end mTLS encryption via SPIFFE/SPIRE">
                <LockClosedIcon className="h-5 w-5 text-green-600" />
                <span className="text-xs font-medium text-slate-700 hidden lg:inline">Secure</span>
            </div>
            <div className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-slate-500" />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-white border-none text-sm text-slate-700 font-medium focus:ring-0 rounded-md p-1"
                >
                    <option value="en">English</option>
                    <option value="si">සිංහල</option>
                    <option value="ta">தமிழ்</option>
                </select>
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full hidden md:inline">
                v1.1 Clinical AI
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
