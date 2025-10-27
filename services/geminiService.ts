import { GoogleGenAI, Type } from "@google/genai";
import type { ValuationResult, PropertyDetails, GroundingSource } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const valuationSchema = {
  type: Type.OBJECT,
  properties: {
    estimatedValueRange: {
      type: Type.OBJECT,
      properties: {
        min: { type: Type.NUMBER, description: "The minimum estimated value based on conservative market analysis." },
        max: { type: Type.NUMBER, description: "The maximum estimated value based on optimistic market conditions." },
      },
      required: ["min", "max"],
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 representing the confidence in the valuation based on image quality, property visibility, and market data availability.",
    },
    currency: {
      type: Type.STRING,
      description: "The currency of the valuation (e.g., USD, EUR, NGN). Default to USD if not obvious.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A comprehensive, detailed explanation for the valuation including market analysis, property condition assessment, comparable properties, and key value drivers.",
    },
    detectedFeatures: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A comprehensive list of key visual features detected including architectural style, interior finishes, outdoor amenities, and unique characteristics.",
    },
    propertyType: {
      type: Type.STRING,
      description: "The specific type of property (e.g., 'Single-Family Home', 'Townhouse', 'Condo', 'Duplex', 'Multi-Family', 'Commercial Building').",
    },
    propertyCondition: {
        type: Type.STRING,
        description: "The overall condition of the property (e.g., 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Needs Major Renovation').",
    },
    architecturalStyle: {
      type: Type.STRING,
      description: "The architectural style of the property (e.g., 'Modern', 'Traditional', 'Colonial', 'Craftsman', 'Contemporary', 'Victorian').",
    },
    yearBuilt: {
      type: Type.STRING,
      description: "Estimated year built based on architectural features and construction materials visible in images.",
    },
    squareFootage: {
      type: Type.STRING,
      description: "Estimated square footage based on visible rooms and proportions (e.g., '2,500-3,000 sqft', '1,200-1,500 sqft').",
    },
    lotSize: {
      type: Type.STRING,
      description: "Estimated lot size based on visible outdoor space and property boundaries (e.g., '0.25-0.5 acres', 'Small urban lot').",
    },
    keyValueDrivers: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Key factors that positively impact the property's value (e.g., 'Updated kitchen', 'Prime location', 'Large lot', 'Modern finishes').",
    },
    potentialConcerns: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Potential issues or concerns that might negatively impact value (e.g., 'Outdated bathrooms', 'Small bedrooms', 'Limited parking').",
    },
    marketPositioning: {
      type: Type.STRING,
      description: "How this property compares to the local market (e.g., 'Above market average', 'Market rate', 'Below market average', 'Premium property').",
    },
    suggestedUpgrades: {
      type: Type.ARRAY,
      description: "A prioritized list of suggested upgrades or repairs to maximize the property's value, including detailed reasoning and ROI analysis.",
      items: {
        type: Type.OBJECT,
        properties: {
          upgrade: { type: Type.STRING, description: "The specific upgrade or repair suggested (e.g., 'Modernize Kitchen Appliances')." },
          reasoning: { type: Type.STRING, description: "Detailed reasoning for why this upgrade is recommended based on current market trends and property analysis." },
          estimatedCost: { type: Type.STRING, description: "A detailed cost estimate ('$5,000-8,000', 'Low: $1,000-3,000', 'High: $15,000-25,000')." },
          impactOnValue: { type: Type.STRING, description: "The potential impact on the property's value ('Low: +2-5%', 'Medium: +5-10%', 'High: +10-20%')." },
          priority: { type: Type.STRING, description: "Priority level ('High', 'Medium', 'Low') based on cost-benefit analysis." },
          timeline: { type: Type.STRING, description: "Recommended timeline for implementation ('Immediate', 'Within 6 months', 'Long-term')." }
        },
        required: ["upgrade", "reasoning", "estimatedCost", "impactOnValue", "priority", "timeline"]
      }
    }
  },
  required: [
    "estimatedValueRange",
    "confidenceScore",
    "currency",
    "reasoning",
    "detectedFeatures",
    "propertyType",
    "propertyCondition",
    "architecturalStyle",
    "yearBuilt",
    "squareFootage",
    "lotSize",
    "keyValueDrivers",
    "potentialConcerns",
    "marketPositioning",
    "suggestedUpgrades"
  ],
};


