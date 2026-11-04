import {
    createContext,
    useContext,
    useLayoutEffect,
    useState,
    type ReactNode,
} from 'react'
import type { Segment } from '../api/types'

interface SegmentContextValue {
    segment: Segment
    setSegment: (segment: Segment) => void
}

const SegmentContext = createContext<SegmentContextValue | undefined>(
    undefined,
)

function getInitialSegment(): Segment {
    return document.documentElement.dataset.segment === 'premium'
        ? 'premium'
        : 'retail'
}

export function SegmentProvider({ children }: { children: ReactNode }) {
    const [segment, setSegment] = useState<Segment>(getInitialSegment)

    useLayoutEffect(() => {
        document.documentElement.dataset.segment = segment

        try {
            localStorage.setItem('meridian-segment', segment)
        } catch {
            // The current session can still use the selected segment.
        }
    }, [segment])

    return (
        <SegmentContext.Provider value={{ segment, setSegment }}>
            {children}
        </SegmentContext.Provider>
    )
}

export function useSegment() {
    const context = useContext(SegmentContext)

    if (!context) {
        throw new Error('useSegment must be used inside SegmentProvider')
    }

    return context
}