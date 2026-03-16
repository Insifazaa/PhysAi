import React, { useState, useCallback } from 'react';
import { analyzeTranscript, generateHandoffSummary, runInterventionForecast, runMultimodalRiskStratification, generateDraftOrders, getResourceAdaptivePathway, generateSyntheticData, getReliabilityReport } from './services/geminiService';
import type { AnalysisResult, DraftedOrderSet, HandoffSummary, DigitalTwinForecast, MultimodalRiskResult, ResourcePathwayResult, SyntheticDataSet, ReliabilityReport, Language, ClinicianRole, AlertLevel, TranslationSet, AppMode, Intervention } from './types';
import Header from './components/Header';
import TranscriptInput from './components/TranscriptInput';
import AmbientConversationInput from './components/AmbientConversationInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import DraftOrdersDisplay from './components/DraftOrdersDisplay';
import HandoffDisplay from './components/HandoffDisplay';
import DigitalTwinController from './components/DigitalTwinController';
import DigitalTwinDisplay from './components/DigitalTwinDisplay';
import MultimodalInputController from './components/MultimodalInputController';
import MultimodalRiskDisplay from './components/MultimodalRiskDisplay';
import ResourcePathwayInput from './components/ResourcePathwayInput';
import ResourcePathwayDisplay from './components/ResourcePathwayDisplay';
import SyntheticDataController from './components/SyntheticDataController';
import SyntheticDataDisplay from './components/SyntheticDataDisplay';
import ReliabilityDashboard from './components/ReliabilityDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import SettingsBar from './components/SettingsBar';
import ModeSelector from './components/ModeSelector';
import { BrainCircuit, InfoIcon, ClipboardCheckIcon } from './components/icons';

