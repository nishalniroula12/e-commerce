import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {

  removecart,
  updatecart,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from "../Redux/api";

const Cart = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  console.log(items)
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartItemCount);

 

  const getProductId = (item) => item.product?._id || item.product;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          🛒 Your Cart
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </h1>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Items</p>
          <p className="text-xl font-semibold">{count}</p>
        </div>

        <div className="bg-gray-50 border rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase">Total</p>
          <p className="text-xl font-semibold">
            Rs {total?.toLocaleString?.() || 0}
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">🛍️</div>
          <p className="font-medium">Your cart is empty</p>
          <p className="text-sm">Add items to get started</p>
        </div>
      )}

      {/* ITEMS */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={getProductId(item)}
            className="flex items-center gap-4 border rounded-xl p-4 bg-white shadow-sm"
          >
            {/* IMAGE */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.name}</p>
              <p className="text-sm text-gray-500">
                Rs {item.price}
              </p>
              <p className="text-sm font-medium text-gray-700">
                Subtotal: Rs {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>

            {/* CONTROLS */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                
                {/* MINUS */}
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      updatecart({
                        productid: getProductId(item),
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 bg-white border rounded-md disabled:opacity-40"
                >
                  −
                </button>

                <span className="w-6 text-center font-medium">
                  {item.quantity}
                </span>

                {/* PLUS */}
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      updatecart({
                        productid: getProductId(item),
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  className="w-8 h-8 bg-white border rounded-md"
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
              <button
                type="button"
                onClick={() =>
                  dispatch(removecart(getProductId(item)))
                }
                className="text-red-500 text-sm hover:underline"
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CHECKOUT */}
      {items.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
          onClick={()=>nav('/checkout')} className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
            🔒 Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;