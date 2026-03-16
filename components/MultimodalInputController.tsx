

import React, { useState } from 'react';
import { DocumentTextIcon, CameraIcon, SpeakerWaveIcon } from './icons';

interface MultimodalInputControllerProps {
    isLoading: boolean;
    onRunStratification: (clinicalData: string, imageFile: string | null, audioFile: string | null) => void;
}

const defaultClinicalData = `Patient presented with a 4-day history of high-grade fever, headache, and myalgia.
Vitals: Temp 39.1C, HR 105, BP 100/70.
Labs: Platelets 95,000, Hematocrit 46%.
Torniquet test: Positive.
`;

const FileInput: React.FC<{
  id: string;
  label: string;
  accept: string;
  Icon: React.FC<{ className?: string }>;
  file: File | null;
  setFile: (file: File | null) => void;
  disabled: boolean;
}> = ({ id, label, accept, Icon, file, setFile, disabled }) => (
  <div className="flex-1 p-4 border border-slate-300 rounded-lg bg-slate-50">
    <label htmlFor={id} className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-2">
      <Icon className="w-5 h-5 text-slate-500" />
      <span>{label}</span>
    </label>
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      disabled={disabled}
      className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
    />
    {file && (
      <div className="mt-2 text-xs text-slate-600 bg-slate-200 px-2 py-1 rounded truncate">
        {file.name}
      </div>
    )}
  </div>
);

const MultimodalInputController: React.FC<MultimodalInputControllerProps> = ({ isLoading, onRunStratification }) => {
    const [clinicalData, setClinicalData] = useState<string>(defaultClinicalData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // remove the "data:mime/type;base64," prefix
                resolve(result.split(',')[1]);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let imageBase64: string | null = null;
        let audioBase64: string | null = null;
        
        if (imageFile) {
            imageBase64 = await fileToBase64(imageFile);
        }
        if (audioFile) {
            audioBase64 = await fileToBase64(audioFile);
        }

        onRunStratification(clinicalData, imageBase64, audioBase64);
    };
    
    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mt-4">
             <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                Multimodal Data Input
            </h2>
            <p className="text-sm text-slate-700 mt-2 mb-4">
                Input clinical data and upload relevant files to stratify risk for Dengue Hemorrhagic Fever.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="clinical-data" className="flex items-center gap-3 text-sm font-medium text-slate-700 mb-1">
                      <DocumentTextIcon className="w-5 h-5 text-slate-500" />
                      <span>Clinical Data & Vitals</span>
                    </label>
                    <textarea
                        id="clinical-data"
                        value={clinicalData}
                        onChange={(e) => setClinicalData(e.target.value)}
                        disabled={isLoading}
                        className="w-full h-40 p-3 border border-slate-300 rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-sm text-slate-900 bg-white placeholder:text-slate-500"
                        placeholder="Enter patient vitals, labs, and history..."
                    />
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <FileInput
                        id="ultrasound-image"
                        label="Ultrasound Image"
                        accept="image/*"
                        Icon={CameraIcon}
                        file={imageFile}
                        setFile={setImageFile}
                        disabled={isLoading}
                    />
                    <FileInput
                        id="cough-audio"
                        label="Cough Audio Sample"
                        accept="audio/*"
                        Icon={SpeakerWaveIcon}
                        file={audioFile}
                        setFile={setAudioFile}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !clinicalData.trim()}
                        className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                    >
                         {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Stratifying...
                            </>
                        ) : 'Stratify Risk'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default MultimodalInputController;