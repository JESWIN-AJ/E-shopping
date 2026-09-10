// pages/signup/signup.tsx
import { useState, type ChangeEvent} from 'react'
import { type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import styles from './signup.module.css'

export default function Signup() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
}

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signup(form)
      if (res.status) {
        navigate('/')
      } else {
        setError(res.error || 'Signup failed')
      }
    } catch {
      setError('Signup failed. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create <span>Account</span></h1>
        <p className={styles.sub}>Join us and start shopping</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input label="First Name" name="firstname" value={form.firstname} onChange={handleChange} placeholder="John" required autoComplete="given-name" />
            <Input label="Last Name" name="lastname" value={form.lastname} onChange={handleChange} placeholder="Doe" required autoComplete="family-name" />
          </div>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required autoComplete="email" />
          <Input label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" autoComplete="tel" />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required autoComplete="new-password" minLength={6} />

          <Button type="submit" fullWidth loading={loading} className={styles.submitBtn}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account? <a href="/login" className={styles.link}>Login</a>
        </p>
      </div>
    </div>
  )
}