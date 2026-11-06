import { z } from 'zod'
import type { Account } from '../../api/types'
import { formatMoney } from '../../lib/format'

export function createAmountSchema(
    accounts: Account[],
    remainingDailyLimit: number,
) {
    return z.object({
        fromAccountId: z.string().min(1, 'Select an account.'),
        amount: z.string().trim(),
        note: z.string().max(50, 'Use 50 characters or fewer.'),
    }).superRefine((values, context) => {
        const account = accounts.find(
            (item) =>
                item.id === values.fromAccountId &&
                item.type !== 'credit',
        )

        if (!account && values.fromAccountId) {
            context.addIssue({
                code: 'custom',
                path: ['fromAccountId'],
                message: 'Select a checking or savings account.',
            })
        }

        if (!/^\d+(\.\d{1,2})?$/.test(values.amount)) {
            context.addIssue({
                code: 'custom',
                path: ['amount'],
                message: 'Enter an amount with up to 2 decimal places.',
            })
            return
        }

        const amountCents = Math.round(Number(values.amount) * 100)

        if (!Number.isSafeInteger(amountCents) || amountCents < 100) {
            context.addIssue({
                code: 'custom',
                path: ['amount'],
                message: 'Enter an amount of at least SGD 1.00.',
            })
            return
        }

        if (
            account &&
            amountCents > Math.round(account.balance * 100)
        ) {
            context.addIssue({
                code: 'custom',
                path: ['amount'],
                message:
                    `Amount can't be more than your available balance ` +
                    `(${formatMoney(account.balance)}).`,
            })
        }

        if (
            amountCents >
            Math.round(Math.max(0, remainingDailyLimit) * 100)
        ) {
            context.addIssue({
                code: 'custom',
                path: ['amount'],
                message:
                    `This transfer exceeds your remaining daily limit ` +
                    `(${formatMoney(Math.max(0, remainingDailyLimit))}).`,
            })
        }
    })
}

export type AmountValues = z.infer<
    ReturnType<typeof createAmountSchema>
>