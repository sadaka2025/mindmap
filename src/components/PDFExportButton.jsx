import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PDFExportButton() {
  const handleExport = async () => {
    const el = document.getElementById("content-area");
    if (!el) return alert("منطقة المحتوى غير موجودة!");
    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 190;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(img, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save("nawazil-nahw.pdf");
  };

  return (
    <button
      className="pdf-btn"
      style={{ color: "yellow", marginRight: 8, fontSize: 40 }}
      onClick={handleExport}
    >
      📥 تحميل الخريطة التفاعلية
    </button>
  );
}
