'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  ShoppingCart,
  Pill,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore, useCartStore } from '@/lib/store';
import type { Medicine } from '@/lib/types';
import { MEDICINES, MEDICINE_CATEGORIES } from '@/lib/medicines-data';

// ─── Rating Stars ─────────────────────────────────────────────
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && (
        <div className="relative h-3 w-3">
          <Star className="h-3 w-3 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} className="h-3 w-3 text-gray-300" />
      ))}
      <span className="ml-1 text-xs text-muted-foreground font-medium">{rating}</span>
    </div>
  );
}

// ─── Discount Badge ───────────────────────────────────────────
function DiscountBadge({ price, discountPrice }: { price: number; discountPrice?: number }) {
  if (!discountPrice) return null;
  const pct = Math.round(((price - discountPrice) / price) * 100);
  return (
    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-0 text-[10px] font-bold px-1.5 py-0.5">
      {pct}% OFF
    </Badge>
  );
}

// ─── Medicine Card ────────────────────────────────────────────
function MedicineCard({
  medicine,
  onCardClick,
  onAdd,
}: {
  medicine: Medicine;
  onCardClick: () => void;
  onAdd: (e: React.MouseEvent) => void;
}) {
  const hasDiscount = medicine.discountPrice && medicine.discountPrice < medicine.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        className="relative cursor-pointer border-border/40 bg-card hover:bg-surface-container transition-all duration-200 overflow-hidden rounded-2xl shadow-sm hover:shadow-md"
        onClick={onCardClick}
      >
        <CardContent className="p-4 space-y-3">
          {/* Top row: badges */}
          <div className="flex items-start justify-between gap-1">
            <div className="flex items-center gap-1 flex-wrap">
              {medicine.prescription && (
                <Badge className="bg-destructive/10 text-destructive border-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  Rx Required
                </Badge>
              )}
              <DiscountBadge price={medicine.price} discountPrice={medicine.discountPrice} />
            </div>
            <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 bg-muted/30 border-border/40 rounded-md">
              {medicine.category}
            </Badge>
          </div>

          {/* Medicine icon + name */}
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-container/10 flex items-center justify-center">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground truncate leading-tight">
                {medicine.name}
              </h3>
              <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                {medicine.genericName}
              </p>
            </div>
          </div>

          {/* Pack info */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            <span>{medicine.packSize}</span>
          </div>

          <Separator className="!mt-1 !mb-1 border-border/40" />

          {/* Price + Add */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-[10px] text-muted-foreground line-through">
                  MRP ₹{medicine.price}
                </span>
              )}
              <span className="text-base font-bold text-foreground">
                ₹{hasDiscount ? medicine.discountPrice : medicine.price}
              </span>
            </div>
            <Button
              size="sm"
              className="h-8 px-3.5 text-xs font-semibold bg-[#0ba68c] hover:bg-[#0ba68c]/90 text-white rounded-xl active:scale-95 transition-all cursor-pointer"
              onClick={onAdd}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>

          {/* Rating */}
          <RatingStars rating={medicine.rating} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Medicine Screen ─────────────────────────────────────
export default function MedicineScreen() {
  const { setScreen, setSelectedMedicineId } = useAppStore();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredMedicines = useMemo(() => {
    return MEDICINES.filter((m) => {
      const matchesCategory =
        activeCategory === 'All' || m.category === activeCategory;
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.genericName.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query) ||
        m.uses.some((u) => u.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleCardClick = useCallback(
    (id: string) => {
      setSelectedMedicineId(id);
      setScreen('medicine-detail');
    },
    [setSelectedMedicineId, setScreen]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, medicine: Medicine) => {
      e.stopPropagation();
      addItem(medicine);
    },
    [addItem]
  );

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-card border-b border-border/40 shadow-sm md:shadow-none">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 space-y-3">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-container">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Medicines</h1>
            </div>
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-muted text-on-surface-variant transition-colors active:scale-95 transition-transform cursor-pointer"
              onClick={() => setScreen('cart')}
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search medicines, health products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 text-sm bg-surface-container border-border/45 rounded-full"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
            {MEDICINE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95
                  ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Medicine Grid */}
      <main className="flex-1 px-4 pt-4 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Result count */}
          <p className="text-xs text-muted-foreground font-medium mb-3">
            {filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''} found
          </p>

          <AnimatePresence mode="popLayout">
            {filteredMedicines.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredMedicines.map((med) => (
                  <MedicineCard
                    key={med.id}
                    medicine={med}
                    onCardClick={() => handleCardClick(med.id)}
                    onAdd={(e) => handleAddToCart(e, med)}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">No medicines found</h3>
                <p className="text-sm text-muted-foreground max-w-[240px]">
                  Try a different search term or browse another category
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950"
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('All');
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
