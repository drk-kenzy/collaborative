import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('=== APP CRASH CAUGHT BY ERROR BOUNDARY ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', background: '#0a0f1a', color: '#e2e8f0', fontFamily: 'monospace', padding: 32
        }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ color: '#EF4444', marginBottom: 8 }}>Erreur détectée</h1>
          <p style={{ color: '#94a3b8', marginBottom: 24, textAlign: 'center' }}>
            L'application a rencontré une erreur. Vérifiez la console pour les détails.
          </p>
          <pre style={{
            background: '#1e293b', padding: 16, borderRadius: 8, maxWidth: 800,
            overflow: 'auto', fontSize: 11, color: '#f87171', marginBottom: 24
          }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack?.split('\n').slice(0, 8).join('\n')}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              background: '#6366F1', color: 'white', border: 'none', borderRadius: 8,
              padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14
            }}
          >
            🔄 Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
