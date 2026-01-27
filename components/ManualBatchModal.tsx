
import React, { useState } from 'react';
import { X, Plus, Trash2, UserPlus, Check, AlertCircle } from 'lucide-react';
import { CertificateData } from '../types.ts';

interface ManualBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CertificateData[]) => void;
  currentDataTemplate: CertificateData;
}

interface StudentEntry {
  id: string;
  name: string;
  dni: string;
  code: string;
}

const ManualBatchModal: React.FC<ManualBatchModalProps> = ({ isOpen, onClose, onSave, currentDataTemplate }) => {
  const [entries, setEntries] = useState<StudentEntry[]>([
    { id: '1', name: '', dni: '', code: '' }
  ]);
  const [quickPaste, setQuickPaste] = useState('');
  const [mode, setMode] = useState<'table' | 'paste'>('table');

  const addEntry = () => {
    setEntries([...entries, { id: Math.random().toString(36).substr(2, 9), name: '', dni: '', code: '' }]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof StudentEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handlePasteProcess = () => {
    const lines = quickPaste.split('\n').filter(line => line.trim() !== '');
    const newEntries = lines.map(line => {
      // Intentamos separar por coma, tabulación o espacios múltiples
      const parts = line.split(/[,;\t]|\s{2,}/).map(p => p.trim());
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: parts[0] || '',
        dni: parts[1] || '',
        code: parts[2] || `UGT-MAN-${Date.now().toString().slice(-4)}`
      };
    });
    setEntries(newEntries.length > 0 ? newEntries : entries);
    setMode('table');
    setQuickPaste('');
  };

  const handleApply = () => {
    const finalData: CertificateData[] = entries
      .filter(e => e.name.trim() !== '')
      .map((entry, index) => ({
        ...currentDataTemplate,
        id: `manual-${entry.id}`,
        studentName: entry.name,
        studentDni: entry.dni,
        uniqueCode: entry.code || `${currentDataTemplate.uniqueCode}-${index + 1}`
      }));

    if (finalData.length === 0) {
      alert("Por favor, introduce al menos un nombre de alumno.");
      return;
    }

    onSave(finalData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ugt-dark/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-ugt-red px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
                <UserPlus size={24} />
                <div>
                    <h2 className="text-xl font-bold leading-none">Gestión de Alumnos en Lote</h2>
                    <p className="text-[10px] uppercase font-bold opacity-80 tracking-widest mt-1">Entrada de datos "In Situ"</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex border-b border-gray-100 p-1 bg-gray-50">
            <button 
                onClick={() => setMode('table')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'table' ? 'bg-white shadow-sm text-ugt-red' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Edición por Filas
            </button>
            <button 
                onClick={() => setMode('paste')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'paste' ? 'bg-white shadow-sm text-ugt-red' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Pegado Rápido (Texto)
            </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
            {mode === 'table' ? (
                <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 mb-2 px-2">
                        <div className="col-span-5 text-[10px] font-black text-gray-400 uppercase">Nombre Completo</div>
                        <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase">DNI / NIE</div>
                        <div className="col-span-3 text-[10px] font-black text-gray-400 uppercase">Código Registro</div>
                        <div className="col-span-1"></div>
                    </div>
                    
                    {entries.map((entry) => (
                        <div key={entry.id} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-left-2 duration-200">
                            <div className="col-span-5">
                                <input 
                                    type="text" 
                                    placeholder="Ej: Juan García López"
                                    value={entry.name}
                                    onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:border-ugt-red outline-none"
                                />
                            </div>
                            <div className="col-span-3">
                                <input 
                                    type="text" 
                                    placeholder="12345678X"
                                    value={entry.dni}
                                    onChange={(e) => updateEntry(entry.id, 'dni', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:border-ugt-red outline-none"
                                />
                            </div>
                            <div className="col-span-3">
                                <input 
                                    type="text" 
                                    placeholder="Auto-gen"
                                    value={entry.code}
                                    onChange={(e) => updateEntry(entry.id, 'code', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:border-ugt-red outline-none bg-gray-50/50"
                                />
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <button 
                                    onClick={() => removeEntry(entry.id)}
                                    disabled={entries.length === 1}
                                    className="text-gray-300 hover:text-ugt-red disabled:opacity-0 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button 
                        onClick={addEntry}
                        className="mt-4 flex items-center gap-2 text-ugt-red text-xs font-bold uppercase hover:underline"
                    >
                        <Plus size={16} /> Añadir Alumno
                    </button>
                </div>
            ) : (
                <div className="h-full flex flex-col gap-4">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-700">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <div className="text-xs leading-relaxed">
                            <p className="font-bold mb-1">Formato de Pegado Rápido:</p>
                            <p>Pega una lista de alumnos, uno por línea. Puedes separar los campos por comas o tabulaciones.</p>
                            <p className="italic mt-1">Ejemplo: Nombre Apellido, 12345678X</p>
                        </div>
                    </div>
                    <textarea 
                        value={quickPaste}
                        onChange={(e) => setQuickPaste(e.target.value)}
                        placeholder="Pega aquí los datos..."
                        className="flex-1 w-full p-4 border border-gray-200 rounded-lg text-sm font-mono focus:border-ugt-red outline-none min-h-[300px]"
                    />
                    <button 
                        onClick={handlePasteProcess}
                        className="bg-ugt-dark text-white font-bold py-3 rounded-lg text-sm hover:bg-black transition-colors"
                    >
                        Procesar Lista
                    </button>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <p className="text-xs text-gray-500">
                <span className="font-bold text-ugt-red">{entries.filter(e => e.name).length}</span> alumnos listos para certificar.
            </p>
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="px-5 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleApply}
                    className="flex items-center gap-2 bg-ugt-red text-white px-8 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-red-700 transition-all"
                >
                    <Check size={18} /> Aplicar Lote
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManualBatchModal;
