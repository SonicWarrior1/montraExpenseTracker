import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { transactionType } from "../../defs/transaction";
const initialState: {
    transactions: { [key: string]: transactionType },
    isFilterOpen: boolean,
    isCatOpen: boolean,
    filters: { filter: 'income' | 'expense' | 'transfer' | 'none', sort: 'highest' | 'lowest' | 'newest' | 'oldest' },
    conversion: { [key: string]: { [key: string]: number } }

} = {
    transactions: {},
    isFilterOpen: false,
    isCatOpen: false,
    filters: { filter: 'none', sort: 'newest' },
    conversion: {}
}
const TransactionSlice = createSlice({
    name: "transaction",
    initialState: initialState,
    reducers: {
        openFilterSheet(state, action) {
            state.isFilterOpen = action.payload;
        },
        openCatSheet(state, action) {
            state.isCatOpen = action.payload;
        },
        setFilters(state, action) {
            if (action.payload === 0) {
                state.filters.filter = 'income'
            } else if (action.payload === 1) {
                state.filters.filter = 'expense'
            } else if (action.payload === 2) {
                state.filters.filter = 'transfer'
            } else {
                state.filters.filter = 'none'
            }
            state.isFilterOpen = false;
        },
        setSortFilter(state, action) {
            console.log(action)
            if (action.payload === 0) {
                state.filters.sort = 'highest'
            } else if (action.payload === 1) {
                state.filters.sort = 'lowest'
            } else if (action.payload === 2) {
                state.filters.sort = 'newest'
            } else if (action.payload === 3) {
                state.filters.sort = 'oldest'
            }
            state.isFilterOpen = false;
        },
        setTransaction(state, action: PayloadAction<transactionType[]>) {

            state.transactions = action.payload.reduce((acc: { [key: string]: transactionType }, curr) => {
                acc[curr.id] = curr;
                return acc;
            }, {});
            console.log(state)
        },
        setConversionData(state, action) {
            state.conversion = action.payload
        }
    }
})
export const { openFilterSheet, setFilters, openCatSheet, setSortFilter, setTransaction, setConversionData } = TransactionSlice.actions
export default TransactionSlice.reducer