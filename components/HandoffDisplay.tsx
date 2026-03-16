

import React from 'react';
import type { HandoffSummary, SystemReview } from '../types';
import {
    HeartIcon,
    LungIcon,
    BrainCircuit,
    KidneyIcon,
    MicrobeIcon,
    ClipboardListIcon,
    InfoIcon,
    AlertTriangleIcon
} from './icons';

const systemStyles: { [key: string]: { icon: React.FC<{className?: string}>, color: string } } = {
    Cardiovascular: { icon: HeartIcon, color: 'text-red-500' },
    Respiratory: { icon: LungIcon, color: 'text-sky-500' },
    Neurological: { icon: BrainCircuit, color: 'text-purple-500' },
    'Renal/Metabolic': { icon: KidneyIcon, color: 'text-amber-600' },
    'Gastrointestinal': { icon: (props) => <div {...props} >GI</div>, color: 'text-lime-600' }, // Placeholder
    'Infectious Disease': { icon: MicrobeIcon, color: 'text-orange-500' },
    Plan: { icon: ClipboardListIcon, color: 'text-slate-700' },
};

const statusStyles: { [key: string]: string } = {
    Stable: 'bg-green-100 text-green-800',
    Improving: 'bg-blue-100 text-blue-800',
    Worsening: 'bg-red-100 text-red-800',
    Concern: 'bg-yellow-100 text-yellow-800',
};

const SystemReviewCard: React.FC<{ review: SystemReview }> = ({ review }) => {
    const style = systemStyles[review.systemName] || { icon: InfoIcon, color: 'text-slate-600' };
    const IconComponent = style.icon;

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h4 className={`text-md font-semibold flex items-center gap-2 ${style.color}`}>
                    <IconComponent className="w-5 h-5" />
                    {review.systemName}
                </h4>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusStyles[review.status]}`}>
                    {review.status}
                </span>
            </div>
            <div className="flex-grow">
                <ul className="space-y-2">
                    {review.details.map((detail, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-700">
                             <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                            <span>{detail}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const HandoffDisplay: React.FC<{ summary: HandoffSummary }> = ({ summary }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">ICU Shift Handoff Summary</h2>
                        <p className="text-slate-700">{summary.patientIdentifier}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-slate-800">{summary.summaryPeriod}</p>
                        <p className="text-xs text-slate-500">Generated: {new Date(summary.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Presenting Problem & Key Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-2">Presenting Problem</h3>
                    <p className="text-sm text-slate-700">{summary.presentingProblem}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-2">Key Events (Last 12h)</h3>
                    <ul className="space-y-1">
                        {summary.keyEvents.map((event, i) => (
                            <li key={i} className="flex items-center text-sm text-slate-700">
                                <AlertTriangleIcon className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                                {event}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* System Reviews */}
            <div>
                 <h3 className="text-xl font-semibold text-slate-900 mb-4">Systems Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {summary.systemReviews.map((review) => (
                        <SystemReviewCard key={review.systemName} review={review} />
                    ))}
                </div>
            </div>

            {/* Provenance Footer */}
            <div className="text-center text-xs text-slate-500 mt-6 p-3 bg-slate-100 rounded-md flex items-center justify-center gap-2 flex-wrap">
                <InfoIcon className="w-4 h-4" />
                <span><span className="font-semibold">Analysis ID:</span> {summary.analysisId}</span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Model:</span> {summary.modelUsed}</span>
            </div>
        </div>
    );
};

export default HandoffDisplay;