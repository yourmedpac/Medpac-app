import 'package:flutter/material.dart';

class MedicinesScreen extends StatefulWidget {
  const MedicinesScreen({super.key});

  @override
  State<MedicinesScreen> createState() => _MedicinesScreenState();
}

class _MedicinesScreenState extends State<MedicinesScreen> {
  final List<Map<String, dynamic>> _medications = [
    {
      'id': '1',
      'name': 'Atorvastatin',
      'dosage': '10mg',
      'time': 'Night (9:00 PM)',
      'taken': false,
      'instructions': 'Take after food',
    },
    {
      'id': '2',
      'name': 'Metformin',
      'dosage': '500mg',
      'time': 'Morning (8:00 AM)',
      'taken': true,
      'instructions': 'Take with food',
    },
    {
      'id': '3',
      'name': 'Vitamin D3',
      'dosage': '1000 IU',
      'time': 'Afternoon (1:00 PM)',
      'taken': false,
      'instructions': 'Take after meal',
    },
    {
      'id': '4',
      'name': 'Amlodipine',
      'dosage': '5mg',
      'time': 'Morning (8:00 AM)',
      'taken': true,
      'instructions': 'Take before food',
    },
  ];

  void _toggleMedication(String id) {
    setState(() {
      final index = _medications.indexWhere((m) => m['id'] == id);
      if (index != -1) {
        _medications[index]['taken'] = !_medications[index]['taken'];
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final takenCount = _medications.where((m) => m['taken']).length;
    final totalCount = _medications.length;
    final progress = totalCount > 0 ? takenCount / totalCount : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Medicines',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: colorScheme.onBackground,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Daily Progress Tracker Card
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                padding: const EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(20.0),
                  border: Border.all(
                    color: colorScheme.onSurface.withOpacity(0.08),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Today\'s Progress',
                          style: TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                            color: colorScheme.onSurface,
                          ),
                        ),
                        Text(
                          '$takenCount of $totalCount taken',
                          style: TextStyle(
                            fontSize: 14.0,
                            fontWeight: FontWeight.bold,
                            color: colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12.0),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10.0),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 8.0,
                        backgroundColor: colorScheme.primary.withOpacity(0.12),
                        valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Pills List section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Pill Schedule',
                    style: TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onBackground,
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text('+ Add Pill'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8.0),

            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              itemCount: _medications.length,
              itemBuilder: (context, index) {
                final med = _medications[index];
                final isTaken = med['taken'];

                return Container(
                  margin: const EdgeInsets.only(bottom: 12.0),
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: isTaken
                        ? colorScheme.surface.withOpacity(0.6)
                        : colorScheme.surface,
                    borderRadius: BorderRadius.circular(18.0),
                    border: Border.all(
                      color: isTaken
                          ? colorScheme.primary.withOpacity(0.2)
                          : colorScheme.onSurface.withOpacity(0.08),
                    ),
                  ),
                  child: Row(
                    children: [
                      // Status Check Button
                      GestureDetector(
                        onTap: () => _toggleMedication(med['id']),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          width: 26.0,
                          height: 26.0,
                          decoration: BoxDecoration(
                            color: isTaken ? colorScheme.primary : Colors.transparent,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isTaken ? colorScheme.primary : colorScheme.onSurface.withOpacity(0.24),
                              width: 2.0,
                            ),
                          ),
                          child: isTaken
                              ? const Icon(Icons.check, size: 16.0, color: Colors.white)
                              : null,
                        ),
                      ),
                      const SizedBox(width: 16.0),
                      // Pill Info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              med['name'],
                              style: TextStyle(
                                fontSize: 16.0,
                                fontWeight: FontWeight.bold,
                                color: isTaken
                                    ? colorScheme.onSurface.withOpacity(0.5)
                                    : colorScheme.onSurface,
                                decoration: isTaken ? TextDecoration.lineThrough : null,
                              ),
                            ),
                            const SizedBox(height: 4.0),
                            Text(
                              '${med['dosage']} • ${med['instructions']}',
                              style: TextStyle(
                                fontSize: 12.0,
                                color: colorScheme.onSurface.withOpacity(0.5),
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Pill Time tag
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 6.0),
                        decoration: BoxDecoration(
                          color: isTaken
                              ? colorScheme.primary.withOpacity(0.06)
                              : colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        child: Text(
                          med['time'].split(' ').first,
                          style: TextStyle(
                            fontSize: 11.0,
                            fontWeight: FontWeight.bold,
                            color: isTaken
                                ? colorScheme.primary.withOpacity(0.5)
                                : colorScheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),

            // Refills Alerts Section
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Refills Needed',
                    style: TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onBackground,
                    ),
                  ),
                  const SizedBox(height: 12.0),
                  Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: Colors.red.shade900.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(18.0),
                      border: Border.all(
                        color: Colors.red.shade800.withOpacity(0.24),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          decoration: BoxDecoration(
                            color: Colors.red.shade400.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.warning_amber_rounded,
                            color: Colors.red.shade300,
                          ),
                        ),
                        const SizedBox(width: 16.0),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Atorvastatin Refill',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14.5,
                                  color: colorScheme.onSurface,
                                ),
                              ),
                              const SizedBox(height: 3.0),
                              Text(
                                '3 pills left • Last ordered 27 days ago',
                                style: TextStyle(
                                  fontSize: 11.5,
                                  color: colorScheme.onSurface.withOpacity(0.6),
                                ),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Refill ordered! ETA: Tomorrow morning.'),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red.shade800,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 14.0),
                          ),
                          child: const Text('Order Now'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
