import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingBag, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, total, isCartOpen, closeCart } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent
        className="flex w-full flex-col sm:max-w-md p-0 border-l border-[#2a2a2a]"
        style={{ background: "#0d0d0d", color: "#ffffff" }}
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-[#1e1e1e]">
          <SheetTitle className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a84c]/20">
              <ShoppingCart className="h-4 w-4 text-[#c9a84c]" />
            </div>
            <span className="font-bold text-white">Your Cart</span>
            {itemCount > 0 && (
              <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a84c] text-xs font-bold text-black">
                {itemCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
              <ShoppingBag className="h-10 w-10 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">Your cart is empty</p>
              <p className="mt-1 text-sm text-gray-500">Add some delicious items to get started</p>
            </div>
            <Button
              onClick={closeCart}
              className="bg-[#c9a84c] hover:bg-[#b8943d] text-black font-bold rounded-full px-8"
            >
              Browse Restaurants
            </Button>
          </div>
        ) : (
          <>
            {/* ── Items list ── */}
            <ScrollArea className="flex-1 px-5">
              <div className="flex flex-col gap-1 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl bg-[#141414] border border-[#2a2a2a] p-3 hover:border-[#c9a84c]/20 transition-colors"
                  >
                    {/* Emoji placeholder */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1f1f1f] text-2xl">
                      🍽️
                    </div>

                    {/* Name & price */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate">{item.name}</h4>
                      <p className="text-xs text-[#c9a84c] font-bold mt-0.5">₹{item.price}</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex flex-col items-end gap-1.5">
                      <p className="text-sm font-bold text-white">₹{item.price * item.quantity}</p>
                      <div className="flex items-center gap-1">
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#333] text-gray-400 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-white">{item.quantity}</span>
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a84c] text-black hover:bg-[#b8943d] transition-all text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all ml-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* ── Footer: summary + checkout ── */}
            <div className="border-t border-[#1e1e1e] px-5 py-4 space-y-3">
              {/* Promo hint */}
              <div className="flex items-center gap-2 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-3 py-2">
                <span className="text-sm">🎉</span>
                <span className="text-xs text-[#c9a84c] font-medium">
                  {total >= 299
                    ? "You qualify for FREE delivery!"
                    : `Add ₹${299 - total} more for free delivery`}
                </span>
              </div>

              {/* Total row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Item Total</span>
                <span className="font-bold text-white">₹{total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Delivery Fee</span>
                <span className={`font-bold text-sm ${total >= 299 ? "text-green-400" : "text-white"}`}>
                  {total >= 299 ? "FREE" : "₹40"}
                </span>
              </div>
              <div className="h-px bg-[#1e1e1e]" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Grand Total</span>
                <span className="font-black text-xl text-[#c9a84c]">
                  ₹{total >= 299 ? total : total + 40}
                </span>
              </div>

              {/* Checkout button */}
              <Link to="/checkout" onClick={closeCart} className="block">
                <Button className="w-full h-12 bg-[#c9a84c] hover:bg-[#b8943d] text-black font-black rounded-xl gap-2 text-base">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
