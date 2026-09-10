function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ouissas_token');
}
export function setToken(token: string) {
  localStorage.setItem('ouissas_token', token);
}
export function clearToken() {
  localStorage.removeItem('ouissas_token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erreur (${res.status})`);
  }
  return res.json();
}

export const api = {
  register: (data: any) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/api/company/me'),
  updateCompany: (data: any) => request('/api/company/me', { method: 'PATCH', body: JSON.stringify(data) }),
  users: () => request('/api/users'),
  createUser: (data: any) => request('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  processes: () => request('/api/processes'),
  createProcess: (data: any) => request('/api/processes', { method: 'POST', body: JSON.stringify(data) }),
  diagnostic: () => request('/api/diagnostic'),
  updateDiagnosticResponse: (requirementId: string, data: any) =>
    request(`/api/diagnostic/${requirementId}`, { method: 'PUT', body: JSON.stringify(data) }),
  documents: () => request('/api/documents'),
  createDocument: (data: any) => request('/api/documents', { method: 'POST', body: JSON.stringify(data) }),
  nonconformities: () => request('/api/nonconformities'),
  createNonConformity: (data: any) => request('/api/nonconformities', { method: 'POST', body: JSON.stringify(data) }),
  updateNcStatus: (id: string, status: string) => request(`/api/nonconformities/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  actions: () => request('/api/actions'),
  createAction: (data: any) => request('/api/actions', { method: 'POST', body: JSON.stringify(data) }),
  moveAction: (id: string, status: string) => request(`/api/actions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  risks: () => request('/api/risks'),
  createRisk: (data: any) => request('/api/risks', { method: 'POST', body: JSON.stringify(data) }),
  createProcedure: (data: any) => request('/api/documents/generate', { method: 'POST', body: JSON.stringify(data) }),
  downloadProcedureDocx: async (id: string, filename: string) => {
    const token = getToken();
    const res = await fetch(`/api/documents/${id}/docx`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) throw new Error('Le téléchargement a échoué.');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
