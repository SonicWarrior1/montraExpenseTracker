import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserReducer from '../reducers/userSlice'
import { persistReducer, persistStore } from "redux-persist";
import { useDispatch, useSelector } from "react-redux";
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}
const RootReducer = combineReducers({ user: UserReducer })
const persistedReducer = persistReducer(persistConfig, RootReducer,)
const store = configureStore({
    reducer: persistedReducer
})
export const persistor = persistStore(store)
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export default store;