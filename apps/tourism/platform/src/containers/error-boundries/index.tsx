import Modal from 'components/modal';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './error-boundries.module.scss';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  visible: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    visible: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    console.log(_);

    // Update state so the next render will show the fallback UI.
    return { hasError: true, visible: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error);
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Modal
          visible={this.state.visible}
          onClose={() => {
            window.location.replace('/');
            this.setState({ visible: false });
          }}
        >
          <div className={styles['error__content']}>
            <span>مشکلی پیش آمده است لطفا دوباره تلاش کنید</span>
            <button
              className={styles['error__btn']}
              type="button"
              onClick={() => window.location.reload()}
            >
              بازگشت
            </button>
          </div>
        </Modal>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
