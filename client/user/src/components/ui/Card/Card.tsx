import styles from './Card.module.css'
export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[padding]} ${hover ? styles.hover : ''} ${className}`}>
      {children}
    </div>
  )
}