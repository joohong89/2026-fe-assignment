import { apiFetch } from '../../api/client'
import type { CustomerResponse } from '../../api/types'

export function getCustomer(signal?: AbortSignal) {
    return apiFetch<CustomerResponse>('/api/customer', { signal })
}