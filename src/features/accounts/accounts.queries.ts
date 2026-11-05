import { useQuery } from '@tanstack/react-query'
import { getAccounts } from './accounts.api'

export const accountsQueryKey = ['accounts'] as const

export function useAccounts() {
    return useQuery({
        queryKey: accountsQueryKey,
        queryFn: ({ signal }) => getAccounts(signal),
        select: (response) => response.accounts,
    })
}