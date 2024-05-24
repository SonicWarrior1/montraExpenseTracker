import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../defs/user";

const initialState: { currentUser: User | undefined } = { currentUser: undefined }
const UserSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        userLoggedIn(state, action) {
            state.currentUser = action.payload
        }
    }
})

export default UserSlice.reducer