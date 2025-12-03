import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (fileName: string) => {
  const frontElement = document.getElementById('certificate-front');
  const backElement = document.getElementById('certificate-back');

  if (!frontElement || !backElement) {
    console.error('Elements not found');
    return;
  }

  // Helper function to capture an element
  const captureElement = async (element: HTMLElement) => {
    // Determine if element is currently hidden
    const wasHidden = element.classList.contains('hidden');
    
    // Make visible for capture if hidden
    if (wasHidden) {
      element.classList.remove('hidden');
    }

    // Wait a brief moment for layout/styles to apply if it was hidden
    if (wasHidden) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      // Re-hide if it was hidden
      if (wasHidden) {
        element.classList.add('hidden');
      }

      return canvas.toDataURL('image/jpeg', 0.95);
    } catch (e) {
      // Ensure we re-hide even on error
      if (wasHidden) {
        element.classList.add('hidden');
      }
      throw e;
    }
  };

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 1. Capture Front
    const frontImg = await captureElement(frontElement);
    pdf.addImage(frontImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // 2. Add Page & Capture Back
    pdf.addPage();
    const backImg = await captureElement(backElement);
    pdf.addImage(backImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);

    // 3. Save
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Hubo un error al generar el PDF. Por favor verifique que las imágenes sean accesibles.');
  }
};