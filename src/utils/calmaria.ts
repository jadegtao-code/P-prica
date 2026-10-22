export interface CalmariaNuance {
  level: 'plena' | 'boa' | 'moderada' | 'alerta' | 'critica';
  label: string;
  sublabel: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  badgeBg: string;
  progressBg: string;
  dotColor: string;
  accentHex: string;
}

export function getCalmariaNuance(score: number): CalmariaNuance {
  if (score >= 90) {
    return {
      level: 'plena',
      label: 'Calmaria Plena',
      sublabel: 'Escritório sereno e com tudo em dia',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-400',
      bgColor: 'bg-emerald-50/70',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      progressBg: 'bg-emerald-600',
      dotColor: 'bg-emerald-500',
      accentHex: '#059669',
    };
  }
  if (score >= 75) {
    return {
      level: 'boa',
      label: 'Calmaria Estável',
      sublabel: 'Ritmo suave e sem atrasos críticos',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-400',
      bgColor: 'bg-teal-50/70',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
      progressBg: 'bg-teal-600',
      dotColor: 'bg-teal-500',
      accentHex: '#0D9488',
    };
  }
  if (score >= 60) {
    return {
      level: 'moderada',
      label: 'Atenção Leve',
      sublabel: 'Prazos vencendo nos próximos 3 dias',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-400',
      bgColor: 'bg-amber-50/70',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      progressBg: 'bg-amber-500',
      dotColor: 'bg-amber-500',
      accentHex: '#D97706',
    };
  }
  if (score >= 40) {
    return {
      level: 'alerta',
      label: 'Alerta Moderado',
      sublabel: 'Acúmulo de urgências e entregas próximas',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-400',
      bgColor: 'bg-orange-50/70',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
      progressBg: 'bg-orange-600',
      dotColor: 'bg-orange-500',
      accentHex: '#EA580C',
    };
  }
  return {
    level: 'critica',
    label: 'Urgência Crítica',
    sublabel: 'Tarefas atrasadas exigindo resolução imediata',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50/70',
    badgeBg: 'bg-red-100 text-red-900 border-red-300',
    progressBg: 'bg-red-600',
    dotColor: 'bg-red-600',
    accentHex: '#DC2626',
  };
}
