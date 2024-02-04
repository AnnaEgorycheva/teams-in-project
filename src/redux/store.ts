import { configureStore } from '@reduxjs/toolkit';

import { authApi } from '../shared/hooks/useAuth/authApi';
import authSlice from '../shared/hooks/useAuth/reducer';

const mw = [ authApi.middleware ];

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(mw),
});
