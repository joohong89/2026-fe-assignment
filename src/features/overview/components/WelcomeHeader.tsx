import './WelcomeHeader.css'

interface WelcomeHeaderProps {
    firstName: string
}

const singaporeHour = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Singapore',
})

const singaporeDate = new Intl.DateTimeFormat('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Singapore',
})

function getGreeting(date: Date) {
    const hour = Number(singaporeHour.format(date))

    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'

    return 'Good evening'
}

export default function WelcomeHeader({
                                          firstName,
                                      }: WelcomeHeaderProps) {
    const now = new Date()

    return (
        <header className="welcome-header">
            <h1>
                {getGreeting(now)}, {firstName}
            </h1>

            <p>{singaporeDate.format(now)}</p>
        </header>
    )
}