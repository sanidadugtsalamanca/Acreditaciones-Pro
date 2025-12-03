
import React, { useState } from 'react';
import { CertificateData } from '../types';
import { ImageOff } from 'lucide-react';

interface CertificatePreviewProps {
  data: CertificateData;
  scale?: number;
  activeSide: 'front' | 'back';
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ data, scale = 1, activeSide }) => {
  const [imageError, setImageError] = useState(false);

  // Common style object
  const containerStyle: React.CSSProperties = {
    width: '1123px', // A4 Landscape width
    height: '794px', // A4 Landscape height
    transform: `scale(${scale})`,
    transformOrigin: 'top center',
    fontFamily: "'Inter', sans-serif",
  };

  const borderOverlay = (
    <div className="absolute inset-0 p-8 pointer-events-none z-10">
      <div className="w-full h-full border-4 border-ugt-red opacity-10 relative">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-ugt-red"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-ugt-red"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-ugt-red"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-ugt-red"></div>
      </div>
    </div>
  );

  return (
    <>
      {/* FRONT SIDE */}
      <div
        id="certificate-front"
        className={`bg-white shadow-2xl relative overflow-hidden mx-auto text-ugt-dark ${activeSide !== 'front' ? 'hidden' : 'block'}`}
        style={containerStyle}
      >
        {borderOverlay}

        <div className="absolute inset-0 p-12 flex flex-col items-center justify-between z-20">
          
          {/* Header Section (Logo Left + Text) */}
          <div className="w-full flex justify-start items-center mb-6 gap-8 border-b-2 border-gray-100 pb-6">
              {/* Logo (Top Left) Logic */}
              <div className="h-20 w-auto flex-shrink-0 flex items-center justify-center">
                  {data.logoUrl && !imageError ? (
                      <img 
                          src={data.logoUrl} 
                          alt="Logo Entidad" 
                          className="h-full w-auto object-contain"
                          onError={() => setImageError(true)}
                          // Reset error if url changes
                          key={data.logoUrl}
                      />
                  ) : (
                      <div className="h-full w-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 p-2">
                          {data.logoUrl ? (
                              <>
                                <ImageOff size={24} />
                                <span className="text-[10px] uppercase font-bold mt-1">Error al cargar</span>
                              </>
                          ) : (
                              <span className="text-sm font-bold text-ugt-red">LOGO AQUÍ</span>
                          )}
                      </div>
                  )}
              </div>
              
              {/* Vertical Separator */}
              <div className="h-16 w-px bg-gray-200"></div>

              {/* Text Block */}
              <div className="flex flex-col justify-center">
                   <h2 className="text-ugt-red font-bold text-2xl uppercase tracking-tight leading-none mb-1">
                      Servicios Públicos
                   </h2>
                   <p className="text-ugt-dark font-serif text-lg italic leading-tight">
                       {data.department}
                   </p>
              </div>
          </div>

          {/* Main Content */}
          <div className="text-center w-full flex-grow flex flex-col justify-center">
              
              <h1 className="font-serif text-5xl font-black text-ugt-dark mb-8 uppercase tracking-tight">
                  {data.title}
              </h1>

              <p className="text-xl text-gray-600 mb-2 font-serif italic">
                  Certifica que
              </p>

              <div className="mb-6">
                  <h2 className="text-4xl font-bold text-ugt-red mb-2 uppercase">
                      {data.studentName}
                  </h2>
                  <p className="text-lg text-gray-500 font-medium">
                      {data.studentDni ? `DNI/NIE: ${data.studentDni}` : ''}
                  </p>
              </div>

              {/* Dynamic Role Text */}
              <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-6 leading-relaxed">
                   Ha participado en calidad de <span className="font-bold uppercase text-ugt-dark">{data.role}</span> en la acción formativa:
              </p>

              <div className="bg-gray-50 border-l-4 border-ugt-red py-4 px-8 max-w-3xl mx-auto mb-6 w-full shadow-sm">
                  <h3 className="text-2xl font-bold text-ugt-dark mb-2">
                      {data.courseName}
                  </h3>
                  <p className="text-lg text-gray-600 italic">
                      {data.description}
                  </p>
              </div>

               {/* Optional short content on front */}
               {data.contentKey && (
                   <p className="text-sm text-gray-500 text-center max-w-2xl mx-auto mb-6">
                       {data.contentKey}
                   </p>
               )}

              <div className="flex justify-center items-center gap-8 text-lg font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                      <span className="text-ugt-red">Duración:</span>
                      <span>{data.hours}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-2">
                      <span className="text-ugt-red">{data.isDateRange ? 'Fechas:' : 'Fecha:'}</span>
                      <span>
                          {data.startDate}
                          {data.isDateRange && data.endDate ? ` - ${data.endDate}` : ''}
                      </span>
                  </div>
              </div>
          </div>

          {/* Footer / Signatures */}
          <div className="w-full mt-8 grid grid-cols-3 gap-8 items-end">
              
              {/* Signature 1 */}
              <div className="text-center">
                  <div className="mb-4 h-16 flex items-end justify-center">
                     {data.showDigitalSignature && (
                        <div className="font-dancing text-gray-400 opacity-50 italic">Firmado digitalmente</div>
                     )}
                  </div>
                  <div className="border-t border-gray-400 w-3/4 mx-auto pt-2">
                      <p className="font-bold text-ugt-dark">{data.authority1Name}</p>
                      <p className="text-xs uppercase text-gray-500 tracking-wider">{data.authority1Role}</p>
                  </div>
              </div>

              {/* Date and Location */}
              <div className="text-center pb-4">
                   <p className="text-md text-gray-600 italic mb-2">
                      {data.location}, a {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="inline-block px-3 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono border border-gray-200">
                      COD: {data.uniqueCode}
                  </div>
              </div>

              {/* Signature 2 */}
               <div className="text-center">
                  <div className="mb-4 h-16 flex items-end justify-center">
                     {data.showDigitalSignature && (
                        <div className="font-dancing text-gray-400 opacity-50 italic">Firmado digitalmente</div>
                     )}
                  </div>
                  <div className="border-t border-gray-400 w-3/4 mx-auto pt-2">
                      <p className="font-bold text-ugt-dark">{data.authority2Name}</p>
                      <p className="text-xs uppercase text-gray-500 tracking-wider">{data.authority2Role}</p>
                  </div>
              </div>

          </div>

          {/* Watermark (only if logo loads correctly) */}
          {data.logoUrl && !imageError && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
                 <img src={data.logoUrl} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
            </div>
          )}
        </div>
      </div>

      {/* BACK SIDE */}
      <div
        id="certificate-back"
        className={`bg-white shadow-2xl relative overflow-hidden mx-auto text-ugt-dark ${activeSide !== 'back' ? 'hidden' : 'block'}`}
        style={containerStyle}
      >
         {/* Simple border for back side */}
         <div className="absolute inset-0 border-[16px] border-white z-20 pointer-events-none"></div>
         <div className="absolute inset-4 border border-gray-200 z-10 pointer-events-none"></div>

         <div className="absolute inset-0 p-16 flex flex-col z-20">
            {/* Header Back */}
            <div className="border-b-2 border-ugt-red pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-ugt-dark uppercase">Desglose de Contenidos</h2>
                    <p className="text-gray-500 mt-1">Detalle académico de la acción formativa</p>
                </div>
                 <div className="text-right">
                    <p className="font-bold text-ugt-dark">{data.studentName}</p>
                    <p className="text-sm text-gray-500">{data.studentDni}</p>
                 </div>
            </div>

            {/* Content Body */}
            <div className="flex-grow columns-2 gap-12 text-sm text-justify leading-relaxed text-gray-700 whitespace-pre-line border-gray-200">
                {data.detailedContent}
            </div>

            {/* Footer Back */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center text-xs text-gray-400 uppercase tracking-wide">
                <span>{data.uniqueCode}</span>
                <span>Página 2 / 2</span>
                <span>UGT Servicios Públicos - {data.department}</span>
            </div>
         </div>
      </div>
    </>
  );
};

export default CertificatePreview;
