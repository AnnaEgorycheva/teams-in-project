import React, { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { Spin } from 'antd';

import { rootRoutes } from './Routes';
import { useAuth } from './shared/hooks/useAuth/useAuth';

//const Login = React.lazy(() => import('./pages/Login/Login'));

const createRoutes = (isAuth: boolean) => [
    {
        path: '/',
        // element: isAuth ? (
        //     <Suspense fallback={<Spin className="main-loader" />}>
        //         MainLayout
        //     </Suspense>
        // ) : (
        //     <Navigate to="/login" />
        // ),
        children: rootRoutes,
    },
    {
        path: '/login',
        element: (
            <Suspense fallback={<Spin className="main-loader" />}>
                {/* <Login/> */}
                login
            </Suspense>
        ),
    },
    {
        path: '*',
        element: (
            <Suspense fallback={<Spin className="main-loader" />}>
                NotFound
            </Suspense>
        ),
    },
];

const App: React.FC = () => {
    const { isAuth, isLoading } = useAuth();
    const customRouter = useRoutes(createRoutes(isAuth));

    //return isLoading ? <Spin /> : <Suspense fallback={<Spin />}>{customRouter}</Suspense>;
    return <Suspense fallback={<Spin />}>{customRouter}</Suspense>;
};

export default App;
