
export type ParticipationRole = 'ALUMNO' | 'ASISTENTE' | 'DOCENTE' | 'PONENTE' | 'COORDINADOR';

export interface CertificateData {
  id: string;
  logoUrl: string;
  title: string;
  department: string;
  studentName: string;
  studentDni: string;
  role: ParticipationRole;
  courseName: string;
  description: string;
  contentKey: string;
  detailedContent: string;
  hours: string;
  startDate: string;
  endDate: string;
  location: string;
  authority1Name: string;
  authority1Role: string;
  authority2Name: string;
  authority2Role: string;
  uniqueCode: string;
  showDigitalSignature: boolean; // New flag
  isDateRange: boolean; // New flag
}

export const INITIAL_DATA: CertificateData = {
  id: 'default',
  logoUrl: '', // Dejamos vacío para que salga el placeholder o el usuario suba su archivo local
  title: 'DIPLOMA ACREDITATIVO',
  department: 'Sanidad Salamanca',
  studentName: 'Juan Pérez García',
  studentDni: '12.345.678-Z',
  role: 'ALUMNO',
  courseName: 'Prevención de Riesgos Laborales en el Sector Público',
  description: 'Por haber completado con éxito la acción formativa organizada por la Secretaría de Formación de UGT Servicios Públicos.',
  contentKey: 'Módulo I: Marco Normativo. Módulo II: Riesgos Específicos. Módulo III: Primeros Auxilios.',
  detailedContent: 'UNIDAD DIDÁCTICA 1: INTRODUCCIÓN\n1.1. Conceptos básicos sobre seguridad y salud\n1.2. Marco normativo básico\n\nUNIDAD DIDÁCTICA 2: RIESGOS GENERALES\n2.1. Riesgos ligados a las condiciones de seguridad\n2.2. Riesgos ligados al medio-ambiente de trabajo\n2.3. La carga de trabajo, la fatiga y la insatisfacción laboral\n\nUNIDAD DIDÁCTICA 3: GESTIÓN DE LA PREVENCIÓN\n3.1. Organismos públicos relacionados\n3.2. Organización del trabajo preventivo',
  hours: '30 horas',
  startDate: '01/03/2024',
  endDate: '15/03/2024',
  location: 'Madrid',
  authority1Name: 'María Rodríguez',
  authority1Role: 'Secretaria de Formación',
  authority2Name: 'Carlos Sánchez',
  authority2Role: 'Secretario General',
  uniqueCode: 'UGT-SP-2024-001',
  showDigitalSignature: true,
  isDateRange: true,
};
