import './AppNavigation.css'

const navigationItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'cards', label: 'Cards' },
    { id: 'payments', label: 'Payments' },
    { id: 'insights', label: 'Insights' },
] as const

export default function AppNavigation() {
    return (
        <nav className="app-navigation" aria-label="Main navigation">
            <ul className="app-navigation-list">
                {navigationItems.map((item) => (
                    <li key={item.id}>
                        {item.id === 'overview' ? (
                            <a
                                className="app-navigation-link"
                                href={import.meta.env.BASE_URL}
                                aria-current="page"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <button
                                className="app-navigation-link"
                                type="button"
                                disabled
                            >
                                {item.label}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}