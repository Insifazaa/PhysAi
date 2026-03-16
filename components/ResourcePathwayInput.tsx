
import React, { useState } from 'react';
import { CubeIcon } from './icons';

interface ResourcePathwayInputProps {
    isLoading: boolean;
    onGetPathway: (treatment: string) => void;
}

const ResourcePathwayInput: React.FC<ResourcePathwayInputProps> = ({ isLoading, onGetPathway }) => {
    const [treatment, setTreatment] = useState<string>('Piperacillin-tazobactam');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGetPathway(treatment);
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mt-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CubeIcon className="w-6 h-6 text-blue-600" />
                Resource-Adaptive Treatment Pathway
            </h2>
            <p className="text-sm text-slate-700 mt-2 mb-4">
                Enter a treatment to check its availability in the hospital pharmacy. If unavailable, the system will suggest alternatives.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-3">
                <div className="w-full">
                    <label htmlFor="treatment-name" className="block text-sm font-medium text-slate-700 mb-1">
                        Requested Treatment
                    </label>
                    <input
                        id="treatment-name"
                        type="text"
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g., Ceftriaxone"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 text-slate-900 placeholder:text-slate-500"
                    />
                     <p className="text-xs text-slate-500 mt-1">Hint: Try "Piperacillin-tazobactam" to see the 'unavailable' pathway.</p>
                </div>
                <div className="w-full md:w-auto flex-shrink-0">
                    <button
                        type="submit"
                        disabled={isLoading || !treatment.trim()}
                        className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Checking...
                            </>
                        ) : 'Check Pathway'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResourcePathwayInput;