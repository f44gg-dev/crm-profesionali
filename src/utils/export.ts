import { Contact, Deal, Task, User } from '../types';

export function exportData(data: { user: User | null; contacts: Contact[]; deals: Deal[]; tasks: Task[] }): void {
  const json = JSON.stringify({ version: '1.0.0', exportDate: new Date().toISOString(), ...data }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importData(): Promise<any> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) { reject('No file'); return; }
      const reader = new FileReader();
      reader.onload = (event) => {
        try { resolve(JSON.parse(event.target?.result as string)); }
        catch { reject('Parse error'); }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
