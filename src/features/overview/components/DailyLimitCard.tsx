import { formatMoney } from '../../../lib/format'
import './DailyLimitCard.css'

interface DailyLimitCardProps {
    limit: number
    used: number
}

export default function DailyLimitCard({
                                           limit,
                                           used,
                                       }: DailyLimitCardProps) {
    const remaining = Math.max(0, limit - used)
    const progressValue = Math.min(Math.max(used, 0), limit)

    return (
        <div className="daily-limit-card">
            <p className="daily-limit-remaining">
                {formatMoney(remaining)}
            </p>

            <p className="daily-limit-caption">
                Remaining today
            </p>

            {limit > 0 && (
                <progress
                    className="daily-limit-progress"
                    value={progressValue}
                    max={limit}
                    aria-label="Daily transfer limit used"
                    aria-valuetext={`${formatMoney(used)} used out of ${formatMoney(limit)}`}
                />
            )}

            <dl className="daily-limit-details">
                <div>
                    <dt>Used today</dt>
                    <dd>{formatMoney(used)}</dd>
                </div>

                <div>
                    <dt>Daily limit</dt>
                    <dd>{formatMoney(limit)}</dd>
                </div>
            </dl>

            <p className="daily-limit-note">
                Resets daily. Applies to all transfers.
            </p>
        </div>
    )
}