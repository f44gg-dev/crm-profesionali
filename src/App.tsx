import React, { useState, useEffect } from 'react';
import { Page, Contact, Deal, Task, User } from './types';
import { initialContacts, initialDeals, initialTasks } from './data';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './utils/storage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Deals from './components/Deals';
import TasksAndContacts from './components/TasksAndContacts';
import Documents from './components/Documents';
import Auth from './components/Auth';
import Settings from './components/Settings';
import { Menu, X, Settings as SettingsIcon } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = loadFromStorage<User>(STORAGE_KEYS.USER);
    if (savedUser) setUser(savedUser);
    setContacts(loadFromStorage<Contact[]>(STORAGE_KEYS.CONTACTS) || initialContacts);
    setDeals(loadFromStorage<Deal[]>(STORAGE_KEYS.DEALS) || initialDeals);
    setTasks(loadFromStorage<Task[]>(STORAGE_KEYS.TASKS) || initialTasks);
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) saveToStorage(STORAGE_KEYS.CONTACTS, contacts); }, [contacts, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage(STORAGE_KEYS.DEALS, deals); }, [deals, isLoaded]);
  useEffect(() => { if (isLoaded) saveToStorage(STORAGE_KEYS.TASKS, tasks); }, [tasks, isLoaded]);

  const handleAuth = (newUser: User) => { setUser(newUser); saveToStorage(STORAGE_KEYS.USER, newUser); };
  const handleLogout = () => { if (confirm('Выйти?')) { localStorage.removeItem(STORAGE_KEYS.USER); setUser(null); } };

  if (!user) return <Auth onAuth={handleAuth} />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard contacts={contacts} deals={deals} tasks={tasks} />;
      case 'tasks': return <TasksAndContacts tasks={tasks} setTasks={setTasks} contacts={contacts} setContacts={setContacts} />;
      case 'deals': return <Deals deals={deals} setDeals={setDeals} />;
      case 'documents': return <Documents />;
      default: return <Dashboard contacts={contacts} deals={deals} tasks={tasks} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-bold"><span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">CRM</span><span className="text-slate-600 font-light">Pro</span></h1>
        <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg"><SettingsIcon size={20} className="text-slate-600" /></button>
      </div>
      <button onClick={() => setSettingsOpen(true)} className="hidden lg:flex fixed top-4 right-4 z-50 p-3 bg-white hover:bg-slate-50 rounded-xl shadow-lg border border-slate-200">
        <SettingsIcon size={20} className="text-slate-600" />
      </button>
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentPage={currentPage} onPageChange={(page) => { setCurrentPage(page); setSidebarOpen(false); }} user={user} onLogout={handleLogout} />
      </div>
      <div className="hidden lg:block"><Sidebar currentPage={currentPage} onPageChange={setCurrentPage} user={user} onLogout={handleLogout} /></div>
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">{renderPage()}</main>
      {settingsOpen && <Settings user={user} contacts={contacts} deals={deals} tasks={tasks} setContacts={setContacts} setDeals={setDeals} setTasks={setTasks} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
