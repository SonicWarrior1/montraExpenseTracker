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
            console.log("USER SET")
        },
        addBudget(state, action) {
            if (state.currentUser!.budget?.[action.payload.month] === undefined) {
                state.currentUser!.budget[action.payload.month] = {}
            }
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
        },
        setIncome(state, action) {
            if (state.currentUser?.income?.[action.payload.month] === undefined) {
                state.currentUser!.income[action.payload.month] = {}
            }
            state.currentUser!.income[action.payload.month][action.payload.category] = action.payload.amount
        },
        setExpense(state, action) {
            if (state.currentUser?.spend?.[action.payload.month] === undefined) {
                state.currentUser!.spend[action.payload.month] = {}
            }
            state.currentUser!.spend[action.payload.month][action.payload.category] = action.payload.amount
        },
        updateNotification(state, action) {
            if (action.payload.type === 'read') {
                state.currentUser!.notification[action.payload.id].read = true;
            } else if (action.payload.type === 'delete') {
                delete state.currentUser!.notification[action.payload.id];
            }
        }
    }
})

export const { userLoggedIn, setLoading, addExpenseCategory, addIncomeCategory, setCurrencyCode, addBudget, deleteBudget, setTheme, setIncome, setExpense, updateNotification } = UserSlice.actions
export default UserSlice.reducer