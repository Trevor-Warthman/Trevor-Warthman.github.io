import { FormEvent, MouseEvent, useEffect, useState } from 'react'
import { Bucket, Settings, SettingsUpdate, Summary, SummaryRange, fetchSettings, fetchSummary, setDayOverride, updateSettings } from './api'

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
// Active energy is throttled by iOS to roughly hourly background delivery even when the
// pipeline is healthy, so "stale" starts at 3h, not immediately after the last hour ticks over.
const STALE_AFTER_MINUTES = 180

function syncAgeLabel(lastSyncAt: string | null): { text: string; className: string } {
  if (!lastSyncAt) return { text: 'Never synced', className: 'hd-neg' }
  const minutes = Math.round((Date.now() - new Date(lastSyncAt).getTime()) / 60000)
  const text = minutes < 1 ? 'just now'
    : minutes < 60 ? `${minutes}m ago`
    : minutes < 24 * 60 ? `${Math.round(minutes / 60)}h ago`
    : `${Math.round(minutes / (24 * 60))}d ago`
  return { text: `Last synced ${text}`, className: minutes > STALE_AFTER_MINUTES ? 'hd-neg' : 'hd-pos' }
}
function rangeNounFor(range: SummaryRange) {
  return range === 'day' ? 'Daily' : range === 'week' ? 'Weekly' : range === 'month' ? 'Monthly' : range === 'year' ? 'Yearly' : 'All-Time'
}
// For headings that read as a sentence fragment ("Averages this week"), not a label.
function periodPhrase(range: SummaryRange) {
  return range === 'day' ? 'today' : range === 'week' ? 'this week' : range === 'month' ? 'this month' : range === 'year' ? 'this year' : 'all-time'
}
// True whenever a bucket has any unlogged day in it: day buckets are 0/1 or 1/1, so
// this is exactly "missing" for those; month buckets (year/all-time) can be partial.
function hasGap(b: Bucket) {
  return b.totalDayCount > 0 && b.loggedDayCount < b.totalDayCount
}
// Day/week/month buckets are one real calendar day each, so they can be marked real
// directly. Year/all-time buckets are whole months -- drill into Month view instead.
function isDayGrain(range: SummaryRange) {
  return range === 'day' || range === 'week' || range === 'month'
}

function RowCell({ rowKey, bucket }: { rowKey: (typeof ROW_KEYS)[number]; bucket: Bucket }) {
  switch (rowKey) {
    case 'net': return <>{fmt(bucket.netKcal)}</>
    case 'budgetUsed': return <>{bucket.budgetUsedPct === null ? '—' : `${fmt(bucket.budgetUsedPct)}%`}</>
    case 'food': return <>{fmt(bucket.foodKcal)}</>
    case 'active': return <>{fmt(bucket.activeKcal)}</>
    // The in-progress bucket (today, or the current month in year/all-time view)
    // hasn't finished, so its daily balance isn't a real number yet and it never
    // contributes to the running balance -- matches the original mockup's "In
    // progress" / "—" treatment instead of showing a number that will still change.
    case 'dailyBalance': return bucket.isComplete
      ? <span className={balanceClass(bucket.dailyBalanceKcal)}>{fmtSigned(bucket.dailyBalanceKcal)}</span>
      : <span className="hd-in-progress">In progress</span>
    case 'balance': return bucket.isComplete
      ? <span className={balanceClass(bucket.cumulativeBalanceKcal)}>{fmtSigned(bucket.cumulativeBalanceKcal)}</span>
      : <span className="hd-in-progress">—</span>
  }
}

function MarkRealButton({ day, onMarked }: { day: string; onMarked: () => void }) {
  const [saving, setSaving] = useState(false)
  const handleClick = async (event: MouseEvent) => {
    event.stopPropagation()
    setSaving(true)
    try {
      await setDayOverride(day, true)
      onMarked()
    } finally {
      setSaving(false)
    }
  }
  return (
    <button type="button" className="hd-mark-real" onClick={handleClick} disabled={saving}>
      {saving ? '…' : 'Mark real'}
    </button>
  )
}

function MonthGapModal({ bucket, onClose }: { bucket: Bucket; onClose: () => void }) {
  return (
    <div className="hd-modal-backdrop" onClick={onClose}>
      <div className="hd-modal" onClick={(event) => event.stopPropagation()}>
        <div className="hd-modal-head">
          <h4>{bucket.label}</h4>
          <button type="button" className="hd-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p>{bucket.loggedDayCount} of {bucket.totalDayCount} days logged this month.</p>
        <p className="hd-modal-hint">Switch to Month view on that month to see and mark individual days as real.</p>
      </div>
    </div>
  )
}

