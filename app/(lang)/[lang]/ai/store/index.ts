import { configureStore, combineReducers } from '@reduxjs/toolkit';
import generatorReducer from './slices/generatorSlice';
import { commitsReducer } from './slices/commitsSlice';

import {
    persistReducer,
    persistStore,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';

import { api } from '../services/api';
import { modelCommitListener } from './listeners/modelCommitListener';

// SSR-safe storage
const createNoopStorage = () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
});

const storage =
    typeof window !== 'undefined'
        ? require('redux-persist/lib/storage').default
        : createNoopStorage();

const persistConfig = {
    key: 'dreamli:redux:v1',
    version: 2,
    storage,
    whitelist: ['generator', 'commits'], // 'api' is not persisted
};

const rootReducer = combineReducers({
    generator: generatorReducer,
    commits: commitsReducer,
    [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (gDM) =>
        gDM({
            serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
        })
            .concat(api.middleware)
            .concat(modelCommitListener.middleware), // <-- register listener
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
