import React from 'react';
import type { AppMode } from '../types';

interface ModeSelectorProps {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
    isOffline: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode, isOffline }) => {
    const modes: { id: AppMode; label: string }[] = [
        { id: 'transcript', label: 'Transcript Analysis' },
        { id: 'ambient_orders', label: 'Ambient Orders' },
        { id: 'multimodal', label: 'Multimodal Risk' },
        { id: 'handoff', label: 'ICU Handoff' },
        { id: 'resource_pathway', label: 'Resource Pathways' },
        { id: 'digital_twin', label: 'Digital Twin' },
        { id: 'synthetic_data', label: 'Synthetic Data' },
        { id: 'reliability', label: 'Reliability' },
    ];

    const onlineOnlyModes: AppMode[] = ['digital_twin', 'synthetic_data', 'reliability'];

    return (
        <div className="mb-2 p-1 bg-slate-200/80 rounded-lg flex items-center w-full max-w-4xl mx-auto shadow-inner overflow-x-auto">
            {modes.map(({ id, label }) => {
                const isDisabled = isOffline && onlineOnlyModes.includes(id);
                return (
                    <button
                        key={id}
                        onClick={() => setMode(id)}
                        disabled={isDisabled}
                        title={isDisabled ? 'This feature requires an online connection' : ''}
                        className={`flex-1 min-w-max py-2 px-2 text-xs md:text-sm font-semibold rounded-md transition-all duration-300 ease-in-out transform focus:outline-none
                            ${mode === id 
                                ? 'bg-white text-blue-600 shadow-md' 
                                : 'text-slate-600 hover:bg-slate-300/60'
                            }
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

export default ModeSelector;