import type { Transaction } from '../../../api/types'
import {
    formatMoney,
    formatShortDate,
} from '../../../lib/format'
import './TransactionList.css'

interface TransactionListProps {
    transactions: Transaction[]
}

export default function TransactionList({
                                            transactions,
                                        }: TransactionListProps) {
    return (
        <ul className="transaction-list">
            {transactions.map((transaction) => {
                const isIncoming = transaction.direction === 'in'

                const signedAmount = isIncoming
                    ? `+${formatMoney(transaction.amount)}`
                    : formatMoney(-transaction.amount)

                return (
                    <li
                        key={transaction.id}
                        className="transaction-row"
                    >
                        <div className="transaction-details">
                            <p className="transaction-description">
                                {transaction.description}
                            </p>

                            <div className="transaction-meta">
                                <span className="transaction-category">
                                    {transaction.category}
                                </span>

                                <span aria-hidden="true">·</span>

                                <time dateTime={transaction.date}>
                                    {formatShortDate(transaction.date)}
                                </time>
                            </div>
                        </div>

                        <div className="transaction-values">
                            <p
                                className={
                                    isIncoming
                                        ? 'transaction-amount transaction-amount-in'
                                        : 'transaction-amount'
                                }
                            >
                                {signedAmount}
                            </p>

                            {transaction.status === 'pending' && (
                                <span className="transaction-pending">
                                    Pending
                                </span>
                            )}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}