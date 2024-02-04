import React, { Suspense } from 'react';
import { Spin } from 'antd';
import Icon, { FormOutlined } from '@ant-design/icons';

import { Paths } from './shared/constants';
import { IRoute } from './shared/types';

export const rootRoutes: Array<IRoute> = [
    {
        path: Paths.Applications,
        //icon: <Icon type="FormOutlined" />,
        title: 'Заявки на регистрацию',
        element: <>Заявки на регистрацию</>,
    },
    {
        path: Paths.Users,
        //icon: AdminIcon,
        title: 'Пользователи',
        element: <>Пользователи</>,
    },
    {
        path: Paths.Projects,
        //icon: AdminIcon,
        title: 'Проекты',
        element: <>Проекты</>,
    },
];
