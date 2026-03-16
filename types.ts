import { Type } from '@google/genai';

export type ClinicianRole = 'psychiatrist' | 'intensivist' | 'gp' | 'sl_nurse' | 'researcher';
export type Language = 'en' | 'si' | 'ta';
export type AlertLevel = 'all' | 'critical';
export type AppMode = 'transcript' | 'ambient_orders' | 'multimodal' | 'handoff' | 'digital_twin' | 'resource_pathway' | 'synthetic_data' | 'reliability';

export interface TranslationSet {
  [key: string]: string;
}

// --- Base Result for Provenance ---
interface BaseResult {
    analysisId: string;
    timestamp: string;
    modelUsed: string;
}


// --- Transcript Analysis Types ---
export interface ClinicalTheme {
    theme: string;
    evidence: string[];
    urgency: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Sentiment {
    patientSentiment: string;
    sessionTrajectory: string;
}

export interface RiskAssessment {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    riskScore: number;
    predictionModel: string;
    keyContributors: string[];
    summary: string;
}

export interface AnalysisResult extends BaseResult {
    patientSummary: string;
    clinicalThemes: ClinicalTheme[];
    actionableInsights: string[];
    sentiment: Sentiment;
    riskAssessment: RiskAssessment;
}

// --- Counterfactual Explanation Types ---
export interface CounterfactualExplanation extends BaseResult {
    counterfactualQuery: string;
    primaryReason: string;
    supportingEvidence: {
        fromText: string[];
        fromKnowledgeBase: string[];
    };
    confidence: 'High' | 'Medium' | 'Low';
}


// --- Ambient Orders Types ---
export interface DraftedOrder {
    orderName: string; // e.g., "Complete Blood Count", "Portable Chest X-ray"
    orderCategory: 'Lab' | 'Imaging' | 'Medication' | 'Other';
    priority: 'Routine' | 'Stat';
    details: string; // e.g., "with differential", "to check for pneumonia"
}

export interface DraftedOrderSet extends BaseResult {
    conversationSnippet: string;
    draftedOrders: DraftedOrder[];
}

// --- ICU Handoff Types ---
export interface SystemReview {
    systemName: 'Cardiovascular' | 'Respiratory' | 'Neurological' | 'Renal/Metabolic' | 'Gastrointestinal' | 'Infectious Disease' | 'Plan';
    status: 'Stable' | 'Improving' | 'Worsening' | 'Concern';
    details: string[];
}

export interface HandoffSummary extends BaseResult {
    patientIdentifier: string;
    summaryPeriod: string;
    presentingProblem: string;
    keyEvents: string[];
    systemReviews: SystemReview[];
}

// --- Digital Twin Types ---
export type InterventionType = 'start_vasopressor' | 'administer_fluid_bolus' | 'increase_sedation';

export interface Intervention {
    type: InterventionType;
    details: string;
}

export interface ForecastedPoint {
    timePoint: string; // e.g., "+5 min", "+15 min", "+30 min"
    value: string; // e.g. "95-105", "1.8-2.2"
}

export interface PredictedMetric {
    metricName: string; // e.g., "Mean Arterial Pressure (MAP)", "Lactate"
    baseline: string; // e.g., "65 mmHg"
    forecast: ForecastedPoint[];
    summary: string;
}

export interface DigitalTwinForecast {
    forecastId: string;
    timestamp: string;
    modelUsed: string;
    interventionSummary: string;
    predictedMetrics: PredictedMetric[];
    confidenceLevel: 'High' | 'Medium' | 'Low';
    risksAndMitigations: string[];
}

// --- Multimodal Risk Types ---
export interface MultimodalRiskResult extends BaseResult {
    patientIdentifier: string;
    diseaseFocus: string;
    riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
    riskScore: number; // 0-100
    contributingFactors: {
        clinical: string[];
        imaging: string[];
        audio: string[];
    };
    summary: string;
    recommendations: string[];
}

export interface MultimodalInput {
    clinicalData: string;
    imageFile: string | null; // base64 encoded
    audioFile: string | null; // base64 encoded
}

// --- Resource Pathway Types ---
export interface TreatmentAlternative {
    drugName: string;
    rationale: string;
    evidence: string; // e.g. "PMID: 12345678" or "IDSA Guidelines 2022"
    notes: string; // e.g. "Requires dose adjustment for renal impairment."
}

export interface ResourcePathwayResult extends BaseResult {
    requestedTreatment: string;
    isAvailable: boolean;
    availabilitySource: string;
    recommendation: {
        status: 'Available' | 'Unavailable';
        header: string;
        details: string;
    };
    alternatives: TreatmentAlternative[];
}

// --- Synthetic Data Types ---
export interface SyntheticPatient {
    patientId: string; // e.g., "SYNTH-001"
    age: number;
    assignedSex: 'Male' | 'Female';
    primaryCondition: string;
    keyMetrics: {
        [key: string]: string | number; // e.g., { "Platelet Count": 85000, "Hematocrit": "45%" }
    };
}

export interface SyntheticDataSet extends BaseResult {
    cohortParameters: {
        patientCount: number;
        primaryCondition: string;
        ageRange: string;
    };
    syntheticPatients: SyntheticPatient[];
}

// --- Reliability & Credibility Types (Enhanced based on Testkit) ---
export type MetricStatus = 'Pass' | 'Fail' | 'Warning' | 'Running' | 'Not Run';

export interface ReliabilityMetric {
    metric: 'AUROC stability' | 'Latency' | 'Data completeness' | 'Security';
    tool: string; // e.g., "pytest", "Locust"
    value: string; // e.g., "Δ 0.8%", "850 ms"
    threshold: string;
    evidence: string; // e.g., "CSV log", "Grafana dashboard"
    status: MetricStatus;
}

export interface TrustMetric {
    theme: 'Transparency' | 'Clinical Reliability' | 'Perceived Accuracy' | 'Workflow Fit';
    instrument: string;
    sampleSize: string;
    value: string; // e.g., "4.7 / 5.0"
    targetScore: string;
    status: MetricStatus;
}

export interface RCTStatus {
    design: string;
    primaryEndpoint: string;
    secondaryEndpoints: string[];
    duration: string;
    status: 'Planning' | 'Enrolling Patients' | 'Active' | 'Analyzing' | 'Complete';
    registryId: string;
}

export interface OSCEStation {
    station: number;
    task: string;
    passCriteria: string;
    status: MetricStatus;
}

export interface OSCEResult {
    name: 'Trust & Explainability Mini-OSCE';
    passRate: number; // e.g. 95
    status: MetricStatus;
    stations: OSCEStation[];
}

export interface ReliabilityReport extends BaseResult {
    reportVersion: string;
    technicalBattery: ReliabilityMetric[];
    trustValidation: TrustMetric[];
    rctStatus: RCTStatus;
    osceResult: OSCEResult;
    quickStartCommands: { command: string, description: string }[];
    escalationRules: string[];
}


// --- Schemas for Gemini ---
export const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    analysisId: { type: Type.STRING, description: 'A unique identifier for this analysis instance, formatted as a UUID.' },
    timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the analysis was generated.' },
    patientSummary: { type: Type.STRING, description: 'A brief, neutral, third-person summary of the patient\'s current state, key concerns, and reported progress. Maximum 150 words. Write in a clinical, objective tone.' },
    clinicalThemes: {
      type: Type.ARRAY, description: 'Key clinical themes identified in the conversation. Identify at least 3-5 distinct themes.',
      items: {
        type: Type.OBJECT, required: ["theme", "evidence", "urgency"],
        properties: {
          theme: { type: Type.STRING, description: 'A concise name for the theme (e.g., "Medication Adherence", "Anxiety Symptoms"). For Sri Lankan context, consider themes like "Fever presentation", "Exposure to contaminated water", or "Post-dengue fatigue".' },
          evidence: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'One to three direct, brief quotes from the transcript that support this theme.' },
          urgency: { type: Type.STRING, description: 'An assessment of clinical urgency. Must be one of: "Low", "Medium", "High", or "Critical".', enum: ["Low", "Medium", "High", "Critical"] }
        },
      }
    },
    actionableInsights: {
      type: Type.ARRAY, description: 'A list of 2-4 concrete, actionable insights or suggestions for the clinician based on the transcript.',
      items: { type: Type.STRING, description: 'A specific suggestion for the clinician to consider, e.g., "Consider screening for social anxiety." For Sri Lankan context, suggest actions like "Recommend testing for Dengue NS1 antigen if fever persists beyond 3 days."' }
    },
    sentiment: {
        type: Type.OBJECT, description: 'Overall sentiment analysis of the session.', required: ["patientSentiment", "sessionTrajectory"],
        properties: {
            patientSentiment: { type: Type.STRING, description: 'The predominant sentiment of the patient (e.g., "Hopeful", "Anxious", "Neutral", "Distressed", "Ambivalent").' },
            sessionTrajectory: { type: Type.STRING, description: 'The emotional trajectory of the session (e.g., "Improving", "Declining", "Stable", "Fluctuating").' }
        }
    },
    riskAssessment: {
        type: Type.OBJECT, description: "A predictive risk assessment based on the 'Treatment Agent' persona. This should simulate a predictive model's output.", required: ["riskLevel", "riskScore", "predictionModel", "keyContributors", "summary"],
        properties: {
            riskLevel: { type: Type.STRING, description: "The overall categorized risk level.", enum: ['Low', 'Medium', 'High', 'Very High'] },
            riskScore: { type: Type.INTEGER, description: "A numerical risk score from 0 to 100, where 100 is the highest risk." },
            predictionModel: { type: Type.STRING, description: 'The name of the hypothetical prediction model used, e.g., "MDD Relapse Model v1.1" or "Dengue Shock Syndrome Predictor v1.0".' },
            keyContributors: { type: Type.ARRAY, description: "A list of 2-3 key factors or themes from the transcript contributing to the risk score.", items: { type: Type.STRING } },
            summary: { type: Type.STRING, description: "A brief summary explaining the risk assessment." }
        }
    }
  },
  required: ["analysisId", "timestamp", "patientSummary", "clinicalThemes", "actionableInsights", "sentiment", "riskAssessment"],
};

