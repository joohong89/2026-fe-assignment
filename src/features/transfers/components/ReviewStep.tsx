import { useEffect, useRef } from 'react'
import type { Account } from '../../../api/types'
import { formatMoney } from '../../../lib/format'
import type { AmountValues } from '../amount.schema'
import type { TransferRecipientSelection } from '../recipient.schema'
import './TransferResult.css'

interface ReviewStepProps {
    account: Account | undefined
    recipient: TransferRecipientSelection
    details: AmountValues
    isSubmitting: boolean
    error: string | null
    onBack: () => void
    onConfirm: () => void
}

export default function ReviewStep({
                                       account,
                                       recipient,
                                       details,
                                       isSubmitting,
                                       error,
                                       onBack,
                                       onConfirm,
                                   }: ReviewStepProps) {
    const headingRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        headingRef.current?.focus()
    }, [])

    const recipientDetails = recipient.kind === 'saved'
        ? {
            name: recipient.payee.name,
            bank: recipient.payee.bank,
            maskedNumber: recipient.payee.accountNumberMasked,
        }
        : {
            name: recipient.recipient.name,
            bank: recipient.recipient.bank,
            maskedNumber:
                `•••• ${recipient.recipient.accountNumber.slice(-4)}`,
        }

    const amount = Number(details.amount)

    return (
        <div className="transfer-result">
            <h3 ref={headingRef} tabIndex={-1}>
                Check the details
            </h3>

            <dl className="transfer-review-details">
                <div>
                    <dt>From</dt>
                    <dd>
                        {account
                            ? `${account.name} · ${account.maskedNumber}`
                            : 'Account unavailable'}
                    </dd>
                </div>

                <div>
                    <dt>To</dt>
                    <dd>
                        {recipientDetails.name}
                        <span>
                            {recipientDetails.bank} ·{' '}
                            {recipientDetails.maskedNumber}
                        </span>
                    </dd>
                </div>

                <div>
                    <dt>Amount</dt>
                    <dd>{formatMoney(amount)}</dd>
                </div>

                <div>
                    <dt>Fee</dt>
                    <dd>{formatMoney(0)}</dd>
                </div>

                <div>
                    <dt>Note</dt>
                    <dd>{details.note || '—'}</dd>
                </div>

                <div className="transfer-review-total">
                    <dt>Total</dt>
                    <dd>{formatMoney(amount)}</dd>
                </div>
            </dl>

            <p>Usually arrives in minutes.</p>

            {error && (
                <p className="transfer-submit-error" role="alert">
                    {error}
                </p>
            )}

            <footer className="transfer-result-actions">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    Back
                </button>

                <button
                    className="transfer-primary"
                    type="button"
                    onClick={onConfirm}
                    disabled={isSubmitting || !account}
                >
                    {isSubmitting ? 'Sending…' : 'Confirm transfer'}
                </button>
            </footer>
        </div>
    )
}