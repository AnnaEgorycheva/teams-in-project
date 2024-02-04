import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { instance } from '../../api/query';
import useLocalStorage from '../useLocalStorage/useLocalStorage';
import { useAppSelector } from '../../../redux/hooks';
import { Role } from '../../constants';

import { ICredentials, IGetUser } from './types';
import { authApi, useGetUserQuery, useLoginMutation, useLogoutMutation } from './authApi';

/**
 * Интерфейс авторизации
 * @property isAuth boolean,
 * @property user string,
 * @property login function,
 */
interface IAuth {
    isAuth: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isFetching: boolean;
    isError: boolean;
    user: string;
    login: ({ email, password }: ICredentials) => void;
    logout: () => void;
    data?: IGetUser;
    role?: Role;
    isLogoutFetching: boolean;
    invalidPswd: boolean;
    isLoginFetching: boolean;
}

interface ProvideAuthProps {
    children: ReactNode;
}

/**
 * Контекст авторизации
 */
const authContext = createContext<IAuth>({
    isAuth: false,
    isLoading: true,
    isFetching: true,
    isSuccess: true,
    isError: false,
    user: '',
    login: () => {},
    logout: () => {},
    data: undefined,
    invalidPswd: false,
    role: undefined,
    isLogoutFetching: false,
    isLoginFetching: false,
});

export const ProvideAuth: React.FC<ProvideAuthProps> = ({ children }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

/**
 * Хук контекста авторизации
 * @returns {IAuth}
 */
export const useAuth = (): IAuth => useContext(authContext);

/**
 * Логика авторизации
 */
const useProvideAuth = (): IAuth => {
    const [ storedValue, setStoredValue ] = useLocalStorage('access', '');
    const [ storedValueForRefresh, setStoredValueForRefresh ] = useLocalStorage('refresh', '');
    const [ invalidPswd, setInvalidPswd ] = useState(false);
    const [ isAuth, setIsAuth ] = useState(false);

    const stateAuthData = useAppSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (storedValue) {
            instance.defaults.headers.common = { Authorization: `Bearer ${storedValue}` };
        }
    }, [ storedValue, isAuth ]);

    const ty = true;
    const { data, isSuccess, isError, isFetching, isLoading } = useGetUserQuery(undefined, { skip: ty });

    useEffect(() => {
        if (isError) {
            setIsAuth(false);
        }
    }, [ isError ]);

    const user: string = data?.name ?? '';

    const [ loginQuery, { isLoading: isLoginFetching } ] = useLoginMutation();
    const [ logoutQuery, { isLoading: isLogoutFetching } ] = useLogoutMutation();

    useEffect(() => {
        if (storedValue) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
            window.localStorage.clear();
        }
    }, [ storedValue ]);

    useEffect(() => {
        if (!stateAuthData?.data?.id) {
            dispatch(authApi.util.invalidateTags([ 'User' ]));
        }
    }, [ stateAuthData, stateAuthData?.data?.id, dispatch ]);

    useEffect(() => {
        if (storedValue) {
            dispatch(authApi.util.invalidateTags([ 'User' ]));
        }
    }, [ storedValue, dispatch ]);

    /**
     * локальный вход с помощью логина и пароля
     * @param email
     * @param password
     */
    const login = ({ email, password }: ICredentials) => {
        setInvalidPswd(false);
        loginQuery({ email, password })
            .unwrap()
            .then((res: { access: string; refresh: string }) => {
                setStoredValue(res.access);
                setStoredValueForRefresh(res.refresh);
                setInvalidPswd(false);
            })
            .catch((error) => {
                setInvalidPswd(true);
                console.log(error);
            });
    };

    /**
     * Выход из приложения
     */
    const logout = () => {
        logoutQuery({ url: '/logout/', refresh: storedValueForRefresh })
            .unwrap()
            .finally(() => {
                setIsAuth(false);
                setStoredValue('');
                setStoredValueForRefresh('');
                window.location.replace('/');
            });
    };

    return {
        invalidPswd,
        isAuth,
        isSuccess,
        data,
        isLoading,
        isFetching,
        isError,
        user,
        role: data?.role ?? undefined,
        login,
        logout,
        isLogoutFetching,
        isLoginFetching,
    };
};
