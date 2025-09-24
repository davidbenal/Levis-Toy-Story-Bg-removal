import { GoogleGenAI, Modality } from "@google/genai";
import { Background } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume API_KEY is always present.
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

const urlToBase64 = async (url: string): Promise<{ base64: string, mimeType: string }> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const mimeType = blob.type;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error("Failed to read file as base64 string."));
            }
            const base64 = reader.result.split(',')[1];
            resolve({ base64, mimeType });
        };
        reader.readAsDataURL(blob);
    });
};


export const generateSwappedBackground = async (userImageBase64WithMime: string, background: Background): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image-preview';

    const userImageMimeType = userImageBase64WithMime.match(/data:(.*);base64,/)?.[1] || 'image/jpeg';
    const userImageBase64 = userImageBase64WithMime.split(',')[1];

    let backgroundBase64: string;
    let backgroundMimeType: string;

    if (background.previewUrl.startsWith('data:image')) {
        const parts = background.previewUrl.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        backgroundMimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        backgroundBase64 = parts[1];
    } else {
        const result = await urlToBase64(background.previewUrl);
        backgroundBase64 = result.base64;
        backgroundMimeType = result.mimeType;
    }
    
    const userImagePart = fileToGenerativePart(userImageBase64, userImageMimeType);
    const backgroundImagePart = fileToGenerativePart(backgroundBase64, backgroundMimeType);

    let prompt = `You are a creative director and expert photo editor. Your mission is to create a new, single, cohesive photograph that looks as if the person was genuinely photographed within the new scene. Do not simply cut out the person and paste them on the new background. Instead, reimagine the entire scene as a single, authentic photograph.
    
    'Important: Do not alter the persons face, eyes, hair, or any other facial features. The goal is to perfectly preserve their original identity and expression.'

    **Analyze the images:**
    1.  **First Image (Subject):** This contains the primary person/subject.
    2.  **Second Image (Environment):** This is the new environment.

    **Instructions for a truly authentic final photograph:**
    1.  **Preserve the Pose:** The person's original pose, posture, and expression from the first image must be strictly maintained. Do not alter their body position or facial expression. Your task is to place the subject with their original pose into the new environment.
    2. **Cohesive Photography Properties:** The final image must look like it was taken with a single camera. This means unifying the depth of field, focus, lens distortion, and film grain across both the subject and the background. **Ensure the facial features, especially the eyes, remain untouched and do not lose their original detail.**
    3.  **Masterful Lighting:**
        *   Analyze the light source (direction, color, softness) from the environment image.
        *   Completely relight the subject to match this light. This includes casting realistic, soft shadows from the subject onto the environment.
        *   Add subtle bounce light from the environment back onto the subject to truly ground them in the scene.7
    4.  **Remove Unwanted Details from the Subject Image:** If the first image contains any objects, props, or details that do not belong to the person (e.g., items lying around, background clutter, or artifacts), remove them seamlessly so they do not appear in the final composition. Ensure the person remains untouched and their pose, expression, and proportions are preserved.
    5.  **Harmonious Color Grading:** Apply a final color grade to the entire image to ensure perfect color harmony between the subject and the environment.
    6.  **Final Output:** The result must be a single, photorealistic composition that feels like a genuine moment captured on camera. Output *only* the final image in a 9:16 vertical aspect ratio. The final image must be high-resolution, crisp, and suitable for download without loss of quality. Retain all fine details and textures.
    `;
    'Important: Do not alter or modify the physical characteristics of the person or people in the image (including facial features, body shape, skin tone, hair, or clothing details). The final composition must include every person from the original photo, preserving their exact identity, appearance, and pose. Apply all integrations and adjustments consistently to all individuals, ensuring realism and harmony with the environment.'
    
    if (background.id === 'cardboard-box') {
        prompt = `You are a creative director for a high-fashion photoshoot. Your task is to create a single, stunning photograph based on the provided assets.

      **The Concept:** A person is posing for a photoshoot inside a giant, life-sized cardboard box set. The final image should feel artistic, intentional, and completely real. It should NOT look like a simple background replacement.

      **The Assets:**
      - **Image 1 (The Model):** A photo of the person.
      - **Image 2 (The Set):** The life-sized cardboard box set with packing peanuts.

      **Your Creative Direction:**

      1.  **Maintain the Original Pose:** It is crucial to preserve the exact pose, posture, and expression of the model from the original photo. Do not alter their pose in any way. Your task is to integrate this exact pose seamlessly into the new environment.

      2.  **Integrate, Don't Place:** The model must be grounded *within* the set.
          *   **Crucial Physical Interaction:** Their feet MUST sink realistically into the packing peanuts. The peanuts should shift and compress under their weight. This detail is non-negotiable for realism.

      3.  **Create a Professional Lighting Setup:**
          *   **Analyze the Set Lighting:** The set is lit by a large, soft light source from the front (the "camera's" direction), mimicking a professional studio softbox.
          *   **Sculpt with Light:** Re-light the model to match this setup. This means soft highlights on the front and gentle, diffused shadows wrapping around their form and cast onto the back and sides of the box and the peanuts below. The lighting should have depth and shape.

      4.  **Harmonize the Scene:**
          *   **Color Story:** Grade the entire image to have a cohesive, professional color palette. The warm tones of the cardboard should influence the overall mood and be subtly reflected on the model's skin and clothing.
          *   **Camera Properties:** The final image should have consistent depth of field, film grain (if appropriate), and focus, as if taken by a single high-end camera.

      5.  **Final Composition:**
          *   Produce a single, photorealistic image in a 9:16 vertical aspect ratio.
          *   The result must look like a final shot from a magazine photoshoot.
          *   Output ONLY the final composed image. Do not include any text or explanation.

      **What to Avoid at All Costs:**
      - Altering the model's original pose.
      - A "sticker" effect where the person looks pasted on.
      - Flat, unrealistic lighting.
      - Feet floating on the peanuts.
      - Any hint that this is a digital composite.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [userImagePart, backgroundImagePart, { text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("API did not return an image.");

  } catch (error) {
    console.error("Error generating swapped background:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};