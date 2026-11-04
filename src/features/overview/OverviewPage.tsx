import './OverviewPage.css'

export default function OverviewPage() {
    return (
        <div className="overview">
            <header className="overview-heading">
                <h1>Good evening, Ava</h1>
                <p>Your accounts at a glance</p>
            </header>

            <div className="overview-grid">
                <section
                    className="overview-panel overview-balance"
                    aria-labelledby="balance-heading"
                >
                    <h2 id="balance-heading">Total available</h2>
                    <p>Balance summary goes here</p>
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