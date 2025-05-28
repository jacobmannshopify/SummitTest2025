'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full text-center">
            <h1 className="text-3xl text-red-500 mb-4 font-['Press_Start_2P']">
              OOPS!
            </h1>
            <p className="text-white mb-4 font-['Press_Start_2P'] text-sm">
              Something went wrong
            </p>
            <p className="text-gray-400 mb-6 font-mono text-xs">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={this.handleReset}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-['Press_Start_2P'] text-sm transition-colors"
            >
              RESTART GAME
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 