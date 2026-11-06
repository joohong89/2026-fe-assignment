import './OverviewPage.css'
import { useCustomer } from '../customer/customer.queries'
import WelcomeHeader from './components/WelcomeHeader'
import { useAccounts } from '../accounts/accounts.queries'
import BalanceSummary from './components/BalanceSummary'
import AccountCard from './components/AccountCard'
import DailyLimitCard from './components/DailyLimitCard'
import { useTransactions } from '../transactions/transactions.queries'
import TransactionList from './components/TransactionList'
import { useRef, useState } from 'react'
import TransferDialog from '../transfers/components/TransferDialog'
import { usePayees } from '../payees/payees.queries'
import { useCreateTransfer } from '../transfers/transfers.mutations'

export default function OverviewPage() {
    const customer = useCustomer()
    const accounts = useAccounts()
    const transactions = useTransactions(8)
    const [transactionSearch, setTransactionSearch] = useState('')
    const [isTransferOpen, setIsTransferOpen] = useState(false)
    const transferButtonRef = useRef<HTMLButtonElement>(null)
    const payees = usePayees(isTransferOpen)
    const transfer = useCreateTransfer()

    function handleTransferClose() {
        setIsTransferOpen(false)
        transferButtonRef.current?.focus()
    }
    const searchTerm = transactionSearch.trim().toLowerCase()

    const filteredTransactions = (transactions.data ?? []).filter(
        (transaction) =>
            transaction.description.toLowerCase().includes(searchTerm) ||
            transaction.category.toLowerCase().includes(searchTerm),
    )

    const depositAccounts = accounts.data?.filter(
        (account) => account.type !== 'credit',
    ) ?? []

    const totalAvailable = depositAccounts.reduce(
        (totalCents, account) =>
            totalCents + Math.round(account.balance * 100),
        0,
    ) / 100


    return (
        <div className="overview">
            {customer.isPending ? (
                <header className="welcome-header" aria-busy="true">
                    <h1>Welcome to Meridian</h1>
                    <p role="status">Loading your profile…</p>
                </header>
            ) : customer.isError ? (
                <header className="welcome-header">
                    <h1>Welcome to Meridian</h1>

                    <p role="alert">
                        We couldn’t load your profile.
                    </p>

                    <button
                        type="button"
                        onClick={() => void customer.refetch()}
                        disabled={customer.isFetching}
                    >
                        {customer.isFetching ? 'Retrying…' : 'Try again'}
                    </button>
                </header>
            ) : (
                <WelcomeHeader firstName={customer.data.firstName} />
            )}

            <div className="overview-grid">
                <section
                    className="overview-panel overview-balance"
                    aria-labelledby="balance-heading"
                    aria-busy={accounts.isPending}
                >
                    <div className="balance-heading-row">
                        <h2 id="balance-heading">Total available</h2>

                        <button
                            ref={transferButtonRef}
                            className="new-transfer-button"
                            type="button"
                            aria-haspopup="dialog"

                            onClick={() => {
                                transfer.reset()
                                setIsTransferOpen(true)
                            }}
                        >
                            <span aria-hidden="true">+</span>
                            New transfer
                        </button>
                    </div>

                    {accounts.isPending ? (
                        <div role="status" aria-label="Loading balances">
                            <div
                                className="balance-loading"
                                aria-hidden="true"
                            >
                                <span className="balance-loading-amount" />
                                <span className="balance-loading-caption" />
                            </div>
                        </div>
                    ) : accounts.isError ? (
                        <div className="balance-error">
                            <p role="alert">
                                We couldn't load your dashboard.
                            </p>

                            <button
                                type="button"
                                onClick={() => void accounts.refetch()}
                                disabled={accounts.isFetching}
                            >
                                {accounts.isFetching ? 'Retrying…' : 'Retry'}
                            </button>
                        </div>
                    ) : (
                        <BalanceSummary
                            totalAvailable={totalAvailable}
                            depositAccountCount={depositAccounts.length}
                        />
                    )}
                </section>

                <section
                    className="overview-accounts"
                    aria-label="Accounts"
                    aria-busy={accounts.isPending}
                >
                    {accounts.isPending ? (
                        <div
                            className="accounts-loading"
                            role="status"
                            aria-label="Loading accounts"
                        >
                            {[1, 2, 3].map((placeholder) => (
                                <div
                                    key={placeholder}
                                    className="overview-panel account-card account-card-skeleton"
                                    aria-hidden="true"
                                >
                                    <span className="account-skeleton-short" />
                                    <span className="account-skeleton-name" />
                                    <span className="account-skeleton-balance" />
                                    <span className="account-skeleton-short" />
                                </div>
                            ))}
                        </div>
                    ) : accounts.isError ? (
                        <div className="overview-panel accounts-message">
                            <p role="alert">
                                We couldn't load your accounts.
                            </p>

                            <button
                                type="button"
                                onClick={() => void accounts.refetch()}
                                disabled={accounts.isFetching}
                            >
                                {accounts.isFetching ? 'Retrying…' : 'Retry'}
                            </button>
                        </div>
                    ) : accounts.data.length === 0 ? (
                        <div className="overview-panel accounts-message">
                            <p>No accounts to display.</p>
                        </div>
                    ) : (
                        accounts.data.map((account) => (
                            <AccountCard
                                key={account.id}
                                account={account}
                            />
                        ))
                    )}
                </section>

                <section
                    className="overview-panel overview-limit"
                    aria-labelledby="limit-heading"
                    aria-busy={customer.isPending}
                >
                    <h2 id="limit-heading">Daily limit</h2>

                    {customer.isPending ? (
                        <div
                            className="daily-limit-loading"
                            role="status"
                            aria-label="Loading daily limit"
                        >
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                        </div>
                    ) : customer.isError ? (
                        <div className="daily-limit-error">
                            <p role="alert">
                                We couldn't load your daily limit.
                            </p>

                            <button
                                type="button"
                                onClick={() => void customer.refetch()}
                                disabled={customer.isFetching}
                            >
                                {customer.isFetching ? 'Retrying…' : 'Retry'}
                            </button>
                        </div>
                    ) : (
                        <DailyLimitCard
                            limit={customer.data.dailyTransferLimit}
                            used={customer.data.transferredToday}
                        />
                    )}
                </section>

                <section
                    className="overview-panel overview-transactions"
                    aria-labelledby="transactions-heading"
                    aria-busy={transactions.isPending}
                >
                    <h2 id="transactions-heading">
                        Recent transactions
                    </h2>

                    {transactions.isPending ? (
                        <div
                            className="transactions-loading"
                            role="status"
                            aria-label="Loading recent transactions"
                        >
                            {Array.from({ length: 8 }, (_, index) => (
                                <div
                                    key={index}
                                    className="transaction-skeleton-row"
                                    aria-hidden="true"
                                >
                                    <span />
                                    <span />
                                </div>
                            ))}
                        </div>
                    ) : transactions.isError ? (
                        <div className="transactions-message">
                            <p role="alert">
                                We couldn't load your dashboard.
                            </p>

                            <button
                                type="button"
                                onClick={() => void transactions.refetch()}
                                disabled={transactions.isFetching}
                            >
                                {transactions.isFetching ? 'Retrying…' : 'Retry'}
                            </button>
                        </div>
                    ) : transactions.data.length === 0 ? (
                        <div className="transactions-message">
                            <p>No transactions yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="transaction-search">
                                <label htmlFor="transaction-search">
                                    Search transactions
                                </label>

                                <div className="transaction-search-controls">
                                    <input
                                        id="transaction-search"
                                        type="search"
                                        placeholder="Search description or category"
                                        value={transactionSearch}
                                        onChange={(event) =>
                                            setTransactionSearch(event.target.value)
                                        }
                                        aria-describedby="transaction-search-count"
                                    />
                                </div>

                                <p
                                    id="transaction-search-count"
                                    className="transaction-search-count"
                                    role="status"
                                >
                                    {searchTerm
                                        ? `${filteredTransactions.length} of ${transactions.data.length} recent transactions match`
                                        : `Showing ${transactions.data.length} recent transactions`}
                                </p>
                            </div>

                            {filteredTransactions.length === 0 ? (
                                <div className="transactions-message">
                                    <p>No transactions match your search.</p>
                                </div>
                            ) : (
                                <TransactionList transactions={filteredTransactions} />
                            )}
                        </>
                    )}
                </section>
            </div>

            {isTransferOpen && (
                <TransferDialog
                    payees={payees.data ?? []}
                    payeesPending={payees.isPending}
                    payeesError={payees.isError}
                    payeesFetching={payees.isFetching}
                    accounts={accounts.data ?? []}
                    remainingDailyLimit={
                        customer.data
                            ? Math.max(
                                0,
                                customer.data.dailyTransferLimit -
                                customer.data.transferredToday,
                            )
                            : 0
                    }
                    transferDataPending={accounts.isPending || customer.isPending}
                    transferDataError={accounts.isError || customer.isError}
                    transferDataFetching={accounts.isFetching || customer.isFetching}
                    onSubmitTransfer={(request) => transfer.mutateAsync(request)}
                    isSubmitting={transfer.isPending}
                    submitError={transfer.error?.message ?? null}
                    onResetSubmit={transfer.reset}
                    onRetryTransferData={() => {
                        void accounts.refetch()
                        void customer.refetch()
                    }}
                    onRetryPayees={() => void payees.refetch()}
                    onClose={handleTransferClose}
                />
            )}
        </div>

    )
}