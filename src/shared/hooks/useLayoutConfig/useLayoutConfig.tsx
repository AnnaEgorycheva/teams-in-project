import React, { createContext, FC, ReactNode, useContext, useState } from 'react';

/**
 * Интерфейс layout
 */
interface ILayoutConfig {
    activeMenuItem: string;
    headerTitle: string | JSX.Element;
    centerComponent: string | JSX.Element;
    backButton?: string | JSX.Element;
    setConfig: (v: IConfig) => void;
    isLoading?: boolean;
}

interface IConfig {
    activeMenuKey: string;
    headerTitle: string | JSX.Element;
    centerComponent?: string | JSX.Element;
    backButton?: string | JSX.Element;
    isLoading?: boolean;
}

interface ProvideAuthProps {
    children: ReactNode;
}
/**
 * Контекст layout страницы
 */
const layoutConfigContext = createContext<ILayoutConfig>({
    activeMenuItem: '',
    headerTitle: '',
    centerComponent: '',
    setConfig: () => {},
    backButton: '',
    isLoading: false,
});

export const ProvideLayoutConfig: FC<ProvideAuthProps> = ({ children }) => {
    const value = useProvideLayoutConfig();
    return <layoutConfigContext.Provider value={value}>{children}</layoutConfigContext.Provider>;
};

/**
 * Хук контекста конфига layout
 */
export const useLayoutConfig = (): ILayoutConfig => useContext(layoutConfigContext);

/**
 * Логика layout страницы
 */
const useProvideLayoutConfig = (): ILayoutConfig => {
    const [ activeMenuItem, setActiveMenuItem ] = useState('');
    const [ headerTitle, setHeaderTitle ] = useState<string | JSX.Element>('');
    const [ centerComponent, setCenterComponent ] = useState<string | JSX.Element>('');
    const [ backButton, setBackButton ] = useState<string | JSX.Element>('');
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const setConfig = ({ activeMenuKey, headerTitle, centerComponent, backButton, isLoading }: IConfig) => {
        setActiveMenuItem(activeMenuKey);
        setHeaderTitle(headerTitle);
        setCenterComponent(centerComponent ?? '');
        setBackButton(backButton ?? '');
        setIsLoading(isLoading ?? false);
    };

    return {
        activeMenuItem,
        headerTitle,
        centerComponent,
        setConfig,
        backButton,
        isLoading,
    };
};
