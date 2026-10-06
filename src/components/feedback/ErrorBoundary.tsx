import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Vittaconect Resilient Boundary]:', error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6D4AF] p-8 text-center shadow-lg space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF0F2] text-[#5D1425] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#480D1B]">
              Não foi possível carregar esta tela
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Ocorreu uma instabilidade temporária. Seus dados continuam protegidos.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#5D1425] hover:bg-[#741C30] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tente novamente</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
