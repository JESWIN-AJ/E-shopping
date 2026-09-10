import styles from './Spinner.module.css'
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function Spinner({ size = 'md', color }: SpinnerProps) {
  return (
    <span 
      className={`${styles.spinner} ${styles[size]}`}
      style={{ borderTopColor: color || 'var(--accent)' }}
    />
  )
}