import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  itemL: [],
  totalamount: 0,
  totalitems: 0,
  loading: false,
};

// ================= FETCH CART =================
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8000/api/findcart", {
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ================= SLICE =================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ➕ ADD
    addtocart: (state, action) => {
      const { product, quantity = 1 } = action.payload;

      const productId = product._id;

      const existing = state.itemL.find(
        (item) => item.product === productId
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.itemL.push({
          product: productId,
          name: product.name,
          price: product.price,
          image: product.image?.[0]?.url || product.image,
          quantity,
        });
      }

      state.totalitems = state.itemL.reduce(
        (sum, i) => sum + i.quantity,
        0
      );

      state.totalamount = state.itemL.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    // ❌ REMOVE
    removecart: (state, action) => {
      const productId = action.payload;

      // Safe check if item.product is an object or a string
      state.itemL = state.itemL.filter(
        (item) => (item.product?._id || item.product) !== productId
      );

      // Recalculate totals
      state.totalitems = state.itemL.reduce((sum, i) => sum + i.quantity, 0);
      state.totalamount = state.itemL.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    // ✏️ UPDATE
    updatecart: (state, action) => {
      const { productid, quantity } = action.payload;

      const item = state.itemL.find(
        (i) => i.product === productid
      );

      if (item) {
        item.quantity = quantity;
      }

      state.itemL = state.itemL.filter((i) => i.quantity > 0);

      state.totalitems = state.itemL.reduce(
        (sum, i) => sum + i.quantity,
        0
      );

      state.totalamount = state.itemL.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },

    clearcart: (state) => {
      state.itemL = [];
      state.totalamount = 0;
      state.totalitems = 0;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      const data = action.payload;

      state.itemL = data.itemL || data.cart?.itemL || [];
      state.totalamount = data.totalamount || data.cart?.totalamount || 0;
      state.totalitems = data.totalitems || data.cart?.totalitems || 0;
    });
  },
});

export const {
  addtocart,
  removecart,
  updatecart,
  clearcart,
} = cartSlice.actions;

export default cartSlice.reducer;

// ================= SELECTORS =================
export const selectCartItems = (state) => state.cart.itemL;
export const selectCartTotal = (state) => state.cart.totalamount;
export const selectCartItemCount = (state) => state.cart.totalitems;