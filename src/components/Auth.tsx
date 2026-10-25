import React, { useState } from 'react';
import { User } from '../types';
import { Phone, User as UserIcon, Mail, Building2, Briefcase, ArrowRight, Shield } from 'lucide-react';

interface AuthProps { onAuth: (user: User) => void; }

export default function Auth({ onAuth }: AuthProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.length > 0) { formatted = '+7 '; if (cleaned.length > 1) formatted += '(' + cleaned.slice(1, 4); if (cleaned.length > 4) formatted += ') ' + cleaned.slice(4, 7); if (cleaned.length > 7) formatted += '-' + cleaned.slice(7, 9); if (cleaned.length > 9) formatted += '-' + cleaned.slice(9, 11); }
    return formatted;
  };

  const handleStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!phone.trim() || phone.replace(/\D/g, '').length < 11) newErrors.phone = 'Введите номер телефона';
    if (!name.trim()) newErrors.name = 'Введите ФИО';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({}); setStep(2);
  };

  const handleStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Введите email';
    if (!company.trim()) newErrors.company = 'Введите компанию';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onAuth({ id: Date.now().toString(), name: name.trim(), phone: phone.trim(), email: email.trim(), company: company.trim(), position: position.trim() || 'Сотрудник', createdAt: new Date().toISOString() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20"><Shield className="text-white" size={32} /></div>
          <h1 className="text-3xl font-bold text-white">CRM <span className="text-blue-300 font-light">Pro</span></h1>
          <p className="text-blue-200/70 mt-2">Система управления клиентами</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-blue-400' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-blue-400' : 'bg-white/20'}`} />
          </div>
          {step === 1 && (
            <div className="space-y-5">
              <div><h2 className="text-xl font-semibold text-white">Добро пожаловать!</h2><p className="text-blue-200/70 text-sm mt-1">Введите свои данные для входа</p></div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Номер телефона *</label>
                <div className="relative"><Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="+7 (999) 123-45-67" maxLength={18}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
                {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">ФИО *</label>
                <div className="relative"><UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Иванов Иван Иванович"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
                {errors.name && <p className="text-red-300 text-xs mt-1">{errors.name}</p>}
              </div>
              <button onClick={handleStep1} className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30">Продолжить <ArrowRight size={18} /></button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <div><h2 className="text-xl font-semibold text-white">Дополнительная информация</h2><p className="text-blue-200/70 text-sm mt-1">Заполните данные о компании</p></div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Email *</label>
                <div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ivan@company.ru"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
                {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Компания *</label>
                <div className="relative"><Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="ООО Моя Компания"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
                {errors.company && <p className="text-red-300 text-xs mt-1">{errors.company}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Должность</label>
                <div className="relative"><Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Менеджер"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400" /></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10">Назад</button>
                <button onClick={handleStep2} className="flex-[2] flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30">Войти <ArrowRight size={18} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
