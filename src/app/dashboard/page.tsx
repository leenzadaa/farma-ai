'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/custom/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  History,
  Crown,
  AlertCircle,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { analyzeSymptomsWithAI, DiagnosisResult } from '@/lib/ai-service';
import { saveConsultation, getDailyConsultationCount } from '@/lib/consultation-service';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [symptoms, setSymptoms] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDailyCount();
    }
  }, [user]);

  const loadDailyCount = async () => {
    if (!user) return;
    const count = await getDailyConsultationCount(user.id);
    setDailyCount(count);
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast.error('Por favor, descreva seus sintomas');
      return;
    }

    if (!user?.is_premium && dailyCount >= 3) {
      toast.error('Limite diário atingido', {
        description: 'Assine o plano Premium para consultas ilimitadas.',
      });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const diagnosis = await analyzeSymptomsWithAI(symptoms, user?.is_premium || false);
      setResult(diagnosis);

      // Salvar consulta
      await saveConsultation(
        user!.id,
        symptoms,
        diagnosis.diagnosis,
        diagnosis.severity,
        diagnosis.medications.map((m) => m.name),
        diagnosis.recommendations
      );

      await loadDailyCount();
      toast.success('Análise concluída!');
    } catch (error) {
      toast.error('Erro ao analisar sintomas', {
        description: 'Tente novamente mais tarde.',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'leve':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'moderado':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'grave':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'leve':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'moderado':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'grave':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Descreva seus sintomas para receber um diagnóstico inteligente
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Plano Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {user.is_premium ? (
                  <>
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-bold text-amber-600">Premium</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">Gratuito</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Consultas Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyCount} / {user.is_premium ? '∞' : '3'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href="/chat">
                <Button size="sm" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Link>
              <Link href="/history">
                <Button size="sm" variant="outline">
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Premium Banner */}
        {!user.is_premium && (
          <Card className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Crown className="w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Upgrade para Premium</h3>
                    <p className="text-sm opacity-90">
                      Consultas ilimitadas, chat avançado e muito mais!
                    </p>
                  </div>
                </div>
                <Link href="/premium">
                  <Button className="bg-white text-amber-600 hover:bg-gray-100">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Descreva seus Sintomas</CardTitle>
              <CardDescription>
                Seja o mais detalhado possível para um diagnóstico preciso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ex: Estou com dor de cabeça forte há 2 dias, febre de 38°C, dor no corpo e cansaço..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={8}
                className="resize-none"
              />

              <Button
                onClick={handleAnalyze}
                disabled={analyzing || !symptoms.trim()}
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] text-white hover:opacity-90"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Analisar Sintomas
                  </>
                )}
              </Button>

              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#1E88E5] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Este diagnóstico é gerado por IA e não substitui consulta médica profissional.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Análise</CardTitle>
              <CardDescription>
                {result ? 'Diagnóstico e recomendações' : 'Aguardando análise...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyzing && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-[#1E88E5] mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Analisando seus sintomas...
                  </p>
                </div>
              )}

              {!analyzing && !result && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Descreva seus sintomas para receber um diagnóstico
                  </p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Severity */}
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(result.severity)}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Gravidade</p>
                      <Badge className={getSeverityColor(result.severity)}>
                        {result.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <h4 className="font-semibold mb-2">Diagnóstico</h4>
                    <p className="text-gray-700 dark:text-gray-300">{result.diagnosis}</p>
                  </div>

                  {/* Medications */}
                  <div>
                    <h4 className="font-semibold mb-2">Medicamentos Sugeridos</h4>
                    <div className="space-y-2">
                      {result.medications.map((med, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Genérico: {med.generic}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Dosagem: {med.dosage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-2">Recomendações</h4>
                    <p className="text-gray-700 dark:text-gray-300">{result.recommendations}</p>
                  </div>

                  {/* Urgency */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      ⚠️ Quando procurar ajuda médica:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{result.urgency}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
