import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountsQueryKey } from '../accounts/accounts.queries'
import { customerQueryKey } from '../customer/customer.queries'
import { transactionsQueryKey } from '../transactions/transactions.queries'
import { createTransfer } from './transfers.api'

export function useCreateTransfer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createTransfer,

        // The endpoint is not idempotent.
        retry: false,

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: accountsQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: customerQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: transactionsQueryKey,
                }),
            ])
        },
    })
}