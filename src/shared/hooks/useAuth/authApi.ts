import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '../../api/query';

import { ICredentials, IGetUser } from './types';

/**
 * Api для авторизации
 */
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: [ 'Auth', 'User' ],
    endpoints: builder => ({
        login: builder.mutation<{ access: string; refresh: string }, ICredentials>({
            query: data => ({
                url: '/login/',
                method: 'post',
                data,
            }),
            invalidatesTags: [ 'Auth' ],
        }),
        logout: builder.mutation({
            query: ({ url, refresh }: { url: string; refresh: string }) => ({ url, method: 'post', data: `refresh=${refresh}` }),
        }),
        getUser: builder.query<IGetUser, unknown>({
            query: params => ({
                url: '/get_user/',
                method: 'get',
                params,
            }),
            providesTags: [ 'User' ],
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useGetUserQuery } = authApi;
