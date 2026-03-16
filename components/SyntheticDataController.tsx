
import React, { useState } from 'react';
import { UsersIcon } from './icons';

interface SyntheticDataControllerProps {
    isLoading: boolean;
    onGenerate: (params: { patientCount: number; primaryCondition: string; ageRange: string; }) => void;
}

const SyntheticDataController: React.FC<SyntheticDataControllerProps> = ({ isLoading, onGenerate }) => {
    const [patientCount, setPatientCount] = useState<number>(10);
    const [primaryCondition, setPrimaryCondition] = useState<string>('Dengue Fever');
    const [ageRange, setAgeRange] = useState<string>('20-60');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({
            patientCount: Number(patientCount),
            primaryCondition,
            ageRange
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mt-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <UsersIcon className="w-6 h-6 text-blue-600" />
                ELYSIUM: Cohort Builder
            </h2>
            <p className="text-sm text-slate-700 mt-2 mb-4">
                Define the parameters for the synthetic patient cohort you want to generate.
            </p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1">
                    <label htmlFor="patient-count" className="block text-sm font-medium text-slate-700 mb-1">
                        Patient Count
                    </label>
                    <input
                        id="patient-count"
                        type="number"
                        value={patientCount}
                        onChange={(e) => setPatientCount(Number(e.target.value))}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 text-slate-900"
                        min="1"
                        max="100"
                    />
                </div>
                 <div className="md:col-span-1">
                    <label htmlFor="age-range" className="block text-sm font-medium text-slate-700 mb-1">
                        Age Range
                    </label>
                    <input
                        id="age-range"
                        type="text"
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g., 20-60"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 text-slate-900"
                    />
                </div>
                <div className="md:col-span-1">
                    <label htmlFor="primary-condition" className="block text-sm font-medium text-slate-700 mb-1">
                        Primary Condition
                    </label>
                    <input
                        id="primary-condition"
                        type="text"
                        value={primaryCondition}
                        onChange={(e) => setPrimaryCondition(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g., Sepsis"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 text-slate-900"
                    />
                </div>

                <div className="md:col-span-1">
                     <button
                        type="submit"
                        disabled={isLoading || !patientCount || !primaryCondition}
                        className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : 'Generate Cohort'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SyntheticDataController;