export const counterfactualSchema = {
    type: Type.OBJECT,
    properties: {
        analysisId: { type: Type.STRING, description: 'A unique identifier for this analysis instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the analysis was generated.' },
        counterfactualQuery: { type: Type.STRING, description: 'The user\'s "Why not..." query.' },
        primaryReason: { type: Type.STRING, description: 'A concise, primary reason why the alternative was not recommended. This should be the main takeaway.' },
        supportingEvidence: {
            type: Type.OBJECT,
            required: ['fromText', 'fromKnowledgeBase'],
            properties: {
                fromText: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Direct quotes from the original clinical text that support the primary reason.' },
                fromKnowledgeBase: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Citations from an external knowledge base (e.g., clinical guidelines, research papers) that support the primary reason. Format as "Reason (Source: PMID XXXXXXXX or Guideline Name)".' }
            }
        },
        confidence: { type: Type.STRING, description: 'The confidence level in this explanation.', enum: ['High', 'Medium', 'Low'] }
    },
    required: ["analysisId", "timestamp", "counterfactualQuery", "primaryReason", "supportingEvidence", "confidence"]
};


export const ordersSchema = {
    type: Type.OBJECT,
    properties: {
        analysisId: { type: Type.STRING, description: 'A unique identifier for this analysis instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the analysis was generated.' },
        conversationSnippet: { type: Type.STRING, description: 'The direct quote or summarized segment of the conversation from which the orders were inferred.'},
        draftedOrders: {
            type: Type.ARRAY,
            description: 'A list of clinical orders detected in the conversation.',
            items: {
                type: Type.OBJECT,
                required: ['orderName', 'orderCategory', 'priority', 'details'],
                properties: {
                    orderName: { type: Type.STRING, description: 'The specific name of the order, e.g., "Complete Blood Count", "Portable Chest X-ray", "Vancomycin Trough".' },
                    orderCategory: { type: Type.STRING, description: 'The category of the order.', enum: ['Lab', 'Imaging', 'Medication', 'Other'] },
                    priority: { type: Type.STRING, description: 'The priority of the order.', enum: ['Routine', 'Stat'] },
                    details: { type: Type.STRING, description: 'Any specific details mentioned about the order, e.g., "with differential", "to check for pneumonia", "to be drawn 30 minutes before next dose". If no details, return an empty string.' },
                }
            }
        }
    },
    required: ['analysisId', 'timestamp', 'conversationSnippet', 'draftedOrders']
};

