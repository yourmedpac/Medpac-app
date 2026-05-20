'use client';

import { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Pill,
  ArrowLeft,
  Truck,
  Tag,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore, useCartStore } from '@/lib/store';
import type { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_FEE = 49;

// ─── Cart Item Row ────────────────────────────────────────────
function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  const effectivePrice = item.medicine.discountPrice ?? item.medicine.price;
  const lineTotal = effectivePrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 pb-4 mb-4 border-b border-border/40 last:border-0 last:mb-0 last:pb-0"
    >
      {/* Medicine icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
        <Pill className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {item.medicine.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {item.medicine.genericName}
            </p>
          </div>
          {/* Remove */}
          <button
            type="button"
            onClick={onRemove}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors group"
            aria-label={`Remove ${item.medicine.name}`}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-red-500 dark:group-hover:text-red-400" />
          </button>
        </div>

        {/* Price + Quantity */}
        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-0 border border-border/60 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={onDecrement}
              className="flex items-center justify-center w-8 h-8 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-foreground bg-muted/30">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              className="flex items-center justify-center w-8 h-8 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Line price */}
          <div className="text-right">
            <span className="text-sm font-bold text-foreground">₹{lineTotal}</span>
            {item.medicine.discountPrice && (
              <span className="text-[10px] text-muted-foreground line-through ml-1">
                ₹{item.medicine.price * item.quantity}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Cart Screen ─────────────────────────────────────────
export default function CartScreen() {
  const { setScreen, goBack } = useAppStore();
  const { items, updateQuantity, removeItem, clearCart, total } = useCartStore();
  const { toast } = useToast();

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, i) => sum + i.medicine.price * i.quantity,
      0
    );
  }, [items]);

  const discountAmount = useMemo(() => {
    return subtotal - total();
  }, [subtotal, total]);

  const totalAmount = total();
  const isFreeDelivery = totalAmount >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
  const finalTotal = totalAmount + deliveryFee;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const amountForFreeDelivery = FREE_DELIVERY_THRESHOLD - totalAmount;

  const handleCheckout = useCallback(() => {
    toast({
      title: 'Order placed successfully!',
      description: `Your order of ₹${finalTotal} has been placed`,
    });
    clearCart();
  }, [toast, clearCart, finalTotal]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-950 dark:to-emerald-950/10 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">Your Cart</h1>
            {itemCount > 0 && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs font-bold px-2 py-0.5">
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pt-4 pb-20">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              <>
                {/* Free delivery progress */}
                {!isFreeDelivery && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40"
                  >
                    <Truck className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                      Add ₹{amountForFreeDelivery} more for FREE delivery
                    </p>
                  </motion.div>
                )}

                {isFreeDelivery && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40"
                  >
                    <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                      You qualify for FREE delivery! 🎉
                    </p>
                  </motion.div>
                )}

                {/* Cart items */}
                <Card className="border-border/60 shadow-md shadow-emerald-500/5">
                  <CardContent className="p-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <CartItemRow
                          key={item.medicine.id}
                          item={item}
                          onIncrement={() =>
                            updateQuantity(item.medicine.id, item.quantity + 1)
                          }
                          onDecrement={() =>
                            updateQuantity(item.medicine.id, item.quantity - 1)
                          }
                          onRemove={() => removeItem(item.medicine.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="border-border/60 shadow-md shadow-emerald-500/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal (MRP)</span>
                      <span className="text-foreground font-medium">₹{subtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Tag className="h-3 w-3 text-emerald-500" />
                          Discount
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          - ₹{discountAmount}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        Delivery Fee
                      </span>
                      <span
                        className={`font-medium ${
                          isFreeDelivery
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        }`}
                      >
                        {isFreeDelivery ? 'FREE' : `₹${DELIVERY_FEE}`}
                      </span>
                    </div>

                    <Separator className="!my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-foreground">Total Amount</span>
                      <span className="text-lg font-bold text-foreground">₹{finalTotal}</span>
                    </div>

                    {discountAmount > 0 && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        You are saving ₹{discountAmount + (isFreeDelivery ? DELIVERY_FEE : 0)} on this order
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                >
                  Proceed to Checkout — ₹{finalTotal}
                </Button>
              </>
            ) : (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-[260px] mb-6">
                  Add medicines to your cart and they will appear here
                </p>
                <Button
                  onClick={() => setScreen('medicine')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8"
                >
                  <Pill className="mr-2 h-4 w-4" />
                  Browse Medicines
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
