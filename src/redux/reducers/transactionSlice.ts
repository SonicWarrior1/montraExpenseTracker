import { createSlice } from '@reduxjs/toolkit';
import { transactionType } from '../../defs/transaction';
const initialState: {
    // transactions: { [key: string]: transactionType },
    isFilterOpen: boolean,
    isCatOpen: boolean,
    filters: { filter: 'income' | 'expense' | 'transfer' | 'none', sort: 'highest' | 'lowest' | 'newest' | 'oldest' | 'none', cat: string[] },
    conversion: { [key: string]: { [key: string]: number } }
    isLogoutOpen: boolean,
    isTabButtonOpen: boolean
} = {
    // transactions: {},
    isFilterOpen: false,
    isCatOpen: false,
    filters: { filter: 'none', sort: 'none', cat: [] },
    conversion: {},
    isLogoutOpen: false,
    isTabButtonOpen: false,
};
const TransactionSlice = createSlice({
    name: 'transaction',
    initialState: initialState,
    reducers: {
        openFilterSheet(state, action) {
            state.isFilterOpen = action.payload;
        },
        openCatSheet(state, action) {
            state.isCatOpen = action.payload;
        },
        openLogoutSheet(state, action) {
            state.isLogoutOpen = action.payload;
        },
        setFilters(state, action) {
            if (action.payload === 0) {
                state.filters.filter = 'income';
            } else if (action.payload === 1) {
                state.filters.filter = 'expense';
            } else if (action.payload === 2) {
                state.filters.filter = 'transfer';
            } else {
                state.filters.filter = 'none';
            }
            state.isFilterOpen = false;
        },
        setSortFilter(state, action) {
            if (action.payload === 0) {
                state.filters.sort = 'highest';
            } else if (action.payload === 1) {
                state.filters.sort = 'lowest';
            } else if (action.payload === 2) {
                state.filters.sort = 'newest';
            } else if (action.payload === 3) {
                state.filters.sort = 'oldest';
            } else {
                state.filters.sort = 'none';
            }
            state.isFilterOpen = false;
        },
        setCatFilter(state, action) {
            console.log(action.payload);
            state.filters.cat = action.payload;
            // if (state.filters.cat.includes(action.payload)) {
            //     state.filters.cat = state.filters.cat.filter((item) => item != action.payload);
            // } else {
            //     state.filters.cat.push(action.payload);
            // }
        },
        clearCatFilter(state) {
            state.filters.cat = [];
        },
        // setTransaction(state, action) {
        //     state.transactions = action.payload
        // },
        setConversionData(state, action) {
            state.conversion = action.payload;
        },
        setTabButton(state, action) {
            state.isTabButtonOpen = action.payload;
        },
    },
});
export const { openFilterSheet, setFilters, openCatSheet, setSortFilter, setConversionData, setCatFilter, clearCatFilter, openLogoutSheet, setTabButton } = TransactionSlice.actions;
export default TransactionSlice.reducer;