export const handoffSchema = {
    type: Type.OBJECT,
    properties: {
        analysisId: { type: Type.STRING, description: 'A unique identifier for this analysis instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the analysis was generated.' },
        patientIdentifier: { type: Type.STRING, description: 'A masked or generic patient identifier, e.g., "Patient ICU-4B-7".' },
        summaryPeriod: { type: Type.STRING, description: 'The time period this summary covers, e.g., "Last 12 Hours (07:00-19:00)".' },
        presentingProblem: { type: Type.STRING, description: 'A brief statement of the patient\'s primary reason for being in the ICU.' },
        keyEvents: { type: Type.ARRAY, description: 'A list of 2-4 major events or changes during the summary period.', items: { type: Type.STRING } },
        systemReviews: {
            type: Type.ARRAY, description: 'A list of reviews for each major organ system.',
            items: {
                type: Type.OBJECT, required: ['systemName', 'status', 'details'],
                properties: {
                    systemName: { type: Type.STRING, description: 'Name of the organ system.', enum: ['Cardiovascular', 'Respiratory', 'Neurological', 'Renal/Metabolic', 'Gastrointestinal', 'Infectious Disease', 'Plan'] },
                    status: { type: Type.STRING, description: 'The overall status of this system.', enum: ['Stable', 'Improving', 'Worsening', 'Concern'] },
                    details: { type: Type.ARRAY, description: 'A list of 2-4 bullet points detailing events, lab results, or changes for this system.', items: { type: Type.STRING } }
                }
            }
        }
    },
    required: ['analysisId', 'timestamp', 'patientIdentifier', 'summaryPeriod', 'presentingProblem', 'keyEvents', 'systemReviews']
};

