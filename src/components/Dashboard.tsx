import React from 'react';
import { Contact, Deal, Task } from '../types';
import { TrendingUp, Users, Briefcase, CheckCircle2, AlertCircle, Clock, DollarSign, ArrowUpRight } from 'lucide-react';

interface DashboardProps { contacts: Contact[]; deals: Deal[]; tasks: Task[]; }

export default function Dashboard({ contacts, deals, tasks }: DashboardProps) {
  const totalRevenue = deals.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + d.value, 0);
  const pipelineValue = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).reduce((sum, d) => sum + d.value, 0);
  const activeContacts = contacts.filter(c => c.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const formatCurrency = (value: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);

  const stageLabels: Record<string, string> = { new: 'Новые', negotiation: 'Переговоры', proposal: 'Предложение', closed_won: 'Выиграно', closed_lost: 'Проиграно' };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <div><h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Дашборд</h2><p className="text-slate-500 mt-1">Обзор ключевых показателей</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between"><div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><DollarSign className="text-green-600" size={24} /></div><span className="flex items-center text-green-600 text-sm font-medium"><ArrowUpRight size={16} /> 12%</span></div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{formatCurrency(totalRevenue)}</p><p className="text-sm text-slate-500 mt-1">Выручка</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between"><div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Briefcase className="text-blue-600" size={24} /></div></div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{formatCurrency(pipelineValue)}</p><p className="text-sm text-slate-500 mt-1">Воронка продаж</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between"><div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center"><Users className="text-purple-600" size={24} /></div></div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{activeContacts}</p><p className="text-sm text-slate-500 mt-1">Активных контактов</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between"><div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center"><CheckCircle2 className="text-orange-600" size={24} /></div></div>
          <p className="text-2xl font-bold text-slate-800 mt-4">{completedTasks}/{tasks.length}</p><p className="text-sm text-slate-500 mt-1">Задач выполнено</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Воронка продаж</h3>
        <div className="space-y-4">
          {['new', 'negotiation', 'proposal', 'closed_won', 'closed_lost'].map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const percentage = deals.length > 0 ? (stageDeals.length / deals.length) * 100 : 0;
            return (
              <div key={stage} className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 w-28">{stageLabels[stage]}</span>
                <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                  <div className={`h-full rounded-lg ${stage === 'new' ? 'bg-blue-500' : stage === 'negotiation' ? 'bg-yellow-500' : stage === 'proposal' ? 'bg-purple-500' : stage === 'closed_won' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.max(percentage, 5)}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-600 w-16 text-right">{stageDeals.length}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4"><AlertCircle size={20} className="text-red-500" />Срочные задачи</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.filter(t => t.status !== 'completed' && t.priority === 'high').map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-4 rounded-lg border border-red-100 bg-red-50">
              <Clock size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div><p className="text-sm font-medium text-slate-700">{task.title}</p><p className="text-xs text-slate-500 mt-1">{task.description}</p>
                {task.customerName && <p className="text-xs text-amber-600 mt-1">Заказчик: {task.customerName}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
