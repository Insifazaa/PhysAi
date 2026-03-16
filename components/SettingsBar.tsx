
import React from 'react';
import { UserCircleIcon } from './icons';
import type { ClinicianRole, AlertLevel, Language, AppMode } from '../types';

interface SettingsBarProps {
    role: ClinicianRole;
    setRole: (role: ClinicianRole) => void;
    alertLevel: AlertLevel;
    setAlertLevel: (level: AlertLevel) => void;
    language: Language;
    currentMode: AppMode;
}

const roleDisplayNames: Record<ClinicianRole, string> = {
    psychiatrist: 'Psychiatrist',
    intensivist: 'Intensivist',
    gp: 'General Practitioner',
    sl_nurse: 'SL Pilot Nurse',
    researcher: 'Researcher',
};

const settingsBarTranslations = {
    en: {
        roleLabel: "Clinician Role Context",
        alertLabel: "Ambient Alert Level",
        showAll: "Show All",
        criticalOnly: "Critical Only"
    },
    si: {
        roleLabel: "සායනික භූමිකාව",
        alertLabel: "ඇඟවීම් මට්ටම",
        showAll: "සියල්ල පෙන්වන්න",
        criticalOnly: "තීරණාත්මක පමණි"
    },
    ta: {
        roleLabel: "மருத்துவர் பங்கு",
        alertLabel: "எச்சரிக்கை நிலை",
        showAll: "அனைத்தையும் காட்டு",
        criticalOnly: "முக்கியமானவை மட்டும்"
    }
}


const SettingsBar: React.FC<SettingsBarProps> = ({ role, setRole, alertLevel, setAlertLevel, language, currentMode }) => {
    const T = settingsBarTranslations[language];
    const isAlertsDisabled = currentMode !== 'transcript';

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mt-6">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-end`}>
                {/* Clinician Role Selector */}
                <div>
                    <label htmlFor="clinician-role" className="block text-sm font-medium text-slate-800 mb-1">
                        {T.roleLabel}
                    </label>
                    <div className="relative">
                        <UserCircleIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-slate-400" />
                        <select
                            id="clinician-role"
                            value={role}
                            onChange={e => setRole(e.target.value as ClinicianRole)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            {Object.entries(roleDisplayNames).map(([key, name]) => (
                                <option key={key} value={key}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ambient Monitoring Alert Level */}
                <div className={isAlertsDisabled ? 'opacity-50' : ''}>
                    <label className="block text-sm font-medium text-slate-800 mb-1">
                        {T.alertLabel}
                        {isAlertsDisabled && <span className="text-xs text-slate-500 ml-2">(N/A for this mode)</span>}
                    </label>
                    <div className="flex rounded-md border border-slate-300 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setAlertLevel('all')}
                            disabled={isAlertsDisabled}
                            className={`flex-1 px-4 py-2 text-sm rounded-l-md transition ${alertLevel === 'all' && !isAlertsDisabled ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'} disabled:cursor-not-allowed`}
                        >
                            {T.showAll}
                        </button>
                        <button
                            type="button"
                            onClick={() => setAlertLevel('critical')}
                             disabled={isAlertsDisabled}
                            className={`flex-1 px-4 py-2 text-sm rounded-r-md transition border-l border-slate-300 ${alertLevel === 'critical' && !isAlertsDisabled ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'} disabled:cursor-not-allowed`}
                        >
                            {T.criticalOnly}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsBar;
