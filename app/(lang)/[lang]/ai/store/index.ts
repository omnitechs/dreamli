import { configureStore, combineReducers } from '@reduxjs/toolkit';
import generatorReducer from './slices/generatorSlice';
import { commitsReducer } from './slices/commitsSlice';

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

// SSR-safe localStorage fallback
const createNoopStorage = () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
});

const storage =
    typeof window !== 'undefined'
        ? require('redux-persist/lib/storage').default
        : createNoopStorage();

// Configure persistence
const persistConfig = {
    key: 'dreamli:redux:v1',
    version: 1,
    storage,
    whitelist: ['generator', 'commits'],
};

// Combine reducers
const rootReducer = combineReducers({
    generator: generatorReducer,
    commits: commitsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