function MobileDayCard({ bucket, range, onMarked, onOpenModal }: {
  bucket: Bucket
  range: SummaryRange
  onMarked: () => void
  onOpenModal: (b: Bucket) => void
}) {
  const missing = hasGap(bucket)
  const clickableMonth = missing && !isDayGrain(range)
  return (
    <div
      className={`hd-mobile-day${missing ? ' hd-missing' : ''}`}
      onClick={clickableMonth ? () => onOpenModal(bucket) : undefined}
    >
      <div className="hd-mobile-day-head">
        <span className="hd-mobile-day-label">
          {bucket.label}
          {!bucket.isComplete && <span className="hd-today-badge">{isDayGrain(range) ? 'TODAY' : 'IN PROGRESS'}</span>}
        </span>
        {bucket.isComplete
          ? <span className={`hd-mobile-day-balance ${balanceClass(bucket.dailyBalanceKcal)}`}>{fmtSigned(bucket.dailyBalanceKcal)}</span>
          : <span className="hd-mobile-day-balance hd-in-progress">In progress</span>}
      </div>
      {missing && (
        <div className="hd-missing-note">
          {isDayGrain(range)
            ? bucket.isMissing ? 'Missing data — under 1,400 kcal logged' : 'Missing data'
            : `Missing data — ${bucket.loggedDayCount} of ${bucket.totalDayCount} days logged`}
          {isDayGrain(range) && <MarkRealButton day={bucket.periodStart} onMarked={onMarked} />}
        </div>
      )}
      <div className="hd-mobile-day-grid">
        <div><span>Net</span><strong>{fmt(bucket.netKcal)}</strong></div>
        <div><span>Food</span><strong>{fmt(bucket.foodKcal)}</strong></div>
        <div><span>Active</span><strong>{fmt(bucket.activeKcal)}</strong></div>
        <div><span>Budget</span><strong>{bucket.budgetUsedPct === null ? '—' : `${fmt(bucket.budgetUsedPct)}%`}</strong></div>
        {!isDayGrain(range) && bucket.weightLb !== null && <div><span>Avg weight</span><strong>{bucket.weightLb} lb</strong></div>}
      </div>
      <div className="hd-mobile-day-balance-row">
        <span>Running balance</span>
        {bucket.isComplete
          ? <strong className={balanceClass(bucket.cumulativeBalanceKcal)}>{fmtSigned(bucket.cumulativeBalanceKcal)}</strong>
          : <strong className="hd-in-progress">—</strong>}
      </div>
    </div>
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
  const [range, setRange] = useState<SummaryRange>('week')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalBucket, setModalBucket] = useState<Bucket | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, cfg] = await Promise.all([fetchSummary(range), fetchSettings()])
      setSummary(s)
      setSettings(cfg)
    } catch {
      setError("Can't reach Jarvis. This page only works on Trevor's private network.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range])

  return (
    <div className="hd-card">
      <div className="hd-topbar">
        <h2>{rangeNounFor(range)} Calories</h2>
        <button className="hd-refresh" onClick={load} aria-label="Refresh" title="Refresh">
          {loading ? '⋯' : '✓'}
        </button>
      </div>

      {summary && (() => {
        const sync = syncAgeLabel(summary.lastSyncAt)
        return <p className={`hd-sync-status ${sync.className}`}>{sync.text}</p>
      })()}

      <div className="hd-range-tabs" role="tablist" aria-label="Time range">
        {RANGES.map((r) => (
          <button key={r.value} role="tab" aria-selected={range === r.value} className={range === r.value ? 'is-active' : ''} onClick={() => setRange(r.value)}>
            {r.label}
          </button>
        ))}
      </div>

      {error && <p className="hd-error">{error}</p>}

      {summary && (() => {
        const gapBuckets = summary.buckets.filter(hasGap)
        const anyMissing = summary.details.totalCompleteDayCount > summary.details.loggedDayCount
        return (
        <>
          {range !== 'day' && (
            <>
              <h3 className="hd-details-heading hd-details-heading-first">Averages, {periodPhrase(range)}</h3>
              <dl className="hd-details hd-averages">
                <div><dt>Days logged</dt><dd>{summary.details.loggedDayCount} of {summary.details.totalCompleteDayCount}</dd></div>
                <div><dt>Avg net / day</dt><dd>{summary.details.averageNetKcalPerLoggedDay === null ? '—' : `${fmt(summary.details.averageNetKcalPerLoggedDay)} kcal`}</dd></div>
                <div><dt>Avg food / day</dt><dd>{summary.details.averageFoodKcalPerLoggedDay === null ? '—' : `${fmt(summary.details.averageFoodKcalPerLoggedDay)} kcal`}</dd></div>
                <div><dt>Avg active / day</dt><dd>{summary.details.averageActiveKcalPerLoggedDay === null ? '—' : `${fmt(summary.details.averageActiveKcalPerLoggedDay)} kcal`}</dd></div>
              </dl>
              <p className="hd-formulas hd-formulas-top">
                Averaged over only the days actually logged {periodPhrase(range)} — missing days are excluded entirely, not counted as zero or as a real low day, so this stays accurate even with sparse logging.
              </p>
            </>
          )}

          {gapBuckets.length > 0 && (
            <p className="hd-missing-banner">
              ⚠ Missing data: {gapBuckets.length} {isDayGrain(range) ? (gapBuckets.length === 1 ? 'day' : 'days') : (gapBuckets.length === 1 ? 'month' : 'months')} with under 1,400 kcal logged this {range === 'all' ? 'all-time view' : range}, excluded from averages.
              {isDayGrain(range) ? ' Click "Mark real" on a highlighted day if it\'s accurate (e.g. sick day).' : ' Click a highlighted month for details.'}
            </p>
          )}
          <div className="hd-table-wrap hd-desktop-only">
            <table className="hd-table">
              <thead>
                <tr>
                  <th className="hd-row-label"> </th>
                  {summary.buckets.map((b) => {
                    const missing = hasGap(b)
                    const clickableMonth = missing && !isDayGrain(range)
                    return (
                      <th
                        key={b.periodStart}
                        className={missing ? 'hd-missing' : ''}
                        onClick={clickableMonth ? () => setModalBucket(b) : undefined}
                      >
                        {b.label}
                        {!b.isComplete && <span className="hd-today-badge">{isDayGrain(range) ? 'TODAY' : 'IN PROGRESS'}</span>}
                        {missing && isDayGrain(range) && <MarkRealButton day={b.periodStart} onMarked={load} />}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {ROW_KEYS.map((key) => (
                  <tr key={key} className={key === 'dailyBalance' || key === 'balance' ? 'hd-row-strong' : ''}>
                    <th className="hd-row-label">{ROW_LABELS[key]}</th>
                    {summary.buckets.map((b) => <td key={b.periodStart} className={hasGap(b) ? 'hd-missing' : ''}><RowCell rowKey={key} bucket={b} /></td>)}
                  </tr>
                ))}
                {!isDayGrain(range) && (
                  <tr>
                    <th className="hd-row-label">Avg weight</th>
                    {summary.buckets.map((b) => <td key={b.periodStart} className={hasGap(b) ? 'hd-missing' : ''}>{b.weightLb === null ? '—' : `${b.weightLb} lb`}</td>)}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="hd-mobile-days">
            {summary.buckets.map((b) => (
              <MobileDayCard key={b.periodStart} bucket={b} range={range} onMarked={load} onOpenModal={setModalBucket} />
            ))}
          </div>
          <p className="hd-note">Balance counts completed {range === 'day' ? 'periods' : 'days'}. The current period is in progress. All calories are kcal.</p>

          {modalBucket && <MonthGapModal bucket={modalBucket} onClose={() => setModalBucket(null)} />}

          <h3 className="hd-details-heading">Details</h3>
          {anyMissing && (
            <p className="hd-affected-note">
              Orange fields below include missing days in their totals and read low as a result. Daily net target, {rangeNounFor(range).toLowerCase()} net budget, and maintenance reference are unaffected{range !== 'day' && ', as are the averages above'}.
            </p>
          )}
          <dl className="hd-details">
            <div><dt>Daily net target</dt><dd>{fmt(summary.details.dailyTargetKcal)} kcal</dd></div>
            <div><dt>Completed net / budget</dt><dd className={anyMissing ? 'hd-affected' : ''}>{fmt(summary.details.completedNetKcal)} / {fmt(summary.details.completedBudgetKcal)} kcal</dd></div>
            <div><dt>Food &middot; completed / incl. today</dt><dd className={anyMissing ? 'hd-affected' : ''}>{fmt(summary.details.foodCompletedKcal)} / {fmt(summary.details.foodInclTodayKcal)} kcal</dd></div>
            <div><dt>Active &middot; completed / incl. today</dt><dd className={anyMissing ? 'hd-affected' : ''}>{fmt(summary.details.activeCompletedKcal)} / {fmt(summary.details.activeInclTodayKcal)} kcal</dd></div>
            <div><dt>{rangeNounFor(range)} net budget</dt><dd>{fmt(summary.details.periodNetBudgetKcal)} kcal</dd></div>
            <div><dt>Net budget left, incl. today</dt><dd className={anyMissing ? 'hd-affected' : ''}>{fmt(summary.details.netBudgetLeftInclTodayKcal)} kcal</dd></div>
            <div><dt>Per remaining day</dt><dd className={anyMissing ? 'hd-affected' : ''}>{summary.details.perRemainingDayKcal === null ? '—' : `${fmt(summary.details.perRemainingDayKcal)} kcal/day`}</dd></div>
            <div><dt>Maintenance reference</dt><dd>{fmt(summary.details.maintenanceKcal)} kcal/day</dd></div>
            <div><dt>Deficit / expected deficit</dt><dd className={anyMissing ? 'hd-affected' : ''}>{fmt(summary.details.deficitKcal)} / {fmt(summary.details.expectedDeficitKcal)} kcal</dd></div>
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
        )
      })()}

      {settings && <SettingsEditor settings={settings} onSaved={setSettings} />}
    </div>
  )
}
