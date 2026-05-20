'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, Plus, Bell, ShoppingCart, Stethoscope, ChevronDown, ChevronUp, Trash2, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore, usePrescriptionStore, useReminderStore, useCartStore } from '@/lib/store';
import { MEDICINES } from '@/lib/medicines-data';
import type { Prescription, PrescriptionMedicine, Reminder } from '@/lib/types';
import { toast } from 'sonner';

export default function PrescriptionScreen() {
  const { goBack, setScreen } = useAppStore();
  const { prescriptions, addPrescription } = usePrescriptionStore();
  const { addReminder } = useReminderStore();
  const { addItem } = useCartStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    doctorName: '',
    hospital: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] as PrescriptionMedicine[],
  });

  const addMedicineRow = () => {
    setForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    }));
  };

  const removeMedicineRow = (index: number) => {
    setForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const updateMedicineRow = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    setForm(prev => ({
      ...prev,
      medicines: prev.medicines.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }));
  };

  const handleSave = () => {
    if (!form.doctorName.trim() || !form.diagnosis.trim()) return;
    const prescription: Prescription = {
      id: 'rx_' + Date.now(),
      doctorName: form.doctorName,
      hospital: form.hospital,
      date: new Date(form.date).toISOString(),
      diagnosis: form.diagnosis,
      medicines: form.medicines.filter(m => m.name.trim()),
      notes: form.notes || undefined,
    };
    addPrescription(prescription);
    setDialogOpen(false);
    setForm({
      doctorName: '', hospital: '', date: new Date().toISOString().split('T')[0],
      diagnosis: '', notes: '',
      medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    });
    toast.success('Prescription saved successfully!');
  };

  const handleSetReminders = (rx: Prescription) => {
    rx.medicines.forEach(med => {
      const reminder: Reminder = {
        id: 'rem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        medicineName: med.name,
        dosage: med.dosage || 'As prescribed',
        frequency: med.frequency || 'As directed',
        times: med.frequency?.includes('twice') ? ['8:00 AM', '8:00 PM'] :
               med.frequency?.includes('three') ? ['8:00 AM', '2:00 PM', '8:00 PM'] :
               ['8:00 AM'],
        startDate: rx.date,
        endDate: med.duration ? new Date(Date.now() + parseDuration(med.duration)).toISOString() : undefined,
        isActive: true,
        notes: `From Dr. ${rx.doctorName}`,
      };
      addReminder(reminder);
    });
    toast.success(`Reminders set for ${rx.medicines.length} medicine(s)!`);
  };

  const handleOrderMedicines = (rx: Prescription) => {
    let addedCount = 0;
    rx.medicines.forEach(med => {
      const found = MEDICINES.find(m =>
        m.name.toLowerCase().includes(med.name.toLowerCase()) ||
        m.genericName.toLowerCase().includes(med.name.toLowerCase())
      );
      if (found) {
        addItem(found);
        addedCount++;
      } else {
        // Add generic medicine entry
        addItem({
          id: 'gen_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          name: med.name,
          genericName: med.name,
          manufacturer: 'Generic',
          price: 0,
          dosageForm: 'Tablet',
          strength: med.dosage || '',
          packSize: '1 unit',
          category: 'General',
          prescription: true,
          description: `Prescribed by Dr. ${rx.doctorName}`,
          uses: [],
          sideEffects: [],
          inStock: true,
          rating: 0,
        });
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(`${addedCount} medicine(s) added to cart!`);
      setScreen('cart');
    } else {
      toast.error('No matching medicines found in our catalog');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-teal-100 px-4 py-3 flex items-center gap-3">
        <button onClick={goBack} className="p-2 rounded-xl hover:bg-teal-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-teal-700" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <ClipboardList className="w-5 h-5 text-teal-600" />
          <h1 className="text-lg font-bold text-foreground">Prescriptions</h1>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white h-8">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Prescription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-sm">Doctor Name *</Label>
                <Input value={form.doctorName} onChange={e => setForm(p => ({ ...p, doctorName: e.target.value }))} placeholder="Dr. Sharma" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Hospital / Clinic</Label>
                <Input value={form.hospital} onChange={e => setForm(p => ({ ...p, hospital: e.target.value }))} placeholder="Apollo Hospital" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Diagnosis *</Label>
                  <Input value={form.diagnosis} onChange={e => setForm(p => ({ ...p, diagnosis: e.target.value }))} placeholder="Type 2 Diabetes" className="mt-1" />
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">Medicines</Label>
                  <Button variant="outline" size="sm" onClick={addMedicineRow} className="h-7 text-xs border-teal-200 text-teal-700">
                    <Plus className="w-3 h-3 mr-1" /> Add Medicine
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.medicines.map((med, i) => (
                    <Card key={i} className="border-gray-100">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Medicine {i + 1}</span>
                          {form.medicines.length > 1 && (
                            <button onClick={() => removeMedicineRow(i)} className="text-red-400 hover:text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <Input value={med.name} onChange={e => updateMedicineRow(i, 'name', e.target.value)} placeholder="Medicine name" className="h-8 text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={med.dosage} onChange={e => updateMedicineRow(i, 'dosage', e.target.value)} placeholder="Dosage" className="h-8 text-sm" />
                          <Input value={med.frequency} onChange={e => updateMedicineRow(i, 'frequency', e.target.value)} placeholder="Frequency" className="h-8 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={med.duration} onChange={e => updateMedicineRow(i, 'duration', e.target.value)} placeholder="Duration" className="h-8 text-sm" />
                          <Input value={med.instructions} onChange={e => updateMedicineRow(i, 'instructions', e.target.value)} placeholder="Instructions" className="h-8 text-sm" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm">Notes</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Additional notes..." className="mt-1" rows={2} />
              </div>

              <Button onClick={handleSave} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Save Prescription
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-4 py-4 pb-24 max-w-lg mx-auto">
        {prescriptions.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
              <ClipboardList className="w-10 h-10 text-teal-400" />
            </div>
            <h2 className="text-xl font-bold">No Prescriptions Yet</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Upload a prescription or add one manually to track your medications</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setScreen('report-analyzer')} variant="outline" className="border-teal-200 text-teal-700">
                Upload Prescription
              </Button>
              <Button onClick={() => setDialogOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Manually
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((rx, i) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedId(expandedId === rx.id ? null : rx.id)}
                    className="w-full text-left"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{rx.doctorName}</p>
                              <p className="text-xs text-muted-foreground">{rx.hospital || 'No hospital specified'}</p>
                            </div>
                            {expandedId === rx.id ? (
                              <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="text-xs bg-teal-100 text-teal-700">{rx.diagnosis}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(rx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{rx.medicines.length} medicine(s)</p>
                        </div>
                      </div>

                      {expandedId === rx.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 pt-3 border-t border-gray-100 space-y-2"
                        >
                          {rx.medicines.map((med, j) => (
                            <div key={j} className="p-2 rounded-lg bg-gray-50 text-sm">
                              <p className="font-medium">{med.name}</p>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                                {med.dosage && <span>Dosage: {med.dosage}</span>}
                                {med.frequency && <span>Frequency: {med.frequency}</span>}
                                {med.duration && <span>Duration: {med.duration}</span>}
                              </div>
                              {med.instructions && (
                                <p className="text-xs text-teal-600 mt-0.5">{med.instructions}</p>
                              )}
                            </div>
                          ))}
                          {rx.notes && (
                            <p className="text-xs text-muted-foreground italic p-2 bg-amber-50 rounded-lg">
                              Note: {rx.notes}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleSetReminders(rx); }}
                              className="h-7 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                            >
                              <Bell className="w-3 h-3 mr-1" /> Set Reminders
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); handleOrderMedicines(rx); }}
                              className="h-7 text-xs border-emerald-200 text-emerald-700"
                            >
                              <ShoppingCart className="w-3 h-3 mr-1" /> Order Medicines
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); setScreen('telemedicine'); }}
                              className="h-7 text-xs border-gray-200 text-gray-600"
                            >
                              <Stethoscope className="w-3 h-3 mr-1" /> Re-consult
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)\s*(day|week|month)/i);
  if (!match) return 30 * 24 * 60 * 60 * 1000; // default 30 days
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  switch (unit) {
    case 'day': return num * 24 * 60 * 60 * 1000;
    case 'week': return num * 7 * 24 * 60 * 60 * 1000;
    case 'month': return num * 30 * 24 * 60 * 60 * 1000;
    default: return 30 * 24 * 60 * 60 * 1000;
  }
}
