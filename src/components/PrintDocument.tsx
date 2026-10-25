import React, { useState, useRef } from 'react';
import { Task } from '../types';
import { X, Printer, FileText } from 'lucide-react';

interface PrintDocumentProps { task: Task; onClose: () => void; }

export default function PrintDocument({ task, onClose }: PrintDocumentProps) {
  const [docType, setDocType] = useState<'combined' | 'contract' | 'act'>('combined');
  const [worksDone, setWorksDone] = useState(task.description || '');
  const [totalPrice, setTotalPrice] = useState('0');
  const [customerName, setCustomerName] = useState(task.customerName || '');
  const [managerName, setManagerName] = useState(task.assignee || '');
  const [companyName, setCompanyName] = useState('');
  const [documentNumber, setDocumentNumber] = useState(`Д-${Date.now().toString().slice(-6)}`);
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Документ ${documentNumber}</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; padding: 20mm; } .header { text-align: center; margin-bottom: 20px; } .header h1 { font-size: 16pt; margin-bottom: 5px; } .header h2 { font-size: 14pt; font-weight: normal; } .header p { font-size: 11pt; color: #555; } .section { margin: 15px 0; } .section h3 { font-size: 12pt; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 3px; } .price-table { width: 100%; border-collapse: collapse; margin: 15px 0; } .price-table th, .price-table td { border: 1px solid #333; padding: 8px; text-align: left; } .price-table th { background: #f0f0f0; font-weight: bold; } .total-row { font-weight: bold; background: #f9f9f9; } .signatures { display: flex; justify-content: space-between; margin-top: 40px; gap: 40px; } .signature-block { flex: 1; } .signature-block h4 { font-size: 11pt; margin-bottom: 10px; } .signature-line { border-bottom: 1px solid #333; height: 40px; margin-top: 30px; } .signature-label { font-size: 9pt; color: #666; margin-top: 3px; } .footer { margin-top: 30px; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ddd; padding-top: 10px; } @media print { body { padding: 15mm; } }</style></head><body>${printContent.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><FileText size={20} className="text-blue-600" /></div><div><h3 className="text-lg font-bold text-slate-800">Печать документа</h3><p className="text-xs text-slate-500">{task.title}</p></div></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button onClick={() => setDocType('combined')} className={`p-3 rounded-lg border-2 transition-all text-left ${docType === 'combined' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}><p className="font-semibold text-sm">Договор + Акт</p><p className="text-xs text-slate-500">Совмещённый</p></button>
            <button onClick={() => setDocType('contract')} className={`p-3 rounded-lg border-2 transition-all text-left ${docType === 'contract' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}><p className="font-semibold text-sm">Только договор</p><p className="text-xs text-slate-500">Без акта</p></button>
            <button onClick={() => setDocType('act')} className={`p-3 rounded-lg border-2 transition-all text-left ${docType === 'act' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}><p className="font-semibold text-sm">Только акт</p><p className="text-xs text-slate-500">Акт работ</p></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Номер</label><input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Дата</label><input type="date" value={documentDate} onChange={(e) => setDocumentDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Компания</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="ООО Компания" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div>
            <div><label className="block text-xs font-medium text-slate-600 mb-1">Менеджер</label><input type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" /></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-10 max-w-3xl mx-auto" ref={printRef}>
            <div className="header" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '16pt', marginBottom: '5px', fontWeight: 'bold' }}>{docType === 'combined' ? 'ДОГОВОР И АКТ' : docType === 'contract' ? 'ДОГОВОР' : 'АКТ ВЫПОЛНЕННЫХ РАБОТ'}</h1>
              <h2 style={{ fontSize: '13pt', fontWeight: 'normal' }}>№ {documentNumber}</h2>
              <p style={{ fontSize: '11pt', color: '#555' }}>от {new Date(documentDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} г.</p>
            </div>
            <div style={{ margin: '15px 0' }}>
              <p style={{ marginBottom: '10px' }}><strong>{companyName || 'Исполнитель'}</strong>, именуемый «Исполнитель», в лице {managerName || 'менеджера'}, и</p>
              <p style={{ marginBottom: '10px' }}><strong>{customerName || 'Заказчик'}</strong>, именуемый «Заказчик»{task.customerContact && <> ({task.customerContact})</>},</p>
              <p>заключили договор:</p>
            </div>
            <div style={{ margin: '15px 0' }}>
              <h3 style={{ fontSize: '12pt', marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '3px' }}>1. Предмет</h3>
              <p style={{ marginLeft: '20px', fontWeight: '500' }}>«{task.title}»</p>
              {task.relatedTo && <p style={{ marginLeft: '20px', fontSize: '11pt', color: '#555' }}>(проект: {task.relatedTo})</p>}
            </div>
            {(docType === 'combined' || docType === 'act') && (
              <div style={{ margin: '15px 0' }}>
                <h3 style={{ fontSize: '12pt', marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '3px' }}>2. Выполненные работы</h3>
                <textarea value={worksDone} onChange={(e) => setWorksDone(e.target.value)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="Описание работ..." />
              </div>
            )}
            <div style={{ margin: '15px 0' }}>
              <h3 style={{ fontSize: '12pt', marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '3px' }}>{docType === 'contract' ? '2. Стоимость' : '3. Стоимость'}</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
                <thead><tr style={{ background: '#f0f0f0' }}><th style={{ border: '1px solid #333', padding: '8px' }}>№</th><th style={{ border: '1px solid #333', padding: '8px' }}>Наименование</th><th style={{ border: '1px solid #333', padding: '8px', width: '120px' }}>Цена, ₽</th></tr></thead>
                <tbody>
                  <tr><td style={{ border: '1px solid #333', padding: '8px' }}>1</td><td style={{ border: '1px solid #333', padding: '8px' }}>{task.title}</td><td style={{ border: '1px solid #333', padding: '8px' }}><input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-sm" /></td></tr>
                  <tr style={{ background: '#f9f9f9', fontWeight: 'bold' }}><td colSpan={2} style={{ border: '1px solid #333', padding: '8px', textAlign: 'right' }}>ИТОГО:</td><td style={{ border: '1px solid #333', padding: '8px' }}>{Number(totalPrice).toLocaleString('ru-RU')} ₽</td></tr>
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', gap: '40px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}><h4 style={{ fontSize: '11pt', marginBottom: '10px', fontWeight: 'bold' }}>ИСПОЛНИТЕЛЬ</h4><p style={{ fontSize: '10pt' }}>{companyName || '_______________'}</p><p style={{ fontSize: '10pt' }}>{managerName || '_______________'}</p><div style={{ borderBottom: '1px solid #333', height: '40px', marginTop: '30px' }}></div><p style={{ fontSize: '9pt', color: '#666', marginTop: '3px' }}>подпись / ФИО / М.П.</p></div>
              <div style={{ flex: '1', minWidth: '200px' }}><h4 style={{ fontSize: '11pt', marginBottom: '10px', fontWeight: 'bold' }}>ЗАКАЗЧИК</h4><p style={{ fontSize: '10pt' }}>{customerName || '_______________'}</p><p style={{ fontSize: '10pt' }}>{task.customerContact || '_______________'}</p><div style={{ borderBottom: '1px solid #333', height: '40px', marginTop: '30px' }}></div><p style={{ fontSize: '9pt', color: '#666', marginTop: '3px' }}>подпись / ФИО</p></div>
            </div>
            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '9pt', color: '#666', borderTop: '1px solid #ddd', paddingTop: '10px' }}>CRM Pro • {new Date().toLocaleDateString('ru-RU')}</div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-200 bg-white shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Закрыть</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium"><Printer size={16} /> Печать / PDF</button>
        </div>
      </div>
    </div>
  );
}
