import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Nepsis encountered an unexpected error', error, info)
  }

  handleReload = () => {
    this.setState({ error: null })
    window.location.assign(import.meta.env.BASE_URL)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page" role="alert">
          <div className="card stack">
            <h1>Something went wrong</h1>
            <p>
              Nepsis ran into a problem showing this screen. Your recorded data is stored
              locally and has not been lost.
            </p>
            <button type="button" className="btn btn-primary" onClick={this.handleReload}>
              Return to home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
