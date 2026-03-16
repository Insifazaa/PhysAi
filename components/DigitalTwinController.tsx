

import React, { useState } from 'react';
import type { Intervention, InterventionType } from '../types';
import { CubeTransparentIcon } from './icons';

interface DigitalTwinControllerProps {
    isLoading: boolean;
    onRunForecast: (intervention: Intervention) => void;
}

const interventionOptions: Record<InterventionType, { label: string; paramLabel: string; paramUnit: string; defaultParam: string; }> = {
    start_vasopressor: {
        label: 'Start Vasopressor',
        paramLabel: 'Dose',
        paramUnit: 'mcg/min',
        defaultParam: '5'
    },
    administer_fluid_bolus: {
        label: 'Administer Fluid Bolus',
        paramLabel: 'Volume',
        paramUnit: 'mL',
        defaultParam: '500'
    },
    increase_sedation: {
        label: 'Increase Sedation',
        paramLabel: 'Propofol Dose',
        paramUnit: 'mcg/kg/min',
        defaultParam: '10'
    },
};

const DigitalTwinController: React.FC<DigitalTwinControllerProps> = ({ isLoading, onRunForecast }) => {
    const [interventionType, setInterventionType] = useState<InterventionType>('start_vasopressor');
    const [parameter, setParameter] = useState<string>(interventionOptions.start_vasopressor.defaultParam);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as InterventionType;
        setInterventionType(newType);
        setParameter(interventionOptions[newType].defaultParam);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const interventionDetails = `${interventionOptions[interventionType].label} at ${parameter} ${interventionOptions[interventionType].paramUnit}`;
        onRunForecast({
            type: interventionType,
            details: interventionDetails,
        });
    }

    const currentOption = interventionOptions[interventionType];

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mt-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CubeTransparentIcon className="w-6 h-6 text-blue-600" />
                Intervention Forecast Simulator
            </h2>
            <p className="text-sm text-slate-700 mt-2 mb-4">
                Select a clinical intervention to simulate its effect on the patient's digital twin.
            </p>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="intervention-type" className="block text-sm font-medium text-slate-700 mb-1">
                            Intervention
                        </label>
                        <select
                            id="intervention-type"
                            value={interventionType}
                            onChange={handleTypeChange}
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 text-slate-900"
                        >
                            {Object.entries(interventionOptions).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="intervention-param" className="block text-sm font-medium text-slate-700 mb-1">
                           {currentOption.paramLabel}
                        </label>
                        <div className="relative">
                            <input
                                id="intervention-param"
                                type="number"
                                value={parameter}
                                onChange={(e) => setParameter(e.target.value)}
                                disabled={isLoading}
                                className="w-full pl-3 pr-16 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50 text-slate-900"
                                step="any"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-slate-500">
                                {currentOption.paramUnit}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                     <button
                        type="submit"
                        disabled={isLoading || !parameter}
                        className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Running...
                            </>
                        ) : 'Run Forecast'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DigitalTwinController;