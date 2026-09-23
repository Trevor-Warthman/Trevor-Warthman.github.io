// Jarvis is Tailscale-only, so this page only works for viewers on Trevor's tailnet
// (himself). The bearer token is entered once and kept in localStorage rather than
// shipped in the built JS, since this repo and its bundle are public.
const API_BASE = 'https://jarvis.tail690ef5.ts.net'
const TOKEN_KEY = 'health-dashboard-token'

export type SummaryRange = 'day' | 'week' | 'month' | 'year' | 'all'

export type Bucket = {
  label: string
  periodStart: string
  periodEndExclusive: string
  isComplete: boolean
  foodKcal: number
  activeKcal: number
  netKcal: number
  budgetUsedPct: number | null
  dailyBalanceKcal: number
  cumulativeBalanceKcal: number
}

export type Details = {
  dailyTargetKcal: number
  maintenanceKcal: number
  completedNetKcal: number
  completedBudgetKcal: number
  foodCompletedKcal: number
  foodInclTodayKcal: number
  activeCompletedKcal: number
  activeInclTodayKcal: number
  periodNetBudgetKcal: number
  netBudgetLeftInclTodayKcal: number
  perRemainingDayKcal: number | null
  deficitKcal: number
  expectedDeficitKcal: number
}

export type WeightSummary = {
  latestLb: number | null
  latestDate: string | null
  movingAverageLb: number | null
  previousMovingAverageLb: number | null
  trend: 'down' | 'up' | 'flat' | 'unknown'
  goalWeightLb: number
  goalDate: string
  lbToGoal: number | null
  daysToGoal: number
  requiredWeeklyRateLb: number | null
  actualWeeklyRateLb: number | null
}

export type Summary = {
  range: SummaryRange
  periodStart: string
  periodEndExclusive: string
  buckets: Bucket[]
  details: Details
  weight: WeightSummary
  lastSyncAt: string | null
}

export type Settings = {
  dailyTargetKcal: number
  maintenanceKcal: number
  goalWeightLb: number
  goalDate: string
  weekStartDay: number
  timeZone: string
}

export type SettingsUpdate = Partial<Settings>

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  if (!token) throw new Error('no-token')

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  if (response.status === 401) {
    clearToken()
    throw new Error('unauthorized')
  }
  if (!response.ok) throw new Error(`request-failed-${response.status}`)
  return response.json() as Promise<T>
}

export function fetchSummary(range: SummaryRange, date?: string): Promise<Summary> {
  const params = new URLSearchParams({ range })
  if (date) params.set('date', date)
  return request<Summary>(`/health/summary?${params}`)
}

export function fetchSettings(): Promise<Settings> {
  return request<Settings>('/health/settings')
}

export function updateSettings(update: SettingsUpdate): Promise<Settings> {
  return request<Settings>('/health/settings', { method: 'PUT', body: JSON.stringify(update) })
}
