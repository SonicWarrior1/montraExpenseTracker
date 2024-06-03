import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from '../reducers/userSlice'
import TransactionReducer from '../reducers/transactionSlice'
import { persistReducer, persistStore } from "redux-persist";
import { useDispatch, useSelector } from "react-redux";
import { convertApi } from "../api/conversionApi";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blackList: ['transaction']
}
const RootReducer = combineReducers({ user: UserReducer, transaction: TransactionReducer, [convertApi.reducerPath]: convertApi.reducer })
const persistedReducer = persistReducer(persistConfig, RootReducer,)
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(convertApi.middleware)
})
export const persistor = persistStore(store)
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export default store;