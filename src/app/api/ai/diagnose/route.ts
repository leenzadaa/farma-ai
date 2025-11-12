import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { symptoms, isPremium } = await request.json();

    if (!symptoms) {
      return NextResponse.json(
        { error: 'Sintomas não fornecidos' },
        { status: 400 }
      );
    }

    // Diagnóstico simulado sem OpenAI
    const diagnosis = {
      symptoms,
      diagnosis: isPremium 
        ? `Análise detalhada dos sintomas: ${symptoms}. Baseado na descrição, identificamos possíveis causas que requerem atenção médica adequada.`
        : `Sintomas identificados: ${symptoms}. Recomendamos acompanhamento médico.`,
      severity: 'moderado' as const,
      medications: [
        {
          name: 'Paracetamol',
          generic: 'Paracetamol',
          dosage: '500mg a cada 6 horas',
          type: 'Analgésico'
        },
        {
          name: 'Dipirona',
          generic: 'Dipirona Sódica',
          dosage: '500mg a cada 6 horas',
          type: 'Analgésico e Antitérmico'
        }
      ],
      recommendations: isPremium
        ? 'Recomendações detalhadas: Mantenha-se hidratado, descanse adequadamente e monitore os sintomas. Se houver piora ou persistência por mais de 3 dias, procure atendimento médico presencial.'
        : 'Descanse, hidrate-se e procure um médico se os sintomas persistirem.',
      urgency: 'Monitore os sintomas. Procure atendimento médico se houver piora.'
    };

    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Erro no diagnóstico:', error);
    return NextResponse.json(
      { error: 'Erro ao processar diagnóstico' },
      { status: 500 }
    );
  }
}
