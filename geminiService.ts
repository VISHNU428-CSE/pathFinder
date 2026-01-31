
import { GoogleGenAI, Type } from "@google/genai";
import { SpatialAdvice, Language } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LANG_NAMES: Record<Language, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  ml: "Malayalam"
};

const FALLBACK_ADVICE: Record<Language, SpatialAdvice> = {
  en: { tip: "Corridors are wide; stay to the right for the smoothest tiles.", caution: "Expect higher density near the duty-free entrance." },
  hi: { tip: "गलियारे चौड़े हैं; सुगम टाइलों के लिए दाईं ओर रहें।", caution: "ड्यूटी-फ्री प्रवेश द्वार के पास अधिक भीड़ की अपेक्षा करें।" },
  te: { tip: "కారిడార్లు వెడల్పుగా ఉన్నాయి; మృదువైన టైల్స్ కోసం కుడి వైపున ఉండండి.", caution: "డ్యూటీ-ఫ్రీ ప్రవేశం వద్ద ఎక్కువ రద్దీని ఆశించండి." },
  ta: { tip: "நடைபாதைகள் அகலமானவை; மென்மையான தரைக்கு வலது பக்கம் ஒதுங்கிச் செல்லவும்.", caution: "சுங்கமில்லா நுழைவாயிலுக்கு அருகில் அதிக நெரிசலை எதிர்பார்க்கலாம்." },
  ml: { tip: "ഇടനാഴികൾ വീതിയുള്ളതാണ്; സുഗമമായ യാത്രയ്ക്കായി വലതുവശം ചേർന്ന് നീങ്ങുക.", caution: "ഡ്യൂട്ടി ഫ്രീ കവാടത്തിന് സമീപം തിരക്ക് പ്രതീക്ഷിക്കുക." }
};

export async function getSpatialAdvice(currentStep: string, destination: string, lang: Language = 'en'): Promise<SpatialAdvice> {
  try {
    const langName = LANG_NAMES[lang];
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As an expert in indoor accessibility for wheelchair users, provide a navigation tip and a caution for someone at "${currentStep}" going to "${destination}". Output the response in ${langName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tip: { type: Type.STRING, description: `A positive accessibility tip in ${langName}.` },
            caution: { type: Type.STRING, description: `A warning about crowds or obstacles in ${langName}.` }
          },
          required: ["tip", "caution"]
        }
      }
    });

    return JSON.parse(response.text) as SpatialAdvice;
  } catch (e) {
    console.warn("Gemini API error (SpatialAdvice), using fallback:", e);
    return FALLBACK_ADVICE[lang] || FALLBACK_ADVICE.en;
  }
}

export async function getDynamicInstructions(start: string, end: string, lang: Language = 'en'): Promise<string[]> {
  try {
    const langName = LANG_NAMES[lang];
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 short, clear navigation steps for a wheelchair user traveling from ${start} to ${end}. Output the response in ${langName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["steps"]
        }
      }
    });
    
    const data = JSON.parse(response.text);
    return data.steps;
  } catch (e) {
    console.warn("Gemini API error (DynamicInstructions), using fallback:", e);
    const trans: Record<Language, string[]> = {
      en: [`Move from ${start}`, "Follow signs through hub", `Arrive at ${end}`],
      hi: [`${start} से शुरू करें`, "हब के माध्यम से संकेतों का पालन करें", `${end} पर पहुंचें`],
      te: [`${start} నుండి బయలుదేరండి`, "గుర్తులను అనుసరించండి", `${end} కి చేరుకోండి`],
      ta: [`${start} இலிருந்து செல்லவும்`, "அடையாளங்களைப் பின்தொடரவும்", `${end} ஐ அடையுங்கள்`],
      ml: [`${start}-ൽ നിന്ന് ആരംഭിക്കുക`, "അടയാളങ്ങൾ ശ്രദ്ധിക്കുക", `${end}-ൽ എത്തുക`]
    };
    return trans[lang] || trans.en;
  }
}
