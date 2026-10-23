const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getToken() {
  return localStorage.getItem('visaprep_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('visaprep_token', token);
  } else {
    localStorage.removeItem('visaprep_token');
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // sends cookies if present
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'An unexpected error occurred.');
    error.status = response.status;
    error.code = data.error;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me', { method: 'GET' }),
};

export const questionApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.difficulty) query.set('difficulty', params.difficulty);
    if (params.topic) query.set('topic', params.topic);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    const queryString = query.toString();
    return request(`/questions${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },
  getById: (id) => request(`/questions/${id}`, { method: 'GET' }),
  create: (data) => request('/admin/questions', { method: 'POST', body: data }),
  update: (id, data) => request(`/admin/questions/${id}`, { method: 'PATCH', body: data }),
  delete: (id) => request(`/admin/questions/${id}`, { method: 'DELETE' }),
};

export const paymentApi = {
  getConfig: () => request('/payments/config', { method: 'GET' }),
  submit: (payload) => request('/payments', { method: 'POST', body: payload }),
  getMyPayments: () => request('/payments/me', { method: 'GET' }),
  listAdminPayments: (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`/admin/payments${query}`, { method: 'GET' });
  },
  approve: (id) => request(`/admin/payments/${id}/approve`, { method: 'PATCH' }),
  reject: (id, reason) => request(`/admin/payments/${id}/reject`, { method: 'PATCH', body: { reason } }),
};

export const progressApi = {
  getProgress: () => request('/progress', { method: 'GET' }),
  updateProgress: (questionId, status) =>
    request(`/progress/${questionId}`, { method: 'PUT', body: { status } }),
};
