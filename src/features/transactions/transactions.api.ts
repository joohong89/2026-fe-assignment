import { apiFetch } from '../../api/client'
import type { TransactionsResponse } from '../../api/types'

export function getTransactions(
    limit: number,
    signal?: AbortSignal,
) {
    return apiFetch<TransactionsResponse>(
        `/api/transactions?limit=${limit}`,
        { signal },
    )
}