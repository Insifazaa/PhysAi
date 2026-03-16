
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MicrophoneIcon, ClipboardListIcon } from './icons';
import { Language } from '../types';

interface AmbientConversationInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  language: Language;
}

const langCodeMap: Record<Language, string> = {
    en: 'en-US',
    si: 'si-LK',
    ta: 'ta-LK'
};

const defaultConversation = `Doctor: Okay, the patient's fever is persistent and the platelet count is dropping. Let's get a stat CBC to re-check the count, and add a lactate to rule out sepsis. 
Nurse: Understood. Anything else?
Doctor: Yes, let's also order a portable chest x-ray, I'm concerned about developing pleural effusion. We can do that routinely.`;

const AmbientConversationInput: React.FC<AmbientConversationInputProps> = ({ value, onValueChange, onGenerate, isLoading, language }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Set default text on mount if value is empty
  useEffect(() => {
    if(!value) {
      onValueChange(defaultConversation);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
  }, []);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langCodeMap[language];

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript.trim() + ' ';
        }
      }
      if (finalTranscript) {
        onValueChange(value ? value + finalTranscript : finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error, event.message);
      alert(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);

  }, [isRecording, value, onValueChange, language, stopRecording]);

  useEffect(() => {
      return () => {
          stopRecording();
      }
  }, [stopRecording]);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mt-4">
      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <ClipboardListIcon className="w-6 h-6 text-blue-600" />
        Ambient Conversation for Order Entry
      </h2>
      <p className="text-sm text-slate-700 mb-4 mt-2">
        Paste or dictate the clinical conversation. The system will listen for potential orders and draft them for your review.
      </p>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Start dictating or paste a conversation..."
          className="w-full h-48 p-3 border border-slate-300 rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 text-sm bg-white text-slate-900 placeholder:text-slate-500"
          disabled={isLoading || isRecording}
        />
        {isRecording && (
          <div className="absolute top-3 right-3 flex items-center space-x-2 text-red-500">
             <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-semibold">Listening...</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-end items-center gap-3">
        <button
          type="button"
          onClick={handleToggleRecording}
          disabled={isLoading}
          className={`p-2.5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50
            ${isRecording 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          aria-label={isRecording ? 'Stop listening' : 'Start listening'}
        >
          <MicrophoneIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading || !value || isRecording}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Orders'
          )}
        </button>
      </div>
    </div>
  );
};

export default AmbientConversationInput;