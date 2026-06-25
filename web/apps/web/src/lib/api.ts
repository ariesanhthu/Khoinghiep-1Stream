const API_BASE = '/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const tokenFromUrl = params.get('token')
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl)
    window.history.replaceState({}, '', window.location.pathname)
    return tokenFromUrl
  }
  return localStorage.getItem('token')
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }
  return res.json()
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: any) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
}
