'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Plus, Bell, Shield, Stethoscope, Trash2, Edit, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore, useFamilyStore } from '@/lib/store';
import type { FamilyMember } from '@/lib/types';

const RELATIONS = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const avatarColor = (gender: string) => {
  switch (gender) {
    case 'male': return 'bg-teal-100 text-teal-700';
    case 'female': return 'bg-pink-100 text-pink-700';
    default: return 'bg-purple-100 text-purple-700';
  }
};

export default function FamilyScreen() {
  const { goBack, setScreen, setSelectedFamilyMemberId } = useAppStore();
  const { members, addMember, removeMember, updateMember } = useFamilyStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', relation: 'Self', age: '', gender: 'male' as 'male' | 'female' | 'other',
    bloodGroup: '', allergies: '', conditions: '',
  });

  const resetForm = () => setForm({
    name: '', relation: 'Self', age: '', gender: 'male',
    bloodGroup: '', allergies: '', conditions: '',
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.age) return;
    const member: FamilyMember = {
      id: 'family_' + Date.now(),
      name: form.name,
      relation: form.relation,
      age: parseInt(form.age),
      gender: form.gender,
      bloodGroup: form.bloodGroup || undefined,
      allergies: form.allergies ? form.allergies.split(',').map(a => a.trim()).filter(Boolean) : [],
      conditions: form.conditions ? form.conditions.split(',').map(c => c.trim()).filter(Boolean) : [],
    };
    addMember(member);
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (member: FamilyMember) => {
    setEditId(member.id);
    setForm({
      name: member.name,
      relation: member.relation,
      age: member.age.toString(),
      gender: member.gender,
      bloodGroup: member.bloodGroup || '',
      allergies: member.allergies?.join(', ') || '',
      conditions: member.conditions?.join(', ') || '',
    });
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editId) return;
    updateMember(editId, {
      name: form.name,
      relation: form.relation,
      age: parseInt(form.age),
      gender: form.gender,
      bloodGroup: form.bloodGroup || undefined,
      allergies: form.allergies ? form.allergies.split(',').map(a => a.trim()).filter(Boolean) : [],
      conditions: form.conditions ? form.conditions.split(',').map(c => c.trim()).filter(Boolean) : [],
    });
    setEditId(null);
    setDialogOpen(false);
    resetForm();
  };

  const detailMember = detailId ? members.find(m => m.id === detailId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-teal-100 px-4 py-3 flex items-center gap-3">
        <button onClick={goBack} className="p-2 rounded-xl hover:bg-teal-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-teal-700" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Users className="w-5 h-5 text-teal-600" />
          <h1 className="text-lg font-bold text-foreground">Family Health</h1>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) { setEditId(null); resetForm(); }
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white h-8">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Member' : 'Add Family Member'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-sm">Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Relation</Label>
                  <Select value={form.relation} onValueChange={v => setForm(p => ({ ...p, relation: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{RELATIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Age *</Label>
                  <Input type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} placeholder="Age" className="mt-1" min={0} max={120} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Gender</Label>
                  <Select value={form.gender} onValueChange={v => setForm(p => ({ ...p, gender: v as 'male' | 'female' | 'other' }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Blood Group</Label>
                  <Select value={form.bloodGroup} onValueChange={v => setForm(p => ({ ...p, bloodGroup: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm">Allergies (comma separated)</Label>
                <Input value={form.allergies} onChange={e => setForm(p => ({ ...p, allergies: e.target.value }))} placeholder="e.g., Penicillin, Peanuts" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Conditions (comma separated)</Label>
                <Input value={form.conditions} onChange={e => setForm(p => ({ ...p, conditions: e.target.value }))} placeholder="e.g., Diabetes, Hypertension" className="mt-1" />
              </div>
              <Button onClick={editId ? handleUpdate : handleAdd} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                {editId ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-4 py-4 pb-24 max-w-lg mx-auto">
        {detailMember ? (
          /* Detail View */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <button onClick={() => setDetailId(null)} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to all members
            </button>
            <Card className="border-teal-100">
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className={`text-2xl font-bold ${avatarColor(detailMember.gender)}`}>
                    {detailMember.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{detailMember.name}</h2>
                <p className="text-muted-foreground">{detailMember.relation} • {detailMember.age} years</p>
                {detailMember.bloodGroup && (
                  <Badge className="mt-2 bg-red-100 text-red-700">{detailMember.bloodGroup}</Badge>
                )}
              </CardContent>
            </Card>

            {detailMember.conditions && detailMember.conditions.length > 0 && (
              <Card className="border-teal-100">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2">Health Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailMember.conditions.map(c => (
                      <Badge key={c} className="bg-amber-100 text-amber-700">{c}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {detailMember.allergies && detailMember.allergies.length > 0 && (
              <Card className="border-teal-100">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailMember.allergies.map(a => (
                      <Badge key={a} variant="outline" className="text-red-600 border-red-200">{a}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => { setSelectedFamilyMemberId(detailMember.id); setScreen('reminders'); }} variant="outline" className="border-teal-200 text-teal-700 h-auto py-3 flex-col gap-1">
                <Bell className="w-5 h-5" />
                <span className="text-xs">Set Reminders</span>
              </Button>
              <Button onClick={() => setScreen('health-vault')} variant="outline" className="border-teal-200 text-teal-700 h-auto py-3 flex-col gap-1">
                <Shield className="w-5 h-5" />
                <span className="text-xs">View Records</span>
              </Button>
              <Button onClick={() => setScreen('telemedicine')} variant="outline" className="border-teal-200 text-teal-700 h-auto py-3 flex-col gap-1">
                <Stethoscope className="w-5 h-5" />
                <span className="text-xs">Consult Doctor</span>
              </Button>
              <Button onClick={() => handleEdit(detailMember)} variant="outline" className="border-teal-200 text-teal-700 h-auto py-3 flex-col gap-1">
                <Edit className="w-5 h-5" />
                <span className="text-xs">Edit Profile</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => { removeMember(detailMember.id); setDetailId(null); }}
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove Member
            </Button>
          </motion.div>
        ) : members.length === 0 ? (
          /* Empty State */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-teal-400" />
            </div>
            <h2 className="text-xl font-bold">No Family Members Yet</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">Add your family members to manage their health profiles and set medicine reminders</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" /> Add Family Member
            </Button>
          </motion.div>
        ) : (
          /* Members List */
          <div className="space-y-3">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="border-gray-100 cursor-pointer hover:border-teal-200 transition-colors"
                  onClick={() => setDetailId(member.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className={`font-bold ${avatarColor(member.gender)}`}>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{member.name}</p>
                          {member.bloodGroup && (
                            <Badge className="text-xs bg-red-100 text-red-700 py-0">{member.bloodGroup}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.relation} • {member.age} years</p>
                        {member.conditions && member.conditions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.conditions.slice(0, 3).map(c => (
                              <Badge key={c} variant="outline" className="text-xs py-0">{c}</Badge>
                            ))}
                            {member.conditions.length > 3 && (
                              <Badge variant="outline" className="text-xs py-0">+{member.conditions.length - 3}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
