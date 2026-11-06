import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Payee } from '../../../api/types'
import {
    newRecipientSchema,
    type NewRecipient,
    type TransferRecipientSelection,
} from '../recipient.schema'
import './RecipientStep.css'

interface RecipientStepProps {
    payees: Payee[]
    isPending: boolean
    isError: boolean
    isFetching: boolean
    onRetry: () => void
    onCancel: () => void
    onContinue: (selection: TransferRecipientSelection) => void
}

export default function RecipientStep({
                                          payees,
                                          isPending,
                                          isError,
                                          isFetching,
                                          onRetry,
                                          onCancel,
                                          onContinue,
                                      }: RecipientStepProps) {
    const [search, setSearch] = useState('')
    const [selectedPayeeId, setSelectedPayeeId] = useState('')
    const [isNewRecipient, setIsNewRecipient] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewRecipient>({
        resolver: zodResolver(newRecipientSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            accountNumber: '',
            bank: '',
        },
    })

    const searchTerm = search.trim().toLowerCase()

    const visiblePayees = payees.filter((payee) =>
        `${payee.name} ${payee.bank} ${payee.accountNumberMasked}`
            .toLowerCase()
            .includes(searchTerm),
    )

    const selectedPayee = payees.find(
        (payee) => payee.id === selectedPayeeId,
    )

    return (
        <div className="recipient-step">
            <h3>Who are you sending to?</h3>

            <label htmlFor="payee-search">Search payees</label>
            <input
                id="payee-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or bank"
            />

            {isPending ? (
                <p role="status">Loading payees…</p>
            ) : isError ? (
                <div>
                    <p role="alert">We couldn't load your payees.</p>
                    <button
                        type="button"
                        onClick={onRetry}
                        disabled={isFetching}
                    >
                        {isFetching ? 'Retrying…' : 'Retry'}
                    </button>
                </div>
            ) : payees.length === 0 ? (
                <p>No saved payees. Send to someone new below.</p>
            ) : (
                <>
                    <fieldset className="payee-options">
                        <legend>Saved payees</legend>

                        {visiblePayees.map((payee) => (
                            <label
                                key={payee.id}
                                className="payee-option"
                            >
                                <input
                                    type="radio"
                                    name="saved-payee"
                                    value={payee.id}
                                    checked={
                                        !isNewRecipient &&
                                        selectedPayeeId === payee.id
                                    }
                                    onChange={() => {
                                        setSelectedPayeeId(payee.id)
                                        setIsNewRecipient(false)
                                    }}
                                />

                                <span
                                    className="payee-initials"
                                    aria-hidden="true"
                                >
                                    {payee.initials}
                                </span>

                                <span className="payee-description">
                                    <strong>{payee.name}</strong>
                                    <span>
                                        {payee.bank} ·{' '}
                                        {payee.accountNumberMasked}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </fieldset>

                    {visiblePayees.length === 0 && (
                        <p role="status">No payees match your search.</p>
                    )}
                </>
            )}

            <button
                className="new-recipient-toggle"
                type="button"
                aria-expanded={isNewRecipient}
                aria-controls="new-recipient-fields"
                onClick={() => setIsNewRecipient((current) => !current)}
            >
                {isNewRecipient ? '−' : '+'} Send to someone new
            </button>

            <form
                noValidate
                onSubmit={handleSubmit((recipient) =>
                    onContinue({ kind: 'new', recipient }),
                )}
            >
                <div
                    id="new-recipient-fields"
                    className="new-recipient-fields"
                    hidden={!isNewRecipient}
                >
                    <div className="recipient-field">
                        <label htmlFor="recipient-name">
                            Recipient name
                        </label>
                        <input
                            id="recipient-name"
                            autoComplete="off"
                            disabled={!isNewRecipient}
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={
                                errors.name ? 'recipient-name-error' : undefined
                            }
                            {...register('name')}
                        />
                        {errors.name && (
                            <p
                                id="recipient-name-error"
                                className="recipient-error"
                            >
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="recipient-field">
                        <label htmlFor="recipient-account">
                            Account number
                        </label>
                        <input
                            id="recipient-account"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            disabled={!isNewRecipient}
                            aria-invalid={Boolean(errors.accountNumber)}
                            aria-describedby={
                                errors.accountNumber
                                    ? 'recipient-account-error'
                                    : undefined
                            }
                            {...register('accountNumber')}
                        />
                        {errors.accountNumber && (
                            <p
                                id="recipient-account-error"
                                className="recipient-error"
                            >
                                {errors.accountNumber.message}
                            </p>
                        )}
                    </div>

                    <div className="recipient-field">
                        <label htmlFor="recipient-bank">Bank</label>
                        <select
                            id="recipient-bank"
                            disabled={!isNewRecipient}
                            aria-invalid={Boolean(errors.bank)}
                            aria-describedby={
                                errors.bank ? 'recipient-bank-error' : undefined
                            }
                            {...register('bank')}
                        >
                            <option value="">Select a bank</option>
                            <option value="DBS">DBS</option>
                            <option value="POSB">POSB</option>
                            <option value="OCBC">OCBC</option>
                            <option value="UOB">UOB</option>
                        </select>
                        {errors.bank && (
                            <p
                                id="recipient-bank-error"
                                className="recipient-error"
                            >
                                {errors.bank.message}
                            </p>
                        )}
                    </div>
                </div>

                <footer className="recipient-actions">
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>

                    {isNewRecipient ? (
                        <button
                            className="recipient-continue"
                            type="submit"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            className="recipient-continue"
                            type="button"
                            disabled={
                                !selectedPayee || isPending || isError
                            }
                            onClick={() => {
                                if (selectedPayee) {
                                    onContinue({
                                        kind: 'saved',
                                        payee: selectedPayee,
                                    })
                                }
                            }}
                        >
                            Continue
                        </button>
                    )}
                </footer>
            </form>
        </div>
    )
}