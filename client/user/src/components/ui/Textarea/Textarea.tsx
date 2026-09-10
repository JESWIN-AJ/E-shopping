import type { ChangeEvent, TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={textareaId} className={styles.label}>{label}</label>}
      <textarea
        id={textareaId}
        className={`${styles.textarea} ${error ? styles.error : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        {...props}
      />
      {error && <p id={`${textareaId}-error`} className={styles.errorText}>{error}</p>}
      {helperText && !error && <p id={`${textareaId}-helper`} className={styles.helperText}>{helperText}</p>}
    </div>
  )
}
