import type { ReactNode } from 'react'
import AppHorizontalHeader from './AppHorizontalHeader'
import './AppShell.css'

interface AppShellProps {
    children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    return (
        <div className="app-shell">
            <a className="skip-link" href="#main-content">
                Skip to content
            </a>

            <AppHorizontalHeader />

            <main
                id="main-content"
                className="app-main"
                tabIndex={-1}
            >
                {children}
            </main>
        </div>
    )
}