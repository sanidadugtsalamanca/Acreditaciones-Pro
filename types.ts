
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
  showDigitalSignature: boolean;
  isDateRange: boolean;
  qrCodeUrl: string;
  isPremium: boolean;
  showQrCode: boolean;
  backgroundUrl?: string;
}

export const INITIAL_DATA: CertificateData = {
  id: 'default',
  logoUrl: 'https://serviciospublicos.ugt.org/images/logo_ugtsp.png',
  backgroundUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop', // Placeholder
  title: 'DIPLOMA ACREDITATIVO',
  department: 'Secretaría de Formación - Sanidad',
  studentName: 'Juan Pérez García',
  studentDni: '12.345.678-Z',
  role: 'ALUMNO',
  courseName: 'Estrategias de Negociación Colectiva en el Sector Público',
  description: 'Por haber completado satisfactoriamente la acción formativa enfocada en la mejora de las condiciones laborales y defensa de los servicios públicos.',
  contentKey: 'Módulo 1: Marco Normativo. Módulo 2: Técnicas de Negociación. Módulo 3: Acción Sindical.',
  detailedContent: 'UNIDAD 1: ESTATUTO BÁSICO DEL EMPLEADO PÚBLICO\n1.1. Derechos y deberes\n1.2. Carrera profesional\n\nUNIDAD 2: NEGOCIACIÓN COLECTIVA\n2.1. Mesas generales y sectoriales\n2.2. Resolución de conflictos\n\nUNIDAD 3: SALUD LABORAL\n3.1. Prevención en centros públicos',
  hours: '40 horas',
  startDate: '01/05/2024',
  endDate: '20/05/2024',
  location: 'Madrid',
  authority1Name: 'Julio Lacuerda Castelló',
  authority1Role: 'Secretario General UGT-SP',
  authority2Name: 'Responsable de Formación',
  authority2Role: 'Secretaría de Formación',
  uniqueCode: 'UGT-SP-EXP-2024-88',
  showDigitalSignature: true,
  isDateRange: true,
  qrCodeUrl: 'https://serviciospublicos.ugt.org/formacion/verificar',
  isPremium: true,
  showQrCode: true,
};
