

import React from 'react';
import type { MultimodalRiskResult } from '../types';
import {
    ShieldCheckIcon,
    InfoIcon,
    AlertTriangleIcon,
    DocumentTextIcon,
    CameraIcon,
    SpeakerWaveIcon,
} from './icons';

const RiskGauge: React.FC<{ score: number }> = ({ score }) => {
    const percentage = Math.max(0, Math.min(100, score));
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    let colorClass = 'text-green-500';
    if (percentage > 75) colorClass = 'text-red-500';
    else if (percentage > 50) colorClass = 'text-orange-500';
    else if (percentage > 25) colorClass = 'text-yellow-500';

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
        </div>
    );
};

const FactorCard: React.FC<{ title: string; factors: string[]; Icon: React.FC<{ className?: string }> }> = ({ title, factors, Icon }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
            <Icon className="w-5 h-5 text-slate-500" />
            {title}
        </h4>
        <ul className="space-y-2">
            {factors.length > 0 ? factors.map((factor, i) => (
                <li key={i} className="flex items-start text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                    {factor}
                </li>
            )) : <li className="text-sm text-slate-600 italic">No significant factors identified from this modality.</li>}
        </ul>
    </div>
);


const MultimodalRiskDisplay: React.FC<{ result: MultimodalRiskResult }> = ({ result }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header and Risk Score */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-slate-900">Multimodal Risk Stratification</h2>
                    <p className="text-slate-700 mt-1 font-semibold">{result.diseaseFocus}</p>
                    <p className="text-sm text-slate-600 mt-2">{result.summary}</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                    <RiskGauge score={result.riskScore} />
                    <p className="text-xl font-bold mt-2">{result.riskLevel} Risk</p>
                    <p className="text-xs text-slate-500">Patient ID: {result.patientIdentifier}</p>
                </div>
            </div>

            {/* Contributing Factors */}
            <div>
                 <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Contributing Factors by Modality</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FactorCard title="Clinical Findings" factors={result.contributingFactors.clinical} Icon={DocumentTextIcon} />
                    <FactorCard title="Imaging Findings" factors={result.contributingFactors.imaging} Icon={CameraIcon} />
                    <FactorCard title="Audio Signature" factors={result.contributingFactors.audio} Icon={SpeakerWaveIcon} />
                </div>
            </div>
            
            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
                 <div>
                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3 mb-4">
                        <AlertTriangleIcon className="w-6 h-6 text-blue-600" />
                        Recommendations
                    </h3>
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <ul className="space-y-3">
                            {result.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start">
                                     <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-slate-700">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Provenance Footer */}
            <div className="text-center text-xs text-slate-500 mt-6 p-3 bg-slate-100 rounded-md flex items-center justify-center gap-2 flex-wrap">
                <InfoIcon className="w-4 h-4" />
                <span><span className="font-semibold">Analysis ID:</span> {result.analysisId}</span>
                 <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Generated:</span> {new Date(result.timestamp).toLocaleString()}</span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Model:</span> {result.modelUsed}</span>
            </div>
        </div>
    );
};

export default MultimodalRiskDisplay;
