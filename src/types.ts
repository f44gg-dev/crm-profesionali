export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  contactId: string;
  contactName: string;
  stage: 'new' | 'negotiation' | 'proposal' | 'closed_won' | 'closed_lost';
  createdAt: string;
  expectedClose: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignee: string;
  relatedTo?: string;
  customerName?: string;
  customerContact?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  createdAt: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'contract' | 'act' | 'combined';
  content: string;
  createdAt: string;
}

export type Page = 'dashboard' | 'tasks' | 'deals' | 'documents';