const translations: Record<Language, TranslationSet> = {
  en: {
    awaitingAnalysis: 'Awaiting Analysis',
    awaitingAnalysisDesc: 'Enter a patient-provider transcript above and click "Analyze" to generate clinical insights.',
    awaitingOrders: 'Awaiting Ambient Conversation',
    awaitingOrdersDesc: 'Input or dictate a clinical conversation (e.g., during rounds) and the system will draft potential orders for you.',
    awaitingHandoff: 'Ready for ICU Handoff Summary',
    awaitingHandoffDesc: 'Click the button below to generate a structured ICU shift handoff report based on the last 12 hours of simulated patient data.',
    awaitingForecast: 'Ready for Intervention Forecasting',
    awaitingForecastDesc: 'Select an intervention and its parameters above, then click "Run Forecast" to simulate the physiological impact on the patient digital twin.',
    awaitingMultimodal: 'Awaiting Multimodal Risk Stratification',
    awaitingMultimodalDesc: 'Provide clinical data, and optionally an ultrasound image and cough audio file, to generate a risk score for tropical diseases like Dengue.',
    awaitingPathway: 'Ready for Resource-Adaptive Pathway Analysis',
    awaitingPathwayDesc: 'Enter a desired treatment (e.g., an antibiotic) to check its real-time availability and receive evidence-based alternative pathways if it is out of stock.',
    awaitingSynthetic: 'ELYSIUM: Synthetic Data Sandbox',
    awaitingSyntheticDesc: 'Define cohort parameters to generate a high-fidelity, privacy-preserving synthetic dataset for research and bias mitigation.',
    awaitingReliability: 'Reliability & Credibility Dashboard',
    awaitingReliabilityDesc: 'Generate the latest report to view platform performance against the technical, clinical, and ethical validation metrics outlined in the Testkit.',
    footerText: 'Powered by a Hierarchical Multi-Agent System with Google Gemini, Psyche-Journey | Confidential Clinical AI Tool',
    visionText: 'Vision and Innovation Engineered by Insaf.',
    connectivityStatus: 'Connectivity: Online (Offline-First Capable)',
  },
  si: {
    awaitingAnalysis: 'විශ්ලේෂණය සඳහා රැඳී සිටිමින්',
    awaitingAnalysisDesc: 'සායනික තීක්ෂ්ණ බුද්ධිය ජනනය කිරීම සඳහා ඉහත රෝගී-සැපයුම්කරු පිටපතක් ඇතුළත් කර "විශ්ලේෂණය කරන්න" ක්ලික් කරන්න.',
    awaitingOrders: 'සංවාදය සඳහා රැඳී සිටීම',
    awaitingOrdersDesc: 'සායනික සංවාදයක් ඇතුළත් කරන්න, පද්ධතිය ඔබ සඳහා විභව ඇණවුම් කෙටුම්පත් කරනු ඇත.',
    awaitingHandoff: 'දැඩි සත්කාර ඒකකයේ සාරාංශය සඳහා සූදානම්',
    awaitingHandoffDesc: 'පසුගිය පැය 12ක රෝගියාගේ දත්ත මත පදනම්ව දැඩි සත්කාර ඒකකයේ මාරු වාර්තාවක් ජනනය කිරීමට පහත බොත්තම ක්ලික් කරන්න.',
    awaitingForecast: 'මැදිහත්වීම් පුරෝකථනය සඳහා සූදානම්',
    awaitingForecastDesc: 'ඉහතින් මැදිහත්වීමක් සහ එහි පරාමිතීන් තෝරා, රෝගියාගේ ඩිජිටල් ද්විත්වය මත භෞතික විද්‍යාත්මක බලපෑම අනුකරණය කිරීමට "පුරෝකථනය ක්‍රියාත්මක කරන්න" ක්ලික් කරන්න.',
    awaitingMultimodal: 'බහුමාධ්‍ය අවදානම් ස්ථරීකරණය සඳහා රැඳී සිටීම',
    awaitingMultimodalDesc: 'ඩෙංගු වැනි නිවර්තන රෝග සඳහා අවදානම් ලකුණු ජනනය කිරීම සඳහා සායනික දත්ත, සහ විකල්ප වශයෙන් අල්ට්රා සවුන්ඩ් රූපයක් සහ කැස්ස ශ්රව්ය ගොනුවක් සපයන්න.',
    awaitingPathway: 'සම්පත්-අනුවර්තී මාර්ග විශ්ලේෂණය සඳහා සූදානම්',
    awaitingPathwayDesc: 'තත්‍ය කාලීන ലഭ്യത පරීක්ෂා කිරීමට සහ තොග අවසන් නම් සාක්ෂි මත පදනම් වූ විකල්ප මාර්ග ලබා ගැනීමට අපේක්ෂිත ප්‍රතිකාරයක් (උදා: ප්‍රතිජීවකයක්) ඇතුළත් කරන්න.',
    awaitingSynthetic: 'ELYSIUM: සින්තටික් දත්ත සෑන්ඩ්බොක්ස්',
    awaitingSyntheticDesc: 'පර්යේෂණ සහ පක්ෂග්‍රාහීත්වය අවම කිරීම සඳහා ඉහළ විශ්වසනීය, පෞද්ගලිකත්වය සුරැකෙන සින්තටික් දත්ත කට්ටලයක් ජනනය කිරීමට කණ්ඩායම් පරාමිතීන් නිර්වචනය කරන්න.',
    awaitingReliability: 'විශ්වසනීයත්වය සහ විශ්වසනීයත්ව පුවරුව',
    awaitingReliabilityDesc: 'පරීක්ෂණ කට්ටලයේ දක්වා ඇති තාක්ෂණික, සායනික, සහ සදාචාරාත්මක වලංගුකරණ ප්‍රමිතිකවලට එරෙහිව වේදිකාවේ ක්‍රියාකාරිත්වය බැලීමට නවතම වාර්තාව ජනනය කරන්න.',
    footerText: 'Google Gemini සමඟින් වන ශ්‍රේණිගත බහු-නියෝජිත පද්ධතියකින් බල ගැන්වේ, Psyche-Journey | රහස්‍ය සායනික AI මෙවලම',
    visionText: 'දැක්ම සහ නවෝත්පාදනය ඉන්සාෆ් විසින් ඉංජිනේරු කරන ලදී.',
    connectivityStatus: 'සම්බන්ධතාවය: සබැඳි (නොබැඳි-පළමු හැකියාව ඇත)',
  },
  ta: {
    awaitingAnalysis: 'பகுப்பாய்வுக்காக காத்திருக்கிறது',
    awaitingAnalysisDesc: 'மருத்துவ நுண்ணறிவுகளைப் பெற, மேலே ஒரு நோயாளி-வழங்குநர் டிரான்ஸ்கிரிப்டை உள்ளிட்டு "பகுப்பாய்வு செய்" என்பதைக் கிளிக் செய்யவும்.',
    awaitingOrders: 'சுற்றுப்புற உரையாடலுக்காகக் காத்திருக்கிறது',
    awaitingOrdersDesc: 'ஒரு மருத்துவ உரையாடலை உள்ளிடவும் அல்லது ஆணையிடவும், கணினி உங்களுக்கான சாத்தியமான ஆர்டர்களை வரைவு செய்யும்.',
    awaitingHandoff: 'ICU ஒப்படைப்பு சுருக்கத்திற்கு தயார்',
    awaitingHandoffDesc: 'கடந்த 12 மணிநேர நோயாளி தரவின் அடிப்படையில் ஒரு கட்டமைக்கப்பட்ட ICU ஷிப்ட் ஒப்படைப்பு அறிக்கையை உருவாக்க கீழே உள்ள பொத்தானைக் கிளிக் செய்யவும்.',
    awaitingForecast: 'தலையீட்டு முன்கணிப்புக்கு தயார்',
    awaitingForecastDesc: 'மேலே ஒரு தலையீடு மற்றும் அதன் அளவுருக்களைத் தேர்ந்தெடுத்து, நோயாளி டிஜிட்டல் இரட்டையரின் உடலியல் தாக்கத்தை உருவகப்படுத்த "முன்கணிப்பை இயக்கு" என்பதைக் கிளிக் செய்யவும்.',
    awaitingMultimodal: 'பன்முறை இடர் அடுக்குப்படுத்தலுக்காகக் காத்திருக்கிறது',
    awaitingMultimodalDesc: 'டெங்கு போன்ற வெப்பமண்டல நோய்களுக்கான இடர் மதிப்பீட்டைப் பெற, மருத்துவத் தரவு, மற்றும் விருப்பப்பட்டால் ஒரு அல்ட்ராசவுண்ட் படம் மற்றும் இருமல் ஆடியோ கோப்பை வழங்கவும்.',
    awaitingPathway: 'வளம்-ஏற்ப சிகிச்சை வழிகள் பகுப்பாய்விற்கு தயார்',
    awaitingPathwayDesc: 'ஒரு விரும்பிய சிகிச்சையை (எ.கா. ஒரு ஆண்டிபயாடிக்) உள்ளிட்டு அதன் நிகழ்நேர இருப்பை சரிபார்த்து, கையிருப்பு இல்லையெனில் சான்று அடிப்படையிலான மாற்று வழிகளைப் பெறவும்.',
    awaitingSynthetic: 'ELYSIUM: செயற்கை தரவு சாண்ட்பாக்ஸ்',
    awaitingSyntheticDesc: 'ஆராய்ச்சி மற்றும் சார்பு தணிப்புக்காக உயர் நம்பகத்தன்மை கொண்ட, தனியுரிமை-பாதுகாக்கும் செயற்கை தரவுத்தொகுப்பை உருவாக்க கூட்டு அளவுருக்களை வரையறுக்கவும்.',
    awaitingReliability: 'நம்பகத்தன்மை மற்றும் நம்பகத்தன்மை டாஷ்போர்டு',
    awaitingReliabilityDesc: 'சோதனைத் தொகுப்பில் கோடிட்டுக் காட்டப்பட்டுள்ள தொழில்நுட்ப, மருத்துவ மற்றும் நெறிமுறை சரிபார்ப்பு அளவீடுகளுக்கு எதிராக தளத்தின் செயல்திறனைக் காண சமீபத்திய அறிக்கையை உருவாக்கவும்.',
    footerText: 'Google Gemini உடன் ஒரு படிநிலை பல-முகவர் அமைப்பு மூலம் இயக்கப்படுகிறது, Psyche-Journey | இரகசிய மருத்துவ AI கருவி',
    visionText: 'இன்சாஃப் மூலம் உருவாக்கப்பட்ட பார்வை மற்றும் புதுமை.',
    connectivityStatus: 'இணைப்பு: ஆன்லைன் (ஆஃப்லைன்-முதல் திறன் கொண்டது)',
  }
};

