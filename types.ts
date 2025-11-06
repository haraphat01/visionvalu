
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
  estimatedCost: string; // e.g., '$5,000-8,000', 'Low: $1,000-3,000', 'High: $15,000-25,000'
  impactOnValue: string; // e.g., 'Low: +2-5%', 'Medium: +5-10%', 'High: +10-20%'
  priority: string; // 'High', 'Medium', 'Low'
  timeline: string; // 'Immediate', 'Within 6 months', 'Long-term'
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
  // New detailed report structure fields
  estimated_value_min?: number;
  estimated_value_max?: number;
  confidence_score?: number;
  property_address?: string;
  property_type?: string;
  property_condition?: string;
  detailed_report?: string;
  created_at?: string;
  // Original fields
  confidenceScore: number;
  currency: string;
  reasoning: string;
  detectedFeatures: string[];
  propertyType: string;
  propertyCondition: string;
  architecturalStyle?: string;
  yearBuilt?: string;
  squareFootage?: string;
  lotSize?: string;
  keyValueDrivers?: string[];
  potentialConcerns?: string[];
  marketPositioning?: string;
  timestamp: string;
  previewImage: string; // base64 string of the first image
  suggestedUpgrades: SuggestedUpgrade[];
  propertyDetails?: PropertyDetails;
  sources?: GroundingSource[];
  userId?: string;
  detailedReport?: string;
  // Hash of input (images + property details) for idempotency
  inputHash?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  credits: number;
  total_credits_purchased: number;
  stripe_customer_id?: string;
  subscription_status?: string;
  subscription_plan?: string;
  created_at: string;
  updated_at: string;
}

// Supabase Auth User type (from auth.users)
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    display_name?: string;
  };
  raw_user_meta_data?: {
    full_name?: string;
    name?: string;
    display_name?: string;
  };
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
