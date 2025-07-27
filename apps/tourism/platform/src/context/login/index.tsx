import { createContext, ReactNode, useEffect, useRef, useState } from 'react';

const initialState: LoginInterface = {
  login: false,
  visible: false,
  closable: true,
  setUserLogin: () => ({}),
  setLoginModalVisible: () => ({}),
  handleModalClose: () => ({}),
  checkAuth: () => false,
  setUserLogout: () => ({}),
  lazyLogin: () => new Promise(() => {}),
};

type CheckAuthArguments = {
  closable: boolean;
  visible: boolean;
};

type TLoginPromise = {
  isPending: boolean;
  resolve: () => void;
  reject: () => void;
};

interface LoginInterface {
  login: boolean;
  visible: boolean;
  closable: boolean;
  setUserLogin: () => void;
  setLoginModalVisible: (visible: boolean) => void;
  handleModalClose: () => void;
  checkAuth: ({ closable, visible }: CheckAuthArguments) => void;
  setUserLogout: (visible: boolean, closable: boolean) => void;
  lazyLogin: () => Promise<unknown>;
}

export class LoginError extends Error {}

export const AuthContext = createContext<LoginInterface>(initialState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(initialState);

  const loginPromiseRef = useRef<TLoginPromise>({
    isPending: false,
    resolve: () => {},
    reject: () => {},
  });

  const setUserLogout = (visible: boolean, closable: boolean) => {
    setState((prevState) => ({ ...prevState, login: false, visible, closable }));
  };

  const setUserLogin = () => {
    loginPromiseRef.current?.resolve();
    setState({
      ...initialState,
      login: true,
      visible: false,
    });
  };

  const setLoginModalVisible = (visible: boolean) => {
    setState((prevState) => ({ ...prevState, visible: visible }));
  };

  const handleModalClose = () => {
    if (loginPromiseRef.current?.isPending) {
      loginPromiseRef.current.reject();
      loginPromiseRef.current.isPending = false;
    }
    setLoginModalVisible(false);
  };

  const checkAuth = ({ closable = false, visible = false }: CheckAuthArguments) => {
    const isAuthenticated =
      typeof window !== 'undefined' &&
      (localStorage.getItem('UATP') || localStorage.getItem('UFTP'));
    if (isAuthenticated) {
      setState({
        ...initialState,
        login: true,
        closable,
        visible: false,
      });
    } else {
      setState((prevState) => ({ ...prevState, login: false, visible, closable }));
    }
  };

  const lazyLogin = (): Promise<boolean> => {
    if (state.login) {
      return new Promise((resolve) => {
        resolve(true);
      });
    }

    if (loginPromiseRef.current?.isPending) {
      loginPromiseRef.current.reject();
      loginPromiseRef.current.isPending = false;
    }

    return new Promise((resolve, reject) => {
      // Show the login modal
      setState((prevState) => ({
        ...prevState,
        visible: true,
        login: false,
      }));

      if (loginPromiseRef.current) {
        // This function will be called when login is successful
        loginPromiseRef.current.resolve = () => {
          resolve(true);
        };

        // This function will be called when login fails
        loginPromiseRef.current.reject = () => {
          reject(new LoginError('Login failed'));
        };

        loginPromiseRef.current.isPending = true;
      }
    });
  };

  useEffect(() => {
    return () => {
      if (loginPromiseRef.current?.isPending) {
        loginPromiseRef.current.reject();
        loginPromiseRef.current.isPending = false;
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login: state.login,
        setUserLogin,
        setLoginModalVisible,
        handleModalClose,
        visible: state.visible,
        closable: state.closable,
        checkAuth: checkAuth,
        setUserLogout,
        lazyLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
