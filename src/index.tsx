import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import 'moment/locale/ru';
import { createRoot } from 'react-dom/client';

import { store } from './redux/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ProvideLayoutConfig } from './shared/hooks/useLayoutConfig/useLayoutConfig';
import { ProvideAuth } from './shared/hooks/useAuth/useAuth';

import './index.less';

const MainApp = () => (
    <Provider store={store}>
        <BrowserRouter>
            <ProvideAuth>
                <ProvideLayoutConfig>
                    <ConfigProvider locale={ruRU}>
                        <App />
                    </ConfigProvider>
                </ProvideLayoutConfig>
            </ProvideAuth>
        </BrowserRouter>
    </Provider>
);

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<MainApp />);
} else {
    console.error('No root element found'); // Обработка случая, когда элемент не найден
}

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
