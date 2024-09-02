import { createSlice } from "@reduxjs/toolkit/react";
import {ToastType} from "../../utils/Type"


interface meetingInitialState {
    toasts: Array<ToastType>;
};

const initialState : meetingInitialState = {
    toasts: [],
}

export const meetingsSlice = createSlice({
    name: "meetings",
    initialState,
    reducers: {
        setToasts: (state, action) =>{
            state.toasts = action.payload;
        },
    }
})

export const {setToasts} = meetingsSlice.actions;