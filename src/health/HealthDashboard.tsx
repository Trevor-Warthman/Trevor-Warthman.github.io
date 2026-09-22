import { FormEvent, useEffect, useState } from 'react'
import {
  Bucket, Settings, SettingsUpdate, Summary, SummaryRange,
  clearToken, fetchSettings, fetchSummary, getToken, setToken, updateSettings,
} from './api'

const RANGES: { value: SummaryRange; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'all', label: 'All-Time' },
]

const ROW_KEYS = ['net', 'budgetUsed', 'food', 'active', 'dailyBalance', 'balance'] as const
const ROW_LABELS: Record<(typeof ROW_KEYS)[number], string> = {
  net: 'Net',
  budgetUsed: 'Budget used',
  food: 'Food',
  active: 'Active',
  dailyBalance: 'Daily balance',
  balance: 'Balance',
}

function fmt(n: number) {
  return Math.round(n).toLocaleString()
}
function fmtSigned(n: number) {
  const rounded = Math.round(n)
  return `${rounded > 0 ? '+' : rounded < 0 ? '−' : ''}${Math.abs(rounded).toLocaleString()}`
}
function balanceClass(n: number) {
  return n > 0 ? 'hd-pos' : n < 0 ? 'hd-neg' : ''
}
function rangeNounFor(range: SummaryRange) {
  return range === 'day' ? 'Daily' : range === 'week' ? 'Weekly' : range === 'month' ? 'Monthly' : range === 'year' ? 'Yearly' : 'All-Time'
}

function RowCell({ rowKey, bucket }: { rowKey: (typeof ROW_KEYS)[number]; bucket: Bucket }) {
  switch (rowKey) {
    case 'net': return <>{fmt(bucket.netKcal)}</>
    case 'budgetUsed': return <>{bucket.budgetUsedPct === null ? '—' : `${fmt(bucket.budgetUsedPct)}%`}</>
    case 'food': return <>{fmt(bucket.foodKcal)}</>
    case 'active': return <>{fmt(bucket.activeKcal)}</>
    case 'dailyBalance': return <span className={balanceClass(bucket.dailyBalanceKcal)}>{fmtSigned(bucket.dailyBalanceKcal)}</span>
    case 'balance': return <span className={balanceClass(bucket.cumulativeBalanceKcal)}>{fmtSigned(bucket.cumulativeBalanceKcal)}</span>
  }
}

function TokenPrompt({ onSaved }: { onSaved: () => void }) {
  const [value, setValue] = useState('')
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!value.trim()) return
    setToken(value.trim())
    onSaved()
  }
  return (
    <form className="hd-token-prompt" onSubmit={handleSubmit}>
      <p>This page reads live from Jarvis over Tailscale, so it only works here, on the tailnet, with the dashboard token.</p>
      <div className="hd-token-row">
        <input type="password" placeholder="Dashboard token" value={value} onChange={(e) => setValue(e.target.value)} aria-label="Dashboard token" />
        <button type="submit" className="hd-btn">Connect</button>
      </div>
    </form>
  )
}

