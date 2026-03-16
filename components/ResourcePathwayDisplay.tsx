
import React from 'react';
import type { ResourcePathwayResult, TreatmentAlternative } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoIcon, CubeIcon, LightBulbIcon, DocumentTextIcon } from './icons';

const AvailabilityCard: React.FC<{ result: ResourcePathwayResult }> = ({ result }) => {
    const isAvailable = result.isAvailable;
    const Icon = isAvailable ? CheckCircleIcon : XCircleIcon;
    const colorClass = isAvailable ? 'text-green-600' : 'text-red-600';
    const bgClass = isAvailable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

    return (
        <div className={`p-6 rounded-lg border ${bgClass} shadow-sm`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Icon className={`w-12 h-12 flex-shrink-0 ${colorClass}`} />
                <div className="flex-1">
                    <h2 className={`text-xl font-bold ${colorClass}`}>{result.recommendation.header}</h2>
                    <p className="mt-1 text-slate-700">{result.recommendation.details}</p>
                    <p className="text-xs text-slate-500 mt-2">Source: {result.availabilitySource}</p>
                </div>
            </div>
        </div>
    );
};

const AlternativeCard: React.FC<{ alternative: TreatmentAlternative }> = ({ alternative }) => {
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="font-bold text-lg text-blue-700">{alternative.drugName}</h3>
            <div className="mt-3 space-y-3">
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <LightBulbIcon className="w-4 h-4 text-slate-500" />
                        Rationale
                    </h4>
                    <p className="text-sm text-slate-700 pl-6">{alternative.rationale}</p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4 text-slate-500" />
                        Evidence
                    </h4>
                    <p className="text-sm text-slate-700 pl-6 font-mono">{alternative.evidence}</p>
                </div>
                 <div>
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <InfoIcon className="w-4 h-4 text-slate-500" />
                        Notes
                    </h4>
                    <p className="text-sm text-slate-700 pl-6">{alternative.notes}</p>
                </div>
            </div>
        </div>
    );
};


const ResourcePathwayDisplay: React.FC<{ result: ResourcePathwayResult }> = ({ result }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <AvailabilityCard result={result} />
            
            {!result.isAvailable && result.alternatives.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <CubeIcon className="w-6 h-6 text-blue-600" />
                        Evidence-Based Alternative Pathways
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.alternatives.map((alt, index) => (
                            <AlternativeCard key={index} alternative={alt} />
                        ))}
                    </div>
                </div>
            )}
            
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

export default ResourcePathwayDisplay;
