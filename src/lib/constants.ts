export const SEVERITY_LEVELS = {
  leve: {
    label: 'Leve',
    color: 'green',
    icon: '🟢',
    description: 'Pode ser tratado em casa com cuidados básicos',
  },
  moderado: {
    label: 'Moderado',
    color: 'yellow',
    icon: '🟡',
    description: 'Monitore os sintomas e procure médico se persistir',
  },
  grave: {
    label: 'Grave',
    color: 'red',
    icon: '🔴',
    description: 'Procure atendimento médico imediatamente',
  },
} as const;

export const PREMIUM_FEATURES = [
  {
    id: 'unlimited-consultations',
    name: 'Consultas Ilimitadas',
    description: 'Sem limite diário de consultas médicas',
    free: '3 por dia',
    premium: 'Ilimitado',
  },
  {
    id: 'advanced-chat',
    name: 'Chat IA Avançado',
    description: 'Respostas mais completas e detalhadas com GPT-4',
    free: 'Básico',
    premium: 'Avançado',
  },
  {
    id: 'full-history',
    name: 'Histórico Completo',
    description: 'Acesso a todas as suas consultas anteriores',
    free: 'Últimas 5',
    premium: 'Ilimitado',
  },
  {
    id: 'ocr',
    name: 'OCR de Receitas',
    description: 'Reconhecimento de texto em imagens de receitas',
    free: false,
    premium: true,
  },
  {
    id: 'reports',
    name: 'Relatórios Personalizados',
    description: 'Histórico de sintomas e diagnósticos detalhados',
    free: false,
    premium: true,
  },
  {
    id: 'no-ads',
    name: 'Sem Anúncios',
    description: 'Experiência premium sem interrupções',
    free: false,
    premium: true,
  },
] as const;

export const MEDICATION_TYPES = {
  analgesico: 'Analgésico',
  antibiotico: 'Antibiótico',
  antiinflamatorio: 'Anti-inflamatório',
  antipiretico: 'Antipirético',
  antialergico: 'Antialérgico',
  antitussigeno: 'Antitussígeno',
  descongestionante: 'Descongestionante',
  vitamina: 'Vitamina/Suplemento',
  outro: 'Outro',
} as const;

export const CONSULTATION_LIMITS = {
  free: {
    daily: 3,
    history: 5,
  },
  premium: {
    daily: Infinity,
    history: Infinity,
  },
} as const;

export const APP_CONFIG = {
  name: 'Farma AI',
  description: 'Assistente Médico Inteligente com IA',
  version: '1.0.0',
  colors: {
    primary: '#1E88E5',
    secondary: '#0E7C7B',
    premium: '#F59E0B',
  },
  support: {
    email: 'suporte@farmaai.com',
    phone: '+55 11 99999-9999',
  },
} as const;
