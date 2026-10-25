import React, { useState } from 'react';
import { Contact, Deal, Task, User } from '../types';
import { exportData, importData } from '../utils/export';
import { STORAGE_KEYS } from '../utils/storage';
import { Download, Upload, HardDrive, FileText, CheckCircle2, AlertTriangle, X, Shield, Trash2 } from 'lucide-react';

interface SettingsProps { user: User; contacts: Contact[]; deals: Deal[]; tasks: Task[]; setContacts: React.Dispatch<React.SetStateAction<Contact[]>>; setDeals: React.Dispatch<React.SetStateAction<Deal[]>>; setTasks: React.Dispatch<React.SetStateAction<Task[]>>; onClose: () => void; }

export default function Settings({ user, contacts, deals, tasks, setContacts, setDeals, setTasks, onClose }: SettingsProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const showStatus = (type: 'success' | 'error', message: string) => { setStatus({ type, message }); setTimeout(() => setStatus(null), 4000); };

  const handleExportJSON = () => {
    try { exportData({ user, contacts, deals, tasks }); showStatus('success', '✅ Бэкап сохранён!'); }
    catch { showStatus('error', '❌ Ошибка сохранения'); }
  };

  const handleImportJSON = async () => {
    try { const data = await importData(); setContacts(data.contacts); setDeals(data.deals); setTasks(data.tasks); showStatus('success', `✅ Загружено! ${data.contacts.length} контактов`); }
    catch (err: any) { showStatus('error', `❌ ${err.message || 'Ошибка'}`); }
  };

  const handleResetData = () => {
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    setShowConfirmReset(false);
    showStatus('success', '✅ Данные сброшены');
  };

  const getStorageSize = () => {
    let total = 0;
    [STORAGE_KEYS.CONTACTS, STORAGE_KEYS.DEALS, STORAGE_KEYS.TASKS, STORAGE_KEYS.USER].forEach(key => { const item = localStorage.getItem(key); if (item) total += item.length * 2; });
    return (total / 1024).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-slate-200 z-10">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center"><Shield size={20} className="text-white" /></div><div><h3 className="text-lg font-bold text-slate-800">Настройки</h3><p className="text-xs text-slate-500">Управление данными</p></div></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-6">
          {status && <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}<span className="text-sm font-medium">{status.message}</span></div>}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Профиль</h4>
            <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">{user.name.charAt(0).toUpperCase()}</div><div className="flex-1 min-w-0"><p className="font-semibold text-slate-800">{user.name}</p><p className="text-sm text-slate-500">{user.position} · {user.company}</p><p className="text-xs text-slate-400 mt-1">{user.phone} · {user.email}</p></div></div>
          </div>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3"><HardDrive size={18} className="text-slate-600" /><h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Хранилище</h4></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-xl font-bold text-blue-600">{contacts.length}</p><p className="text-xs text-slate-500">Контактов</p></div>
              <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-xl font-bold text-purple-600">{deals.length}</p><p className="text-xs text-slate-500">Сделок</p></div>
              <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-xl font-bold text-orange-600">{tasks.length}</p><p className="text-xs text-slate-500">Задач</p></div>
              <div className="bg-white rounded-lg p-3 border border-slate-200"><p className="text-xl font-bold text-slate-700">{getStorageSize()} КБ</p><p className="text-xs text-slate-500">Размер</p></div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2"><FileText size={16} />Резервное копирование</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={handleExportJSON} className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors text-left"><div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0"><Download size={20} className="text-white" /></div><div><p className="font-semibold text-slate-800">Скачать бэкап</p><p className="text-xs text-slate-500">JSON файл</p></div></button>
              <button onClick={handleImportJSON} className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors text-left"><div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shrink-0"><Upload size={20} className="text-white" /></div><div><p className="font-semibold text-slate-800">Загрузить бэкап</p><p className="text-xs text-slate-500">Из JSON</p></div></button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">Опасная зона</h4>
            {showConfirmReset ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 mb-3">⚠️ Удалить все данные?</p>
                <div className="flex gap-2"><button onClick={handleResetData} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Да, удалить</button><button onClick={() => setShowConfirmReset(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm">Отмена</button></div>
              </div>
            ) : (
              <button onClick={() => setShowConfirmReset(true)} className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors text-left w-full"><div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center shrink-0"><Trash2 size={20} className="text-white" /></div><div><p className="font-semibold text-red-700">Сбросить данные</p><p className="text-xs text-red-500">Удалить всё</p></div></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
