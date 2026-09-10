// pages/checkout/checkout.tsx
import { useState,type FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { checkoutService } from '@/services/checkoutService'
import { useCart } from '@/hooks/useCart'
import { Button, Input, Textarea } from '@/components/ui'
import { Spinner } from '@/components/ui'
import { EmptyState } from '@/components/ui'
import { RAZORPAY_KEY_ID } from '@/config/constants'
import styles from './checkout.module.css'
import type { ChangeEvent } from 'react'

declare global {
  interface Window { Razorpay: any }
}

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cart, loading: cartLoading, error: cartError, refresh } = useCart()
  const [step, setStep] = useState<'delivery' | 'payment' | 'razorpay'>('delivery')
  const [delivery, setDelivery] = useState({ mobile: '', pincode: '', address: '' })
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rzpOrder, setRzpOrder] = useState<{ id: string; amount: number; receipt: string } | null>(null)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  const handleDeliverySubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!delivery.mobile || !delivery.pincode || !delivery.address) {
      setError('Please fill all delivery fields')
      return
    }
    setStep('payment')
    setError('')
  }

  const handlePlaceOrder = async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const res = await checkoutService.placeOrder({
        userId: user._id,
        mobile: delivery.mobile,
        pincode: delivery.pincode,
        address: delivery.address,
        payment: paymentMethod,
      })

      if (res.codSuccess) {
        navigate('/orders')
      } else if (res.id && res.amount) {
        // Razorpay order created
        setRzpOrder({ id: res.id, amount: res.amount, receipt: res.receipt || '' })
        setStep('razorpay')
        // open Razorpay after state updates
      } else {
        setError('Unexpected response from server')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  // Open Razorpay checkout when step becomes 'razorpay'
  useEffect(() => {
    if (step !== 'razorpay' || !rzpOrder || !window.Razorpay) return

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: 'INR',
      name: 'E-Shop',
      description: 'Order Payment',
      order_id: rzpOrder.id,
      handler: async (response: any) => {
        // Verify payment
        setLoading(true)
        try {
          await checkoutService.verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId: rzpOrder.receipt || rzpOrder.id,
          })
          navigate('/orders')
        } catch {
          setError('Payment verification failed')
        } finally {
          setLoading(false)
        }
      },
      prefill: { name: 'Customer', contact: delivery.mobile, email: 'customer@example.com' },
      theme: { color: '#c9a84c' },
      modal: { ondismiss: () => { setStep('payment'); setRzpOrder(null); } },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }, [step, rzpOrder, delivery.mobile, navigate])

  if (cartLoading) return <div className={styles.loading}><Spinner size="lg" /><p>Loading cart...</p></div>
  if (cartError) return <EmptyState icon="⚠️" title="Failed to load" description={cartError} action={<button onClick={refresh} className={styles.retryBtn}>Retry</button>} />
  if (cart.products.length === 0) return <EmptyState icon="🛒" title="Cart is empty" description="Add items before checkout" action={<a href="/products" className={styles.cta}>Shop Now</a>} />

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Checkout</h1>
      </header>

      <div className={styles.steps}>
        <div className={styles.stepIndicator}>
          <div className={styles.step + (step !== 'delivery' ? ' ' + styles.complete : '')}>
            <span className={styles.stepNum}>1</span> Delivery
          </div>
          <div className={styles.stepConnector} />
          <div className={styles.step + ((step === 'payment' || step === 'razorpay') ? ' ' + styles.active : '')}>
            <span className={styles.stepNum}>2</span> Payment
          </div>
          <div className={styles.stepConnector} />
          <div className={styles.step + (step === 'razorpay' ? ' ' + styles.complete : '')}>
            <span className={styles.stepNum}>3</span> Confirm
          </div>
        </div>
      </div>

      {step === 'delivery' && (
        <form onSubmit={handleDeliverySubmit} className={styles.form}>
          <h2 className={styles.stepTitle}>Delivery Details</h2>
          {error && <div className={styles.error}>{error}</div>}
          <Input label="Mobile Number" type="tel" value={delivery.mobile} onChange={e => setDelivery(d => ({ ...d, mobile: e.target.value }))} placeholder="98765 43210" required />
          <Input label="Pincode" type="text" value={delivery.pincode} onChange={e => setDelivery(d => ({ ...d, pincode: e.target.value }))} placeholder="560001" required maxLength={6} />
          <Textarea
            label="Address"
            value={delivery.address}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDelivery(d => ({ ...d, address: e.target.value }))}
            placeholder="Flat/House No, Street, City, State"
            required
            rows={3}
          />
          <Button type="submit" fullWidth className={styles.nextBtn}>Continue to Payment</Button>
        </form>
      )}

      {step === 'payment' && (
        <div className={styles.form}>
          <h2 className={styles.stepTitle}>Payment Method</h2>
          {error && <div className={styles.error}>{error}</div>}

          <label className={styles.paymentOption}>
            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <div className={styles.paymentCard}>
              <span className={styles.paymentIcon}>💵</span>
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay when your order arrives</p>
              </div>
            </div>
          </label>

          <label className={styles.paymentOption}>
            <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
            <div className={styles.paymentCard}>
              <span className={styles.paymentIcon}>🔒</span>
              <div>
                <strong>Online Payment (Razorpay)</strong>
                <p>Credit/Debit Card, UPI, Net Banking, Wallet</p>
              </div>
            </div>
          </label>

          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}><span>Subtotal</span><span>₹{cart.grandTotal.toFixed(2)}</span></div>
            <div className={styles.summaryRow}><span>Shipping</span><span>Free</span></div>
            <div className={styles.summaryRowTotal}><span>Total</span><span>₹{cart.grandTotal.toFixed(2)}</span></div>
          </div>

          <Button onClick={handlePlaceOrder} fullWidth loading={loading} className={styles.placeBtn}>
            {loading ? 'Processing...' : `Pay ₹${cart.grandTotal.toFixed(2)}`}
          </Button>
        </div>
      )}

      {step === 'razorpay' && (
        <div className={styles.razorpayStep}>
          <Spinner size="lg" />
          <h3>Opening Razorpay...</h3>
          <p className={styles.razorpayNote}>If the popup doesn't appear, check your browser's popup blocker.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setStep('payment')
              setRzpOrder(null)
            }}
            className={styles.backBtn}
          >
            Go Back
          </Button>
        </div>
      )}
    </div>
  )
}