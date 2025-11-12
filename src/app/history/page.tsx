'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/custom/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XCircle, Calendar, Crown, Loader2 } from 'lucide-react';
import { getConsultationHistory, Consultation } from '@/lib/consultation-service';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const history = await getConsultationHistory(user.id, user.is_premium);
      setConsultations(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'leve':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'moderado':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'grave':
        return <XCircle className="w-5 h-5 text-red-500" />;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Histórico de Consultas</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user.is_premium
              ? 'Histórico completo de todas as suas consultas'
              : 'Últimas 5 consultas (Upgrade para Premium para histórico completo)'}
          </p>
        </div>

        {!user.is_premium && (
          <Card className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Crown className="w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Histórico Limitado</h3>
                    <p className="text-sm opacity-90">
                      Upgrade para Premium para acessar histórico completo e ilimitado
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

        {loadingHistory ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#1E88E5]" />
          </div>
        ) : consultations.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma consulta ainda</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comece descrevendo seus sintomas no dashboard
              </p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-[#1E88E5] to-[#0E7C7B] text-white hover:opacity-90">
                  Ir para Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(consultation.severity)}
                      <div>
                        <CardTitle className="text-lg">
                          {new Date(consultation.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </CardTitle>
                        <CardDescription>
                          {new Date(consultation.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(consultation.severity)}>
                      {consultation.severity.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Sintomas
                    </h4>
                    <p className="text-gray-900 dark:text-gray-100">{consultation.symptoms}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Diagnóstico
                    </h4>
                    <p className="text-gray-900 dark:text-gray-100">{consultation.diagnosis}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Medicamentos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {consultation.medications.map((med, index) => (
                        <Badge key={index} variant="outline">
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Recomendações
                    </h4>
                    <p className="text-gray-900 dark:text-gray-100">
                      {consultation.recommendations}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