export const digitalTwinSchema = {
    type: Type.OBJECT,
    properties: {
        forecastId: { type: Type.STRING, description: 'A unique identifier for this forecast instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the forecast was generated.' },
        interventionSummary: { type: Type.STRING, description: 'A concise summary of the intervention that was simulated.'},
        predictedMetrics: {
            type: Type.ARRAY,
            description: 'A list of predicted outcomes for key physiological metrics.',
            items: {
                type: Type.OBJECT,
                required: ['metricName', 'baseline', 'forecast', 'summary'],
                properties: {
                    metricName: { type: Type.STRING, description: 'Name of the physiological metric (e.g., "Mean Arterial Pressure (MAP)", "Heart Rate", "Lactate").' },
                    baseline: { type: Type.STRING, description: 'The baseline value of the metric before the intervention, including units (e.g., "65 mmHg").' },
                    forecast: {
                        type: Type.ARRAY,
                        description: 'A list of forecasted values at different time points.',
                        items: {
                            type: Type.OBJECT,
                            required: ['timePoint', 'value'],
                            properties: {
                                timePoint: { type: Type.STRING, description: 'The future time point (e.g., "+5 min", "+15 min", "+30 min").' },
                                value: { type: Type.STRING, description: 'The predicted value or range at the time point, including units (e.g., "70-75 mmHg").' },
                            }
                        }
                    },
                    summary: { type: Type.STRING, description: 'A brief text summary of the predicted trajectory for this metric.'}
                }
            }
        },
        confidenceLevel: {
            type: Type.STRING,
            description: 'The overall confidence in this forecast.',
            enum: ['High', 'Medium', 'Low']
        },
        risksAndMitigations: {
            type: Type.ARRAY,
            description: 'A list of potential risks associated with the intervention and suggested mitigations.',
            items: { type: Type.STRING }
        }
    },
    required: ['forecastId', 'timestamp', 'interventionSummary', 'predictedMetrics', 'confidenceLevel', 'risksAndMitigations']
};

