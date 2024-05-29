import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../defs/user";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

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
       
    }
})

export const { userLoggedIn, setLoading,  } = UserSlice.actions
export default UserSlice.reducer