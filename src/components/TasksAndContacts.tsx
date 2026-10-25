import React, { useState } from 'react';
import { Task, Contact } from '../types';
import { Plus, X, Calendar, Flag, User, CheckCircle2, Circle, Clock, Filter, Phone, Mail, Building2, Search, Edit2, Trash2, Printer } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import PrintDocument from './PrintDocument';

interface TasksProps { tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>; contacts: Contact[]; setContacts: React.Dispatch<React.SetStateAction<Contact[]>>; }

export default function TasksAndContacts({ tasks, setTasks, contacts, setContacts }: TasksProps) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [printingTask, setPrintingTask] = useState<Task | null>(null);

  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium' as Task['priority'], status: 'pending' as Task['status'], dueDate: '', assignee: '', relatedTo: '', customerName: '', customerContact: '' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', company: '', status: 'lead' as Contact['status'] });

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || task.title.toLowerCase().includes(q) || (task.customerName || '').toLowerCase().includes(q) || (task.customerContact || '').toLowerCase().includes(q);
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const priorityColors: Record<string, string> = { high: 'text-red-500 bg-red-50 border-red-200', medium: 'text-yellow-600 bg-yellow-50 border-yellow-200', low: 'text-green-600 bg-green-50 border-green-200' };
  const priorityLabels: Record<string, string> = { high: 'Высокий', medium: 'Средний', low: 'Низкий' };
  const statusColors: Record<string, string> = { pending: 'bg-slate-100 text-slate-700', in_progress: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
  const statusLabels: Record<string, string> = { pending: 'Ожидает', in_progress: 'В работе', completed: 'Выполнено' };
  const contactStatusColors: Record<string, string> = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-700', lead: 'bg-blue-100 text-blue-700' };
  const contactStatusLabels: Record<string, string> = { active: 'Активный', inactive: 'Неактивный', lead: 'Лид' };

  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus: Record<string, Task['status']> = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
      return { ...t, status: nextStatus[t.status] };
    }));
  };

  const openAddTask = () => { setEditingTask(null); setTaskForm({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '', assignee: '', relatedTo: '', customerName: '', customerContact: '' }); setShowTaskModal(true); };
  const openEditTask = (task: Task) => { setEditingTask(task); setTaskForm({ title: task.title, description: task.description, priority: task.priority, status: task.status, dueDate: task.dueDate, assignee: task.assignee, relatedTo: task.relatedTo || '', customerName: task.customerName || '', customerContact: task.customerContact || '' }); setShowTaskModal(true); };

  const handleSaveTask = () => {
    if (!taskForm.title) return;
    if (editingTask) { setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskForm } : t)); }
    else { setTasks(prev => [...prev, { id: uuidv4(), ...taskForm, dueDate: taskForm.dueDate || new Date().toISOString().split('T')[0] }]); }
    setShowTaskModal(false);
  };

  const handleDeleteTask = (id: string) => { if (confirm('Удалить задачу?')) setTasks(prev => prev.filter(t => t.id !== id)); };

  const openAddContact = () => { setEditingContact(null); setContactForm({ name: '', email: '', phone: '', company: '', status: 'lead' }); setShowContactModal(true); };
  const openEditContact = (contact: Contact) => { setEditingContact(contact); setContactForm({ name: contact.name, email: contact.email, phone: contact.phone, company: contact.company, status: contact.status }); setShowContactModal(true); };

  const handleSaveContact = () => {
    if (!contactForm.name || !contactForm.email) return;
    if (editingContact) { setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...c, ...contactForm } : c)); }
    else { setContacts(prev => [...prev, { id: uuidv4(), ...contactForm, createdAt: new Date().toISOString().split('T')[0] }]); }
    setShowContactModal(false);
  };

  const handleDeleteContact = (id: string) => { if (confirm('Удалить контакт?')) setContacts(prev => prev.filter(c => c.id !== id)); };

  const getDaysUntilDue = (date: string) => { const today = new Date(); const due = new Date(date); return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div><h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Задачи и Клиенты</h2><p className="text-slate-500 mt-1 text-sm sm:text-base">Задачи с контактами заказчиков</p></div>
        <div className="flex gap-2">
          <button onClick={openAddContact} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 shadow-sm"><User size={18} /> Клиент</button>
          <button onClick={openAddTask} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm"><Plus size={18} /> Задача</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"><option value="all">Все статусы</option><option value="pending">Ожидает</option><option value="in_progress">В работе</option><option value="completed">Выполнено</option></select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"><option value="all">Все приоритеты</option><option value="high">Высокий</option><option value="medium">Средний</option><option value="low">Низкий</option></select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Clock size={20} className="text-blue-500" /></div><div><p className="text-xl font-bold text-slate-800">{tasks.filter(t => t.status === 'in_progress').length}</p><p className="text-xs text-slate-500">В работе</p></div></div></div>
        <div className="bg-white rounded-xl p-4 border border-slate-200"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle2 size={20} className="text-green-500" /></div><div><p className="text-xl font-bold text-slate-800">{tasks.filter(t => t.status === 'completed').length}</p><p className="text-xs text-slate-500">Выполнено</p></div></div></div>
        <div className="bg-white rounded-xl p-4 border border-slate-200"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><User size={20} className="text-purple-500" /></div><div><p className="text-xl font-bold text-slate-800">{contacts.length}</p><p className="text-xs text-slate-500">Клиентов</p></div></div></div>
        <div className="bg-white rounded-xl p-4 border border-slate-200"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Flag size={20} className="text-red-500" /></div><div><p className="text-xl font-bold text-slate-800">{tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length}</p><p className="text-xs text-slate-500">Срочных</p></div></div></div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const daysUntil = getDaysUntilDue(task.dueDate);
          const isOverdue = daysUntil < 0 && task.status !== 'completed';
          return (
            <div key={task.id} className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${task.status === 'completed' ? 'border-green-200 opacity-80' : 'border-slate-200'} ${isOverdue ? 'border-l-4 border-l-red-400' : ''}`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <button onClick={() => toggleStatus(task.id)} className="mt-0.5 shrink-0">
                    {task.status === 'completed' ? <CheckCircle2 size={22} className="text-green-500" /> : task.status === 'in_progress' ? <Clock size={22} className="text-blue-500" /> : <Circle size={22} className="text-slate-300 hover:text-blue-400" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                        {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setPrintingTask(task)} className="p-1.5 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Печать"><Printer size={16} /></button>
                        <button onClick={() => openEditTask(task)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>{statusLabels[task.status]}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}><Flag size={10} className="inline mr-1" />{priorityLabels[task.priority]}</span>
                      <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-500'}`}><Calendar size={12} />{new Date(task.dueDate).toLocaleDateString('ru-RU')}{isOverdue && ' (просрочено!)'}</span>
                      {task.assignee && <span className="flex items-center gap-1 text-xs text-slate-500"><User size={12} /> {task.assignee}</span>}
                      {task.relatedTo && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{task.relatedTo}</span>}
                    </div>
                    {(task.customerName || task.customerContact) && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white text-sm font-bold shrink-0">{(task.customerName || '?').charAt(0).toUpperCase()}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-amber-800 uppercase tracking-wide">Заказчик</p>
                            {task.customerName && <p className="text-sm font-semibold text-slate-800 mt-0.5">{task.customerName}</p>}
                            {task.customerContact && <p className="text-sm text-slate-600 mt-0.5 flex items-center gap-1"><Phone size={12} className="text-slate-400" />{task.customerContact}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && <div className="text-center py-16 text-slate-500 bg-white rounded-xl border border-slate-200"><Clock size={48} className="mx-auto mb-4 text-slate-300" /><p className="font-medium">Задачи не найдены</p></div>}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-slate-800">База клиентов</h3><span className="text-sm text-slate-500">{contacts.length} клиентов</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">{contact.name.charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><p className="font-semibold text-slate-800 truncate">{contact.name}</p><p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Building2 size={11} /> {contact.company}</p></div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${contactStatusColors[contact.status]}`}>{contactStatusLabels[contact.status]}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 truncate"><Mail size={11} className="text-slate-400 shrink-0" />{contact.email}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5"><Phone size={11} className="text-slate-400 shrink-0" />{contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-100">
                    <button onClick={() => openEditContact(contact)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded hover:bg-blue-50"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200"><h3 className="text-lg font-semibold">{editingTask ? 'Редактировать задачу' : 'Новая задача'}</h3><button onClick={() => setShowTaskModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Название *</label><input type="text" value={taskForm.title} onChange={(e) => setTaskForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Описание</label><textarea value={taskForm.description} onChange={(e) => setTaskForm(p => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} /></div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2"><Building2 size={16} />Контакты заказчика</h4>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">ФИО заказчика</label><input type="text" value={taskForm.customerName} onChange={(e) => setTaskForm(p => ({ ...p, customerName: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Иванов Иван Иванович" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Контакты</label><input type="text" value={taskForm.customerContact} onChange={(e) => setTaskForm(p => ({ ...p, customerContact: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="+7 (999) 123-45-67" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Приоритет</label><select value={taskForm.priority} onChange={(e) => setTaskForm(p => ({ ...p, priority: e.target.value as Task['priority'] }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"><option value="low">Низкий</option><option value="medium">Средний</option><option value="high">Высокий</option></select></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Статус</label><select value={taskForm.status} onChange={(e) => setTaskForm(p => ({ ...p, status: e.target.value as Task['status'] }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"><option value="pending">Ожидает</option><option value="in_progress">В работе</option><option value="completed">Выполнено</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Срок</label><input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Исполнитель</label><input type="text" value={taskForm.assignee} onChange={(e) => setTaskForm(p => ({ ...p, assignee: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Связано с</label><input type="text" value={taskForm.relatedTo} onChange={(e) => setTaskForm(p => ({ ...p, relatedTo: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200"><button onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Отмена</button><button onClick={handleSaveTask} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingTask ? 'Сохранить' : 'Создать'}</button></div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200"><h3 className="text-lg font-semibold">{editingContact ? 'Редактировать' : 'Новый клиент'}</h3><button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">ФИО *</label><input type="text" value={contactForm.name} onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Email *</label><input type="email" value={contactForm.email} onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label><input type="tel" value={contactForm.phone} onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Компания</label><input type="text" value={contactForm.company} onChange={(e) => setContactForm(p => ({ ...p, company: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Статус</label><select value={contactForm.status} onChange={(e) => setContactForm(p => ({ ...p, status: e.target.value as Contact['status'] }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"><option value="lead">Лид</option><option value="active">Активный</option><option value="inactive">Неактивный</option></select></div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200"><button onClick={() => setShowContactModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Отмена</button><button onClick={handleSaveContact} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">{editingContact ? 'Сохранить' : 'Добавить'}</button></div>
          </div>
        </div>
      )}

      {printingTask && <PrintDocument task={printingTask} onClose={() => setPrintingTask(null)} />}
    </div>
  );
}
