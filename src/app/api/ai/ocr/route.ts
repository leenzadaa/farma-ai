import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // OCR simulado sem OpenAI
    const medicationName = 'Paracetamol 500mg';

    return NextResponse.json({ 
      medicationName,
      message: 'Medicamento identificado com sucesso (modo simulado)'
    });
  } catch (error) {
    console.error('Erro no OCR:', error);
    return NextResponse.json(
      { error: 'Erro ao processar imagem' },
      { status: 500 }
    );
  }
}
