
import React, { useState, useEffect, useRef } from 'react';
import CertificatePreview from './components/CertificatePreview.tsx';
import FormControls from './components/FormControls.tsx';
import { CertificateData, INITIAL_DATA } from './types.ts';
import { generatePDF } from './utils/pdfGenerator.ts';
import { Users, ChevronRight, ChevronLeft, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [currentData, setCurrentData] = useState<CertificateData>(INITIAL_DATA);
  const [batchData, setBatchData] = useState<CertificateData[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(-1);
  const [previewScale, setPreviewScale] = useState(0.6);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scale preview logic
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // 1123px is the fixed width of the certificate in Preview
        const newScale = Math.min(containerWidth / 1200, 1);
        setPreviewScale(Math.max(newScale, 0.3)); // Minimum scale 0.3
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (key: keyof CertificateData, value: any) => {
    // If in batch mode, update the specific item in the batch array
    if (currentBatchIndex >= 0) {
        const updatedBatch = [...batchData];
        updatedBatch[currentBatchIndex] = { ...updatedBatch[currentBatchIndex], [key]: value };
        setBatchData(updatedBatch);
        setCurrentData(updatedBatch[currentBatchIndex]);
    } else {
        setCurrentData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleBatchUpload = (data: CertificateData[]) => {
    setBatchData(data);
    if (data.length > 0) {
        setCurrentBatchIndex(0);
        setCurrentData(data[0]);
    }
  };

  const navigateBatch = (direction: 'prev' | 'next') => {
      if (currentBatchIndex === -1) return;
      
      let newIndex = currentBatchIndex;
      if (direction === 'prev') newIndex = Math.max(0, currentBatchIndex - 1);
      if (direction === 'next') newIndex = Math.min(batchData.length - 1, currentBatchIndex + 1);
      
      setCurrentBatchIndex(newIndex);
      setCurrentData(batchData[newIndex]);
  };

  const downloadPDF = () => {
    generatePDF(`Certificado-${currentData.studentName.replace(/\s+/g, '-')}-${currentData.uniqueCode}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      
      {/* Sidebar Controls (Left) */}
      <div className="w-96 flex-shrink-0 border-r border-gray-200 shadow-lg z-20">
        <FormControls 
            data={currentData} 
            onChange={handleChange} 
            onGeneratePDF={downloadPDF} 
            onBatchUpload={handleBatchUpload}
        />
      </div>

      {/* Main Content Area (Right) */}
      <div className="flex-1 flex flex-col bg-gray-100 relative">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setActiveSide('front')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeSide === 'front' ? 'bg-white shadow text-ugt-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Layout size={16} /> Anverso
                </button>
                <button
                    onClick={() => setActiveSide('back')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeSide === 'back' ? 'bg-white shadow text-ugt-dark' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Layout size={16} /> Reverso
                </button>
            </div>

            {/* Batch Navigation */}
            {batchData.length > 0 && (
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 text-ugt-dark font-medium text-sm">
                        <Users size={16} className="text-ugt-red" />
                        <span>Modo Lotes: {batchData.length}</span>
                    </div>
                     <span className="text-sm text-gray-500 border-l pl-4">
                        {currentBatchIndex + 1} / {batchData.length}
                     </span>
                     <div className="flex bg-gray-100 rounded-md p-1">
                        <button 
                            onClick={() => navigateBatch('prev')}
                            disabled={currentBatchIndex === 0}
                            className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-30 disabled:shadow-none transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={() => navigateBatch('next')}
                            disabled={currentBatchIndex === batchData.length - 1}
                            className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-30 disabled:shadow-none transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                     </div>
                </div>
            )}
        </div>

        {/* Preview Canvas Area */}
        <div 
            ref={containerRef}
            className="flex-1 overflow-auto flex items-center justify-center p-8 bg-gray-200/50 relative"
            style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}
        >
          <div className="bg-white shadow-xl transition-all duration-300">
             <CertificatePreview data={currentData} scale={previewScale} activeSide={activeSide} />
          </div>
          
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow border text-xs text-gray-500 font-mono">
              Vista previa: {Math.round(previewScale * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
