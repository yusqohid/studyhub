
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// AI Summarizer functions
export interface SummarizeOptions {
  length?: 'short' | 'medium' | 'long';
  style?: 'bullet' | 'paragraph' | 'outline';
  focus?: 'key_points' | 'concepts' | 'actionable';
  language?: 'id' | 'en';
}

export const summarizeText = async (
  content: string, 
  title?: string,
  options: SummarizeOptions = {}
): Promise<string> => {
  const {
    length = 'medium',
    style = 'bullet',
    focus = 'key_points',
    language = 'id'
  } = options;

  // Define length specifications
  const lengthSpecs = {
    short: '3-5 poin utama dalam 150-200 kata',
    medium: '5-8 poin utama dalam 300-400 kata', 
    long: '8-12 poin utama dalam 500-600 kata'
  };

  // Define style formats
  const styleFormats = {
    bullet: 'gunakan format bullet points dengan • untuk setiap poin',
    paragraph: 'gunakan format paragraf yang mengalir dengan baik',
    outline: 'gunakan format outline dengan heading dan sub-poin'
  };

  // Define focus areas
  const focusAreas = {
    key_points: 'fokus pada poin-poin kunci dan konsep penting',
    concepts: 'fokus pada konsep teoritis dan pemahaman mendalam',
    actionable: 'fokus pada langkah-langkah praktis dan actionable insights'
  };

  const prompt = `
Buatlah ringkasan dari catatan belajar berikut ini:

${title ? `**Judul:** ${title}` : ''}

**Konten:**
${content}

**Instruksi Ringkasan:**
- Panjang: ${lengthSpecs[length]}
- Format: ${styleFormats[style]}
- Fokus: ${focusAreas[focus]}
- Bahasa: ${language === 'id' ? 'Bahasa Indonesia' : 'English'}
- Gunakan bahasa yang jelas dan mudah dipahami
- Pertahankan informasi penting dan detail relevan
- Jika ada rumus atau formula, sertakan dalam ringkasan
- Buat struktur yang logis dan mudah diikuti

Mulai ringkasan langsung tanpa kata pengantar:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Gagal membuat ringkasan. Silakan coba lagi.');
  }
};

export const generateStudyQuestions = async (
  content: string,
  title?: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<string> => {
  const difficultySpecs = {
    easy: 'pertanyaan dasar untuk pemahaman konsep',
    medium: 'pertanyaan analisis dan aplikasi konsep', 
    hard: 'pertanyaan sintesis dan evaluasi tingkat tinggi'
  };

  const prompt = `
Buatlah 5-7 pertanyaan belajar berdasarkan catatan berikut:

${title ? `**Judul:** ${title}` : ''}

**Konten:**
${content}

**Instruksi:**
- Level kesulitan: ${difficultySpecs[difficulty]}
- Buat pertanyaan yang membantu pemahaman dan review materi
- Gunakan variasi jenis pertanyaan (definisi, analisis, aplikasi, dll)
- Format dengan nomor dan baris baru untuk setiap pertanyaan
- Gunakan bahasa Indonesia yang jelas

Pertanyaan:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating study questions:', error);
    throw new Error('Gagal membuat pertanyaan belajar. Silakan coba lagi.');
  }
};

export const explainConcept = async (
  concept: string,
  context?: string,
  level: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): Promise<string> => {
  const levelSpecs = {
    beginner: 'dengan bahasa sederhana untuk pemula, gunakan analogi dan contoh sehari-hari',
    intermediate: 'dengan detail yang cukup untuk tingkat menengah, sertakan contoh praktis',
    advanced: 'dengan analisis mendalam untuk tingkat lanjut, sertakan nuansa dan kompleksitas'
  };

  const prompt = `
Jelaskan konsep "${concept}" ${levelSpecs[level]}.

${context ? `Konteks: ${context}` : ''}

**Format penjelasan:**
1. Definisi singkat dan jelas
2. Penjelasan detail dengan contoh
3. Aplikasi praktis atau relevansi
4. Tips untuk memahami atau mengingat

Gunakan bahasa Indonesia yang mudah dipahami:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error explaining concept:', error);
    throw new Error('Gagal menjelaskan konsep. Silakan coba lagi.');
  }
};
