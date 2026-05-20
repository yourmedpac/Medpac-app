import 'package:flutter/material.dart';

class RecordsScreen extends StatefulWidget {
  const RecordsScreen({super.key});

  @override
  State<RecordsScreen> createState() => _RecordsScreenState();
}

class _RecordsScreenState extends State<RecordsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _records = [
    {
      'id': '1',
      'title': 'Complete Blood Count (CBC)',
      'date': 'May 12, 2026',
      'clinic': 'City Diagnostics Lab',
      'type': 'Lab Results',
      'status': 'Analyzed',
      'summary': 'Hemoglobin (14.2 g/dL) is normal. Vitamin D3 (21 ng/mL) is slightly low (insufficient). Cholesterol (210 mg/dL) is borderline high.',
    },
    {
      'id': '2',
      'title': 'COVID-19 Vaccination Certificate',
      'date': 'Dec 18, 2023',
      'clinic': 'Health Ministry Office',
      'type': 'Vaccines',
      'status': 'Verified',
      'summary': '3rd dose Pfizer-BioNTech booster administered successfully.',
    },
    {
      'id': '3',
      'title': 'Prescription - Cardiology Consultation',
      'date': 'Oct 04, 2025',
      'clinic': 'Dr. Connor\'s Heart Clinic',
      'type': 'Prescriptions',
      'status': 'Analyzed',
      'summary': 'Prescribed Atorvastatin 10mg once daily at night. Follow up in 6 months.',
    },
  ];

  final List<Map<String, dynamic>> _mockUploadReports = [
    {
      'title': 'Thyroid Profile (T3, T4, TSH)',
      'clinic': 'Metro Thyroid Care',
      'type': 'Lab Results',
      'summary': 'TSH levels are elevated (5.4 uIU/mL), indicating mild subclinical hypothyroidism. T3 and T4 levels are within normal physiological ranges. Consult doctor for potential low-dose levothyroxine.',
    },
    {
      'title': 'Lipid Profile (Fast, Serum)',
      'clinic': 'Acura Labs & Diagnostics',
      'type': 'Lab Results',
      'summary': 'Total cholesterol (224 mg/dL) is high. LDL cholesterol (142 mg/dL) is borderline high. Triglycerides (155 mg/dL) are slightly elevated. Recommend dietary changes, cardiovascular exercise, and check-up in 3 months.',
    },
    {
      'title': 'Chest X-Ray Diagnostic Report',
      'clinic': 'Max Hospital Radiology',
      'type': 'Lab Results',
      'summary': 'Bony thorax and soft tissues are unremarkable. Heart size is normal. Lungs are clear, no focal consolidation, pleural effusion, or pneumothorax. Impression: Normal chest radiograph.',
    },
  ];

  void _showUploadDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28.0)),
          ),
          padding: EdgeInsets.only(
            left: 24.0,
            right: 24.0,
            top: 24.0,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24.0,
          ),
          child: _UploadSimulationWidget(
            mockReports: _mockUploadReports,
            onUploadComplete: (newRecord) {
              setState(() {
                _records.insert(0, newRecord);
              });
            },
            onViewSummary: (record) {
              _showSummaryModal(record);
            },
          ),
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showSummaryModal(Map<String, dynamic> record) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final theme = Theme.of(context);
        final colorScheme = theme.colorScheme;

        return Container(
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(24.0),
              topRight: Radius.circular(24.0),
            ),
          ),
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40.0,
                  height: 4.0,
                  decoration: BoxDecoration(
                    color: colorScheme.onSurface.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
              ),
              const SizedBox(height: 24.0),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10.0),
                    decoration: BoxDecoration(
                      color: colorScheme.primary.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.analytics_rounded, color: colorScheme.primary),
                  ),
                  const SizedBox(width: 14.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          record['title'],
                          style: const TextStyle(
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '${record['clinic']} • ${record['date']}',
                          style: TextStyle(
                            fontSize: 12.0,
                            color: colorScheme.onSurface.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20.0),
              const Divider(),
              const SizedBox(height: 16.0),
              const Text(
                'AI Analysis Summary',
                style: TextStyle(
                  fontSize: 15.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8.0),
              Text(
                record['summary'],
                style: TextStyle(
                  fontSize: 14.0,
                  color: colorScheme.onSurface.withOpacity(0.8),
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 24.0),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colorScheme.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14.0),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 14.0),
                  ),
                  child: const Text('Close'),
                ),
              ),
              const SizedBox(height: 16.0),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Health Records',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: colorScheme.onBackground,
          ),
        ),
      ),
      body: Column(
        children: [
          // Upload PDF Record Box
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 28.0, horizontal: 20.0),
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: BorderRadius.circular(20.0),
                border: Border.all(
                  color: colorScheme.primary.withOpacity(0.3),
                  style: BorderStyle.solid,
                  width: 1.5,
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.cloud_upload_outlined,
                    size: 38.0,
                    color: colorScheme.primary,
                  ),
                  const SizedBox(height: 12.0),
                  Text(
                    'Upload Medical PDF Reports',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15.0,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 4.0),
                  Text(
                    'AI will automatically parse and summarize key metrics.',
                    style: TextStyle(
                      fontSize: 11.5,
                      color: colorScheme.onSurface.withOpacity(0.5),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16.0),
                  ElevatedButton(
                    onPressed: _showUploadDialog,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                    ),
                    child: const Text('Select File'),
                  ),
                ],
              ),
            ),
          ),

          // Tab Bar selector
          TabBar(
            controller: _tabController,
            isScrollable: true,
            labelColor: colorScheme.primary,
            unselectedLabelColor: colorScheme.onSurface.withOpacity(0.5),
            indicatorColor: colorScheme.primary,
            tabs: const [
              Tab(text: 'All Reports'),
              Tab(text: 'Lab Results'),
              Tab(text: 'Prescriptions'),
              Tab(text: 'Vaccines'),
            ],
          ),

          // Tab views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildRecordsList(_records, colorScheme),
                _buildRecordsList(_records.where((r) => r['type'] == 'Lab Results').toList(), colorScheme),
                _buildRecordsList(_records.where((r) => r['type'] == 'Prescriptions').toList(), colorScheme),
                _buildRecordsList(_records.where((r) => r['type'] == 'Vaccines').toList(), colorScheme),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecordsList(List<Map<String, dynamic>> recordsList, ColorScheme colorScheme) {
    if (recordsList.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.folder_open_rounded, size: 48.0, color: colorScheme.onSurface.withOpacity(0.24)),
            const SizedBox(height: 12.0),
            Text(
              'No records in this category.',
              style: TextStyle(color: colorScheme.onSurface.withOpacity(0.4)),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20.0),
      itemCount: recordsList.length,
      itemBuilder: (context, index) {
        final record = recordsList[index];

        return Container(
          margin: const EdgeInsets.only(bottom: 12.0),
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: colorScheme.surface,
            borderRadius: BorderRadius.circular(18.0),
            border: Border.all(
              color: colorScheme.onSurface.withOpacity(0.08),
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10.0),
                decoration: BoxDecoration(
                  color: colorScheme.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Icon(
                  record['type'] == 'Prescriptions'
                      ? Icons.description_rounded
                      : record['type'] == 'Vaccines'
                          ? Icons.vaccines_rounded
                          : Icons.science_rounded,
                  color: colorScheme.primary,
                ),
              ),
              const SizedBox(width: 16.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      record['title'],
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14.5,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      '${record['clinic']} • ${record['date']}',
                      style: TextStyle(
                        fontSize: 11.5,
                        color: colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8.0),
              // Analyzed Status Chip Action
              GestureDetector(
                onTap: () => _showSummaryModal(record),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 6.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        colorScheme.primary,
                        colorScheme.secondary,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: const Text(
                    'AI Summary',
                    style: TextStyle(
                      fontSize: 10.5,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _UploadSimulationWidget extends StatefulWidget {
  final List<Map<String, dynamic>> mockReports;
  final Function(Map<String, dynamic>) onUploadComplete;
  final Function(Map<String, dynamic>) onViewSummary;

  const _UploadSimulationWidget({
    required this.mockReports,
    required this.onUploadComplete,
    required this.onViewSummary,
  });

  @override
  State<_UploadSimulationWidget> createState() => _UploadSimulationWidgetState();
}

class _UploadSimulationWidgetState extends State<_UploadSimulationWidget> {
  int _step = 0; // 0: Select, 1: Progress, 2: Success
  double _progress = 0.0;
  String _statusText = 'Initializing...';
  Map<String, dynamic>? _selectedReport;
  Map<String, dynamic>? _completedRecord;

  void _runSimulation(Map<String, dynamic> report) async {
    setState(() {
      _selectedReport = report;
      _step = 1;
      _progress = 0.0;
      _statusText = 'Uploading report PDF...';
    });

    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    setState(() {
      _progress = 0.3;
      _statusText = 'Reading document structure...';
    });

    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;
    setState(() {
      _progress = 0.6;
      _statusText = 'Extracting biomarkers and reference ranges...';
    });

    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;
    setState(() {
      _progress = 0.9;
      _statusText = 'Generating smart health insight summary...';
    });

    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    
    final newRecord = {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'title': report['title'],
      'date': 'May 20, 2026',
      'clinic': report['clinic'],
      'type': report['type'],
      'status': 'Analyzed',
      'summary': report['summary'],
    };

    widget.onUploadComplete(newRecord);
    _completedRecord = newRecord;

    setState(() {
      _progress = 1.0;
      _step = 2;
    });
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    if (_step == 0) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 48,
              height: 4,
              decoration: BoxDecoration(
                color: colorScheme.onSurface.withOpacity(0.12),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 24.0),
          Row(
            children: [
              Icon(Icons.picture_as_pdf_rounded, color: colorScheme.primary, size: 28),
              const SizedBox(width: 12.0),
              const Text(
                'Select Report to Upload',
                style: TextStyle(
                  fontSize: 20.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8.0),
          Text(
            'Simulate AI extraction of biomarkers and diagnostic values',
            style: TextStyle(
              fontSize: 13.0,
              color: colorScheme.onSurface.withOpacity(0.5),
            ),
          ),
          const SizedBox(height: 20.0),
          ...widget.mockReports.map((report) {
            return Card(
              margin: const EdgeInsets.only(bottom: 12.0),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
                side: BorderSide(
                  color: colorScheme.onSurface.withOpacity(0.08),
                ),
              ),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                leading: Container(
                  padding: const EdgeInsets.all(10.0),
                  decoration: BoxDecoration(
                    color: colorScheme.primary.withOpacity(0.08),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.description_outlined, color: colorScheme.primary),
                ),
                title: Text(
                  report['title'],
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                ),
                subtitle: Text(
                  'Format: PDF • ${report['clinic']}',
                  style: TextStyle(fontSize: 12.0, color: colorScheme.onSurface.withOpacity(0.5)),
                ),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0),
                onTap: () => _runSimulation(report),
              ),
            );
          }),
        ],
      );
    }

    if (_step == 1) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 12.0),
          SizedBox(
            height: 80.0,
            width: 80.0,
            child: CircularProgressIndicator(
              value: _progress,
              strokeWidth: 6.0,
              backgroundColor: colorScheme.primary.withOpacity(0.1),
              valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
            ),
          ),
          const SizedBox(height: 28.0),
          Text(
            'Processing Health PDF',
            style: TextStyle(
              fontSize: 18.0,
              fontWeight: FontWeight.bold,
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 8.0),
          Text(
            _statusText,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13.5,
              color: colorScheme.onSurface.withOpacity(0.6),
            ),
          ),
          const SizedBox(height: 16.0),
          Text(
            '${(_progress * 100).toInt()}% Complete',
            style: TextStyle(
              fontSize: 12.0,
              fontWeight: FontWeight.bold,
              color: colorScheme.primary,
            ),
          ),
          const SizedBox(height: 12.0),
        ],
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 12.0),
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: Colors.green.shade50,
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.green.shade200,
              width: 1.5,
            ),
          ),
          child: Icon(
            Icons.check_circle_rounded,
            size: 56.0,
            color: Colors.green.shade600,
          ),
        ),
        const SizedBox(height: 24.0),
        const Text(
          'Analysis Completed!',
          style: TextStyle(
            fontSize: 20.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8.0),
        Text(
          'Your report "${_selectedReport?['title']}" was successfully parsed and summarized by Medpac AI.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onSurface.withOpacity(0.6),
            height: 1.4,
          ),
        ),
        const SizedBox(height: 28.0),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => Navigator.pop(context),
                style: OutlinedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14.0),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14.0),
                ),
                child: const Text('Close'),
              ),
            ),
            const SizedBox(width: 12.0),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  Future.delayed(const Duration(milliseconds: 150), () {
                    if (_completedRecord != null) {
                      widget.onViewSummary(_completedRecord!);
                    }
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: colorScheme.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14.0),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14.0),
                  elevation: 0,
                ),
                child: const Text('View Summary'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
