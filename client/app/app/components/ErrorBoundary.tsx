import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import ErrorFallback from "~/components/ErrorFallback";
import { logError } from "~/utils/logging";

type State = { error: Error | null };
type Props = { children: ReactNode };

export class ReactErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, errorInfo);
  }
  render() {
    if (this.state.error) {
      this.state = { error: null };
      return <ErrorFallback></ErrorFallback>;
    }
    return this.props.children;
  }
}
