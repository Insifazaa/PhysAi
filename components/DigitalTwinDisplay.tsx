

import React from 'react';
import type { DigitalTwinForecast, PredictedMetric } from '../types';
import { HeartIcon, InfoIcon, AlertTriangleIcon } from './icons';

const metricIcons: Record<string, React.FC<{ className?: string }>> = {
    'Mean Arterial Pressure (MAP)': HeartIcon,
    'Heart Rate': HeartIcon,
    'Lactate': (props) => <span className="font-bold text-sm" {...props}>La</span>,
};

const confidenceStyles: Record<string, string> = {
    High: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-red-100 text-red-800',
};

const PredictedMetricCard: React.FC<{ metric: PredictedMetric }> = ({ metric }) => {
    const IconComponent = metricIcons[metric.metricName] || InfoIcon;
    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
                <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    {metric.metricName}
                </h4>
                <p className="text-sm text-slate-600 mt-2 mb-1">Baseline: <span className="font-semibold">{metric.baseline}</span></p>
                <div className="mt-3 space-y-2">
                    {metric.forecast.map(point => (
                        <div key={point.timePoint} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">{point.timePoint}</span>
                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">{point.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-sm text-slate-700 mt-4 pt-3 border-t border-slate-200">{metric.summary}</p>
        </div>
    );
};

const DigitalTwinDisplay: React.FC<{ forecast: DigitalTwinForecast }> = ({ forecast }) => {
    const confidenceStyle = confidenceStyles[forecast.confidenceLevel] || 'bg-slate-100 text-slate-800';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Intervention Forecast</h2>
                        <p className="text-slate-700 mt-1">{forecast.interventionSummary}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold text-slate-800">Forecast Confidence</p>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${confidenceStyle}`}>
                            {forecast.confidenceLevel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Predicted Metrics */}
            <div>
                 <h3 className="text-xl font-semibold text-slate-900 mb-4">Predicted Physiological Response</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forecast.predictedMetrics.map((metric) => (
                        <PredictedMetricCard key={metric.metricName} metric={metric} />
                    ))}
                </div>
            </div>
            
            {/* Risks and Mitigations */}
            {forecast.risksAndMitigations && forecast.risksAndMitigations.length > 0 && (
                 <div>
                    <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3 mb-4">
                        <AlertTriangleIcon className="w-6 h-6 text-orange-600" />
                        Potential Risks & Mitigations
                    </h3>
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <ul className="space-y-3">
                            {forecast.risksAndMitigations.map((risk, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                                    <span className="text-slate-700">{risk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}


            {/* Provenance Footer */}
            <div className="text-center text-xs text-slate-500 mt-6 p-3 bg-slate-100 rounded-md flex items-center justify-center gap-2 flex-wrap">
                <InfoIcon className="w-4 h-4" />
                <span><span className="font-semibold">Forecast ID:</span> {forecast.forecastId}</span>
                 <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Generated:</span> {new Date(forecast.timestamp).toLocaleString()}</span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Model:</span> {forecast.modelUsed}</span>
            </div>
        </div>
    );
};

export default DigitalTwinDisplay;
