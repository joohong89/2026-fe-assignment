import { apiFetch } from '../../api/client'
import type { AccountsResponse } from '../../api/types'

export function getAccounts(signal?: AbortSignal) {
    return apiFetch<AccountsResponse>('/api/accounts', { signal })
}