export default function App() {
  const [transcript, setTranscript] = useState<string>('');
  const [conversation, setConversation] = useState<string>('');
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [draftedOrders, setDraftedOrders] = useState<DraftedOrderSet | null>(null);
  const [handoffSummary, setHandoffSummary] = useState<HandoffSummary | null>(null);
  const [digitalTwinForecast, setDigitalTwinForecast] = useState<DigitalTwinForecast | null>(null);
  const [multimodalRiskResult, setMultimodalRiskResult] = useState<MultimodalRiskResult | null>(null);
  const [resourcePathwayResult, setResourcePathwayResult] = useState<ResourcePathwayResult | null>(null);
  const [syntheticDataSet, setSyntheticDataSet] = useState<SyntheticDataSet | null>(null);
  const [reliabilityReport, setReliabilityReport] = useState<ReliabilityReport | null>(null);


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [language, setLanguage] = useState<Language>('en');
  const [clinicianRole, setClinicianRole] = useState<ClinicianRole>('intensivist');
  const [alertLevel, setAlertLevel] = useState<AlertLevel>('all');
  const [appMode, setAppMode] = useState<AppMode>('transcript');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    setAnalysisResult(null);
    setDraftedOrders(null);
    setHandoffSummary(null);
    setDigitalTwinForecast(null);
    setMultimodalRiskResult(null);
    setResourcePathwayResult(null);
    setSyntheticDataSet(null);
    setReliabilityReport(null);
    setError(null);
  }

  const handleAnalyze = useCallback(async () => {
    if (!transcript.trim()) {
      setError('Transcript cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeTranscript(transcript, clinicianRole, isOffline);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please check the console for details or ensure your API key is configured correctly.');
    } finally {
      setIsLoading(false);
    }
  }, [transcript, clinicianRole, isOffline]);

  const handleGenerateOrders = useCallback(async () => {
    if (!conversation.trim()) {
      setError('Conversation cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDraftedOrders(null);
    try {
      const result = await generateDraftOrders(conversation, clinicianRole, isOffline);
      setDraftedOrders(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during order generation. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [conversation, clinicianRole, isOffline]);

  const handleGenerateHandoff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHandoffSummary(null);

    try {
      const result = await generateHandoffSummary(clinicianRole, isOffline);
      setHandoffSummary(result);
    } catch (err) {
        console.error(err);
        setError('An error occurred during handoff generation. Please check the console for details or ensure your API key is configured correctly.');
    } finally {
        setIsLoading(false);
    }
  }, [clinicianRole, isOffline]);
  
  const handleRunForecast = useCallback(async (intervention: Intervention) => {
    setIsLoading(true);
    setError(null);
    setDigitalTwinForecast(null);

    try {
        const result = await runInterventionForecast(intervention, clinicianRole);
        setDigitalTwinForecast(result);
    } catch (err) {
        console.error(err);
        setError('An error occurred during forecast generation. Please check the console for details or ensure your API key is configured correctly.');
    } finally {
        setIsLoading(false);
    }
  }, [clinicianRole]);

  const handleRunMultimodalRisk = useCallback(async (clinicalData: string, imageFile: string | null, audioFile: string | null) => {
    setIsLoading(true);
    setError(null);
    setMultimodalRiskResult(null);

    try {
      const result = await runMultimodalRiskStratification({ clinicalData, imageFile, audioFile }, clinicianRole, isOffline);
      setMultimodalRiskResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during multimodal risk stratification. Please check the console for details or ensure your API key is configured correctly.');
    } finally {
      setIsLoading(false);
    }
  }, [clinicianRole, isOffline]);

  const handleGetResourcePathway = useCallback(async (treatment: string) => {
    if (!treatment.trim()) {
      setError('Treatment name cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResourcePathwayResult(null);
    try {
      const result = await getResourceAdaptivePathway(treatment, clinicianRole, isOffline);
      setResourcePathwayResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching resource pathways. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [clinicianRole, isOffline]);
  
  const handleGenerateSyntheticData = useCallback(async (params: { patientCount: number; primaryCondition: string; ageRange: string; }) => {
    setIsLoading(true);
    setError(null);
    setSyntheticDataSet(null);
    try {
      const result = await generateSyntheticData(params, clinicianRole);
      setSyntheticDataSet(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating synthetic data. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [clinicianRole]);

  const handleGetReliabilityReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setReliabilityReport(null);
    try {
      const result = await getReliabilityReport();
      setReliabilityReport(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the reliability report. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const T = translations[language];

  const renderActionComponent = () => {
    switch (appMode) {
      case 'transcript':
        return (
          <TranscriptInput
            value={transcript}
            onValueChange={setTranscript}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            language={language}
          />
        );
      case 'ambient_orders':
        return (
          <AmbientConversationInput
            value={conversation}
            onValueChange={setConversation}
            onGenerate={handleGenerateOrders}
            isLoading={isLoading}
            language={language}
          />
        );
      case 'digital_twin':
        return (
          <DigitalTwinController 
            onRunForecast={handleRunForecast}
            isLoading={isLoading}
          />
        );
      case 'multimodal':
        return (
          <MultimodalInputController
            onRunStratification={handleRunMultimodalRisk}
            isLoading={isLoading}
          />
        );
      case 'resource_pathway':
        return (
            <ResourcePathwayInput
                onGetPathway={handleGetResourcePathway}
                isLoading={isLoading}
            />
        );
      case 'synthetic_data':
        return (
            <SyntheticDataController
                onGenerate={handleGenerateSyntheticData}
                isLoading={isLoading}
            />
        );
      default:
        return null;
    }
  };

  const renderDisplay = () => {
    if (isLoading) return <LoadingSpinner mode={appMode} isOffline={isOffline} />;
    if (error) return <ErrorMessage message={error} />;

    switch (appMode) {
      case 'transcript':
        if (analysisResult) {
          return <AnalysisDisplay result={analysisResult} alertLevel={alertLevel} role={clinicianRole} isOffline={isOffline} originalTranscript={transcript} />;
        }
        return (
          <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <BrainCircuit className="w-16 h-16 mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingAnalysis}</h2>
            <p className="mt-2 text-slate-700">{T.awaitingAnalysisDesc}</p>
          </div>
        );
      case 'ambient_orders':
        if (draftedOrders) {
          return <DraftOrdersDisplay resultSet={draftedOrders} />;
        }
        return (
          <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <BrainCircuit className="w-16 h-16 mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingOrders}</h2>
            <p className="mt-2 text-slate-700 max-w-lg mx-auto">{T.awaitingOrdersDesc}</p>
          </div>
        );
      
      case 'handoff':
        if (handoffSummary) {
          return <HandoffDisplay summary={handoffSummary} />;
        }
        return (
           <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <BrainCircuit className="w-16 h-16 mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingHandoff}</h2>
            <p className="mt-2 text-slate-700 max-w-lg mx-auto">{T.awaitingHandoffDesc}</p>
            <button
                onClick={handleGenerateHandoff}
                disabled={isLoading}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center mx-auto"
            >
                Generate Handoff
            </button>
          </div>
        );
        
      case 'digital_twin':
        if (digitalTwinForecast) {
          return <DigitalTwinDisplay forecast={digitalTwinForecast} />;
        }
        return (
           <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <BrainCircuit className="w-16 h-16 mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingForecast}</h2>
            <p className="mt-2 text-slate-700 max-w-lg mx-auto">{T.awaitingForecastDesc}</p>
          </div>
        );
      
      case 'multimodal':
        if (multimodalRiskResult) {
          return <MultimodalRiskDisplay result={multimodalRiskResult} />;
        }
        return (
          <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <BrainCircuit className="w-16 h-16 mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingMultimodal}</h2>
            <p className="mt-2 text-slate-700 max-w-lg mx-auto">{T.awaitingMultimodalDesc}</p>
             {clinicianRole !== 'sl_nurse' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md max-w-md mx-auto flex items-center justify-center gap-2">
                    <InfoIcon className="w-5 h-5 flex-shrink-0" />
                    <span>For best results, select the 'SL Pilot Nurse' role.</span>
                </div>
            )}
          </div>
        );
      case 'resource_pathway':
        if (resourcePathwayResult) {
            return <ResourcePathwayDisplay result={resourcePathwayResult} />;
        }
        return (
            <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                <BrainCircuit className="w-16 h-16 mx-auto text-slate-400" />
                <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingPathway}</h2>
                <p className="mt-2 text-slate-700 max-w-lg mx-auto">{T.awaitingPathwayDesc}</p>
                 {language !== 'si' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md max-w-md mx-auto flex items-center justify-center gap-2">
                        <InfoIcon className="w-5 h-5 flex-shrink-0" />
                        <span>This feature is optimized for the Sri Lanka (සිංහල) context.</span>
                    </div>
                )}
            </div>
        );
    case 'synthetic_data':
        if (syntheticDataSet) {
            return <SyntheticDataDisplay dataSet={syntheticDataSet} />;
        }
        return (
            <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                <BrainCircuit className="w-16 h-16 mx-auto text-slate-400" />
                <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingSynthetic}</h2>
                <p className="mt-2 text-slate-700 max-w-lg mx-auto">{T.awaitingSyntheticDesc}</p>
                 {clinicianRole !== 'researcher' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md max-w-md mx-auto flex items-center justify-center gap-2">
                        <InfoIcon className="w-5 h-5 flex-shrink-0" />
                        <span>This feature is designed for the 'Researcher' role context.</span>
                    </div>
                )}
            </div>
        );
      case 'reliability':
        if (reliabilityReport) {
            return <ReliabilityDashboard report={reliabilityReport} />;
        }
        return (
            <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                <ClipboardCheckIcon className="w-16 h-16 mx-auto text-slate-400" />
                <h2 className="mt-4 text-xl font-semibold text-slate-800">{T.awaitingReliability}</h2>
                <p className="mt-2 text-slate-700 max-w-lg mx-auto">{T.awaitingReliabilityDesc}</p>
                <button
                    onClick={handleGetReliabilityReport}
                    disabled={isLoading}
                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center mx-auto"
                >
                    Generate Report
                </button>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100/50">
      <Header 
        language={language}
        setLanguage={setLanguage}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <ModeSelector mode={appMode} setMode={handleModeChange} isOffline={isOffline} />
          { appMode !== 'reliability' && (
            <SettingsBar
              role={clinicianRole}
              setRole={setClinicianRole}
              alertLevel={alertLevel}
              setAlertLevel={setAlertLevel}
              language={language}
              currentMode={appMode}
            />
          )}
          
          {renderActionComponent()}
          
          <div className="mt-8">
            {renderDisplay()}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-slate-700">
        <p>{T.footerText}</p>
        <p className="mt-2 text-xs text-slate-500">
            <span className="font-semibold">{T.connectivityStatus}</span>
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-500">{T.visionText}</p>
      </footer>
    </div>
  );
}