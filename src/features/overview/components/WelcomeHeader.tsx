import './WelcomeHeader.css'

interface WelcomeHeaderProps {
    firstName: string
}

const singaporeDate = new Intl.DateTimeFormat('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Singapore',
})

export default function WelcomeHeader({ firstName,}: WelcomeHeaderProps) {
    const now = new Date()

    return (
        <header className="welcome-header">
            <h1>Good evening, {firstName}</h1>

            <p>{singaporeDate.format(now)}</p>
        </header>
    )
}