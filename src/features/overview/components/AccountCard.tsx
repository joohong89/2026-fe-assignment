import type { Account } from '../../../api/types'
import { formatMoney } from '../../../lib/format'
import './AccountCard.css'

interface AccountCardProps {
    account: Account
}

const accountTypeLabels = {
    checking: 'Checking',
    savings: 'Savings',
    credit: 'Credit',
} satisfies Record<Account['type'], string>

export default function AccountCard({ account }: AccountCardProps) {
    const isCredit = account.type === 'credit'

    return (
        <article
            className="overview-panel account-card"
            aria-labelledby={`account-${account.id}-heading`}
        >
            <div className="account-card-header">
                <span className="account-card-type">
                    {accountTypeLabels[account.type]}
                </span>

                <span className="account-card-number">
                    <span className="account-card-sr-only">
                        Account ending in{' '}
                    </span>
                    {account.maskedNumber}
                </span>
            </div>

            <h3 id={`account-${account.id}-heading`}>
                {account.name}
            </h3>

            <p className="account-card-balance">
                {formatMoney(account.balance)}
            </p>

            <p className="account-card-caption">
                {isCredit ? 'Amount due' : 'Available balance'}
            </p>
        </article>
    )
}