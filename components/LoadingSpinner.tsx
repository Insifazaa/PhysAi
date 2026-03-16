import React from 'react';
import { AppMode } from '../types';

interface LoadingSpinnerProps {
  mode: AppMode;
  isOffline: boolean;
}

const loadingMessages: Record<string, { title: string; subtitle: string; }> = {
    transcript: {
        title: 'Analyzing Transcript...',
        subtitle: 'This may take a few moments.',
    },
    ambient_orders: {
        title: 'Generating Draft Orders...',
        subtitle: 'Listening for clinical orders in the conversation.',
    },
    handoff: {
        title: 'Generating Handoff...',
        subtitle: 'Synthesizing patient data from the last 12 hours.',
    },
    digital_twin: {
        title: 'Running Forecast...',
        subtitle: 'Simulating physiological response with the digital twin.',
    },
    multimodal: {
        title: 'Stratifying Multimodal Risk...',
        subtitle: 'Fusing clinical, imaging, and audio data for analysis.',
    },
    resource_pathway: {
        title: 'Checking Pathways...',
        subtitle: 'Querying inventory and knowledge graph for alternatives.',
    },
    synthetic_data: {
        title: 'Generating Synthetic Cohort...',
        subtitle: 'Simulating GAN to create privacy-preserving data.',
    },
    reliability: {
        title: 'Generating Reliability Report...',
        subtitle: 'Compiling results from the latest Testkit run.',
    }
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ mode, isOffline }) => {
  const message = loadingMessages[mode] || loadingMessages.transcript;
  const subtitle = isOffline ? 'Processing on local edge device...' : message.subtitle;

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg border border-slate-200 shadow-sm">
      <svg
        className="animate-spin h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-4 text-lg font-semibold text-slate-700">{message.title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
};

export default LoadingSpinner;