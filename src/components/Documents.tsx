import React, { useState, useEffect } from 'react';
import { DocumentTemplate } from '../types';
import { Plus, FileText, Edit2, Trash2, X, Save, Copy } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { saveToStorage, loadFromStorage } from '../utils/storage';

const STORAGE_KEY = 'crm_document_templates';

const defaultTemplates: DocumentTemplate[] = [
  { id: '1', name: 'Договор на оказание услуг', type: 'contract', content: 'ДОГОВОР № ___\nот «__» ______ 20__ г.\n\n[ИСПОЛНИТЕЛЬ] и [ЗАКАЗЧИК] заключили договор:\n\n1. Предмет: [ОПИСАНИЕ]\n2. Стоимость: ___ руб.\n3. Срок: до ___\n\nПодписи:\nИсполнитель: ____________\nЗаказчик: ____________', createdAt: new Date().toISOString() },
  { id: '2', name: 'Акт выполненных работ', type: 'act', content: 'АКТ № ___\nот «__» ______ 20__ г.\n\nВыполнены работы:\n1. [НАЗВАНИЕ] - ___ руб.\n\nИтого: ___ руб.\n\nПодписи:\nИсполнитель: ____________\nЗаказчик: ____________', createdAt: new Date().toISOString() },
  { id: '3', name: 'Договор с доставкой', type: 'combined', content: 'ДОГОВОР И АКТ № ___\nот «__» ______ 20__ г.\n\n1. Услуги: [ОПИСАНИЕ]\n2. Доставка по адресу: [АДРЕС]\n3. Стоимость: ___ руб.\n\nПодписи:\nИсполнитель: ____________\nЗаказчик: ____________', createdAt: new Date().toISOString() },
];

export default function Documents() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editorName, setEditorName] = useState('');

  useEffect(() => { const saved = loadFromStorage<DocumentTemplate[]>(STORAGE_KEY); setTemplates(saved || defaultTemplates); }, []);
  useEffect(() => { if (templates.length > 0) saveToStorage(STORAGE_KEY, templates); }, [templates]);

  const openNewTemplate = () => { setEditingTemplate(null); setEditorName(''); setEditorContent(''); setShowEditor(true); };
  const openEditTemplate = (template: DocumentTemplate) => { setEditingTemplate(template); setEditorName(template.name); setEditorContent(template.content); setShowEditor(true); };

  const handleSaveTemplate = () => {
    if (!editorName.trim() || !editorContent.trim()) return;
    if (editingTemplate) { setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, name: editorName, content: editorContent } : t)); }
    else { setTemplates(prev => [...prev, { id: uuidv4(), name: editorName, type: 'contract', content: editorContent, createdAt: new Date().toISOString() }]); }
    setShowEditor(false);
  };

  const handleDeleteTemplate = (id: string) => { if (confirm('Удалить шаблон?')) setTemplates(prev => prev.filter(t => t.id !== id)); };
  const handleDuplicateTemplate = (template: DocumentTemplate) => { setTemplates(prev => [...prev, { ...template, id: uuidv4(), name: `${template.name} (копия)`, createdAt: new Date().toISOString() }]); };

  const typeLabels: Record<string, string> = { contract: 'Договор', act: 'Акт', combined: 'Совмещённый' };
  const typeColors: Record<string, string> = { contract: 'bg-blue-100 text-blue-700', act: 'bg-green-100 text-green-700', combined: 'bg-purple-100 text-purple-700' };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Шаблоны документов</h2><p className="text-slate-500 mt-1 text-sm sm:text-base">Редактируемые шаблоны</p></div>
        <button onClick={openNewTemplate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm"><Plus size={18} /> Новый шаблон</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-start gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0"><FileText size={20} className="text-white" /></div>
              <div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-800 truncate">{template.name}</h3><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${typeColors[template.type]}`}>{typeLabels[template.type]}</span></div>
            </div>
            <div className="flex-1 mb-4"><p className="text-xs text-slate-500 line-clamp-4 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">{template.content.slice(0, 200)}...</p></div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => openEditTemplate(template)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /> Редактировать</button>
              <button onClick={() => handleDuplicateTemplate(template)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Copy size={16} /></button>
              <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {templates.length === 0 && <div className="text-center py-16 text-slate-500 bg-white rounded-xl border border-slate-200"><FileText size={48} className="mx-auto mb-4 text-slate-300" /><p className="font-medium">Шаблоны не найдены</p></div>}
      {showEditor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 shrink-0"><h3 className="text-lg font-bold">{editingTemplate ? 'Редактировать' : 'Новый шаблон'}</h3><button onClick={() => setShowEditor(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button></div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Название *</label><input type="text" value={editorName} onChange={(e) => setEditorName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Содержимое *</label><textarea value={editorContent} onChange={(e) => setEditorContent(e.target.value)} rows={25} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" /></div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-200 shrink-0"><button onClick={() => setShowEditor(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Отмена</button><button onClick={handleSaveTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Save size={16} /> Сохранить</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

