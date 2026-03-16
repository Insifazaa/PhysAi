import React, { useState, useCallback } from 'react';
import { getCounterfactualExplanation } from '../services/geminiService';
import type { CounterfactualExplanation, ClinicianRole } from '../types';
import { LightBulbIcon, XCircleIcon, InfoIcon, DocumentTextIcon } from './icons';
import ErrorMessage from './ErrorMessage';

interface CounterfactualExplainerProps {
    isOpen: boolean;
    onClose: () => void;
    originalTranscript: string;
    analysisSummary: string;
    role: ClinicianRole;
    isOffline: boolean;
}

const ProvenanceFooter: React.FC<{ result: {analysisId: string, timestamp: string, modelUsed: string}; }> = ({ result }) => (
    <div className="text-center text-xs text-slate-500 mt-4 p-2 bg-slate-100 rounded-md flex items-center justify-center gap-2 flex-wrap">
        <InfoIcon className="w-4 h-4" />
        <span><span className="font-semibold">Explain ID:</span> {result.analysisId}</span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span><span className="font-semibold">Generated:</span> {new Date(result.timestamp).toLocaleString()}</span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span><span className="font-semibold">Model:</span> {result.modelUsed}</span>
    </div>
);


const CounterfactualExplainer: React.FC<CounterfactualExplainerProps> = ({ isOpen, onClose, originalTranscript, analysisSummary, role, isOffline }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [explanation, setExplanation] = useState<CounterfactualExplanation | null>(null);

    const handleExplain = useCallback(async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        setExplanation(null);
        try {
            const result = await getCounterfactualExplanation(originalTranscript, analysisSummary, query, role, isOffline);
            setExplanation(result);
        } catch (err) {
            console.error(err);
            setError('Failed to generate explanation. Please check the console.');
        } finally {
            setIsLoading(false);
        }
    }, [query, originalTranscript, analysisSummary, role, isOffline]);

    const handleClose = () => {
        setQuery('');
        setError(null);
        setExplanation(null);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={handleClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                           <LightBulbIcon className="w-6 h-6 text-blue-600"/>
                           Counterfactual Explainer
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">Ask the AI to justify why an alternative was not recommended.</p>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded-full hover:bg-slate-100">
                        <XCircleIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="why-not-query" className="block text-sm font-medium text-slate-800 mb-1">
                                Your "Why not...?" question:
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="why-not-query"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., Why not screen for depression?"
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleExplain}
                                    disabled={isLoading || !query.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Thinking...' : 'Explain'}
                                </button>
                            </div>
                        </div>
                        
                        {isLoading && (
                             <div className="flex flex-col items-center justify-center text-center p-8">
                                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <p className="mt-3 text-md font-semibold text-slate-700">Generating Explanation</p>
                             </div>
                        )}
                        {error && <ErrorMessage message={error} />}

                        {explanation && (
                            <div className="space-y-4 pt-4 border-t border-slate-200 animate-fade-in">
                               <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                    <h3 className="font-bold text-blue-800">Primary Reason</h3>
                                    <p className="mt-1 text-blue-900">{explanation.primaryReason}</p>
                               </div>

                               <div>
                                   <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><DocumentTextIcon className="w-5 h-5 text-slate-500"/>Evidence from Transcript</h4>
                                   <ul className="space-y-2">
                                       {explanation.supportingEvidence.fromText.map((e, i) => <li key={i} className="text-sm text-slate-700 border-l-2 border-slate-200 pl-3 italic">"{e}"</li>)}
                                   </ul>
                               </div>
                               <div>
                                   <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><InfoIcon className="w-5 h-5 text-slate-500"/>Evidence from Knowledge Base</h4>
                                    <ul className="space-y-2">
                                       {explanation.supportingEvidence.fromKnowledgeBase.map((e, i) => <li key={i} className="text-sm text-slate-700 pl-2">{e}</li>)}
                                   </ul>
                               </div>
                               <ProvenanceFooter result={explanation} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounterfactualExplainer;
