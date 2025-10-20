
import { GoogleGenAI, Modality } from "@google/genai";
import { type GeneratePortraitsParams } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const generatePortraits = async ({
  imageFile,
  topic,
  context,
  aspectRatio,
  numImages,
}: GeneratePortraitsParams): Promise<string[]> => {
  
  if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';
  
  const base64Image = await fileToBase64(imageFile);

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: imageFile.type,
    },
  };

  const prompt = `Generate a high-resolution, natural portrait of a Vietnamese woman.
Use the exact face from the uploaded image — do not modify her eyes, nose, mouth, expression, or hairstyle.
Topic: ${topic}.
Context: ${context}.
Lighting: flattering soft light, cinematic tone, natural colors.
Camera style: 50–85mm full-frame portrait, f/1.8–f/2.8, sharp eyes, shallow depth of field.
Composition must follow ${aspectRatio} aspect ratio.
Produce 1 high-quality photo maintaining the exact same identity and hair.
Output: high-resolution, photorealistic, downloadable portraits of Vietnamese women, culturally elegant, realistic, and beautiful.`;

  const textPart = { text: prompt };

  const generationPromises = Array(numImages).fill(0).map(() => {
    return ai.models.generateContent({
      model: model,
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
  });

  const responses = await Promise.all(generationPromises);

  const imageUrls: string[] = [];
  for (const response of responses) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        imageUrls.push(`data:${mimeType};base64,${base64ImageData}`);
      }
    }
  }

  if (imageUrls.length !== numImages) {
    throw new Error("Failed to generate the requested number of images.");
  }
  
  return imageUrls;
};
