import './OverviewPage.css'
import { useCustomer } from '../customer/customer.queries'
import WelcomeHeader from './components/WelcomeHeader'
import { useAccounts } from '../accounts/accounts.queries'
import BalanceSummary from './components/BalanceSummary'

export default function OverviewPage() {
    const customer = useCustomer()
    const accounts = useAccounts()

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
                    <h2 id="balance-heading">Total available</h2>

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
                >
                    <article className="overview-panel">
                        <h2>Checking account</h2>
                        <p>Account balance</p>
                    </article>

                    <article className="overview-panel">
                        <h2>Savings account</h2>
                        <p>Account balance</p>
                    </article>

                    <article className="overview-panel">
                        <h2>Credit account</h2>
                        <p>Amount due</p>
                    </article>
                </section>

                <section
                    className="overview-panel overview-limit"
                    aria-labelledby="limit-heading"
                >
                    <h2 id="limit-heading">Daily limit</h2>
                    <p>Remaining transfer limit goes here</p>
                </section>

                <section
                    className="overview-panel overview-transactions"
                    aria-labelledby="transactions-heading"
                >
                    <h2 id="transactions-heading">
                        Recent transactions
                    </h2>
                    <p>Search and transaction list go here</p>
                </section>
            </div>
        </div>
    )
}