export const getPropertyValuation = async (images: string[], details: PropertyDetails): Promise<Omit<ValuationResult, 'id' | 'timestamp' | 'previewImage' | 'propertyDetails'>> => {
  const imageParts = images.map(base64Data => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  }));

  const prompt = `
    Analyze the following property images and details as an expert real estate appraiser with 20+ years of experience. Conduct a comprehensive property valuation using advanced market analysis techniques.

    Property Details Provided:
    - Address/Location: ${details.address || 'Not provided'}
    - Property Size: ${details.propertySize ? `${details.propertySize} sqft` : 'Not provided'}
    - Bedrooms: ${details.bedrooms || 'Not provided'}
    - Bathrooms: ${details.bathrooms || 'Not provided'}
    - Additional Notes: ${details.additionalNotes || 'None'}

    **Comprehensive Analysis Requirements:**

    1. **Market Research & Comparables:**
       - If address provided: Use Google Search to find recent sales (last 6-12 months) within 1-2 miles
       - Analyze 3-5 comparable properties with similar size, age, and condition
       - Consider market trends, seasonal variations, and local economic factors
       - Factor in neighborhood desirability, school districts, and amenities

    2. **Property Assessment:**
       - Analyze architectural style, construction quality, and materials
       - Assess interior condition, finishes, and modern amenities
       - Evaluate outdoor spaces, landscaping, and curb appeal
       - Identify unique features that add or detract from value
       - Estimate year built, square footage, and lot size from visual cues

    3. **Value Analysis:**
       - Determine market positioning (above/below/at market rate)
       - Identify key value drivers and potential concerns
       - Consider location factors: walkability, safety, transportation
       - Assess energy efficiency and modern systems
       - Evaluate parking, storage, and functional layout

    4. **Investment Analysis:**
       - Provide detailed upgrade recommendations with ROI analysis
       - Prioritize improvements by cost-benefit ratio
       - Include timeline recommendations for implementation
       - Consider market timing and buyer preferences

    **Confidence Scoring Guidelines:**
    - 90-100%: Excellent image quality, clear comps, detailed property info
    - 80-89%: Good images, some comps, basic property details
    - 70-79%: Fair images, limited comps, minimal details
    - 60-69%: Poor images, no comps, very limited info
    - Below 60%: Insufficient data for reliable valuation

    **Output Format:**
    Provide your complete response as a single, valid JSON object. Do not add any text, comments, or markdown formatting (like \`\`\`json) before or after the JSON object. The JSON object must strictly adhere to the following structure:

    {
      "estimatedValueRange": { "min": number, "max": number },
      "confidenceScore": number (0-100),
      "currency": string (e.g., "USD"),
      "reasoning": string (comprehensive market analysis and valuation rationale),
      "detectedFeatures": string[] (detailed visual features and amenities),
      "propertyType": string (specific property classification),
      "propertyCondition": string (detailed condition assessment),
      "architecturalStyle": string (architectural classification),
      "yearBuilt": string (estimated construction year),
      "squareFootage": string (estimated size range),
      "lotSize": string (estimated lot dimensions),
      "keyValueDrivers": string[] (positive value factors),
      "potentialConcerns": string[] (negative value factors),
      "marketPositioning": string (market comparison assessment),
      "suggestedUpgrades": [
        {
          "upgrade": string,
          "reasoning": string,
          "estimatedCost": string (detailed cost range),
          "impactOnValue": string (percentage impact),
          "priority": string ("High", "Medium", "Low"),
          "timeline": string ("Immediate", "Within 6 months", "Long-term")
        }
      ]
    }
  `;
  
  const useGrounding = details.address && details.address.trim() !== '';

  try {
    const config = useGrounding 
      ? { tools: [{ googleSearch: {} }] }
      : {
          responseMimeType: 'application/json',
          responseSchema: valuationSchema,
      };
      
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [...imageParts, { text: prompt }],
      },
      config,
    });

    if (!response.text) {
      throw new Error("No response text received from AI service.");
    }
    
    const jsonText = response.text.trim();
    // If grounding is used, the model might wrap the JSON in markdown backticks.
    const cleanJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    const valuationData = JSON.parse(cleanJsonText);
    
    if (!valuationData.estimatedValueRange || !valuationData.reasoning) {
        throw new Error("Incomplete valuation data received from AI.");
    }
    
    if (useGrounding) {
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: GroundingSource[] = groundingChunks
        ?.map(chunk => chunk.web)
        .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title) || [];
      return { ...valuationData, sources };
    }

    return valuationData;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get property valuation: ${error.message}`);
    }
    throw new Error("An unknown error occurred during property valuation.");
  }
};

export const generateDetailedReport = async (valuation: ValuationResult): Promise<string> => {
  const prompt = `
    As a senior real estate analyst with 20+ years of experience, create a comprehensive, professional property valuation report. This report will be used by potential buyers, sellers, and investors for critical decision-making. The tone should be authoritative, data-driven, and actionable.

    **Comprehensive Property Data:**
    - Property Type: ${valuation.propertyType}
    - Address: ${valuation.propertyDetails?.address || 'Not specified'}
    - Property Size: ${valuation.propertyDetails?.propertySize ? `${valuation.propertyDetails.propertySize} sqft` : valuation.squareFootage || 'Not specified'}
    - Bedrooms: ${valuation.propertyDetails?.bedrooms || 'Not specified'}
    - Bathrooms: ${valuation.propertyDetails?.bathrooms || 'Not specified'}
    - Architectural Style: ${valuation.architecturalStyle || 'Not specified'}
    - Year Built: ${valuation.yearBuilt || 'Not specified'}
    - Lot Size: ${valuation.lotSize || 'Not specified'}
    - Estimated Value Range: $${valuation.estimatedValueRange.min.toLocaleString()} - $${valuation.estimatedValueRange.max.toLocaleString()} ${valuation.currency}
    - Confidence Score: ${valuation.confidenceScore}%
    - Market Positioning: ${valuation.marketPositioning || 'Not specified'}
    - Overall Condition: ${valuation.propertyCondition}
    
    **Key Value Drivers:**
    ${valuation.keyValueDrivers ? valuation.keyValueDrivers.map(driver => `- ${driver}`).join('\n') : 'Not specified'}
    
    **Potential Concerns:**
    ${valuation.potentialConcerns ? valuation.potentialConcerns.map(concern => `- ${concern}`).join('\n') : 'None identified'}
    
    **Detected Features:**
    ${valuation.detectedFeatures.join(', ')}
    
    **AI Valuation Analysis:**
    ${valuation.reasoning}
    
    **Strategic Investment Recommendations:**
    ${valuation.suggestedUpgrades.map(u => `- **${u.upgrade}** (Priority: ${u.priority}, Timeline: ${u.timeline})
  - Reasoning: ${u.reasoning}
  - Estimated Cost: ${u.estimatedCost}
  - Value Impact: ${u.impactOnValue}`).join('\n\n')}
    
    **Market Research Sources:**
    ${(valuation.sources && valuation.sources.length > 0) ? valuation.sources.map(s => `- [${s.title}](${s.uri})`).join('\n') : 'No external sources consulted'}

    **Professional Report Structure:**
    Create a comprehensive report with the following sections:
    
    1. **## Executive Summary**
       - Property overview and key metrics
       - Estimated value range and confidence level
       - Market positioning and investment potential
       - Key recommendations summary
    
    2. **## Property Analysis**
       - Detailed property description and characteristics
       - Architectural assessment and construction quality
       - Interior and exterior condition analysis
       - Unique features and amenities
       - Space utilization and functional layout
    
    3. **## Market Analysis & Valuation**
       - Local market conditions and trends
       - Comparable property analysis (if available)
       - Valuation methodology and rationale
       - Market positioning assessment
       - Risk factors and market considerations
    
    4. **## Investment Strategy**
       - Prioritized upgrade recommendations
       - Cost-benefit analysis for each improvement
       - Timeline and implementation strategy
       - Expected return on investment
       - Market timing considerations
    
    5. **## Risk Assessment**
       - Potential concerns and mitigation strategies
       - Market risks and economic factors
       - Property-specific challenges
       - Investment timeline recommendations
    
    6. **## Conclusion & Next Steps**
       - Investment recommendation summary
       - Key action items for buyers/sellers
       - Professional disclaimer and limitations
       - Recommendation for professional appraisal

    **Report Requirements:**
    - Use professional real estate terminology
    - Include specific data points and metrics
    - Provide actionable insights and recommendations
    - Maintain objective, analytical tone
    - Include relevant market context and trends
    - Format with clear headings and bullet points
    - Target length: 1,500-2,500 words

    Generate only the report text without any additional commentary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    if (!response.text) {
      throw new Error("No response text received from AI service.");
    }
    
    return response.text;
  } catch (error) {
    console.error("Error generating detailed report:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate detailed report: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the report.");
  }
};
