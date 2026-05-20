'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, ClipboardList, Scan, Syringe, Plus, ChevronDown, ChevronUp, Brain, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore, useHealthVaultStore, useFamilyStore } from '@/lib/store';
import type { HealthRecord } from '@/lib/types';

const typeIcon = (type: string) => {
  switch (type) {
    case 'lab_report': return <FileText className="w-5 h-5 text-teal-600" />;
    case 'prescription': return <ClipboardList className="w-5 h-5 text-emerald-600" />;
    case 'imaging': return <Scan className="w-5 h-5 text-cyan-600" />;
    case 'vaccination': return <Syringe className="w-5 h-5 text-amber-600" />;
    default: return <FileText className="w-5 h-5 text-gray-600" />;
  }
};

const typeLabel = (type: string) => {
  switch (type) {
    case 'lab_report': return 'Lab Report';
    case 'prescription': return 'Prescription';
    case 'imaging': return 'Imaging';
    case 'vaccination': return 'Vaccination';
    default: return 'Other';
  };
};

const typeColor = (type: string) => {
  switch (type) {
    case 'lab_report': return 'bg-teal-100 text-teal-700';
    case 'prescription': return 'bg-emerald-100 text-emerald-700';
    case 'imaging': return 'bg-cyan-100 text-cyan-700';
    case 'vaccination': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function HealthVaultScreen() {
  const { goBack, setScreen } = useAppStore();
  const { records, deleteRecord, reportAnalyses } = useHealthVaultStore();
  const { members } = useFamilyStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [memberFilter, setMemberFilter] = useState('all');

  // Add Record Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'lab_report' as HealthRecord['type'],
    title: '',
    date: new Date().toISOString().split('T')[0],
    provider: '',
    tags: '',
  });

  const filteredRecords = records.filter(r =>
    memberFilter === 'all' || r.memberId === memberFilter
  );

  const handleAddRecord = () => {
    if (!newRecord.title.trim()) return;
    const record: HealthRecord = {
      id: 'record_' + Date.now(),
      type: newRecord.type,
      title: newRecord.title,
      date: newRecord(newRecord.date).toISOString(),
      provider: newRecord.provider,
      tags: newRecord.tags.split(',').map(t => t.trim()).filter(Boolean),
      memberId: memberFilter !== 'all' ? memberFilter : undefined,
    };
    useHealthVaultStore.getState().addRecord(record);
    setDialogOpen(false);
    setNewRecord({
      type: 'lab_report',
      title: '',
      date: new Date().toISOString().split('T')[0],
      provider: '',
      tags: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-teal-100 px-4 py-3 flex items-center gap-3">
        <button onClick={goBack} className="p-2 rounded-xl hover:bg-teal-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-teal-700" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Shield className="w-5 h-5 text-teal-600" />
          <h1 className="text-lg font-bold text-foreground">Health Vault</h1>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white h-8">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Add Health Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-sm">Type</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(['lab_report', 'prescription', 'imaging', 'vaccination', 'other'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewRecord(prev => ({ ...prev, type: t }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        newRecord.type === t ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {typeLabel(t)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm">Title *</Label>
                <Input
                  value={newRecord.title}
                  onChange={e => setNewRecord(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Blood Test Report"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Date</Label>
                <Input
                  type="date"
                  value={newRecord.date}
                  onChange={e => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Provider / Hospital</Label>
                <Input
                  value={newRecord.provider}
                  onChange={e => setNewRecord(prev => ({ ...prev, provider: e.target.value }))}
                  placeholder="e.g., Apollo Hospital"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Tags (comma separated)</Label>
                <Input
                  value={newRecord.tags}
                  onChange={e => setNewRecord(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., blood, sugar, thyroid"
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddRecord} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Save Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-4 py-4 pb-24 max-w-lg mx-auto">
        {/* Member Filter */}
        {members.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
            <button
              onClick={() => setMemberFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                memberFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              All Members
            </button>
            {members.map(m => (
              <button
                key={m.id}
                onClick={() => setMemberFilter(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  memberFilter === m.id ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-4 h-9">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="lab_report" className="text-xs">Labs</TabsTrigger>
            <TabsTrigger value="prescription" className="text-xs">Rx</TabsTrigger>
            <TabsTrigger value="imaging" className="text-xs">Imaging</TabsTrigger>
            <TabsTrigger value="vaccination" className="text-xs">Vaccines</TabsTrigger>
          </TabsList>

          {['all', 'lab_report', 'prescription', 'imaging', 'vaccination'].map(tab => (
            <TabsContent key={tab} value={tab}>
              {filteredRecords
                .filter(r => tab === 'all' || r.type === tab)
                .length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-muted-foreground">No records yet</h3>
                  <p className="text-sm text-muted-foreground">Upload your first report to get AI-powered insights</p>
                  <Button
                    onClick={() => setScreen('report-analyzer')}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Upload Report
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRecords
                    .filter(r => tab === 'all' || r.type === tab)
                    .map((record, i) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="border-gray-100 overflow-hidden">
                          <button
                            onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                            className="w-full text-left"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                                  {typeIcon(record.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="font-medium text-sm">{record.title}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{record.provider || 'Unknown provider'}</p>
                                    </div>
                                    {expandedId === record.id ? (
                                      <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className={`text-xs ${typeColor(record.type)}`}>
                                      {typeLabel(record.type)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                  {record.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {record.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-xs py-0">{tag}</Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {expandedId === record.id && record.aiSummary && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-3 pt-3 border-t border-gray-100"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Brain className="w-4 h-4 text-teal-600" />
                                    <span className="text-xs font-medium text-teal-700">AI Summary</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{record.aiSummary}</p>
                                </motion.div>
                              )}
                            </CardContent>
                          </button>
                          {expandedId === record.id && (
                            <div className="px-4 pb-3 flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteRecord(record.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 text-xs"
                              >
                                <Trash2 className="w-3 h-3 mr-1" /> Delete
                              </Button>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* AI Analyses Section */}
        {reportAnalyses.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal-600" />
              AI Report Analyses
            </h3>
            {reportAnalyses.map(analysis => (
              <Card key={analysis.id} className="border-teal-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{analysis.fileName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(analysis.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge className={
                      analysis.riskLevel === 'low' ? 'bg-emerald-100 text-emerald-700' :
                      analysis.riskLevel === 'moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} Risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{analysis.summary}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScreen('report-analyzer')}
                    className="mt-2 h-7 text-xs border-teal-200 text-teal-700"
                  >
                    View Full Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
