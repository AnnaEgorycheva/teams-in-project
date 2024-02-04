import { createSlice } from '@reduxjs/toolkit';

import { Role } from '../../constants';

import { IGetUser } from './types';
import { authApi } from './authApi';

interface IInitialState {
    data?: IGetUser;
    role?: Role;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

const initialState: IInitialState = {
    data: undefined,
    role: undefined,
    isLoading: true,
    isSuccess: false,
    isError: false,
};

/* reducer */
const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.getUser.matchFulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.data = action.payload;
            state.role = action.payload.role;
        });

        builder.addMatcher(authApi.endpoints.getUser.matchPending, (state, action) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        });

        builder.addMatcher(authApi.endpoints.getUser.matchRejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
        });
    },
});

export default authSlice.reducer;
