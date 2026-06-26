import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Seller from "./pages/seller/Seller";

import Protectedroutes from "./component/Protectedroutes";
import Mainlayout from "./component/Mainlayout";
import Addcategory from "./pages/seller/Addcategory";
import Allcategory from "./pages/seller/Allcategory";
import Addproduct from "./pages/seller/Addproduct";
import Allproduct from "./pages/seller/Allproduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";

const App = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES (with navbar) */}
      <Route element={<Mainlayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>  }/>
        <Route path="/payment" element={<Payment/>}/>
      </Route>

      {/* AUTH PAGES (no navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />

      {/* PROTECTED ROUTES */}
      <Route element={<Protectedroutes />}>
        <Route element={<Mainlayout />}>
          <Route path="/sellerpanel" element={<Seller />} />
          <Route path="/dashboard" element={<Seller />} />
          <Route path="/addcategory" element={<Addcategory/>}/>
          <Route path="/addcategory/:id" element={<Addcategory/>}/>
          <Route path="/allcategory" element={<Allcategory/>}/>
          <Route path="/addproduct" element={<Addproduct/>}/>
          <Route path="/addproduct/:id" element={<Addproduct/>}/>
          <Route path="/allproduct" element={<Allproduct/>}/>
        </Route>
      </Route>

    </Routes>
  );
};

export default App;