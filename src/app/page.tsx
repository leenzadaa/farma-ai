'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Activity, Brain, Shield, Zap, Crown, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1E88E5] to-[#0E7C7B] rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] bg-clip-text text-transparent">
              Farma AI
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-[#1E88E5] text-[#1E88E5] hover:bg-blue-50">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] text-white hover:opacity-90">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-[#1E88E5] font-semibold text-sm mb-4">
            🤖 Inteligência Artificial Médica
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Diagnóstico Inteligente{' '}
            <span className="bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] bg-clip-text text-transparent">
              com IA
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descreva seus sintomas e receba análise médica instantânea, sugestões de medicamentos e orientações profissionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] text-white hover:opacity-90 text-lg px-8 py-6"
              >
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/premium">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 text-lg px-8 py-6"
              >
                <Crown className="w-5 h-5 mr-2" />
                Ver Plano Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Brain,
              title: 'IA Avançada',
              description: 'Análise inteligente de sintomas com tecnologia de ponta',
              color: 'from-blue-500 to-blue-600',
            },
            {
              icon: Zap,
              title: 'Diagnóstico Rápido',
              description: 'Respostas instantâneas para suas dúvidas médicas',
              color: 'from-green-500 to-green-600',
            },
            {
              icon: Shield,
              title: 'Seguro e Confiável',
              description: 'Dados criptografados e privacidade garantida',
              color: 'from-purple-500 to-purple-600',
            },
            {
              icon: Activity,
              title: 'Histórico Completo',
              description: 'Acompanhe todas as suas consultas e diagnósticos',
              color: 'from-orange-500 to-orange-600',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-12 text-white text-center">
          <Crown className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Plano Premium</h2>
          <p className="text-xl mb-8 opacity-90">
            Consultas ilimitadas, chat avançado e recursos exclusivos
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {[
              'Consultas Ilimitadas',
              'Chat IA Avançado',
              'Histórico Completo',
              'Reconhecimento de Receitas (OCR)',
              'Relatórios Personalizados',
              'Sem Anúncios',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 bg-white/20 rounded-lg p-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
          <Link href="/premium">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Assinar Premium
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        <p className="mb-2">
          <strong>Farma AI</strong> - Assistente Médico Inteligente
        </p>
        <p className="text-sm">
          ⚠️ Este aplicativo não substitui consulta médica profissional. Em casos graves, procure atendimento médico imediatamente.
        </p>
      </footer>
    </div>
  );
}
