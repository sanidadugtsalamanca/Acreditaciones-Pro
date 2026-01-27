
import React from 'react';
import { CertificateData, ParticipationRole } from '../types';
import { Download, Printer, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import Papa from 'papaparse';

interface FormControlsProps {
  data: CertificateData;
  onChange: (key: keyof CertificateData, value: any) => void;
  onGeneratePDF: () => void;
  onBatchUpload: (data: CertificateData[]) => void;
}

// --- Helper Components ---

const InputGroup = ({ label, id, type = "text", value, placeholder, className = "", onChange }: { 
  label: string; 
  id: keyof CertificateData; 
  type?: string; 
  value: string; 
  placeholder?: string; 
  className?: string; 
  onChange: (key: keyof CertificateData, value: string) => void 
}) => (
  <div className={`flex flex-col ${className}`}>
    <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ugt-red focus:border-ugt-red outline-none transition-all text-sm"
    />
  </div>
);

const TextAreaGroup = ({ label, id, value, placeholder, rows = 3, onChange }: {
  label: string;
  id: keyof CertificateData;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (key: keyof CertificateData, value: string) => void
}) => (
  <div className="flex flex-col col-span-2">
    <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase mb-1">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ugt-red focus:border-ugt-red outline-none transition-all text-sm resize-none"
    />
  </div>
);

const SelectGroup = ({ label, id, value, options, onChange }: {
  label: string;
  id: keyof CertificateData;
  value: string;
  options: string[];
  onChange: (key: keyof CertificateData, value: string) => void
}) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ugt-red focus:border-ugt-red outline-none transition-all text-sm bg-white"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// --- Main Component ---

const FormControls: React.FC<FormControlsProps> = ({ data, onChange, onGeneratePDF, onBatchUpload }) => {
  
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
             studentName: row['Nombre'] || row['Alumno'] || data.studentName,
             studentDni: row['DNI'] || row['NIF'] || data.studentDni,
             uniqueCode: row['Codigo'] || row['ID'] || `CSV-${Date.now()}-${index}`,
             role: (row['Rol'] || data.role) as ParticipationRole,
             courseName: row['Curso'] || data.courseName,
             hours: row['Horas'] || data.hours,
             department: row['Secretaria'] || row['Departamento'] || data.department,
             startDate: row['FechaInicio'] || data.startDate,
             endDate: row['FechaFin'] || data.endDate,
          }));
          onBatchUpload(mappedData);
          e.target.value = '';
        },
      });
    }
  };

  const downloadCSVTemplate = () => {
    const headers = ["Nombre", "DNI", "Rol", "Curso", "Codigo", "Horas", "Secretaria", "FechaInicio", "FechaFin"];
    const rows = [
      ["Juan Pérez García", "12345678Z", "ALUMNO", "Prevención de Riesgos Laborales", "UGT-2024-001", "30 horas", "Sanidad Salamanca", "01/10/2024", "05/10/2024"],
      ["Ana Belén López", "87654321X", "ALUMNO", "Prevención de Riesgos Laborales", "UGT-2024-002", "30 horas", "Sanidad Salamanca", "01/10/2024", "05/10/2024"],
      ["Carlos Rodríguez", "11223344T", "DOCENTE", "Prevención de Riesgos Laborales", "UGT-2024-003", "30 horas", "Sanidad Salamanca", "01/10/2024", "05/10/2024"]
    ];
    
    // Adding UTF-8 BOM (\uFEFF) ensures Excel opens it with correct encoding for accents/ñ
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_ugt_certificados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
           onChange('logoUrl', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      
      {/* Header Actions */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
            <h2 className="font-bold text-ugt-dark flex items-center gap-2">
                <span className="w-2 h-6 bg-ugt-red rounded-sm"></span>
                Configuración
            </h2>
             <div className="flex gap-2">
                 <button 
                    onClick={downloadCSVTemplate}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md transition-colors flex items-center gap-1" 
                    title="Descargar Plantilla CSV"
                 >
                    <FileText size={18} />
                    <span className="text-xs font-bold hidden xl:inline">Plantilla</span>
                 </button>
                 <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md transition-colors flex items-center gap-1" title="Cargar CSV">
                    <Upload size={18} />
                    <span className="text-xs font-bold hidden xl:inline">Subir</span>
                    <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                 </label>
                <button 
                  onClick={() => window.print()}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-md transition-colors"
                  title="Imprimir"
                >
                  <Printer size={18} />
                </button>
                <button 
                  onClick={onGeneratePDF}
                  className="bg-ugt-dark text-white hover:bg-gray-800 px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-colors font-medium text-sm"
                >
                  <Download size={18} />
                  <span>PDF</span>
                </button>
            </div>
        </div>
      </div>

      {/* Form Fields - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        
        {/* Section: Cabecera e Imagen */}
         <section>
             <h3 className="text-ugt-red text-sm font-bold mb-3 border-b pb-1">Identidad Visual y Cabecera</h3>
             <div className="grid grid-cols-1 gap-4">
                 <div className="bg-gray-50 p-3 rounded border border-gray-100">
                     <p className="text-xs font-bold text-gray-400 mb-2">LOGO</p>
                    <div className="flex items-center gap-2">
                        <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 px-3 py-2 rounded border border-gray-300 border-dashed transition-colors text-xs font-semibold text-gray-600 h-10">
                            <ImageIcon size={14} />
                            <span>Subir Logo...</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </label>
                        {data.logoUrl && (
                             <div className="h-10 w-10 border rounded bg-white p-1 flex items-center justify-center">
                                 <img src={data.logoUrl} className="max-h-full max-w-full" alt="Miniatura" />
                             </div>
                        )}
                    </div>
                     <InputGroup id="logoUrl" label="O pegar URL" value={data.logoUrl} placeholder="https://..." className="mt-2" onChange={onChange} />
                 </div>
                 
                 <InputGroup id="department" label="Secretaría / Departamento" value={data.department} placeholder="Ej: Sanidad Salamanca" onChange={onChange} />
             </div>
        </section>

        {/* Section: Alumno */}
        <section>
             <h3 className="text-ugt-red text-sm font-bold mb-3 border-b pb-1">Datos del Participante</h3>
             <div className="grid grid-cols-2 gap-4">
                <SelectGroup 
                    id="role" 
                    label="Tipo de Participación" 
                    value={data.role} 
                    options={['ALUMNO', 'ASISTENTE', 'DOCENTE', 'PONENTE', 'COORDINADOR']} 
                    onChange={onChange}
                />
                <InputGroup id="studentDni" label="DNI / NIE" value={data.studentDni} onChange={onChange} />
                <InputGroup id="studentName" label="Nombre Completo" value={data.studentName} className="col-span-2" onChange={onChange} />
                <InputGroup id="uniqueCode" label="Cód. Certificado" value={data.uniqueCode} className="col-span-2" onChange={onChange} />
             </div>
        </section>

        {/* Section: Curso */}
        <section>
             <h3 className="text-ugt-red text-sm font-bold mb-3 border-b pb-1">Anverso (Detalles Principales)</h3>
             <div className="grid grid-cols-2 gap-4">
                <InputGroup id="title" label="Título del Diploma" value={data.title} className="col-span-2" onChange={onChange} />
                <InputGroup id="courseName" label="Nombre del Curso" value={data.courseName} className="col-span-2" onChange={onChange} />
                <TextAreaGroup id="description" label="Texto Acreditación" value={data.description} onChange={onChange} />
                <TextAreaGroup id="contentKey" label="Resumen Contenido (Anverso)" value={data.contentKey} onChange={onChange} />
                <InputGroup id="hours" label="Horas Lectivas" value={data.hours} onChange={onChange} />
                <InputGroup id="location" label="Lugar de Emisión" value={data.location} onChange={onChange} />
                
                {/* Date Configuration */}
                <div className="col-span-2 border-t border-gray-100 pt-2 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer mb-2 w-fit">
                        <input 
                            type="checkbox" 
                            checked={data.isDateRange} 
                            onChange={(e) => onChange('isDateRange', e.target.checked)} 
                            className="rounded text-ugt-red focus:ring-ugt-red border-gray-300"
                        />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Usar Rango de Fechas</span>
                    </label>
                    <div className={`grid ${data.isDateRange ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                        <InputGroup id="startDate" type="text" label={data.isDateRange ? "Fecha Inicio" : "Fecha de Actividad"} value={data.startDate} onChange={onChange} />
                        {data.isDateRange && (
                            <InputGroup id="endDate" type="text" label="Fecha Fin" value={data.endDate} onChange={onChange} />
                        )}
                    </div>
                </div>
             </div>
        </section>

        {/* Section: Reverso */}
        <section>
             <h3 className="text-ugt-red text-sm font-bold mb-3 border-b pb-1">Reverso (Detalle Académico)</h3>
             <div className="grid grid-cols-2 gap-4">
                <p className="text-xs text-gray-400 col-span-2 italic">
                    Este contenido aparecerá en la segunda página del certificado.
                </p>
                <TextAreaGroup 
                    id="detailedContent" 
                    label="Temario / Asignaturas / Desglose" 
                    value={data.detailedContent} 
                    rows={10}
                    onChange={onChange}
                />
             </div>
        </section>

        {/* Section: Autoridades */}
        <section>
             <h3 className="text-ugt-red text-sm font-bold mb-3 border-b pb-1">Firmas Autorizadas</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 mb-2">
                     <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input 
                            type="checkbox" 
                            checked={data.showDigitalSignature} 
                            onChange={(e) => onChange('showDigitalSignature', e.target.checked)} 
                            className="rounded text-ugt-red focus:ring-ugt-red border-gray-300"
                        />
                        <span className="text-xs font-semibold text-gray-500 uppercase">Mostrar texto "Firmado digitalmente"</span>
                    </label>
                </div>

                <div className="col-span-2 bg-gray-50 p-3 rounded border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 mb-2">AUTORIDAD 1 (Izquierda)</p>
                    <div className="grid grid-cols-2 gap-2">
                        <InputGroup id="authority1Name" label="Nombre" value={data.authority1Name} onChange={onChange} />
                        <InputGroup id="authority1Role" label="Cargo" value={data.authority1Role} onChange={onChange} />
                    </div>
                </div>
                 <div className="col-span-2 bg-gray-50 p-3 rounded border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 mb-2">AUTORIDAD 2 (Derecha)</p>
                    <div className="grid grid-cols-2 gap-2">
                        <InputGroup id="authority2Name" label="Nombre" value={data.authority2Name} onChange={onChange} />
                        <InputGroup id="authority2Role" label="Cargo" value={data.authority2Role} onChange={onChange} />
                    </div>
                </div>
             </div>
        </section>
      </div>
    </div>
  );
};

export default FormControls;
