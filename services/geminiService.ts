
import { Background } from '../types';

// A URL para o seu novo servidor back-end
const API_URL = 'http://localhost:3001/api/generate';

/**
 * Envia uma imagem e um fundo para o servidor back-end para processamento pelo Gemini.
 * @param userImage A imagem do usuário no formato data URL (base64).
 * @param background O objeto de background selecionado.
 * @returns A imagem gerada no formato data URL (base64).
 */
export const generateImageWithGemini = async (userImage: string, background: Background): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userImage,
        background 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha na requisição para o servidor');
    }

    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error('Erro ao comunicar com o servidor proxy:', error);
    throw error;
  }
};
