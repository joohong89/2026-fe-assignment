import { useEffect, useRef } from 'react'
import './TransferDialog.css'

interface TransferDialogProps {
    onClose: () => void
}

export default function TransferDialog({
                                           onClose,
                                       }: TransferDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = dialogRef.current

        if (!dialog) return

        const previouslyFocused = document.activeElement
        const previousOverflow = document.body.style.overflow

        if (!dialog.open) {
            dialog.showModal()
        }

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow

            if (
                previouslyFocused instanceof HTMLElement &&
                previouslyFocused.isConnected
            ) {
                previouslyFocused.focus()
            }
        }
    }, [])

    return (
        <dialog
            ref={dialogRef}
            className="transfer-dialog"
            aria-labelledby="transfer-dialog-title"
            onClose={onClose}
        >
            <div className="transfer-dialog-content">
                <header className="transfer-dialog-header">
                    <h2 id="transfer-dialog-title">
                        New transfer
                    </h2>

                    <button
                        className="transfer-dialog-close"
                        type="button"
                        aria-label="Close transfer"
                        autoFocus
                        onClick={() => dialogRef.current?.close()}
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </header>

                <ol
                    className="transfer-steps"
                    aria-label="Transfer steps"
                >
                    <li aria-current="step">
                        <span aria-hidden="true">1</span>
                        Recipient
                    </li>

                    <li>
                        <span aria-hidden="true">2</span>
                        Amount
                    </li>

                    <li>
                        <span aria-hidden="true">3</span>
                        Review
                    </li>
                </ol>

                <div className="transfer-dialog-body">
                    <h3>Who are you sending to?</h3>

                    <p>
                        Recipient selection will be added in the next step.
                    </p>
                </div>
            </div>
        </dialog>
    )
}