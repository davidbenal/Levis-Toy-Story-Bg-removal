require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.GEMINI_API_KEY) {
  throw new Error('A variável de ambiente GEMINI_API_KEY não está definida.');
}

app.use(cors());
app.use(express.json({ limit: '20mb' })); // Aumentado o limite para imagens

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Função para converter URL de imagem para base64 no back-end
const urlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    return {
        base64: buffer.toString('base64'),
        mimeType: blob.type,
    };
};

const fileToGenerativePart = (base64, mimeType) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

app.post('/api/generate', async (req, res) => {
  try {
    const { userImage, background } = req.body;

    if (!userImage || !background) {
      return res.status(400).json({ error: 'É necessário enviar userImage e background.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });

     const userImageMimeType = userImage.match(/data:(.*);base64,/)?.[1] || 'image/jpeg';
    const userImageBase64 = userImage.split(',')[1];

    let backgroundBase64;
    let backgroundMimeType;

     if (background.previewUrl.startsWith('data:image')) {
        const parts = background.previewUrl.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        backgroundMimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        backgroundBase64 = parts[1];
    } else {
        let imageUrl = background.previewUrl;
        if (imageUrl.startsWith('/')) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            imageUrl = `${frontendUrl}${imageUrl}`;
        }
        const result = await urlToBase64(imageUrl);
        backgroundBase64 = result.base64;
        backgroundMimeType = result.mimeType;
    }
    
    const userImagePart = fileToGenerativePart(userImageBase64, userImageMimeType);
    const backgroundImagePart = fileToGenerativePart(backgroundBase64, backgroundMimeType);

    // Lógica de seleção de prompt (simplificada a partir do seu código)
  let prompt = `You are a creative director and expert photo editor. Your mission is to create a new, single, cohesive photograph that looks as if the person was genuinely photographed within the new scene. Do not simply cut out the person and paste them on the new background. Instead, reimagine the entire scene as a single, authentic photograph.
      
    'Important: Do not alter the physical characteristics of the person or people in the image (including facial features, body shape, skin tone, hair, or clothing details). The final composition must include every person from the original photo, preserving their exact identity, appearance, and pose. Apply all integrations and adjustments consistently to all individuals, ensuring realism and harmony with the environment.'

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
      4. Grounding and Physical Interaction: Ensure the person is firmly "grounded" in the new environment. The light, shadow, and, most importantly, the way the feet or other body parts interact with the ground must be perfectly realistic. If the person is standing, create subtle shadows and surface deformations under their feet to make it look like they are genuinely exerting weight on the surface.
      5.  **Remove Unwanted Details from the Subject Image:** If the first image contains any objects, props, or details that do not belong to the person (e.g., items lying around, background clutter, or artifacts), remove them seamlessly so they do not appear in the final composition. Ensure the person remains untouched and their pose, expression, and proportions are preserved.
      6.  **Harmonious Color Grading:** Apply a final color grade to the entire image to ensure perfect color harmony between the subject and the environment.
      7.  **Final Output:** The result must be a single, photorealistic composition that feels like a genuine moment captured on camera. Output *only* the final image in a 9:16 vertical aspect ratio. The final image must be high-resolution, crisp, and suitable for download without loss of quality. Retain all fine details and textures.
      `;
      'Important: Do not alter or modify the physical characteristics of the person or people in the image (including facial features, body shape, skin tone, hair, or clothing details). The final composition must include every person from the original photo, preserving their exact identity, appearance, and pose. Apply all integrations and adjustments consistently to all individuals, ensuring realism and harmony with the environment.'
      
      if (background.id === 'cardboard-box') {
          prompt = `You are a creative director for a high-fashion photoshoot. Your task is to create a single, stunning photograph based on the provided assets.

        **The Concept: A person is posing for a photoshoot inside a giant, life-sized cardboard box set. The final image should feel artistic, intentional, and completely real. It should NOT look like a simple background replacement.
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

    const generationResult = await model.generateContent([prompt, userImagePart, backgroundImagePart]);
    const response = generationResult.response;

    // Extrai a imagem da resposta
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        const dataUrl = `data:${mimeType};base64,${base64ImageBytes}`;
        return res.json({ data: dataUrl });
      }
    }
    
    // Se nenhuma imagem for encontrada na resposta
    throw new Error('A API do Gemini não retornou uma imagem.');

  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error);
    res.status(500).json({ error: 'Falha ao processar a imagem no servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy rodando na porta ${PORT}`);
});