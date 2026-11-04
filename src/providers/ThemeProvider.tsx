import {
    createContext,
    useContext,
    useLayoutEffect,
    useState,
    type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(
    undefined,
)

function getInitialTheme(): Theme {
    return document.documentElement.dataset.theme === 'dark'
        ? 'dark'
        : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme

        try {
            localStorage.setItem('meridian-theme', theme)
        } catch {
            // The current session can still use the selected theme.
        }
    }, [theme])

    function toggleTheme() {
        setTheme((current) => (current === 'light' ? 'dark' : 'light'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider')
    }

    return context
}