import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
          <h1 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h1>
          <p className="mt-4 text-center text-gray-700">
            Maaf, sesuatu yang tidak beres terjadi. Silakan refresh halaman.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Refresh Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
