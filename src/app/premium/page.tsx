'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/custom/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Check,
  Zap,
  MessageSquare,
  History,
  Image as ImageIcon,
  FileText,
  Sparkles,
  CreditCard,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function PremiumPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

  const handleSubscribe = async () => {
    if (!user) return;

    setProcessing(true);

    // Simulação de pagamento (em produção, integrar com Stripe, Mercado Pago, etc)
    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('users')
          .update({ is_premium: true })
          .eq('id', user.id);

        if (error) throw error;

        await refreshUser();
        toast.success('Assinatura Premium ativada!', {
          description: 'Aproveite todos os recursos exclusivos.',
        });
        router.push('/dashboard');
      } catch (error) {
        toast.error('Erro ao processar pagamento');
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
      </div>
    );
  }

  if (!user) return null;

  const features = [
    {
      icon: Zap,
      title: 'Consultas Ilimitadas',
      description: 'Sem limite diário de consultas médicas',
      free: '3 por dia',
      premium: 'Ilimitado',
    },
    {
      icon: MessageSquare,
      title: 'Chat IA Avançado',
      description: 'Respostas mais completas e detalhadas',
      free: 'Básico',
      premium: 'Avançado',
    },
    {
      icon: History,
      title: 'Histórico Completo',
      description: 'Acesso a todas as suas consultas',
      free: 'Últimas 5',
      premium: 'Ilimitado',
    },
    {
      icon: ImageIcon,
      title: 'OCR de Receitas',
      description: 'Reconhecimento de texto em imagens',
      free: '✗',
      premium: '✓',
    },
    {
      icon: FileText,
      title: 'Relatórios Personalizados',
      description: 'Histórico de sintomas e diagnósticos',
      free: '✗',
      premium: '✓',
    },
    {
      icon: Sparkles,
      title: 'Sem Anúncios',
      description: 'Experiência premium sem interrupções',
      free: '✗',
      premium: '✓',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-4">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Plano{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Premium
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Desbloqueie todo o potencial do Farma AI com recursos exclusivos e ilimitados
          </p>
        </div>

        {user.is_premium && (
          <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6 text-center">
              <Check className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Você já é Premium! 🎉</h3>
              <p className="text-lg opacity-90">
                Aproveite todos os recursos exclusivos disponíveis
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-12">
          <Card className="border-2 border-amber-500 shadow-2xl">
            <CardHeader className="text-center pb-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-4 mx-auto">
                Mais Popular
              </Badge>
              <CardTitle className="text-3xl font-bold mb-2">Premium</CardTitle>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold">R$ 29,90</span>
                <span className="text-gray-600 dark:text-gray-400">/mês</span>
              </div>
              <CardDescription className="text-base mt-2">
                Cancele quando quiser
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-4 mb-8">
                {[
                  'Consultas ilimitadas por dia',
                  'Chat IA avançado e prioritário',
                  'Histórico completo de consultas',
                  'OCR de receitas médicas',
                  'Relatórios personalizados de saúde',
                  'Respostas mais rápidas e detalhadas',
                  'Acesso prioritário a novos recursos',
                  'Experiência sem anúncios',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {!user.is_premium && (
                <Button
                  onClick={handleSubscribe}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 text-lg py-6"
                >
                  {processing ? (
                    'Processando...'
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Assinar Premium Agora
                    </>
                  )}
                </Button>
              )}

              {user.is_premium && (
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] text-white hover:opacity-90 text-lg py-6">
                    Ir para Dashboard
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods (Simulado) */}
        {!user.is_premium && (
          <Card className="max-w-md mx-auto mb-12">
            <CardHeader>
              <CardTitle className="text-center">Formas de Pagamento</CardTitle>
              <CardDescription className="text-center">
                Pagamento seguro e criptografado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 p-4 border rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                  <span className="text-sm font-medium">Cartão</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-4 border rounded-lg">
                  <QrCode className="w-6 h-6 text-gray-600" />
                  <span className="text-sm font-medium">PIX</span>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                💡 Demo: O pagamento é simulado para fins de demonstração
              </p>
            </CardContent>
          </Card>
        )}

        {/* Feature Comparison */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Comparação de Recursos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E88E5] to-[#0E7C7B] rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Gratuito:</span>
                        <Badge variant="outline">{feature.free}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Premium:</span>
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          {feature.premium}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.',
              },
              {
                q: 'O que acontece se eu cancelar?',
                a: 'Você continuará com acesso Premium até o fim do período pago, depois voltará ao plano gratuito.',
              },
              {
                q: 'Os dados são seguros?',
                a: 'Sim! Todos os dados são criptografados e armazenados com segurança máxima.',
              },
              {
                q: 'Posso mudar de plano depois?',
                a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento.',
              },
            ].map((faq, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
