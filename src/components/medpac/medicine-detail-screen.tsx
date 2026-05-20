'use client';

import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Pill,
  Package,
  Building2,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore, useCartStore } from '@/lib/store';
import { MEDICINES } from '@/lib/medicines-data';
import { useToast } from '@/hooks/use-toast';

// ─── Rating Stars (detail version) ────────────────────────────
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && (
        <div className="relative h-4 w-4">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="ml-1.5 text-sm text-muted-foreground font-medium">{rating} / 5</span>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center">
        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm text-foreground font-semibold">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Medicine Detail Screen ──────────────────────────────
export default function MedicineDetailScreen() {
  const { selectedMedicineId, goBack, setScreen } = useAppStore();
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const { toast } = useToast();

  const medicine = useMemo(
    () => MEDICINES.find((m) => m.id === selectedMedicineId) ?? null,
    [selectedMedicineId]
  );

  const hasDiscount = medicine
    ? medicine.discountPrice !== undefined && medicine.discountPrice < medicine.price
    : false;
  const discountPct = hasDiscount && medicine
    ? Math.round(((medicine.price - medicine.discountPrice!) / medicine.price) * 100)
    : 0;

  const handleAddToCart = useCallback(() => {
    if (!medicine) return;
    addItem(medicine);
    toast({
      title: 'Added to cart',
      description: `${medicine.name} has been added to your cart`,
    });
  }, [medicine, addItem, toast]);

  // Fallback if no medicine is selected
  if (!medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-950 dark:to-emerald-950/10 flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground mb-4">No medicine selected</p>
        <Button
          onClick={() => setScreen('medicine')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Browse Medicines
        </Button>
      </div>
    );
  }

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
          <h1 className="text-lg font-bold text-foreground">Medicine Details</h1>
          <button
            type="button"
            className="relative p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
            onClick={() => setScreen('cart')}
            aria-label={`Cart with ${cartCount} items`}
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-emerald-600 text-white text-[10px] font-bold px-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pt-4 pb-28 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/60 shadow-md shadow-emerald-500/5 overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
                    <Pill className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Badges row */}
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      {medicine.prescription && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-0 text-[10px] font-bold px-2 py-0.5">
                          Rx Prescription Required
                        </Badge>
                      )}
                      {hasDiscount && (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-0 text-[10px] font-bold px-2 py-0.5">
                          {discountPct}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Name */}
                    <h2 className="text-xl font-bold text-foreground leading-tight">
                      {medicine.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {medicine.genericName}
                    </p>

                    {/* Rating */}
                    <div className="mt-2">
                      <RatingStars rating={medicine.rating} />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Price section */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    ₹{hasDiscount ? medicine.discountPrice : medicine.price}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-muted-foreground line-through">
                        ₹{medicine.price}
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs font-bold">
                        Save ₹{medicine.price - medicine.discountPrice!}
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-border/60 shadow-md shadow-emerald-500/5">
              <CardContent className="p-0">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent h-auto p-0">
                    <TabsTrigger
                      value="overview"
                      className="flex-1 py-3 text-sm font-semibold data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none dark:data-[state=active]:text-emerald-400 rounded-none"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="uses"
                      className="flex-1 py-3 text-sm font-semibold data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none dark:data-[state=active]:text-emerald-400 rounded-none"
                    >
                      Uses
                    </TabsTrigger>
                    <TabsTrigger
                      value="side-effects"
                      className="flex-1 py-3 text-sm font-semibold data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:shadow-none dark:data-[state=active]:text-emerald-400 rounded-none"
                    >
                      Side Effects
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="p-5 space-y-1">
                    <p className="text-sm text-foreground leading-relaxed mb-4">
                      {medicine.description}
                    </p>
                    <InfoRow icon={Building2} label="Manufacturer" value={medicine.manufacturer} />
                    <InfoRow icon={Pill} label="Dosage Form" value={medicine.dosageForm} />
                    <InfoRow icon={Ruler} label="Strength" value={medicine.strength} />
                    <InfoRow icon={Package} label="Pack Size" value={medicine.packSize} />
                  </TabsContent>

                  {/* Uses Tab */}
                  <TabsContent value="uses" className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="text-sm font-semibold text-foreground">Indications & Uses</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {medicine.uses.map((use) => (
                        <Badge
                          key={use}
                          variant="outline"
                          className="px-3 py-1.5 text-sm font-medium border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                        >
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Side Effects Tab */}
                  <TabsContent value="side-effects" className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-foreground">Possible Side Effects</h3>
                    </div>
                    <div className="space-y-2">
                      {medicine.sideEffects.map((effect) => (
                        <div
                          key={effect}
                          className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          <span className="text-sm text-foreground font-medium">{effect}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 italic">
                      Not all side effects are listed here. Consult your doctor for medical advice.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-border/50 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleAddToCart}
            className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart — ₹{hasDiscount ? medicine.discountPrice : medicine.price}
          </Button>
        </div>
      </div>
    </div>
  );
}
