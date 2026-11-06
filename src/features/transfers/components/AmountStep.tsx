import { useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Account } from '../../../api/types'
import { formatMoney } from '../../../lib/format'
import {
    createAmountSchema,
    type AmountValues,
} from '../amount.schema'
import './AmountStep.css'

interface AmountStepProps {
    accounts: Account[]
    remainingDailyLimit: number
    isActive: boolean
    onBack: () => void
    onContinue: (values: AmountValues) => void
}

export default function AmountStep({
                                       accounts,
                                       remainingDailyLimit,
                                       isActive,
                                       onBack,
                                       onContinue,
                                   }: AmountStepProps) {
    const headingRef = useRef<HTMLHeadingElement>(null)

    const depositAccounts = accounts.filter(
        (account) => account.type !== 'credit',
    )

    const {
        register,
        control,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<AmountValues>({
        resolver: zodResolver(
            createAmountSchema(accounts, remainingDailyLimit),
        ),
        mode: 'onBlur',
        defaultValues: {
            fromAccountId: depositAccounts[0]?.id ?? '',
            amount: '',
            note: '',
        },
    })

    const fromAccountId = useWatch({
        control,
        name: 'fromAccountId',
    })

    const note = useWatch({
        control,
        name: 'note',
    })

    const selectedAccount = depositAccounts.find(
        (account) => account.id === fromAccountId,
    )

    const accountField = register('fromAccountId')

    useEffect(() => {
        if (isActive) {
            headingRef.current?.focus()
        }
    }, [isActive])

    return (
        <form
            className="amount-step"
            noValidate
            onSubmit={handleSubmit(onContinue)}
        >
            <h3 ref={headingRef} tabIndex={-1}>
                How much?
            </h3>

            <div className="amount-field">
                <label htmlFor="transfer-from-account">
                    From account
                </label>

                <select
                    id="transfer-from-account"
                    {...accountField}
                    onChange={(event) => {
                        void accountField.onChange(event)

                        if (errors.amount) {
                            void trigger('amount')
                        }
                    }}
                    aria-invalid={Boolean(errors.fromAccountId)}
                    aria-describedby={
                        errors.fromAccountId
                            ? 'transfer-account-error'
                            : undefined
                    }
                >
                    <option value="">Select an account</option>

                    {depositAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name} · {account.maskedNumber}
                        </option>
                    ))}
                </select>

                {errors.fromAccountId && (
                    <p
                        id="transfer-account-error"
                        className="amount-error"
                    >
                        {errors.fromAccountId.message}
                    </p>
                )}
            </div>

            <dl className="amount-availability">
                <div>
                    <dt>Available balance</dt>
                    <dd>
                        {selectedAccount
                            ? formatMoney(selectedAccount.balance)
                            : 'Select an account'}
                    </dd>
                </div>

                <div>
                    <dt>Remaining daily limit</dt>
                    <dd>{formatMoney(remainingDailyLimit)}</dd>
                </div>
            </dl>

            <div className="amount-field">
                <label htmlFor="transfer-amount">
                    Amount (SGD)
                </label>

                <input
                    id="transfer-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    aria-invalid={Boolean(errors.amount)}
                    aria-describedby={
                        errors.amount
                            ? 'transfer-amount-error'
                            : undefined
                    }
                    {...register('amount')}
                />

                {errors.amount && (
                    <p
                        id="transfer-amount-error"
                        className="amount-error"
                    >
                        {errors.amount.message}
                    </p>
                )}
            </div>

            <div
                className="amount-shortcuts"
                role="group"
                aria-label="Quick amounts"
            >
                {[50, 100, 250, 500].map((amount) => (
                    <button
                        key={amount}
                        type="button"
                        aria-label={`Set amount to ${formatMoney(amount)}`}
                        onClick={() =>
                            setValue('amount', String(amount), {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                        }
                    >
                        {amount}
                    </button>
                ))}
            </div>

            <div className="amount-field">
                <label htmlFor="transfer-note">
                    Note (optional)
                </label>

                <textarea
                    id="transfer-note"
                    rows={3}
                    aria-invalid={Boolean(errors.note)}
                    aria-describedby={
                        errors.note
                            ? 'transfer-note-count transfer-note-error'
                            : 'transfer-note-count'
                    }
                    {...register('note')}
                />

                <span
                    id="transfer-note-count"
                    className="amount-note-count"
                >
                    {note.length}/50 characters
                </span>

                {errors.note && (
                    <p
                        id="transfer-note-error"
                        className="amount-error"
                    >
                        {errors.note.message}
                    </p>
                )}
            </div>

            {depositAccounts.length === 0 && (
                <p role="alert">
                    No checking or savings accounts are available.
                </p>
            )}

            <footer className="amount-actions">
                <button type="button" onClick={onBack}>
                    Back
                </button>

                <button
                    className="amount-continue"
                    type="submit"
                    disabled={depositAccounts.length === 0}
                >
                    Continue
                </button>
            </footer>
        </form>
    )
}