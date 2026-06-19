import {configureStore} from '@reduxjs/toolkit'


import { slice } from "../Redux/slice";

export const store =configureStore({
    reducer:{
        data:slice.reducer,
    }
})