import { GoogleGenAI, Type } from "@google/genai";
import type { ValuationResult, PropertyDetails, GroundingSource } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const valuationSchema = {
  type: Type.OBJECT,
  properties: {
    estimatedValueRange: {
      type: Type.OBJECT,
      properties: {
        min: { type: Type.NUMBER, description: "The minimum estimated value." },
        max: { type: Type.NUMBER, description: "The maximum estimated value." },
      },
      required: ["min", "max"],
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 representing the confidence in the valuation.",
    },
    currency: {
      type: Type.STRING,
      description: "The currency of the valuation (e.g., USD, EUR, NGN). Default to USD if not obvious.",
    },
    reasoning: {
      type: Type.STRING,
      description: "A detailed, paragraph-long explanation for the valuation, considering all visual cues and provided data.",
    },
    detectedFeatures: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A list of key visual features detected (e.g., 'Modern kitchen with granite countertops', 'Large backyard with swimming pool', 'Hardwood flooring').",
    },
    propertyType: {
      type: Type.STRING,
      description: "The type of property (e.g., 'Single-Family Home', 'Apartment', 'Duplex', 'Commercial Building').",
    },
    propertyCondition: {
        type: Type.STRING,
        description: "The overall condition of the property (e.g., 'Excellent', 'Good', 'Fair', 'Needs Renovation').",
    },
    suggestedUpgrades: {
      type: Type.ARRAY,
      description: "A list of suggested upgrades or repairs to increase the property's value, including reasoning.",
      items: {
        type: Type.OBJECT,
        properties: {
          upgrade: { type: Type.STRING, description: "The specific upgrade or repair suggested (e.g., 'Modernize Kitchen Appliances')." },
          reasoning: { type: Type.STRING, description: "Why this upgrade is recommended based on the images and market standards." },
          estimatedCost: { type: Type.STRING, description: "A rough estimate of the cost involved ('Low', 'Medium', 'High')." },
          impactOnValue: { type: Type.STRING, description: "The potential impact on the property's value ('Low', 'Medium', 'High')." }
        },
        required: ["upgrade", "reasoning", "estimatedCost", "impactOnValue"]
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
    Analyze the following property images and details as an expert real estate appraiser. 
    
    Property Details Provided:
    - Address/Location: ${details.address || 'Not provided'}
    - Property Size: ${details.propertySize ? `${details.propertySize} sqft` : 'Not provided'}
    - Bedrooms: ${details.bedrooms || 'Not provided'}
    - Bathrooms: ${details.bathrooms || 'Not provided'}
    - Additional Notes: ${details.additionalNotes || 'None'}

    **Crucial Instructions:**
    1.  **If an address is provided:** Your most important task is to use the Google Search tool to find recent, comparable property sales data ("comps") for that specific address and neighborhood. 
    2.  **Analyze and Compare:** Your valuation MUST be heavily based on comparing the provided property (images and details) against the real-world sales data of the comps you find. Note key similarities and differences (e.g., square footage, condition, amenities) in your reasoning.
    3.  **If no address is provided:** Base your valuation on the visual evidence and assume a standard, average market for a property of this type.

    Based on this analysis, provide a comprehensive valuation. Also, identify key areas for improvement with suggested upgrades that could increase the property's market value.

    **Output Format:**
    Provide your complete response as a single, valid JSON object. Do not add any text, comments, or markdown formatting (like \`\`\`json) before or after the JSON object. The JSON object must strictly adhere to the following structure:

    {
      "estimatedValueRange": { "min": number, "max": number },
      "confidenceScore": number (a score from 0 to 100),
      "currency": string (e.g., "USD"),
      "reasoning": string (a detailed, paragraph-long explanation),
      "detectedFeatures": string[] (a list of key visual features detected),
      "propertyType": string (e.g., "Single-Family Home", "Apartment"),
      "propertyCondition": string (e.g., "Excellent", "Good", "Needs Renovation"),
      "suggestedUpgrades": [
        {
          "upgrade": string,
          "reasoning": string,
          "estimatedCost": string ("Low", "Medium", or "High"),
          "impactOnValue": string ("Low", "Medium", or "High")
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
    As a professional real estate analyst, synthesize the following structured data into a comprehensive, well-written, client-facing report. The tone should be professional, informative, and persuasive. The report should be formatted with clear headings using Markdown for structure (e.g., "## Executive Summary").

    **Valuation Data:**
    - Property Type: ${valuation.propertyType}
    - Address: ${valuation.propertyDetails?.address || 'Not specified'}
    - Property Size: ${valuation.propertyDetails?.propertySize ? `${valuation.propertyDetails.propertySize} sqft` : 'Not specified'}
    - Bedrooms: ${valuation.propertyDetails?.bedrooms || 'Not specified'}
    - Bathrooms: ${valuation.propertyDetails?.bathrooms || 'Not specified'}
    - Estimated Value Range: ${valuation.estimatedValueRange.min} - ${valuation.estimatedValueRange.max} ${valuation.currency}
    - AI's Reasoning for Valuation: ${valuation.reasoning}
    - Detected Features: ${valuation.detectedFeatures.join(', ')}
    - Overall Condition: ${valuation.propertyCondition}
    - Suggested Upgrades:
      ${valuation.suggestedUpgrades.map(u => `  - ${u.upgrade}: ${u.reasoning} (Estimated Cost: ${u.estimatedCost}, Impact on Value: ${u.impactOnValue})`).join('\n')}
    - Web Sources Consulted:
      ${(valuation.sources && valuation.sources.length > 0) ? valuation.sources.map(s => `  - [${s.title}](${s.uri})`).join('\n') : 'None'}

    **Report Structure:**
    Create a report with the following sections:
    
    1.  **## Executive Summary:** Start with a brief, high-level overview of the property, its estimated value, and key findings.
    2.  **## Property Overview:** Describe the property in detail, using the detected features, property type, and condition. Make it sound appealing but realistic.
    3.  **## Market & Valuation Analysis:** Elaborate on the reasoning behind the valuation. If web sources were consulted, explain how the property compares to the local market based on those comps.
    4.  **## Path to Increased Value:** Frame the "Suggested Upgrades" as a strategic investment plan. For each upgrade, explain the potential return on investment in a compelling way.
    5.  **## Conclusion & Disclaimer:** End with a concluding paragraph summarizing the property's potential. Include a brief disclaimer that this is an AI-generated estimate and a professional in-person appraisal is recommended for final decisions.

    Generate only the text for the report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating detailed report:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate detailed report: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the report.");
  }
};
