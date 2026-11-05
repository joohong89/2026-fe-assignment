import { useQuery } from '@tanstack/react-query'
import { getTransactions } from './transactions.api'

export const transactionsQueryKey = ['transactions'] as const

export function useTransactions(limit = 8) {
    return useQuery({
        queryKey: [...transactionsQueryKey, { limit }],
        queryFn: ({ signal }) => getTransactions(limit, signal),
        select: (response) => response.transactions,
    })
}