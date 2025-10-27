(()=>{var e={};e.id=581,e.ids=[581],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{"use strict";e.exports=require("assert")},78893:e=>{"use strict";e.exports=require("buffer")},61282:e=>{"use strict";e.exports=require("child_process")},84770:e=>{"use strict";e.exports=require("crypto")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},20629:e=>{"use strict";e.exports=require("fs/promises")},32615:e=>{"use strict";e.exports=require("http")},35240:e=>{"use strict";e.exports=require("https")},98216:e=>{"use strict";e.exports=require("net")},19801:e=>{"use strict";e.exports=require("os")},55315:e=>{"use strict";e.exports=require("path")},35816:e=>{"use strict";e.exports=require("process")},68621:e=>{"use strict";e.exports=require("punycode")},86624:e=>{"use strict";e.exports=require("querystring")},76162:e=>{"use strict";e.exports=require("stream")},82452:e=>{"use strict";e.exports=require("tls")},74175:e=>{"use strict";e.exports=require("tty")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},6162:e=>{"use strict";e.exports=require("worker_threads")},71568:e=>{"use strict";e.exports=require("zlib")},72254:e=>{"use strict";e.exports=require("node:buffer")},87561:e=>{"use strict";e.exports=require("node:fs")},88849:e=>{"use strict";e.exports=require("node:http")},22286:e=>{"use strict";e.exports=require("node:https")},87503:e=>{"use strict";e.exports=require("node:net")},49411:e=>{"use strict";e.exports=require("node:path")},97742:e=>{"use strict";e.exports=require("node:process")},84492:e=>{"use strict";e.exports=require("node:stream")},72477:e=>{"use strict";e.exports=require("node:stream/web")},41041:e=>{"use strict";e.exports=require("node:url")},47261:e=>{"use strict";e.exports=require("node:util")},65628:e=>{"use strict";e.exports=require("node:zlib")},58359:()=>{},93739:()=>{},65925:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>g,patchFetch:()=>h,requestAsyncStorage:()=>u,routeModule:()=>l,serverHooks:()=>y,staticGenerationAsyncStorage:()=>m});var i={};r.r(i),r.d(i,{POST:()=>d});var o=r(49303),s=r(88716),a=r(60670),n=r(19692),p=r(48235),c=r(87070);async function d(e){let t=await (0,n.e)(),{data:{user:r},error:i}=await t.auth.getUser();if(i||!r)return c.NextResponse.json({error:"Unauthorized"},{status:401});let{report:o}=await e.json();try{let e=await (0,p.g)(o),i={id:o.id,user_id:r.id,property_address:o.propertyDetails?.address||"Not specified",property_type:o.propertyType,property_condition:o.propertyCondition,estimated_value_min:o.estimatedValueRange.min,estimated_value_max:o.estimatedValueRange.max,confidence_score:o.confidenceScore,currency:o.currency,detailed_report:e,preview_image:o.previewImage,created_at:new Date().toISOString()},{data:s,error:a}=await t.from("reports").insert({user_id:r.id,report_data:i,created_at:new Date().toISOString()}).select().single();if(a)return c.NextResponse.json({error:a.message},{status:500});return c.NextResponse.json({report:e})}catch(e){return console.error("Error generating detailed report:",e),c.NextResponse.json({error:"Failed to generate detailed report"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/valuation/generate-report/route",pathname:"/api/valuation/generate-report",filename:"route",bundlePath:"app/api/valuation/generate-report/route"},resolvedPagePath:"/Users/macbook/Desktop/Projects/visionvalu_-ai-property-valuation/app/api/valuation/generate-report/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:m,serverHooks:y}=l,g="/api/valuation/generate-report/route";function h(){return(0,a.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:m})}},19692:(e,t,r)=>{"use strict";r.d(t,{e:()=>s});var i=r(2305),o=r(71615);async function s(){let e=await (0,o.cookies)();return(0,i.createServerClient)("https://bbbengshbvpqxtzrphov.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYmVuZ3NoYnZwcXh0enJwaG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzcxNjYsImV4cCI6MjA3Njk1MzE2Nn0.CkmmMBMjbQlJgsgMjRLGfjE6fO-BXiis8nZflT16VX8",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:i})=>e.set(t,r,i))}catch{}}}})}},48235:(e,t,r)=>{"use strict";r.d(t,{P:()=>n,g:()=>p});var i=r(58954);let o="AIzaSyDefnzV2zmVTS-mGUjliQI7grypJhfsdDk";if(!o)throw Error("GEMINI_API_KEY environment variable not set.");let s=new i.fA({apiKey:o}),a={type:i.Dy.OBJECT,properties:{estimatedValueRange:{type:i.Dy.OBJECT,properties:{min:{type:i.Dy.NUMBER,description:"The minimum estimated value based on conservative market analysis."},max:{type:i.Dy.NUMBER,description:"The maximum estimated value based on optimistic market conditions."}},required:["min","max"]},confidenceScore:{type:i.Dy.NUMBER,description:"A score from 0 to 100 representing the confidence in the valuation based on image quality, property visibility, and market data availability."},currency:{type:i.Dy.STRING,description:"The currency of the valuation (e.g., USD, EUR, NGN). Default to USD if not obvious."},reasoning:{type:i.Dy.STRING,description:"A comprehensive, detailed explanation for the valuation including market analysis, property condition assessment, comparable properties, and key value drivers."},detectedFeatures:{type:i.Dy.ARRAY,items:{type:i.Dy.STRING},description:"A comprehensive list of key visual features detected including architectural style, interior finishes, outdoor amenities, and unique characteristics."},propertyType:{type:i.Dy.STRING,description:"The specific type of property (e.g., 'Single-Family Home', 'Townhouse', 'Condo', 'Duplex', 'Multi-Family', 'Commercial Building')."},propertyCondition:{type:i.Dy.STRING,description:"The overall condition of the property (e.g., 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Needs Major Renovation')."},architecturalStyle:{type:i.Dy.STRING,description:"The architectural style of the property (e.g., 'Modern', 'Traditional', 'Colonial', 'Craftsman', 'Contemporary', 'Victorian')."},yearBuilt:{type:i.Dy.STRING,description:"Estimated year built based on architectural features and construction materials visible in images."},squareFootage:{type:i.Dy.STRING,description:"Estimated square footage based on visible rooms and proportions (e.g., '2,500-3,000 sqft', '1,200-1,500 sqft')."},lotSize:{type:i.Dy.STRING,description:"Estimated lot size based on visible outdoor space and property boundaries (e.g., '0.25-0.5 acres', 'Small urban lot')."},keyValueDrivers:{type:i.Dy.ARRAY,items:{type:i.Dy.STRING},description:"Key factors that positively impact the property's value (e.g., 'Updated kitchen', 'Prime location', 'Large lot', 'Modern finishes')."},potentialConcerns:{type:i.Dy.ARRAY,items:{type:i.Dy.STRING},description:"Potential issues or concerns that might negatively impact value (e.g., 'Outdated bathrooms', 'Small bedrooms', 'Limited parking')."},marketPositioning:{type:i.Dy.STRING,description:"How this property compares to the local market (e.g., 'Above market average', 'Market rate', 'Below market average', 'Premium property')."},suggestedUpgrades:{type:i.Dy.ARRAY,description:"A prioritized list of suggested upgrades or repairs to maximize the property's value, including detailed reasoning and ROI analysis.",items:{type:i.Dy.OBJECT,properties:{upgrade:{type:i.Dy.STRING,description:"The specific upgrade or repair suggested (e.g., 'Modernize Kitchen Appliances')."},reasoning:{type:i.Dy.STRING,description:"Detailed reasoning for why this upgrade is recommended based on current market trends and property analysis."},estimatedCost:{type:i.Dy.STRING,description:"A detailed cost estimate ('$5,000-8,000', 'Low: $1,000-3,000', 'High: $15,000-25,000')."},impactOnValue:{type:i.Dy.STRING,description:"The potential impact on the property's value ('Low: +2-5%', 'Medium: +5-10%', 'High: +10-20%')."},priority:{type:i.Dy.STRING,description:"Priority level ('High', 'Medium', 'Low') based on cost-benefit analysis."},timeline:{type:i.Dy.STRING,description:"Recommended timeline for implementation ('Immediate', 'Within 6 months', 'Long-term')."}},required:["upgrade","reasoning","estimatedCost","impactOnValue","priority","timeline"]}}},required:["estimatedValueRange","confidenceScore","currency","reasoning","detectedFeatures","propertyType","propertyCondition","architecturalStyle","yearBuilt","squareFootage","lotSize","keyValueDrivers","potentialConcerns","marketPositioning","suggestedUpgrades"]},n=async(e,t)=>{let r=e.map(e=>({inlineData:{mimeType:"image/jpeg",data:e}})),i=`
    Analyze the following property images and details as an expert real estate appraiser with 20+ years of experience. Conduct a comprehensive property valuation using advanced market analysis techniques.

    Property Details Provided:
    - Address/Location: ${t.address||"Not provided"}
    - Property Size: ${t.propertySize?`${t.propertySize} sqft`:"Not provided"}
    - Bedrooms: ${t.bedrooms||"Not provided"}
    - Bathrooms: ${t.bathrooms||"Not provided"}
    - Additional Notes: ${t.additionalNotes||"None"}

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
  `,o=t.address&&""!==t.address.trim();try{let e=await s.models.generateContent({model:"gemini-2.5-flash",contents:{parts:[...r,{text:i}]},config:o?{tools:[{googleSearch:{}}]}:{responseMimeType:"application/json",responseSchema:a}});if(!e.text)throw Error("No response text received from AI service.");let t=e.text.trim().replace(/^```json\s*|```$/g,""),n=JSON.parse(t);if(!n.estimatedValueRange||!n.reasoning)throw Error("Incomplete valuation data received from AI.");if(o){let t=e.candidates?.[0]?.groundingMetadata?.groundingChunks,r=t?.map(e=>e.web).filter(e=>!!e&&!!e.uri&&!!e.title)||[];return{...n,sources:r}}return n}catch(e){if(console.error("Error calling Gemini API:",e),e instanceof Error)throw Error(`Failed to get property valuation: ${e.message}`);throw Error("An unknown error occurred during property valuation.")}},p=async e=>{let t=`
    As a senior real estate analyst with 20+ years of experience, create a comprehensive, professional property valuation report. This report will be used by potential buyers, sellers, and investors for critical decision-making. The tone should be authoritative, data-driven, and actionable.

    **Comprehensive Property Data:**
    - Property Type: ${e.propertyType}
    - Address: ${e.propertyDetails?.address||"Not specified"}
    - Property Size: ${e.propertyDetails?.propertySize?`${e.propertyDetails.propertySize} sqft`:e.squareFootage||"Not specified"}
    - Bedrooms: ${e.propertyDetails?.bedrooms||"Not specified"}
    - Bathrooms: ${e.propertyDetails?.bathrooms||"Not specified"}
    - Architectural Style: ${e.architecturalStyle||"Not specified"}
    - Year Built: ${e.yearBuilt||"Not specified"}
    - Lot Size: ${e.lotSize||"Not specified"}
    - Estimated Value Range: $${e.estimatedValueRange.min.toLocaleString()} - $${e.estimatedValueRange.max.toLocaleString()} ${e.currency}
    - Confidence Score: ${e.confidenceScore}%
    - Market Positioning: ${e.marketPositioning||"Not specified"}
    - Overall Condition: ${e.propertyCondition}
    
    **Key Value Drivers:**
    ${e.keyValueDrivers?e.keyValueDrivers.map(e=>`- ${e}`).join("\n"):"Not specified"}
    
    **Potential Concerns:**
    ${e.potentialConcerns?e.potentialConcerns.map(e=>`- ${e}`).join("\n"):"None identified"}
    
    **Detected Features:**
    ${e.detectedFeatures.join(", ")}
    
    **AI Valuation Analysis:**
    ${e.reasoning}
    
    **Strategic Investment Recommendations:**
    ${e.suggestedUpgrades.map(e=>`- **${e.upgrade}** (Priority: ${e.priority}, Timeline: ${e.timeline})
  - Reasoning: ${e.reasoning}
  - Estimated Cost: ${e.estimatedCost}
  - Value Impact: ${e.impactOnValue}`).join("\n\n")}
    
    **Market Research Sources:**
    ${e.sources&&e.sources.length>0?e.sources.map(e=>`- [${e.title}](${e.uri})`).join("\n"):"No external sources consulted"}

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
  `;try{let e=await s.models.generateContent({model:"gemini-2.5-flash",contents:t});if(!e.text)throw Error("No response text received from AI service.");return e.text}catch(e){if(console.error("Error generating detailed report:",e),e instanceof Error)throw Error(`Failed to generate detailed report: ${e.message}`);throw Error("An unknown error occurred while generating the report.")}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[276,456,972,954],()=>r(65925));module.exports=i})();