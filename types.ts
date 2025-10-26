
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
  userId?: string;
  detailedReport?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  credits: number;
  total_credits_purchased: number;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price_cents: number;
  original_price_cents?: number;
  stripe_price_id?: string;
  popular: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchased' | 'spent' | 'bonus' | 'refund';
  description: string;
  package_id?: string;
  stripe_payment_intent_id?: string;
  created_at: string;
}