export const multimodalRiskSchema = {
    type: Type.OBJECT,
    properties: {
        analysisId: { type: Type.STRING, description: 'A unique identifier for this analysis instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the analysis was generated.' },
        patientIdentifier: { type: Type.STRING, description: 'A masked or generic patient identifier, e.g., "Patient PID-5821".' },
        diseaseFocus: { type: Type.STRING, description: 'The primary disease focus of the analysis, e.g., "Dengue Hemorrhagic Fever Progression".' },
        riskLevel: { type: Type.STRING, description: 'The overall categorized risk level.', enum: ['Low', 'Moderate', 'High', 'Very High'] },
        riskScore: { type: Type.INTEGER, description: "A numerical risk score from 0 to 100, where 100 is the highest risk." },
        contributingFactors: {
            type: Type.OBJECT,
            required: ['clinical', 'imaging', 'audio'],
            properties: {
                clinical: { type: Type.ARRAY, description: 'Key factors from the clinical data text.', items: { type: Type.STRING } },
                imaging: { type: Type.ARRAY, description: 'Key findings from the simulated analysis of the ultrasound image.', items: { type: Type.STRING } },
                audio: { type: Type.ARRAY, description: 'Key findings from the simulated analysis of the cough audio file.', items: { type: Type.STRING } },
            }
        },
        summary: { type: Type.STRING, description: "A brief summary explaining the risk assessment by synthesizing all modalities." },
        recommendations: { type: Type.ARRAY, description: 'Concrete, actionable recommendations for the clinician.', items: { type: Type.STRING } },
    },
    required: ['analysisId', 'timestamp', 'patientIdentifier', 'diseaseFocus', 'riskLevel', 'riskScore', 'contributingFactors', 'summary', 'recommendations']
};

export const resourcePathwaySchema = {
    type: Type.OBJECT,
    properties: {
        analysisId: { type: Type.STRING, description: 'A unique identifier for this analysis instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the analysis was generated.' },
        requestedTreatment: { type: Type.STRING, description: 'The treatment that was queried by the user.' },
        isAvailable: { type: Type.BOOLEAN, description: 'A boolean indicating if the drug is available in the simulated inventory.' },
        availabilitySource: { type: Type.STRING, description: 'The simulated source of the availability information, e.g., "Colombo North Teaching Hospital - Real-Time Pharmacy API".' },
        recommendation: {
            type: Type.OBJECT,
            required: ['status', 'header', 'details'],
            properties: {
                status: { type: Type.STRING, description: 'The availability status.', enum: ['Available', 'Unavailable'] },
                header: { type: Type.STRING, description: 'A short, bold summary of the status, e.g., "Ceftriaxone is available." or "Piperacillin-tazobactam is unavailable."' },
                details: { type: Type.STRING, description: 'A more detailed explanation of the status or next steps.' }
            }
        },
        alternatives: {
            type: Type.ARRAY,
            description: 'A list of evidence-based alternatives if the requested treatment is unavailable. If available, return an empty array.',
            items: {
                type: Type.OBJECT,
                required: ['drugName', 'rationale', 'evidence', 'notes'],
                properties: {
                    drugName: { type: Type.STRING, description: 'The name of the alternative drug.' },
                    rationale: { type: Type.STRING, description: 'The clinical rationale for why this is a suitable alternative.' },
                    evidence: { type: Type.STRING, description: 'A supporting evidence citation, e.g., "PMID: 12345678" or "IDSA Guidelines 2022".' },
                    notes: { type: Type.STRING, description: 'Any important notes for the clinician, e.g., "Requires dose adjustment for renal impairment."' }
                }
            }
        }
    },
    required: ['analysisId', 'timestamp', 'requestedTreatment', 'isAvailable', 'availabilitySource', 'recommendation', 'alternatives']
};

export const syntheticDataSchema = {
    type: Type.OBJECT,
    properties: {
        analysisId: { type: Type.STRING, description: 'A unique identifier for this analysis instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the analysis was generated.' },
        cohortParameters: {
            type: Type.OBJECT,
            required: ['patientCount', 'primaryCondition', 'ageRange'],
            properties: {
                patientCount: { type: Type.INTEGER, description: 'The number of patients requested for the cohort.' },
                primaryCondition: { type: Type.STRING, description: 'The primary condition for the cohort.' },
                ageRange: { type: Type.STRING, description: 'The requested age range for the cohort (e.g., "30-50").' },
            }
        },
        syntheticPatients: {
            type: Type.ARRAY,
            description: 'An array of generated synthetic patient data records.',
            items: {
                type: Type.OBJECT,
                required: ['patientId', 'age', 'assignedSex', 'primaryCondition', 'keyMetrics'],
                properties: {
                    patientId: { type: Type.STRING, description: 'A unique synthetic patient identifier, e.g., "SYNTH-001".' },
                    age: { type: Type.INTEGER, description: 'The synthetic age of the patient, within the requested range.' },
                    assignedSex: { type: Type.STRING, description: 'The assigned sex of the patient.', enum: ['Male', 'Female'] },
                    primaryCondition: { type: Type.STRING, description: 'The primary condition of the patient, which should match the cohort parameter.'},
                    keyMetrics: {
                        type: Type.OBJECT,
                        description: 'An object containing 2-4 clinically relevant key metrics for the specified condition. The keys should be the metric names (e.g., "Platelet Count") and values should be realistic numbers or strings. For Dengue, use "Platelet Count" and "Hematocrit". For Sepsis, use "Lactate" and "WBC Count".',
                        properties: {} // allows for any key-value pairs
                    }
                }
            }
        }
    },
    required: ['analysisId', 'timestamp', 'cohortParameters', 'syntheticPatients']
};

