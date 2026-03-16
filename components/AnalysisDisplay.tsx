import React, { useState } from 'react';
import type { AnalysisResult, ClinicalTheme, RiskAssessment, AlertLevel, ClinicianRole } from '../types';
import { SummaryIcon, InsightIcon, ThemeIcon, EvidenceIcon, SentimentIcon, AlertTriangleIcon, ShieldCheckIcon, InfoIcon, LightBulbIcon } from './icons';
import CounterfactualExplainer from './CounterfactualExplainer';

const urgencyStyles = {
  Low: {
    base: 'bg-green-100 text-green-800 border-green-200',
    border: 'border-slate-200/80',
    icon: null,
  },
  Medium: {
    base: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    border: 'border-slate-200/80',
    icon: null,
  },
  High: {
    base: 'bg-orange-100 text-orange-800 border-orange-200',
    border: 'border-orange-300',
    icon: null,
  },
  Critical: {
    base: 'bg-red-200 text-red-900 border-red-300',
    border: 'border-red-400 shadow-lg',
    icon: <AlertTriangleIcon className="w-5 h-5 text-red-600" />,
  },
};

const ThemeCard: React.FC<{ theme: ClinicalTheme }> = ({ theme }) => {
    const styles = urgencyStyles[theme.urgency];
    return (
        <div className={`p-4 rounded-lg border ${styles.border} transition-all hover:shadow-md bg-white`}>
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
                    {styles.icon}
                    {theme.theme}
                </h4>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${styles.base}`}>
                    {theme.urgency}
                </span>
            </div>
            <div className="space-y-2 mt-3">
                <h5 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <EvidenceIcon className="w-4 h-4 text-slate-500" />
                    Supporting Evidence
                </h5>
                <ul className="list-none space-y-2 pl-1">
                {theme.evidence.map((ev, i) => (
                    <li key={i} className="text-sm text-slate-700 border-l-2 border-slate-200 pl-3 italic">
                    "{ev}"
                    </li>
                ))}
                </ul>
            </div>
        </div>
    );
};

const RiskGauge: React.FC<{ score: number }> = ({ score }) => {
    const percentage = Math.max(0, Math.min(100, score));
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    let colorClass = 'text-green-500';
    if (percentage > 75) colorClass = 'text-red-500';
    else if (percentage > 50) colorClass = 'text-orange-500';
    else if (percentage > 25) colorClass = 'text-yellow-500';

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
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
            <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
        </div>
    );
};

const RiskAssessmentCard: React.FC<{ assessment: RiskAssessment }> = ({ assessment }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3 mb-4">
            <ShieldCheckIcon className="w-7 h-7 text-blue-600" />
            Predictive Risk Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center text-center">
                <RiskGauge score={assessment.riskScore} />
                <p className="text-lg font-bold mt-2">{assessment.riskLevel} Risk</p>
                <p className="text-xs text-slate-600">{assessment.predictionModel}</p>
            </div>
            <div className="md:col-span-2">
                <p className="text-slate-700 leading-relaxed mb-4">{assessment.summary}</p>
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Key Contributing Factors</h4>
                    <ul className="space-y-2">
                    {assessment.keyContributors.map((factor, i) => (
                        <li key={i} className="flex items-center text-sm text-slate-700">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3"></div>
                            {factor}
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const ProvenanceFooter: React.FC<{ result: {analysisId: string, timestamp: string, modelUsed: string}; }> = ({ result }) => (
    <div className="text-center text-xs text-slate-500 mt-8 p-3 bg-slate-100 rounded-md flex items-center justify-center gap-2 flex-wrap">
        <InfoIcon className="w-4 h-4" />
        <span><span className="font-semibold">Analysis ID:</span> {result.analysisId}</span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span><span className="font-semibold">Generated:</span> {new Date(result.timestamp).toLocaleString()}</span>
        <span className="text-slate-300 hidden md:inline">|</span>
        <span><span className="font-semibold">Model:</span> {result.modelUsed}</span>
    </div>
);


const AnalysisDisplay: React.FC<{ result: AnalysisResult; alertLevel: AlertLevel; role: ClinicianRole; isOffline: boolean; originalTranscript: string; }> = ({ result, alertLevel, role, isOffline, originalTranscript }) => {
  const [explainerOpen, setExplainerOpen] = useState(false);
  
  const displayedThemes = alertLevel === 'critical' 
    ? result.clinicalThemes.filter(t => t.urgency === 'Critical') 
    : result.clinicalThemes;
  const hiddenThemesCount = result.clinicalThemes.length - displayedThemes.length;

  return (
    <div className="space-y-8 animate-fade-in">
      <CounterfactualExplainer 
        isOpen={explainerOpen}
        onClose={() => setExplainerOpen(false)}
        originalTranscript={originalTranscript}
        analysisSummary={result.patientSummary}
        role={role}
        isOffline={isOffline}
      />
      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-md p-3 text-center">
        This view is designed for seamless integration into EHR flowsheets (SMART-on-FHIR compatible).
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
                <SummaryIcon className="w-6 h-6 text-blue-600" />
                Patient Summary
            </h3>
            <p className="mt-3 text-slate-700 leading-relaxed">{result.patientSummary}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-3">
                <SentimentIcon className="w-6 h-6 text-blue-600" />
                Sentiment
            </h3>
            <div className="mt-3 space-y-3">
                <div>
                    <p className="text-sm text-slate-600">Patient Sentiment</p>
                    <p className="font-semibold text-slate-800">{result.sentiment.patientSentiment}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-600">Session Trajectory</p>
                    <p className="font-semibold text-slate-800">{result.sentiment.sessionTrajectory}</p>
                </div>
            </div>
        </div>
      </div>
      
      {result.riskAssessment && <RiskAssessmentCard assessment={result.riskAssessment} />}

      <div>
        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3 mb-4">
            <ThemeIcon className="w-7 h-7 text-blue-600" />
            Clinical Themes
        </h3>
        {hiddenThemesCount > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md">
                {hiddenThemesCount} non-critical theme(s) are hidden. Switch "Alert Level" to "Show All" to view them.
            </div>
        )}
        {displayedThemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedThemes.map((theme, i) => (
                <ThemeCard key={i} theme={theme} />
            ))}
            </div>
        ) : (
            <div className="text-center py-12 px-6 bg-white rounded-lg border border-slate-200">
                <p className="text-slate-600">No critical themes were identified in this transcript.</p>
            </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                <InsightIcon className="w-7 h-7 text-blue-600" />
                Actionable Insights
            </h3>
             <button 
                onClick={() => setExplainerOpen(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition flex items-center gap-2">
                <LightBulbIcon className="w-4 h-4" />
                Why not...?
            </button>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <ul className="space-y-3">
            {result.actionableInsights.map((insight, i) => (
              <li key={i} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ProvenanceFooter result={{analysisId: result.analysisId, timestamp: result.timestamp, modelUsed: result.modelUsed}}/>
    </div>
  );
};

export default AnalysisDisplay;