// Paystack inline checkout — loaded on demand so the script never blocks the
// initial page load. Only the public key lives here; verifying that a
// payment actually succeeded happens server-side in /api/verify-paystack,
// using the secret key (never shipped to the browser).

const SCRIPT_SRC = 'https://js.paystack.co/v1/inline.js'
const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

export const isPaystackConfigured = Boolean(PUBLIC_KEY)

let scriptPromise = null

function loadPaystackScript() {
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.onload = () => resolve(window.PaystackPop)
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Could not load the payment window. Check your connection and try again.'))
    }
    document.body.appendChild(script)
  })
  return scriptPromise
}

// Opens the Paystack popup for `amountKobo` (an integer, in kobo — i.e.
// naira * 100). Calls `onSuccess(reference)` once the popup reports success;
// the booking is only confirmed after the server verifies that reference.
export async function payWithPaystack({ email, amountKobo, metadata, onSuccess, onClose }) {
  if (!PUBLIC_KEY) {
    throw new Error('Online payment isn’t set up yet. Add VITE_PAYSTACK_PUBLIC_KEY to enable it.')
  }
  const PaystackPop = await loadPaystackScript()
  const handler = PaystackPop.setup({
    key: PUBLIC_KEY,
    email,
    amount: amountKobo,
    currency: 'NGN',
    metadata,
    callback: (response) => onSuccess(response.reference),
    onClose,
  })
  handler.openIframe()
}
