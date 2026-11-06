import './TransferDialog.css'
import { useEffect, useRef, useState } from 'react'
import type { Payee } from '../../../api/types'
import type { TransferRecipientSelection } from '../recipient.schema'
import RecipientStep from './RecipientStep'
import type { Account } from '../../../api/types'
import type { AmountValues } from '../amount.schema'
import { formatMoney } from '../../../lib/format'
import AmountStep from './AmountStep'
import type { CreateTransferRequest, TransferResponse } from '../../../api/types'
import { createAmountSchema } from '../amount.schema'
import ReviewStep from './ReviewStep'


interface TransferDialogProps {
    payees: Payee[]
    payeesPending: boolean
    payeesError: boolean
    payeesFetching: boolean
    onRetryPayees: () => void
    onClose: () => void
    accounts: Account[]
    remainingDailyLimit: number
    transferDataPending: boolean
    transferDataError: boolean
    transferDataFetching: boolean
    onRetryTransferData: () => void
    onSubmitTransfer: (
        request: CreateTransferRequest,
    ) => Promise<TransferResponse>
    isSubmitting: boolean
    submitError: string | null
    onResetSubmit: () => void
}

export default function TransferDialog({
                                           payees,
                                           payeesPending,
                                           payeesError,
                                           payeesFetching,
                                           onRetryPayees,
                                           onClose,
                                           accounts,
                                           remainingDailyLimit,
                                           transferDataPending,
                                           transferDataError,
                                           transferDataFetching,
                                           onRetryTransferData,
                                           onSubmitTransfer,
                                           isSubmitting,
                                           submitError,
                                           onResetSubmit,
                                       }: TransferDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [step, setStep] = useState<'recipient' | 'amount' | 'review' | 'success'>('recipient')

    const [amountDetails, setAmountDetails] = useState<AmountValues | null>(null)

    const [recipient, setRecipient] = useState<TransferRecipientSelection | null>(null)

    const [transferResult, setTransferResult] =
        useState<TransferResponse | null>(null)

    const [reviewError, setReviewError] = useState<string | null>(null)

    const submittingRef = useRef(false)
    useEffect(() => {
        const dialog = dialogRef.current

        if (!dialog) return

        const previouslyFocused = document.activeElement
        const previousOverflow = document.body.style.overflow

        if (!dialog.open) {
            dialog.showModal()
        }

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow

            if (
                previouslyFocused instanceof HTMLElement &&
                previouslyFocused.isConnected
            ) {
                previouslyFocused.focus()
            }
        }
    }, [])

    async function handleConfirm() {
        if (
            submittingRef.current ||
            isSubmitting ||
            transferResult ||
            !recipient ||
            !amountDetails
        ) {
            return
        }

        setReviewError(null)

        if (transferDataPending || transferDataError) {
            setReviewError(
                'Transfer details are unavailable. Go back and retry.',
            )
            return
        }

        // Reuse the same rules with the latest account and limit data.
        const validation = createAmountSchema(
            accounts,
            remainingDailyLimit,
        ).safeParse(amountDetails)

        if (!validation.success) {
            setReviewError(
                validation.error.issues[0]?.message ??
                'Check your transfer details.',
            )
            return
        }

        const values = validation.data

        const request: CreateTransferRequest = {
            fromAccountId: values.fromAccountId,
            amount: Number(values.amount),
            ...(values.note ? { note: values.note } : {}),
            ...(recipient.kind === 'saved'
                ? { payeeId: recipient.payee.id }
                : { recipient: recipient.recipient }),
        }

        submittingRef.current = true

        try {
            const result = await onSubmitTransfer(request)

            setTransferResult(result)
            setStep('success')
        } catch {
            // The mutation supplies submitError.
            // Stay on Review and preserve the entered details.
        } finally {
            submittingRef.current = false
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="transfer-dialog"
            aria-labelledby="transfer-dialog-title"
            onClose={onClose}
            onCancel={(event) => {
                if (isSubmitting || submittingRef.current) {
                    event.preventDefault()
                }
            }}
        >
            <div className="transfer-dialog-content">
                <header className="transfer-dialog-header">
                    <h2 id="transfer-dialog-title">
                        New transfer
                    </h2>

                    <button
                        className="transfer-dialog-close"
                        type="button"
                        aria-label="Close transfer"
                        autoFocus
                        disabled={isSubmitting}
                        onClick={() => {
                            if (!submittingRef.current) {
                                dialogRef.current?.close()
                            }
                        }}
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </header>
                {step !== 'success' && (
                    <ol className="transfer-steps" aria-label="Transfer steps">
                        <li aria-current={step === 'recipient' ? 'step' : undefined}>
                            <span aria-hidden="true">1</span>
                            Recipient
                        </li>

                        <li aria-current={step === 'amount' ? 'step' : undefined}>
                            <span aria-hidden="true">2</span>
                            Amount
                        </li>

                        <li aria-current={step === 'review' ? 'step' : undefined}>
                            <span aria-hidden="true">3</span>
                            Review
                        </li>
                    </ol>
                )}

                <div className="transfer-dialog-body">
                    <div hidden={step !== 'recipient'}>
                        <RecipientStep
                            payees={payees}
                            isPending={payeesPending}
                            isError={payeesError}
                            isFetching={payeesFetching}
                            onRetry={onRetryPayees}
                            onCancel={() => dialogRef.current?.close()}
                            onContinue={(selection) => {
                                setRecipient(selection)
                                setStep('amount')
                            }}
                        />
                    </div>

                    {recipient && (
                        <div hidden={step !== 'amount'}>
                            {transferDataPending ? (
                                <p role="status">Loading transfer details…</p>
                            ) : transferDataError ? (
                                <div>
                                    <p role="alert">
                                        We couldn't load your transfer details.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={onRetryTransferData}
                                        disabled={transferDataFetching}
                                    >
                                        {transferDataFetching ? 'Retrying…' : 'Retry'}
                                    </button>
                                </div>
                            ) : (
                                <AmountStep
                                    accounts={accounts}
                                    remainingDailyLimit={remainingDailyLimit}
                                    isActive={step === 'amount'}
                                    onBack={() => {
                                        setStep('recipient')

                                        requestAnimationFrame(() => {
                                            dialogRef.current
                                                ?.querySelector<HTMLInputElement>(
                                                    '#payee-search',
                                                )
                                                ?.focus()
                                        })
                                    }}
                                    onContinue={(values) => {
                                        setAmountDetails(values)
                                        setStep('review')
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {step === 'review' && recipient && amountDetails && (
                        <ReviewStep
                            account={accounts.find(
                                (account) => account.id === amountDetails.fromAccountId,
                            )}
                            recipient={recipient}
                            details={amountDetails}
                            isSubmitting={isSubmitting}
                            error={reviewError ?? submitError}
                            onBack={() => {
                                setReviewError(null)
                                onResetSubmit()
                                setStep('amount')
                            }}
                            onConfirm={() => void handleConfirm()}
                        />
                    )}

                    {step === 'success' && transferResult && (
                        <div className="transfer-result">
                            <div role="status" aria-live="polite" aria-atomic="true">
                                <h3
                                    tabIndex={-1}
                                    ref={(element) => element?.focus()}
                                >
                                    Transfer sent
                                </h3>

                                <p>
                                    {formatMoney(transferResult.transfer.amount)} sent to{' '}
                                    {transferResult.transfer.recipient.name}.
                                </p>

                                <p>The money should arrive within minutes.</p>
                            </div>

                            <dl className="transfer-review-details">
                                <div>
                                    <dt>Reference</dt>
                                    <dd>{transferResult.transfer.reference}</dd>
                                </div>
                            </dl>

                            <footer className="transfer-result-actions">
                                <button
                                    className="transfer-primary"
                                    type="button"
                                    onClick={() => dialogRef.current?.close()}
                                >
                                    Back to dashboard
                                </button>
                            </footer>
                        </div>
                    )}
                </div>
            </div>
        </dialog>
    )
}