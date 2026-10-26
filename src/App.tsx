import React, { useState, useEffect } from 'react';
import { Page, Contact, Deal, Task, User } from './types';
import { saveToStorage, loadFromStorage } from './utils/storage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Deals from './components/Deals';
import TasksAndContacts from './components/TasksAndContacts';
import Documents from './components/Documents';
import Auth from './components/Auth';
import Settings from './components/Settings';
import { Menu, X, Settings as SettingsIcon } from 'lucide-react';

// Ключи localStorage привязаны к ID пользователя
function getUserKey(userId: string, type: string): string {
  return `crm_${type}_${userId}`;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка пользователя и его данных
  useEffect(() => {
    const savedUser = loadFromStorage<User>('crm_user');
    if (savedUser) {
      setUser(savedUser);

      // Загружаем данные КОНКРЕТНОГО пользователя
      const userContacts = loadFromStorage<Contact[]>(getUserKey(savedUser.id, 'contacts'));
      const userDeals = loadFromStorage<Deal[]>(getUserKey(savedUser.id, 'deals'));
      const userTasks = loadFromStorage<Task[]>(getUserKey(savedUser.id, 'tasks'));

      // Если данных нет — начинаем с пустых (не с дефолтных!)
      setContacts(userContacts || []);
      setDeals(userDeals || []);
      setTasks(userTasks || []);
    }
    setIsLoaded(true);
  }, []);

  // Автосохранение данных текущего пользователя
  useEffect(() => {
    if (isLoaded && user) {
      saveToStorage(getUserKey(user.id, 'contacts'), contacts);
    }
  }, [contacts, isLoaded, user]);

  useEffect(() => {
    if (isLoaded && user) {
      saveToStorage(getUserKey(user.id, 'deals'), deals);
    }
  }, [deals, isLoaded, user]);

  useEffect(() => {
    if (isLoaded && user) {
      saveToStorage(getUserKey(user.id, 'tasks'), tasks);
    }
  }, [tasks, isLoaded, user]);

  // Регистрация нового пользователя
  const handleAuth = (newUser: User) => {
    // Сохраняем пользователя
    setUser(newUser);
    saveToStorage('crm_user', newUser);

    // Проверяем есть ли уже данные для этого пользователя
    const existingContacts = loadFromStorage<Contact[]>(getUserKey(newUser.id, 'contacts'));
    const existingDeals = loadFromStorage<Deal[]>(getUserKey(newUser.id, 'deals'));
    const existingTasks = loadFromStorage<Task[]>(getUserKey(newUser.id, 'tasks'));

    // Если данных нет — начинаем с пустых
    setContacts(existingContacts || []);
    setDeals(existingDeals || []);
    setTasks(existingTasks || []);
  };

  // Выход — очищаем только профиль, данные остаются
  const handleLogout = () => {
    if (confirm('Выйти из системы?')) {
      localStorage.removeItem('crm_user');
      setUser(null);
      setContacts([]);
      setDeals([]);
      setTasks([]);
    }
  };

  // Если не авторизован — показываем форму входа
  if (!user) return <Auth onAuth={handleAuth} />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard contacts={contacts} deals={deals} tasks={tasks} />;
      case 'tasks':
        return (
          <TasksAndContacts
            tasks={tasks}
            setTasks={setTasks}
            contacts={contacts}
            setContacts={setContacts}
          />
        );
      case 'deals':
        return <Deals deals={deals} setDeals={setDeals} />;
      case 'documents':
        return <Documents />;
      default:
        return <Dashboard contacts={contacts} deals={deals} tasks={tasks} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Мобильная шапка */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">CRM</span>
          <span className="text-slate-600 font-light">Pro</span>
        </h1>
        <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
          <SettingsIcon size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Кнопка настроек на десктопе */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="hidden lg:flex fixed top-4 right-4 z-50 p-3 bg-white hover:bg-slate-50 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105"
        title="Настройки и данные"
      >
        <SettingsIcon size={20} className="text-slate-600" />
      </button>

      {/* Мобильное боковое меню */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          currentPage={currentPage}
          onPageChange={(page) => { setCurrentPage(page); setSidebarOpen(false); }}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Десктопное боковое меню */}
      <div className="hidden lg:block">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} user={user} onLogout={handleLogout} />
      </div>

      {/* Затемнение для мобильного меню */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Основной контент */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {renderPage()}
      </main>

      {/* Модальное окно настроек */}
      {settingsOpen && (
        <Settings
          user={user}
          contacts={contacts}
          deals={deals}
          tasks={tasks}
          setContacts={setContacts}
          setDeals={setDeals}
          setTasks={setTasks}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
