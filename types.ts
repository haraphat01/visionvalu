
export interface PropertyDetails {
  address?: string;
  propertySize?: number;
  bedrooms?: number;
  bathrooms?: number;
  additionalNotes?: string;
}

export interface SuggestedUpgrade {
  upgrade: string;
  reasoning: string;
  estimatedCost: string; // e.g., 'Low', 'Medium', 'High'
  impactOnValue: string; // e.g., 'Low', 'Medium', 'High'
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ValuationResult {
  id: string;
  estimatedValueRange: {
    min: number;
    max: number;
  };
  confidenceScore: number;
  currency: string;
  reasoning: string;
  detectedFeatures: string[];
  propertyType: string;
  propertyCondition: string;
  timestamp: string;
  previewImage: string; // base64 string of the first image
  suggestedUpgrades: SuggestedUpgrade[];
  propertyDetails?: PropertyDetails;
  sources?: GroundingSource[];
}
