import { supabase, Consultation, ChatMessage } from './supabase';

export async function saveConsultation(
  userId: string,
  symptoms: string,
  diagnosis: string,
  severity: 'leve' | 'moderado' | 'grave',
  medications: string[],
  recommendations: string
): Promise<string> {
  const { data, error } = await supabase
    .from('consultations')
    .insert({
      user_id: userId,
      symptoms,
      diagnosis,
      severity,
      medications,
      recommendations,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function getConsultationHistory(
  userId: string,
  isPremium: boolean
): Promise<Consultation[]> {
  let query = supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!isPremium) {
    query = query.limit(5);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function saveChatMessage(
  userId: string,
  consultationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    consultation_id: consultationId,
    role,
    content,
  });

  if (error) throw error;
}

export async function getChatHistory(
  userId: string,
  consultationId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getDailyConsultationCount(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('consultations')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());

  if (error) throw error;
  return data?.length || 0;
}
