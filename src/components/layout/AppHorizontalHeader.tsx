import AppNavigation from './AppNavigation'
import './AppHorizontalHeader.css'

export default function AppHorizontalHeader() {
    return (
        <header className="app-horizontal-header">
            <div className="app-horizontal-header-inner">
                <a
                    className="app-brand"
                    href={import.meta.env.BASE_URL}
                    aria-label="Meridian home"
                >
          <span className="app-brand-mark" aria-hidden="true">
            M
          </span>

                    <span>Meridian</span>
                </a>

                <AppNavigation />

                <div className="app-header-actions">
          <span className="app-avatar" aria-label="Customer initials AC">
            AC
          </span>
                </div>
            </div>
        </header>
    )
}