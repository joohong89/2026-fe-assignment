import { useSegment } from '../../providers/SegmentProvider'
import { useTheme } from '../../providers/ThemeProvider'
import './AppearanceControls.css'

export default function AppearanceControls() {
    const { segment, setSegment } = useSegment()
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="appearance-controls">
            <div className="segment-switch" aria-label="Customer segment">
                <button
                    className="segment-switch-button"
                    type="button"
                    aria-pressed={segment === 'retail'}
                    onClick={() => setSegment('retail')}
                >
                    Retail
                </button>
                <button
                    className="segment-switch-button"
                    type="button"
                    aria-pressed={segment === 'premium'}
                    onClick={() => setSegment('premium')}
                >
                    Premium
                </button>
            </div>

            <button
                className="theme-toggle"
                type="button"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                onClick={toggleTheme}
            >
                {theme === 'light' ? '☾' : '☀'}
            </button>
        </div>
    )
}