import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetErrorBoundary = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error) {
      if (typeof fallback === 'function') {
        return fallback({ error, resetErrorBoundary: this.resetErrorBoundary })
      }
      return (
        <ErrorBoundaryFallback
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return children
  }
}
