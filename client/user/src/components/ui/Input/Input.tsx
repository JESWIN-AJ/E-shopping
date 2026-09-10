
import styles from './Input.module.css'                                                 
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({ 
  label, 
  error, 
  helperText, 
  leftIcon, 
  rightIcon, 
  className = '',
  id,
  ...props 
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <input
          id={inputId}
          className={`${styles.input} ${error ? styles.error : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </div>
      {error && <p id={`${inputId}-error`} className={styles.errorText}>{error}</p>}
      {helperText && !error && <p id={`${inputId}-helper`} className={styles.helperText}>{helperText}</p>}
    </div>
  )
}