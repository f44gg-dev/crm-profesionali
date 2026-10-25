import { Contact, Deal, Task } from './types';

export const initialContacts: Contact[] = [
  { id: '1', name: 'Алексей Петров', email: 'alex@company.ru', phone: '+7 (999) 123-45-67', company: 'ТехноСофт', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Мария Иванова', email: 'maria@startup.io', phone: '+7 (916) 234-56-78', company: 'СтартАп', status: 'lead', createdAt: '2024-02-20' },
  { id: '3', name: 'Дмитрий Козлов', email: 'dmitry@enterprise.com', phone: '+7 (903) 345-67-89', company: 'Энтерпрайз', status: 'active', createdAt: '2024-03-10' },
  { id: '4', name: 'Елена Смирнова', email: 'elena@digital.ru', phone: '+7 (925) 456-78-90', company: 'ДиджиталАгентство', status: 'inactive', createdAt: '2024-01-05' },
  { id: '5', name: 'Сергей Волков', email: 'sergey@innovate.tech', phone: '+7 (977) 567-89-01', company: 'ИнноваТех', status: 'lead', createdAt: '2024-04-01' },
];

export const initialDeals: Deal[] = [
  { id: '1', title: 'Внедрение CRM', value: 500000, contactId: '1', contactName: 'Алексей Петров', stage: 'negotiation', createdAt: '2024-03-01', expectedClose: '2024-06-01' },
  { id: '2', title: 'Разработка сайта', value: 250000, contactId: '2', contactName: 'Мария Иванова', stage: 'new', createdAt: '2024-04-01', expectedClose: '2024-07-15' },
  { id: '3', title: 'Аудит безопасности', value: 180000, contactId: '3', contactName: 'Дмитрий Козлов', stage: 'proposal', createdAt: '2024-02-15', expectedClose: '2024-05-30' },
  { id: '4', title: 'Мобильное приложение', value: 800000, contactId: '1', contactName: 'Алексей Петров', stage: 'negotiation', createdAt: '2024-03-20', expectedClose: '2024-08-01' },
  { id: '5', title: 'SEO-продвижение', value: 120000, contactId: '4', contactName: 'Елена Смирнова', stage: 'closed_won', createdAt: '2024-01-10', expectedClose: '2024-04-10' },
];

export const initialTasks: Task[] = [
  { id: '1', title: 'Подготовить КП', description: 'Составить КП для ТехноСофт', priority: 'high', status: 'in_progress', dueDate: '2024-05-20', assignee: 'Менеджер', customerName: 'Алексей Петров', customerContact: '+7 (999) 123-45-67' },
  { id: '2', title: 'Позвонить Марии', description: 'Обсудить детали проекта', priority: 'medium', status: 'pending', dueDate: '2024-05-18', assignee: 'Менеджер', customerName: 'Мария Иванова', customerContact: '+7 (916) 234-56-78' },
  { id: '3', title: 'Отправить счёт', description: 'Выставить счёт', priority: 'high', status: 'completed', dueDate: '2024-04-10', assignee: 'Бухгалтерия', customerName: 'Елена Смирнова', customerContact: '+7 (925) 456-78-90' },
  { id: '4', title: 'Встреча с Энтерпрайз', description: 'Презентация результатов', priority: 'high', status: 'pending', dueDate: '2024-05-25', assignee: 'Менеджер', customerName: 'Дмитрий Козлов', customerContact: '+7 (903) 345-67-89' },
];
