import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import playlistReducer from './slices/playlistSlice';
import musicReducer from './slices/musicSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        playlist: playlistReducer,
        music: musicReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: import.meta.env.NODE_ENV !== 'production',
});