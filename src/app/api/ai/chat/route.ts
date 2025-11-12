import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, isPremium } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não fornecida' },
        { status: 400 }
      );
    }

    // Resposta simulada sem OpenAI
    const responses = {
      basic: `Obrigado pela sua mensagem. Como assistente médico virtual, posso ajudá-lo com informações básicas sobre saúde.

Para sintomas específicos, recomendo:
- Descrever detalhadamente o que está sentindo
- Informar há quanto tempo os sintomas persistem
- Mencionar se já tomou algum medicamento

⚠️ Lembre-se: sempre consulte um médico para diagnóstico preciso.`,
      
      premium: `Obrigado pela sua mensagem! Como usuário Premium, você tem acesso a respostas mais detalhadas.

Posso ajudá-lo com:
✓ Análise detalhada de sintomas
✓ Sugestões de medicamentos (genéricos e marca)
✓ Orientações sobre quando procurar atendimento médico
✓ Informações sobre dosagens e contraindicações

Por favor, descreva seus sintomas em detalhes para que eu possa fornecer orientações mais precisas.

⚠️ Importante: Minhas orientações não substituem consulta médica profissional.`
    };

    const response = isPremium ? responses.premium : responses.basic;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Erro no chat:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
