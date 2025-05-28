/* global React */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto my-8">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Something went wrong</h2>
          <div className="bg-white p-4 rounded-lg mb-4 overflow-auto">
            <p className="text-red-600 mb-2">{this.state.error?.message || 'An unexpected error occurred'}</p>
            {this.state.errorInfo && (
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
          <button
            onClick={this.handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

window.ErrorBoundary = ErrorBoundary; 