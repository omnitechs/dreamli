import { configureStore, combineReducers } from '@reduxjs/toolkit';
import generatorReducer from '@/app/store/slices/generatorSlice';
import { commitsReducer } from '@/app/store/slices/commitsSlice';
import accountUserReducer from '@/app/store/slices/accountUserSlice';
import adminUsersReducer from '@/app/store/slices/adminUsersSlice';

import {
    persistReducer,
    persistStore,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';

import { api } from '../(lang)/[lang]/ai/services/api';
import { modelCommitListener } from '@/app/store/listeners/modelCommitListener';
import { imageCommitListener } from '@/app/store/listeners/imageCommitListener';

// SSR-safe storage
const createNoopStorage = () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
});

import storageWeb from 'redux-persist/lib/storage';
const storage =
    typeof window !== 'undefined'
        ? storageWeb
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
    accountUser: accountUserReducer,
    adminUsers: adminUsersReducer,
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
            .concat(modelCommitListener.middleware)
            .concat(imageCommitListener.middleware), // <-- register listeners
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
