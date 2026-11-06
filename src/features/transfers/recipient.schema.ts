import { z } from 'zod'
import type { Payee } from '../../api/types'

export const newRecipientSchema = z.object({
    name: z.string()
        .trim()
        .min(2, 'Enter at least 2 characters.')
        .max(50, 'Use 50 characters or fewer.'),

    accountNumber: z.string()
        .regex(/^\d{8}$/, 'Enter a valid 8-digit account number.'),

    bank: z.string()
        .trim()
        .min(1, 'Select a bank.'),
})

export type NewRecipient = z.infer<typeof newRecipientSchema>

export type TransferRecipientSelection =
    | { kind: 'saved'; payee: Payee }
    | { kind: 'new'; recipient: NewRecipient }