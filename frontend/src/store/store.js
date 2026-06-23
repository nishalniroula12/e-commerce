import {configureStore, createReducer} from '@reduxjs/toolkit'


import { slice } from "../Redux/slice";
import cartReducer from "../Redux/api"

export const store =configureStore({
    reducer:{
        data:slice.reducer,
        cart:cartReducer
    }
})