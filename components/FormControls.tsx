
import React, { useState } from 'react';
import { CertificateData, ParticipationRole } from '../types';
import { Download, Printer, Upload, Image as ImageIcon, FileText, Sparkles, Loader2, QrCode, Star, Eye, EyeOff } from 'lucide-react';
import Papa from 'papaparse';
import { GoogleGenAI } from "@google/genai";

interface FormControlsProps {
  data: CertificateData;
  onChange: (key: keyof CertificateData, value: any) => void;
  onGeneratePDF: () => void;
  onBatchUpload: (data: CertificateData[]) => void;
}

const InputGroup = ({ label, id, type = "text", value, placeholder, className = "", onChange }: { 
  label: string; 
  id: keyof CertificateData; 
  type?: string; 
  value: string; 
  placeholder?: string; 
  className?: string; 
  onChange: (key: keyof CertificateData, value: any) => void 
}) => (
  <div className={`flex flex-col ${className}`}>
    <label htmlFor={id} className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-ugt-red focus:border-ugt-red outline-none transition-all text-sm bg-white"
    />
  </div>
);

const FormControls: React.FC<FormControlsProps> = ({ data, onChange, onGeneratePDF, onBatchUpload }) => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const generateWithAI = async (field: 'description' | 'detailedContent') => {
    setIsGenerating(field);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = field === 'description' 
        ? `Actúa como el Secretario de Formación de UGT Servicios Públicos. Escribe una frase breve (máximo 25 palabras) y formal de acreditación para un certificado del curso: "${data.courseName}". El tono debe ser institucional, destacando el compromiso con el servicio público y la formación continua.`
        : `Como experto en formación sindical de UGT Servicios Públicos, genera un temario o desglose de contenidos detallado (máximo 200 palabras) para un certificado del curso: "${data.courseName}". Divide el contenido en UNIDADES y puntos clave. Usa un tono académico y profesional.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      if (response.text) {
        onChange(field, response.text.trim());
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Error al conectar con la IA de formación.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const mappedData: CertificateData[] = results.data.map((row: any, index: number) => ({
             ...data,
             id: `csv-${index}-${Date.now()}`,
             studentName: row['Nombre'] || data.studentName,
             studentDni: row['DNI'] || data.studentDni,
             uniqueCode: row['Codigo'] || `UGT-${Date.now()}-${index}`,
             role: (row['Rol'] || data.role) as ParticipationRole,
             courseName: row['Curso'] || data.courseName,
          }));
          onBatchUpload(mappedData);
        },
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => onChange('logoUrl', reader.result as string);
        reader.readAsDataURL(file);
      }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden border-r border-gray-100 shadow-xl">
      <div className="p-5 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-ugt-red rounded flex items-center justify-center text-white font-black text-xl italic shadow-md">U</div>
                <div>
                  <h1 className="text-sm font-black text-ugt-dark leading-none">Certificados</h1>
                  <p className="text-[10px] text-ugt-red font-bold uppercase tracking-widest">Servicios Públicos</p>
                </div>
            </div>
            <div className="flex gap-1.5">
                <button onClick={() => window.print()} className="p-2 hover:bg-gray-100 rounded text-gray-400 transition-colors" title="Imprimir"><Printer size={16} /></button>
                <button onClick={onGeneratePDF} className="flex items-center gap-2 bg-ugt-dark text-white px-4 py-2 rounded font-bold text-xs shadow-lg hover:bg-black transition-all">
                  <Download size={14} /> PDF
                </button>
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => {}} className="flex-1 bg-white border border-gray-200 text-[10px] font-bold uppercase py-1.5 rounded flex items-center justify-center gap-1 hover:border-ugt-red transition-colors text-gray-500">
                <FileText size={12} /> Plantilla
            </button>
            <label className="flex-1 cursor-pointer bg-white border border-gray-200 text-[10px] font-bold uppercase py-1.5 rounded flex items-center justify-center gap-1 hover:border-ugt-red transition-colors text-gray-500 text-center">
                <Upload size={12} /> Cargar Lote
                <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
            </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar pb-20">
        
        <section>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-ugt-red"></div>
                <h3 className="text-xs font-black text-ugt-dark uppercase tracking-widest">Identidad Sindical</h3>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-100 rounded">
                    <label className="cursor-pointer bg-white w-12 h-12 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:text-ugt-red hover:border-ugt-red transition-all">
                        <ImageIcon size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Logotipo UGT-SP</p>
                        <input type="text" value={data.logoUrl} onChange={(e) => onChange('logoUrl', e.target.value)} className="w-full text-xs text-gray-500 truncate bg-transparent outline-none" placeholder="O pega una URL..." />
                    </div>
                </div>
                <InputGroup id="department" label="Secretaría o Federación" value={data.department} onChange={onChange} />
                
                <div className="flex items-center gap-4 bg-yellow-50/50 p-2 rounded border border-yellow-100">
                  <button 
                    onClick={() => onChange('isPremium', !data.isPremium)}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors ${data.isPremium ? 'text-ugt-gold' : 'text-gray-400'}`}
                  >
                    <Star size={14} fill={data.isPremium ? "currentColor" : "none"} />
                    Estilo Institucional
                  </button>
                </div>
             </div>
        </section>

        <section>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-ugt-red"></div>
                <h3 className="text-xs font-black text-ugt-dark uppercase tracking-widest">Participante</h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Calidad de Participación</label>
                    <select value={data.role} onChange={(e) => onChange('role', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded text-sm bg-white">
                        {['ALUMNO', 'ASISTENTE', 'DOCENTE', 'PONENTE', 'COORDINADOR'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <InputGroup id="studentName" label="Nombre y Apellidos" value={data.studentName} className="col-span-2" onChange={onChange} />
                <InputGroup id="studentDni" label="Identificación (DNI/NIE)" value={data.studentDni} onChange={onChange} />
                <InputGroup id="uniqueCode" label="Nº Registro / ID" value={data.uniqueCode} onChange={onChange} />
             </div>
        </section>

        <section>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-ugt-red"></div>
                    <h3 className="text-xs font-black text-ugt-dark uppercase tracking-widest">Acción Formativa</h3>
                </div>
             </div>
             <div className="space-y-4">
                <InputGroup id="courseName" label="Nombre del Curso/Actividad" value={data.courseName} onChange={onChange} />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Texto de Acreditación</label>
                    <button 
                      onClick={() => generateWithAI('description')}
                      disabled={isGenerating !== null}
                      className="text-[10px] font-bold text-ugt-red flex items-center gap-1 hover:underline disabled:opacity-50"
                    >
                      {isGenerating === 'description' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      Generar con IA
                    </button>
                  </div>
                  <textarea value={data.description} onChange={(e) => onChange('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded text-sm resize-none outline-none focus:border-ugt-red bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <InputGroup id="hours" label="Horas" value={data.hours} onChange={onChange} />
                   <InputGroup id="location" label="Localidad" value={data.location} onChange={onChange} />
                   <InputGroup id="startDate" label="Fecha Inicio" value={data.startDate} onChange={onChange} />
                   <InputGroup id="endDate" label="Fecha Fin" value={data.endDate} onChange={onChange} />
                </div>
             </div>
        </section>

        <section>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-ugt-red"></div>
                    <h3 className="text-xs font-black text-ugt-dark uppercase tracking-widest">Reverso Técnico</h3>
                </div>
                <button 
                  onClick={() => generateWithAI('detailedContent')}
                  disabled={isGenerating !== null}
                  className="text-[10px] font-bold text-ugt-red flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  {isGenerating === 'detailedContent' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Redactar Temario
                </button>
             </div>
             <textarea 
                value={data.detailedContent} 
                onChange={(e) => onChange('detailedContent', e.target.value)} 
                rows={8} 
                className="w-full px-3 py-2 border border-gray-200 rounded text-[11px] font-mono leading-relaxed bg-gray-50/30 outline-none focus:border-ugt-red" 
                placeholder="Introduzca el desglose de unidades..."
             />
        </section>

        <section>
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-ugt-red"></div>
                <h3 className="text-xs font-black text-ugt-dark uppercase tracking-widest">Seguridad y Firmas</h3>
             </div>
             <div className="space-y-4">
                <div className="flex flex-col gap-3 bg-gray-50 p-3 rounded">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-1">
                      <div className="flex items-center gap-2">
                        <QrCode size={16} className="text-ugt-red" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Control de Verificación QR</span>
                      </div>
                      <button 
                        onClick={() => onChange('showQrCode', !data.showQrCode)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${data.showQrCode ? 'bg-ugt-red text-white' : 'bg-gray-200 text-gray-500'}`}
                      >
                        {data.showQrCode ? <Eye size={12} /> : <EyeOff size={12} />}
                        {data.showQrCode ? 'Visible' : 'Oculto'}
                      </button>
                    </div>
                    {data.showQrCode && (
                      <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">URL Verificación QR</p>
                          <input type="text" value={data.qrCodeUrl} onChange={(e) => onChange('qrCodeUrl', e.target.value)} className="w-full text-xs text-gray-500 bg-transparent outline-none border-b border-gray-200 focus:border-ugt-red pb-1" placeholder="https://..." />
                      </div>
                    )}
                </div>
                
                <div className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-4">
                    <p className="text-[10px] font-bold text-gray-300 uppercase mb-1">Autoridad Principal (Firma Izq.)</p>
                    <input type="text" value={data.authority1Name} onChange={(e) => onChange('authority1Name', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs" placeholder="Nombre..." />
                    <input type="text" value={data.authority1Role} onChange={(e) => onChange('authority1Role', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-[10px] text-gray-400" placeholder="Cargo..." />
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-4">
                    <p className="text-[10px] font-bold text-gray-300 uppercase mb-1">Segunda Autoridad (Firma Der.)</p>
                    <input type="text" value={data.authority2Name} onChange={(e) => onChange('authority2Name', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-xs" placeholder="Nombre..." />
                    <input type="text" value={data.authority2Role} onChange={(e) => onChange('authority2Role', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded text-[10px] text-gray-400" placeholder="Cargo..." />
                </div>
             </div>
        </section>
      </div>
    </div>
  );
};

export default FormControls;
