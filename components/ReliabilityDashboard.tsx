import React from 'react';
import type { ReliabilityReport, MetricStatus, ReliabilityMetric, TrustMetric, OSCEStation } from '../types';
import {
    ClipboardCheckIcon,
    InfoIcon,
    CheckBadgeIcon,
    XCircleIcon,
    ScaleIcon,
    ChartBarIcon,
    AcademicCapIcon,
    TerminalIcon,
    ExclamationIcon,
    CodeIcon,
    ClockIcon,
    TableIcon,
    ShieldExclamationIcon
} from './icons';

const statusStyles: Record<MetricStatus, { icon: React.FC<{className?: string}>, text: string, bg: string, border: string }> = {
    Pass: { icon: CheckBadgeIcon, text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
    Fail: { icon: XCircleIcon, text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
    Warning: { icon: ExclamationIcon, text: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    Running: { icon: () => <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>, text: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' },
    'Not Run': { icon: InfoIcon, text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
};

const metricToolIcons: Record<string, React.FC<{className?: string}>> = {
    "pytest": CodeIcon,
    "Locust": ClockIcon,
    "Great Expectations": TableIcon,
    "OWASP ZAP": ShieldExclamationIcon
}

const TableHeader: React.FC<{ headers: string[] }> = ({ headers }) => (
    <thead className="bg-slate-50">
        <tr>
            {headers.map((h, i) => (
                <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    {h}
                </th>
            ))}
        </tr>
    </thead>
);

const StatusCell: React.FC<{ status: MetricStatus }> = ({ status }) => {
    const style = statusStyles[status];
    const IconComponent = style.icon;
    return (
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                <IconComponent className="w-4 h-4" />
                {status}
            </span>
        </td>
    );
};

const ReliabilityDashboard: React.FC<{ report: ReliabilityReport }> = ({ report }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <ClipboardCheckIcon className="w-8 h-8 text-blue-600" />
                            Reliability & Credibility Dashboard
                        </h2>
                        <p className="text-slate-700 mt-1">A transparent, auditable view of the platform's validation status based on the Testkit.</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold text-slate-800">{report.reportVersion}</p>
                        <p className="text-xs text-slate-500">Generated: {new Date(report.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Technical Reliability */}
            <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                    <ChartBarIcon className="w-6 h-6 text-slate-600" />
                    1. Technical Reliability Battery
                </h3>
                <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['Metric', 'Tool', 'Value', 'Pass/Fail Threshold', 'Evidence Required', 'Status']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {report.technicalBattery.map((metric) => {
                                const ToolIcon = metricToolIcons[metric.tool] || CodeIcon;
                                return (
                                <tr key={metric.metric}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{metric.metric}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 flex items-center gap-2"><ToolIcon className="w-4 h-4"/>{metric.tool}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{metric.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{metric.threshold}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{metric.evidence}</td>
                                    <StatusCell status={metric.status} />
                                </tr>
                                )}
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
             {/* Credibility & Trust */}
            <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                    <ScaleIcon className="w-6 h-6 text-slate-600" />
                    2. Credibility & Trust Validation
                </h3>
                 <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['Theme', 'Instrument', 'Sample Size', 'Score', 'Target Score', 'Status']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {report.trustValidation.map((metric) => (
                                <tr key={metric.theme}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{metric.theme}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{metric.instrument}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{metric.sampleSize}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{metric.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{metric.targetScore}</td>
                                    <StatusCell status={metric.status} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Real-World & Human Tests */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">3. Real-World Outcome Test</h3>
                    <div className="space-y-3 text-sm">
                        <p><span className="font-semibold text-slate-700">Design:</span> {report.rctStatus.design}</p>
                        <p><span className="font-semibold text-slate-700">Primary Endpoint:</span> {report.rctStatus.primaryEndpoint}</p>
                        <p><span className="font-semibold text-slate-700">Secondary Endpoints:</span> {report.rctStatus.secondaryEndpoints.join(', ')}</p>
                        <p><span className="font-semibold text-slate-700">Duration:</span> {report.rctStatus.duration}</p>
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                             <p><span className="font-semibold text-slate-700">Registry:</span> <a href="#" className="underline text-blue-600 hover:text-blue-700">{report.rctStatus.registryId}</a></p>
                             <span className="font-bold text-white bg-blue-600 px-3 py-1 rounded-full text-xs">{report.rctStatus.status}</span>
                        </div>
                    </div>
                </div>
                 <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><AcademicCapIcon className="w-5 h-5"/>4. Least-Burden Human Exam (Mini-OSCE)</h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <TableHeader headers={['Station', 'Task', 'Pass Criteria', 'Result']} />
                            <tbody className="divide-y divide-slate-200">
                                {report.osceResult.stations.map(station => (
                                    <tr key={station.station}>
                                        <td className="px-4 py-3 text-sm font-semibold text-center text-slate-700">{station.station}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700">{station.task}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 italic">{station.passCriteria}</td>
                                        <td className="px-4 py-3"><StatusCell status={station.status as MetricStatus} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                        <TerminalIcon className="w-6 h-6 text-slate-600" />
                        5. Quick-Start Command Line
                    </h3>
                    <div className="bg-slate-800 text-white p-4 rounded-lg font-mono text-sm shadow-lg space-y-2">
                         {report.quickStartCommands.map(cmd => (
                            <p key={cmd.command}><span className="text-slate-400"># {cmd.description}</span><br/><span className="text-green-400">$</span> {cmd.command}</p>
                         ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                        <ExclamationIcon className="w-6 h-6 text-slate-600" />
                        6. Red-Flag Escalation Rules
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-2">
                        {report.escalationRules.map((rule, i) => (
                           <p key={i} className="text-sm text-red-800 flex items-start gap-2">
                               <span className="font-bold">{i+1}.</span> 
                               <span>{rule}</span>
                           </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Provenance Footer */}
            <div className="text-center text-xs text-slate-500 mt-6 p-3 bg-slate-100 rounded-md flex items-center justify-center gap-2 flex-wrap">
                <InfoIcon className="w-4 h-4" />
                <span><span className="font-semibold">Report ID:</span> {report.analysisId}</span>
                <span className="text-slate-300 hidden md:inline">|</span>
                <span><span className="font-semibold">Model:</span> {report.modelUsed}</span>
            </div>
        </div>
    );
};

export default ReliabilityDashboard;
