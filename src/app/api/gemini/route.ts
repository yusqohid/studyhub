import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    const { content, title, type, options } = await request.json();

    let prompt = '';
    
    if (type === 'summarize') {
      const {
        length = 'medium',
        style = 'bullet',
        focus = 'key_points',
        language = 'id'
      } = options || {};

      const lengthSpecs: Record<string, string> = {
        short: '3-5 poin utama dalam 150-200 kata',
        medium: '5-8 poin utama dalam 300-400 kata', 
        long: '8-12 poin utama dalam 500-600 kata'
      };

      const styleFormats: Record<string, string> = {
        bullet: 'gunakan format bullet points dengan • untuk setiap poin',
        paragraph: 'gunakan format paragraf yang mengalir dengan baik',
        outline: 'gunakan format outline dengan heading dan sub-poin'
      };

      const focusAreas: Record<string, string> = {
        key_points: 'fokus pada poin-poin kunci dan konsep penting',
        concepts: 'fokus pada konsep teoritis dan pemahaman mendalam',
        actionable: 'fokus pada langkah-langkah praktis dan actionable insights'
      };

      prompt = `
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
    } else if (type === 'questions') {
      const difficulty = options?.difficulty || 'medium';
      const difficultySpecs: Record<string, string> = {
        easy: 'pertanyaan dasar untuk pemahaman konsep',
        medium: 'pertanyaan analisis dan aplikasi konsep', 
        hard: 'pertanyaan sintesis dan evaluasi tingkat tinggi'
      };

      prompt = `
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
    } else if (type === 'explain') {
      const { concept, context, level = 'intermediate' } = options || {};
      const levelSpecs: Record<string, string> = {
        beginner: 'dengan bahasa sederhana untuk pemula, gunakan analogi dan contoh sehari-hari',
        intermediate: 'dengan detail yang cukup untuk tingkat menengah, sertakan contoh praktis',
        advanced: 'dengan analisis mendalam untuk tingkat lanjut, sertakan nuansa dan kompleksitas'
      };

      prompt = `
Jelaskan konsep "${concept}" ${levelSpecs[level]}.

${context ? `Konteks: ${context}` : ''}

**Format penjelasan:**
1. Definisi singkat dan jelas
2. Penjelasan detail dengan contoh
3. Aplikasi praktis atau relevansi
4. Tips untuk memahami atau mengingat

Gunakan bahasa Indonesia yang mudah dipahami:
`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
