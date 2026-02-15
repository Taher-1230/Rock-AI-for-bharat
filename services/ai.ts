import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Scheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractProfileFromImage = async (base64Image: string): Promise<Partial<UserProfile>> => {
  try {
    // Using gemini-3-flash-preview which supports multimodal inputs (Vision)
    const model = "gemini-3-flash-preview"; 
    const prompt = "Extract the following details from this ID card image: Name, Date of Birth (convert to age range if possible), Gender, Address (State/District). Format as JSON.";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            ageRange: { type: Type.STRING },
            state: { type: Type.STRING },
            district: { type: Type.STRING },
            gender: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return {};
  } catch (error) {
    console.error("Error extracting ID:", error);
    return {};
  }
};

export const generateSchemes = async (profile: UserProfile): Promise<Scheme[]> => {
  try {
    // Using gemini-3-flash-preview for text/reasoning tasks
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      You are an expert on Indian Government Schemes (JanSaarthi). 
      Based on the following user profile, recommend 5-6 highly relevant government schemes.
      
      User Profile:
      - Name: ${profile.name}
      - Age: ${profile.ageRange}
      - State: ${profile.state}
      - District: ${profile.district}
      - Occupation: ${profile.occupation}
      - Income: ${profile.income}
      - Category: ${profile.category}
      - Language: ${profile.language}

      Output must be in ${profile.language}.
      Return a JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              benefitType: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              eligible: { type: Type.BOOLEAN },
              amount: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure unique IDs
      return data.map((item: any, index: number) => ({
        ...item,
        id: item.id || `scheme-${index}-${Date.now()}`,
        eligible: true
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }
};