// Jarvis is Tailscale-only, so this page only works for viewers on Trevor's tailnet
// (himself) — that network boundary is the actual access control, not a token.
const API_BASE = 'https://jarvis.tail690ef5.ts.net'

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
  // True when this bucket is entirely unlogged (0 of a nonzero total days logged) and
  // not overridden as real. Day buckets are 0/1 or 1/1; month buckets (year/all-time
  // views) aggregate, e.g. loggedDayCount 18 of totalDayCount 30.
  isMissing: boolean
  loggedDayCount: number
  totalDayCount: number
  // Average of daily weight samples within the bucket, null if none logged. Only
  // populated for month-grain buckets (year/all-time views).
  weightLb: number | null
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
  // Averages over only the days actually logged (missing days excluded entirely,
  // not zeroed and not counted as real low days).
  loggedDayCount: number
  totalCompleteDayCount: number
  averageNetKcalPerLoggedDay: number | null
  averageFoodKcalPerLoggedDay: number | null
  averageActiveKcalPerLoggedDay: number | null
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
  })
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

// Mark a flagged day as real (e.g. "I was sick, this low/zero day is accurate"), or
// pass markedReal: false to revert it back to the auto-detector's judgment.
export function setDayOverride(day: string, markedReal: boolean): Promise<{ day: string; markedReal: boolean }> {
  return request(`/health/day-overrides/${day}`, { method: 'PUT', body: JSON.stringify({ markedReal }) })
}
