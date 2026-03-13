
import React, { useState } from 'react';
import { CertificateData } from '../types.ts';
import { ShieldCheck } from 'lucide-react';

interface CertificatePreviewProps {
  data: CertificateData;
  scale?: number;
  activeSide: 'front' | 'back';
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ data, scale = 1, activeSide }) => {
  const [imageError, setImageError] = useState(false);

  const containerStyle: React.CSSProperties = {
    width: '1123px',
    height: '794px',
    transform: `scale(${scale})`,
    transformOrigin: 'top center',
    fontFamily: "'Inter', sans-serif",
    backgroundImage: data.backgroundUrl ? `url(${data.backgroundUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const premiumBorder = data.isPremium ? (
    <div className="absolute inset-0 p-4 pointer-events-none z-10">
      <div className="w-full h-full border-[12px] border-double border-ugt-gold/30 rounded-sm"></div>
    </div>
  ) : null;

  return (
    <>
      <div
        id="certificate-front"
        className={`bg-white shadow-2xl relative overflow-hidden mx-auto text-ugt-dark ${activeSide !== 'front' ? 'hidden' : 'block'}`}
        style={containerStyle}
      >
        {premiumBorder}
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-ugt-red opacity-[0.03] rounded-br-full -translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-ugt-red opacity-[0.05] rounded-tl-full translate-x-12 translate-y-12"></div>

        <div className="absolute inset-0 px-16 py-10 flex flex-col items-center justify-between z-20">
          
          {/* Header */}
          <div className="w-full flex justify-between items-start mb-2">
              <div className="flex items-center gap-6">
                  <div className="h-16 w-auto flex-shrink-0">
                      {data.logoUrl && !imageError ? (
                          <img 
                              src={data.logoUrl} 
                              alt="Logo UGT" 
                              className="h-full w-auto object-contain"
                              onError={() => setImageError(true)}
                              key={data.logoUrl}
                          />
                      ) : (
                          <div className="h-full w-40 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-[10px] font-bold text-ugt-red">
                              LOGO UGT
                          </div>
                      )}
                  </div>
                  <div className="h-12 w-px bg-gray-200"></div>
                  <div>
                      <h2 className="text-ugt-red font-black text-xl uppercase tracking-tighter leading-none">
                          Servicios Públicos
                      </h2>
                      <p className="text-gray-500 font-serif text-xs italic">
                          {data.department}
                      </p>
                  </div>
              </div>
              
              <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-ugt-red font-bold text-[10px] uppercase mb-1">
                      <ShieldCheck size={14} />
                      <span>Certificación Oficial</span>
                  </div>
                  <div className="text-[9px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      Ref: {data.uniqueCode}
                  </div>
              </div>
          </div>

          {/* Main Content Area */}
          <div className="text-center w-full flex-grow flex flex-col justify-center py-2 overflow-hidden">
              <h1 className="font-serif text-5xl font-black text-ugt-dark mb-4 uppercase tracking-tight">
                  {data.title}
              </h1>

              <div className="space-y-2 mb-4">
                  <p className="text-lg text-gray-500 font-serif italic">Se otorga el presente reconocimiento a:</p>
                  <h2 className="text-4xl font-bold text-ugt-red uppercase border-b-2 border-ugt-red/10 inline-block pb-1 px-8">
                      {data.studentName}
                  </h2>
                  <p className="text-base text-gray-500 font-semibold tracking-widest">
                      DNI/NIE: {data.studentDni}
                  </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-3">
                  <p className="text-lg text-gray-700 leading-relaxed">
                      En reconocimiento a su participación y aprovechamiento como <span className="font-bold text-ugt-dark underline decoration-ugt-red/30 underline-offset-4">{data.role}</span> en:
                  </p>
                  
                  <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 py-3 px-10 border-y border-gray-100 relative shadow-sm">
                      <h3 className="text-2xl font-bold text-ugt-dark mb-1">
                          {data.courseName}
                      </h3>
                      <p className="text-base text-gray-600 italic font-serif leading-tight">
                          "{data.description}"
                      </p>
                  </div>
              </div>

              <div className="flex justify-center items-center gap-12 mt-4 text-base">
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-ugt-red tracking-widest">Carga Lectiva</span>
                      <span className="font-bold text-ugt-dark">{data.hours}</span>
                  </div>
                  <div className="h-6 w-px bg-gray-200"></div>
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-ugt-red tracking-widest">Periodo</span>
                      <span className="font-bold text-ugt-dark">
                          {data.startDate} {data.isDateRange && data.endDate ? `al ${data.endDate}` : ''}
                      </span>
                  </div>
              </div>
          </div>

          {/* Footer Area */}
          <div className="w-full grid grid-cols-3 gap-6 items-end pt-4 border-t border-gray-100">
              <div className="text-center flex flex-col items-center">
                  <div className="h-16 flex items-center justify-center mb-2">
                      {data.showDigitalSignature && (
                          <span className="text-[8px] text-gray-400 font-mono rotate-[-2deg] border border-dashed border-gray-300 px-2 py-1 leading-none text-center">
                              CERTIFICADO DIGITALMENTE POR<br/>{data.authority1Name.toUpperCase()}
                          </span>
                      )}
                  </div>
                  <div className="w-full border-t border-gray-300 pt-2">
                      <p className="font-bold text-sm text-ugt-dark leading-tight">{data.authority1Name}</p>
                      <p className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter mt-0.5">{data.authority1Role}</p>
                  </div>
              </div>

              <div className="text-center flex flex-col items-center">
                  {data.showQrCode && (
                    <div className="mb-2 bg-white p-0.5 border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center overflow-hidden">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data.qrCodeUrl || data.uniqueCode)}`} 
                              alt="QR"
                              className="w-full h-full"
                            />
                        </div>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-500 italic mb-0.5">
                      Expedido en {data.location}, a {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[8px] font-mono text-gray-300 uppercase">Verificación: {data.uniqueCode}</p>
              </div>

              <div className="text-center flex flex-col items-center">
                  <div className="h-16 flex items-center justify-center mb-2">
                      {data.showDigitalSignature && (
                          <span className="text-[8px] text-gray-400 font-mono rotate-[2deg] border border-dashed border-gray-300 px-2 py-1 leading-none text-center">
                              AUTENTICADO POR<br/>SECRETARÍA UGT-SP
                          </span>
                      )}
                  </div>
                  <div className="w-full border-t border-gray-300 pt-2">
                      <p className="font-bold text-sm text-ugt-dark leading-tight">{data.authority2Name}</p>
                      <p className="text-[9px] uppercase text-gray-400 font-bold tracking-tighter mt-0.5">{data.authority2Role}</p>
                  </div>
              </div>
          </div>

          {/* Background Watermark */}
          {data.logoUrl && !imageError && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none z-0">
                 <img src={data.logoUrl} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
            </div>
          )}
        </div>
      </div>

      <div
        id="certificate-back"
        className={`bg-white shadow-2xl relative overflow-hidden mx-auto text-ugt-dark ${activeSide !== 'back' ? 'hidden' : 'block'}`}
        style={containerStyle}
      >
         <div className="absolute inset-0 border-[20px] border-gray-50 z-10 pointer-events-none"></div>
         
         <div className="absolute inset-0 p-16 flex flex-col z-20">
            <div className="flex justify-between items-end border-b-2 border-ugt-red pb-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-ugt-dark uppercase tracking-tighter">Programa Formativo</h2>
                    <p className="text-ugt-red font-bold text-xs">UGT SERVICIOS PÚBLICOS - {data.department.toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Titular del Certificado</p>
                    <p className="text-lg font-bold text-ugt-dark leading-tight">{data.studentName}</p>
                    <p className="text-xs font-mono text-gray-500">{data.studentDni}</p>
                </div>
            </div>

            <div className="flex-grow columns-2 gap-12 text-xs text-justify leading-relaxed text-gray-700 whitespace-pre-line overflow-hidden font-sans">
                {data.detailedContent}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {data.showQrCode && (
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center border border-gray-200">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data.qrCodeUrl || data.uniqueCode)}`} 
                                alt="QR Back"
                                className="w-8 h-8 grayscale opacity-40"
                            />
                        </div>
                    )}
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Verificación oficial</p>
                        <p className="text-[9px] font-mono text-gray-500">{data.qrCodeUrl || 'Vía Código de Registro'}</p>
                    </div>
                </div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Certificado de Aprovechamiento - ID: {data.uniqueCode}</p>
            </div>
         </div>
      </div>
    </>
  );
};

export default CertificatePreview;