function SettingsEditor({ settings, onSaved }: { settings: Settings; onSaved: (s: Settings) => void }) {
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const update: SettingsUpdate = {
      dailyTargetKcal: Number(form.dailyTargetKcal),
      maintenanceKcal: Number(form.maintenanceKcal),
      goalWeightLb: Number(form.goalWeightLb),
      goalDate: form.goalDate,
    }
    try {
      onSaved(await updateSettings(update))
    } catch {
      setError('Could not save. Check the connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <details className="hd-settings">
      <summary>Edit goals</summary>
      <form onSubmit={handleSubmit}>
        <label>Daily target (kcal)<input type="number" value={form.dailyTargetKcal} onChange={(e) => setForm({ ...form, dailyTargetKcal: Number(e.target.value) })} /></label>
        <label>Maintenance (kcal)<input type="number" value={form.maintenanceKcal} onChange={(e) => setForm({ ...form, maintenanceKcal: Number(e.target.value) })} /></label>
        <label>Goal weight (lb)<input type="number" step="0.1" value={form.goalWeightLb} onChange={(e) => setForm({ ...form, goalWeightLb: Number(e.target.value) })} /></label>
        <label>Goal date<input type="date" value={form.goalDate} onChange={(e) => setForm({ ...form, goalDate: e.target.value })} /></label>
        <button type="submit" className="hd-btn" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        {error && <p className="hd-error">{error}</p>}
      </form>
    </details>
  )
}

export function HealthDashboard() {
  const [hasToken, setHasToken] = useState(() => !!getToken())
  const [range, setRange] = useState<SummaryRange>('week')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, cfg] = await Promise.all([fetchSummary(range), fetchSettings()])
      setSummary(s)
      setSettings(cfg)
    } catch (err) {
      if (err instanceof Error && (err.message === 'no-token' || err.message === 'unauthorized')) {
        setHasToken(false)
      } else {
        setError("Can't reach Jarvis. This page only works on Trevor's private network.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasToken) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken, range])

  if (!hasToken) return <div className="hd-card"><TokenPrompt onSaved={() => setHasToken(true)} /></div>

  return (
    <div className="hd-card">
      <div className="hd-topbar">
        <h2>{rangeNounFor(range)} Calories</h2>
        <button className="hd-refresh" onClick={load} aria-label="Refresh" title="Refresh">
          {loading ? '⋯' : '✓'}
        </button>
      </div>

      <div className="hd-range-tabs" role="tablist" aria-label="Time range">
        {RANGES.map((r) => (
          <button key={r.value} role="tab" aria-selected={range === r.value} className={range === r.value ? 'is-active' : ''} onClick={() => setRange(r.value)}>
            {r.label}
          </button>
        ))}
      </div>

      {error && <p className="hd-error">{error}</p>}

      {summary && (
        <>
          <div className="hd-table-wrap">
            <table className="hd-table">
              <thead>
                <tr>
                  <th className="hd-row-label"> </th>
                  {summary.buckets.map((b) => <th key={b.periodStart}>{b.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {ROW_KEYS.map((key) => (
                  <tr key={key} className={key === 'dailyBalance' || key === 'balance' ? 'hd-row-strong' : ''}>
                    <th className="hd-row-label">{ROW_LABELS[key]}</th>
                    {summary.buckets.map((b) => <td key={b.periodStart}><RowCell rowKey={key} bucket={b} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hd-note">Balance counts completed {range === 'day' ? 'periods' : 'days'}. The current period is in progress. All calories are kcal.</p>

          <h3 className="hd-details-heading">Details</h3>
          <dl className="hd-details">
            <div><dt>Daily net target</dt><dd>{fmt(summary.details.dailyTargetKcal)} kcal</dd></div>
            <div><dt>Completed net / budget</dt><dd>{fmt(summary.details.completedNetKcal)} / {fmt(summary.details.completedBudgetKcal)} kcal</dd></div>
            <div><dt>Food &middot; completed / incl. today</dt><dd>{fmt(summary.details.foodCompletedKcal)} / {fmt(summary.details.foodInclTodayKcal)} kcal</dd></div>
            <div><dt>Active &middot; completed / incl. today</dt><dd>{fmt(summary.details.activeCompletedKcal)} / {fmt(summary.details.activeInclTodayKcal)} kcal</dd></div>
            <div><dt>{rangeNounFor(range)} net budget</dt><dd>{fmt(summary.details.periodNetBudgetKcal)} kcal</dd></div>
            <div><dt>Net budget left, incl. today</dt><dd>{fmt(summary.details.netBudgetLeftInclTodayKcal)} kcal</dd></div>
            <div><dt>Per remaining day</dt><dd>{summary.details.perRemainingDayKcal === null ? '—' : `${fmt(summary.details.perRemainingDayKcal)} kcal/day`}</dd></div>
            <div><dt>Maintenance reference</dt><dd>{fmt(summary.details.maintenanceKcal)} kcal/day</dd></div>
            <div><dt>Deficit / expected deficit</dt><dd>{fmt(summary.details.deficitKcal)} / {fmt(summary.details.expectedDeficitKcal)} kcal</dd></div>
          </dl>
          <p className="hd-formulas">
            Net = Food &minus; Active<br />
            Daily balance = {fmt(summary.details.dailyTargetKcal)} &minus; Net<br />
            Balance = total Daily balance for completed periods<br />
            Budget used = Net &divide; net budget &times; 100
          </p>

          <h3 className="hd-details-heading">Weight</h3>
          <dl className="hd-details">
            <div><dt>Latest</dt><dd>{summary.weight.latestLb === null ? 'No data' : `${summary.weight.latestLb} lb (${summary.weight.latestDate})`}</dd></div>
            <div><dt>7-day average</dt><dd>{summary.weight.movingAverageLb === null ? '—' : `${summary.weight.movingAverageLb} lb`}</dd></div>
            <div><dt>Trend vs. prior week</dt><dd className={summary.weight.trend === 'down' ? 'hd-pos' : summary.weight.trend === 'up' ? 'hd-neg' : ''}>
              {summary.weight.trend === 'down' ? '↓ Down' : summary.weight.trend === 'up' ? '↑ Up' : summary.weight.trend === 'flat' ? 'Flat' : 'Not enough data'}
              {summary.weight.actualWeeklyRateLb !== null && ` (${summary.weight.actualWeeklyRateLb > 0 ? '+' : ''}${summary.weight.actualWeeklyRateLb} lb/wk)`}
            </dd></div>
            <div><dt>Goal</dt><dd>{summary.weight.goalWeightLb} lb by {summary.weight.goalDate}</dd></div>
            <div><dt>Required pace</dt><dd>{summary.weight.requiredWeeklyRateLb === null ? '—' : `${summary.weight.requiredWeeklyRateLb} lb/wk, ${summary.weight.daysToGoal} days left`}</dd></div>
          </dl>
        </>
      )}

      {settings && <SettingsEditor settings={settings} onSaved={setSettings} />}
      <button className="hd-disconnect" onClick={() => { clearToken(); setHasToken(false) }}>Disconnect</button>
    </div>
  )
}
