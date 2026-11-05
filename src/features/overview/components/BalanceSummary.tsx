import { formatMoney } from '../../../lib/format'
import './BalanceSummary.css'

interface BalanceSummaryProps {
    totalAvailable: number
    depositAccountCount: number
}

export default function BalanceSummary({
                                           totalAvailable,
                                           depositAccountCount,
                                       }: BalanceSummaryProps) {
    return (
        <div className="balance-summary">
            <p className="balance-summary-amount">
                {formatMoney(totalAvailable)}
            </p>

            <p className="balance-summary-caption">
                Across {depositAccountCount} deposit{' '}
                {depositAccountCount === 1 ? 'account' : 'accounts'}
            </p>
        </div>
    )
}