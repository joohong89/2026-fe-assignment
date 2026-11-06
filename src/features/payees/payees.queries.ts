import { useQuery } from '@tanstack/react-query'
import { getPayees } from './payees.api'

export const payeesQueryKey = ['payees'] as const

export function usePayees(enabled: boolean) {
    return useQuery({
        queryKey: payeesQueryKey,
        queryFn: ({ signal }) => getPayees(signal),
        select: (response) => response.payees,
        enabled,
    })
}