import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Load cart from localStorage
const getCartFromStorage = () => {
  const cart = localStorage.getItem("cart");

  if (cart) {
    return JSON.parse(cart);
  }

  return {
    itemL: [],
    totalamount: 0,
    totalitems: 0,
    loading: false,
  };
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      itemL: state.itemL,
      totalamount: state.totalamount,
      totalitems: state.totalitems,
    })
  );
};

const initialState = getCartFromStorage();

// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/findcart",
//         {
//           withCredentials: true,
//         }
//       );

//       return res.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Error");
//     }
//   }
// );

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
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

      saveCartToStorage(state);
    },

    removecart: (state, action) => {
      const productId = action.payload;

      state.itemL = state.itemL.filter(
        (item) => (item.product?._id || item.product) !== productId
      );

      state.totalitems = state.itemL.reduce(
        (sum, i) => sum + i.quantity,
        0
      );

      state.totalamount = state.itemL.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      saveCartToStorage(state);
    },

    updatecart: (state, action) => {
      const { productid, quantity } = action.payload;

      const item = state.itemL.find(
        (i) => i.product === productid
      );

      if (item) {
        item.quantity = quantity;
      }

      state.itemL = state.itemL.filter(
        (i) => i.quantity > 0
      );

      state.totalitems = state.itemL.reduce(
        (sum, i) => sum + i.quantity,
        0
      );

      state.totalamount = state.itemL.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      saveCartToStorage(state);
    },

    clearcart: (state) => {
      state.itemL = [];
      state.totalamount = 0;
      state.totalitems = 0;

      localStorage.removeItem("cart");
    },
  },

  // extraReducers: (builder) => {
  //   builder.addCase(fetchCart.fulfilled, (state, action) => {
  //     const data = action.payload;

  //     state.itemL = data.itemL || data.cart?.itemL || [];
  //     state.totalamount =
  //       data.totalamount || data.cart?.totalamount || 0;
  //     state.totalitems =
  //       data.totalitems || data.cart?.totalitems || 0;

  //     saveCartToStorage(state);
  //   });
  // },
});

export const {
  addtocart,
  removecart,
  updatecart,
  clearcart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.itemL;
export const selectCartTotal = (state) => state.cart.totalamount;
export const selectCartItemCount = (state) => state.cart.totalitems;