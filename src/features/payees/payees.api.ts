import { apiFetch } from '../../api/client'
import type { PayeesResponse } from '../../api/types'

export function getPayees(signal?: AbortSignal) {
    return apiFetch<PayeesResponse>('/api/payees', { signal })
}