export const reliabilityReportSchema = {
    type: Type.OBJECT,
    properties: {
        analysisId: { type: Type.STRING, description: 'A unique identifier for this report instance, formatted as a UUID.' },
        timestamp: { type: Type.STRING, description: 'The ISO 8601 timestamp for when the report was generated.' },
        reportVersion: { type: Type.STRING, description: 'The version of the report, e.g., "Q3 2024 Testkit Run".' },
        technicalBattery: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT, required: ['metric', 'tool', 'value', 'threshold', 'evidence', 'status'],
                properties: {
                    metric: { type: Type.STRING, enum: ['AUROC stability', 'Latency', 'Data completeness', 'Security'] },
                    tool: { type: Type.STRING },
                    value: { type: Type.STRING },
                    threshold: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['Pass', 'Fail', 'Warning', 'Running', 'Not Run'] }
                }
            }
        },
        trustValidation: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT, required: ['theme', 'instrument', 'sampleSize', 'value', 'targetScore', 'status'],
                properties: {
                    theme: { type: Type.STRING, enum: ['Transparency', 'Clinical Reliability', 'Perceived Accuracy', 'Workflow Fit'] },
                    instrument: { type: Type.STRING },
                    sampleSize: { type: Type.STRING },
                    value: { type: Type.STRING },
                    targetScore: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['Pass', 'Fail', 'Warning', 'Running', 'Not Run'] }
                }
            }
        },
        rctStatus: {
            type: Type.OBJECT, required: ['design', 'primaryEndpoint', 'secondaryEndpoints', 'duration', 'status', 'registryId'],
            properties: {
                design: { type: Type.STRING },
                primaryEndpoint: { type: Type.STRING },
                secondaryEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['Planning', 'Enrolling Patients', 'Active', 'Analyzing', 'Complete'] },
                registryId: { type: Type.STRING }
            }
        },
        osceResult: {
            type: Type.OBJECT, required: ['name', 'passRate', 'status', 'stations'],
            properties: {
                name: { type: Type.STRING, enum: ['Trust & Explainability Mini-OSCE'] },
                passRate: { type: Type.INTEGER, description: 'The overall pass rate as a percentage (0-100).' },
                status: { type: Type.STRING, enum: ['Pass', 'Fail', 'Warning', 'Not Run'] },
                stations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT, required: ['station', 'task', 'passCriteria', 'status'],
                        properties: {
                            station: { type: Type.INTEGER },
                            task: { type: Type.STRING },
                            passCriteria: { type: Type.STRING },
                            status: { type: Type.STRING, enum: ['Pass', 'Fail'] }
                        }
                    }
                }
            }
        },
        quickStartCommands: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT, required: ['command', 'description'],
                properties: {
                    command: { type: Type.STRING },
                    description: { type: Type.STRING }
                }
            }
        },
        escalationRules: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ['analysisId', 'timestamp', 'reportVersion', 'technicalBattery', 'trustValidation', 'rctStatus', 'osceResult', 'quickStartCommands', 'escalationRules']
};


declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
  };
  
  var webkitSpeechRecognition: {
      prototype: SpeechRecognition;
      new(): SpeechRecognition;
  };

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(): void;
    stop(): void;
  }
  
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  type SpeechRecognitionErrorCode =
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported";

  interface SpeechRecognitionErrorEvent extends Event {
      readonly error: SpeechRecognitionErrorCode;
      readonly message: string;
  }
}
