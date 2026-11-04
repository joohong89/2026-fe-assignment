import { useQuery } from '@tanstack/react-query'
import { getCustomer } from './customer.api'

export const customerQueryKey = ['customer'] as const

export function useCustomer() {
    return useQuery({
        queryKey: customerQueryKey,
        queryFn: ({ signal }) => getCustomer(signal),
        select: (response) => response.customer,
    })
}