import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../defs/user";

const initialState: {
    currentUser: UserType | undefined, loading: boolean, theme?: 'device' | 'light' | 'dark'
} = {
    currentUser: undefined, loading: false, theme: undefined

}
const UserSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        userLoggedIn(state, action) {
            state.currentUser = action.payload
        },
        addBudget(state, action) {
            state.currentUser!.budget[action.payload.month][action.payload.cat] = action.payload.budget
        },
        deleteBudget(state, action) {
            delete state.currentUser!.budget[action.payload.month][action.payload.cat];
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        addExpenseCategory(state, action: PayloadAction<string>) {
            state.currentUser!.expenseCategory = [...state.currentUser!.expenseCategory, action.payload]
        },
        addIncomeCategory(state, action: PayloadAction<string>) {
            state.currentUser!.incomeCategory = [...state.currentUser!.incomeCategory, action.payload]
        },
        setCurrencyCode(state, action) {
            state.currentUser!.currency = action.payload;
        },
        setTheme(state, action) {
            state.theme = action.payload
        }
    }
})

export const { userLoggedIn, setLoading, addExpenseCategory, addIncomeCategory, setCurrencyCode, addBudget, deleteBudget, setTheme } = UserSlice.actions
export default UserSlice.reducer