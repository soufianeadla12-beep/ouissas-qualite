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
};
