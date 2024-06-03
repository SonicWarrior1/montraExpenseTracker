import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../defs/user";

const initialState: {
    currentUser: UserType | undefined, loading: boolean,
} = {
    currentUser: undefined, loading: false,

}
const UserSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        userLoggedIn(state, action) {
            state.currentUser = action.payload
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
        }
    }
})

export const { userLoggedIn, setLoading, addExpenseCategory, addIncomeCategory,setCurrencyCode } = UserSlice.actions
export default UserSlice.reducer