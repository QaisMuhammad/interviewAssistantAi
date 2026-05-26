const { GoogleGenAI , Type } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "Job title for which the interview report is generated"
    },

    matchScore: {
      type: Type.NUMBER,
      description: "Score between 0 and 100"
    },

    technicalQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "intention", "answer"]
      }
    },

    behavioralQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "intention", "answer"]
      }
    },

    skillGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          severity: {
            type: Type.STRING,
            enum: ["low", "medium", "high"]
          }
        },
        required: ["skill", "severity"]
      }
    },

    preparationPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          focus: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING
            }
          }
        },
        required: ["day", "focus", "tasks"]
      }
    }
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan"
  ]
};

async function invokeGoogleGenAI(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello Gemini ! Explain what is interview?"
        });
        console.log("Google GenAI response:", response.text);
        return response;
    } catch (error) {
        console.error("Error invoking Google GenAI:", error);
        throw error;
    }
}

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate a detailed interview preparation report.

Return ONLY valid JSON.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    });

    const data = JSON.parse(response.text);

    console.log(data);

    return data;
}

module.exports = {
    invokeGoogleGenAI,
    generateInterviewReport
};