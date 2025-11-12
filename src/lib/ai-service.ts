export type DiagnosisResult = {
  symptoms: string;
  diagnosis: string;
  severity: 'leve' | 'moderado' | 'grave';
  medications: {
    name: string;
    generic: string;
    dosage: string;
    type: string;
  }[];
  recommendations: string;
  urgency: string;
};

export async function analyzeSymptomsWithAI(
  symptoms: string,
  isPremium: boolean
): Promise<DiagnosisResult> {
  const response = await fetch('/api/ai/diagnose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symptoms, isPremium }),
  });

  if (!response.ok) {
    throw new Error('Erro ao analisar sintomas');
  }

  return response.json();
}

export async function chatWithAI(
  message: string,
  conversationHistory: { role: string; content: string }[],
  isPremium: boolean
): Promise<string> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory, isPremium }),
  });

  if (!response.ok) {
    throw new Error('Erro ao conversar com IA');
  }

  const data = await response.json();
  return data.response;
}

export async function analyzeImageOCR(imageBase64: string): Promise<string> {
  const response = await fetch('/api/ai/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64 }),
  });

  if (!response.ok) {
    throw new Error('Erro ao analisar imagem');
  }

  const data = await response.json();
  return data.medicationName;
}
