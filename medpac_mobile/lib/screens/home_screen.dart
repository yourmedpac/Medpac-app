import 'package:flutter/material.dart';
import '../widgets/medpac_logo.dart';
import '../user_state.dart';

class HomeScreen extends StatelessWidget {
  final VoidCallback? onProfileTap;
  final ValueChanged<int>? onNavigateToTab;

  const HomeScreen({
    super.key,
    this.onProfileTap,
    this.onNavigateToTab,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // AppBar with greeting & profile
          SliverAppBar(
            floating: true,
            pinned: false,
            expandedHeight: 80.0,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                padding: const EdgeInsets.only(left: 20.0, right: 20.0, top: 40.0),
                alignment: Alignment.centerLeft,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          const MedpacLogo(size: 18.0, showBackground: true),
                          const SizedBox(width: 10.0),
                          Flexible(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Hello, ${UserState().userName}',
                                  style: TextStyle(
                                    fontSize: 18.0,
                                    fontWeight: FontWeight.bold,
                                    color: colorScheme.onBackground,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 1,
                                ),
                                const SizedBox(height: 2.0),
                                Text(
                                  'How are you feeling today?',
                                  style: TextStyle(
                                    fontSize: 11.5,
                                    color: colorScheme.onBackground.withOpacity(0.6),
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 1,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: () => _showNotificationsBottomSheet(context, colorScheme),
                          icon: Icon(
                            Icons.notifications_outlined,
                            color: colorScheme.onBackground,
                          ),
                        ),
                        GestureDetector(
                          onTap: onProfileTap,
                          child: CircleAvatar(
                            radius: 20.0,
                            backgroundColor: colorScheme.primary,
                            child: const Icon(Icons.person, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                decoration: BoxDecoration(
                  color: colorScheme.surface.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(
                    color: colorScheme.onSurface.withOpacity(0.08),
                  ),
                ),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search health records, doctors, pills...',
                    hintStyle: TextStyle(color: colorScheme.onSurface.withOpacity(0.5)),
                    icon: Icon(Icons.search, color: colorScheme.primary),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
          ),

          // Daily AI Summary Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
              child: Container(
                padding: const EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      colorScheme.primary,
                      colorScheme.secondary,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24.0),
                  boxShadow: [
                    BoxShadow(
                      color: colorScheme.primary.withOpacity(0.3),
                      blurRadius: 16.0,
                      offset: const Offset(0, 8),
                    )
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8.0),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.insights_rounded,
                            color: Colors.white,
                            size: 20.0,
                          ),
                        ),
                        const SizedBox(width: 12.0),
                        const Text(
                          'AI Daily Health Score',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: const Text(
                            '92%',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 14.0,
                            ),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    Text(
                      'Your heart rate is stable, and you are 2,400 steps away from your daily goal. Don\'t forget to take your Vitamin D after lunch.',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 14.0,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Vitals Section
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 20.0, top: 16.0, bottom: 12.0),
                  child: Text(
                    'My Vitals',
                    style: TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onBackground,
                    ),
                  ),
                ),
                SizedBox(
                  height: 110.0,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20.0),
                    children: [
                      _buildVitalCard(
                        Icons.favorite_rounded,
                        'Heart Rate',
                        UserState().watchHeartRate,
                        'Normal',
                        Colors.red.shade400,
                        colorScheme,
                      ),
                      const SizedBox(width: 12.0),
                      _buildVitalCard(
                        Icons.thermostat_rounded,
                        'Temperature',
                        '98.6 °F',
                        'Normal',
                        Colors.orange.shade400,
                        colorScheme,
                      ),
                      const SizedBox(width: 12.0),
                      _buildVitalCard(
                        Icons.bloodtype_rounded,
                        'Blood Pres.',
                        '120/80',
                        'Optimal',
                        Colors.blue.shade400,
                        colorScheme,
                      ),
                      const SizedBox(width: 12.0),
                      _buildVitalCard(
                        Icons.bubble_chart_rounded,
                        'SpO2',
                        '98 %',
                        'Optimal',
                        Colors.teal.shade400,
                        colorScheme,
                      ),
                      const SizedBox(width: 12.0),
                      _buildVitalCard(
                        Icons.bedtime_rounded,
                        'Sleep Score',
                        UserState().watchSleepScore,
                        'Restorative',
                        Colors.indigo.shade400,
                        colorScheme,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Quick Actions Grid
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Quick Actions',
                    style: TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onBackground,
                    ),
                  ),
                  const SizedBox(height: 12.0),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 12.0,
                    mainAxisSpacing: 12.0,
                    childAspectRatio: 1.5,
                    children: [
                      _buildActionCard(
                        Icons.video_call_rounded,
                        'Book Consult',
                        'Talk to a doctor',
                        colorScheme.primary,
                        colorScheme,
                        () => _showBookingBottomSheet(context, colorScheme),
                      ),
                      _buildActionCard(
                        Icons.notifications_active_rounded,
                        'Pill Reminder',
                        'Upcoming medication',
                        colorScheme.secondary,
                        colorScheme,
                        () => onNavigateToTab?.call(2),
                      ),
                      _buildActionCard(
                        Icons.upload_file_rounded,
                        'Upload Report',
                        'Analyze PDF reports',
                        Colors.purple,
                        colorScheme,
                        () => onNavigateToTab?.call(3),
                      ),
                      _buildActionCard(
                        Icons.support_agent_rounded,
                        'Medpac Support',
                        'Help & FAQs',
                        Colors.amber.shade700,
                        colorScheme,
                        () => _showSupportBottomSheet(context, colorScheme),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Upcoming Appointments
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Upcoming Consultations',
                        style: TextStyle(
                          fontSize: 18.0,
                          fontWeight: FontWeight.bold,
                          color: colorScheme.onBackground,
                        ),
                      ),
                      TextButton(
                        onPressed: () => _showConsultationsBottomSheet(context, colorScheme),
                        child: const Text('View All'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8.0),
                  Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: colorScheme.surface,
                      borderRadius: BorderRadius.circular(16.0),
                      border: Border.all(
                        color: colorScheme.onSurface.withOpacity(0.08),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12.0),
                          decoration: BoxDecoration(
                            color: colorScheme.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: Icon(
                            Icons.calendar_today_rounded,
                            color: colorScheme.primary,
                          ),
                        ),
                        const SizedBox(width: 16.0),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Dr. Sarah Connor',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15.0,
                                  color: colorScheme.onSurface,
                                ),
                              ),
                              const SizedBox(height: 4.0),
                              Text(
                                'Cardiologist • Video Call',
                                style: TextStyle(
                                  fontSize: 12.0,
                                  color: colorScheme.onSurface.withOpacity(0.6),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              'Today',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: colorScheme.primary,
                                fontSize: 13.0,
                              ),
                            ),
                            const SizedBox(height: 4.0),
                            Text(
                              '3:30 PM',
                              style: TextStyle(
                                fontSize: 12.0,
                                color: colorScheme.onSurface.withOpacity(0.6),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24.0),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVitalCard(
    IconData icon,
    String title,
    String value,
    String status,
    Color color,
    ColorScheme colorScheme,
  ) {
    return Container(
      width: 130.0,
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(18.0),
        border: Border.all(
          color: colorScheme.onSurface.withOpacity(0.08),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 20.0),
              Container(
                width: 6.0,
                height: 6.0,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                ),
              ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.bold,
                  color: colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 2.0),
              Text(
                title,
                style: TextStyle(
                  fontSize: 11.0,
                  color: colorScheme.onSurface.withOpacity(0.6),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(
    IconData icon,
    String title,
    String subtitle,
    Color themeColor,
    ColorScheme colorScheme,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14.0),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(18.0),
          border: Border.all(
            color: colorScheme.onSurface.withOpacity(0.08),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: themeColor.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: themeColor,
                size: 20.0,
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14.0,
                    fontWeight: FontWeight.bold,
                    color: colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 10.0,
                    color: colorScheme.onSurface.withOpacity(0.5),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showNotificationsBottomSheet(BuildContext context, ColorScheme colorScheme) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
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
                  Text(
                    'Notifications',
                    style: TextStyle(
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Mark all as read'),
                  ),
                ],
              ),
              const SizedBox(height: 16.0),
              _buildNotificationItem(
                Icons.medication_rounded,
                'Medication Reminder',
                'Time to take Metformin 500mg. Scheduled at 8:00 AM.',
                '10m ago',
                colorScheme.primary,
                colorScheme,
              ),
              const Divider(height: 24.0),
              _buildNotificationItem(
                Icons.analytics_rounded,
                'Lab Results Ready',
                'Your Complete Blood Count (CBC) report has been analyzed by AI.',
                '2h ago',
                colorScheme.secondary,
                colorScheme,
              ),
              const Divider(height: 24.0),
              _buildNotificationItem(
                Icons.calendar_today_rounded,
                'Consultation Scheduled',
                'Video call consultation with Dr. Sarah Connor starts in 30 minutes.',
                '3h ago',
                Colors.blue,
                colorScheme,
              ),
              const SizedBox(height: 24.0),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNotificationItem(
    IconData icon,
    String title,
    String body,
    String time,
    Color iconColor,
    ColorScheme colorScheme,
  ) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(10.0),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 20.0),
        ),
        const SizedBox(width: 14.0),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14.0,
                    ),
                  ),
                  Text(
                    time,
                    style: TextStyle(
                      fontSize: 11.0,
                      color: colorScheme.onSurface.withOpacity(0.4),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4.0),
              Text(
                body,
                style: TextStyle(
                  fontSize: 12.5,
                  color: colorScheme.onSurface.withOpacity(0.7),
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showBookingBottomSheet(BuildContext context, ColorScheme colorScheme) {
    final List<Map<String, dynamic>> allDoctors = [
      {
        'id': 'd1',
        'name': 'Dr. Rajesh Sharma',
        'specialization': 'General Medicine',
        'qualification': 'MBBS, MD',
        'experience': 15,
        'rating': 4.8,
        'consultationFee': 299,
        'availableSlots': ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
        'languages': ['Hindi', 'English'],
        'online': true,
        'avatar': 'RS',
      },
      {
        'id': 'd2',
        'name': 'Dr. Priya Mehta',
        'specialization': 'Gynecology',
        'qualification': 'MBBS, MS (OBG)',
        'experience': 12,
        'rating': 4.9,
        'consultationFee': 499,
        'availableSlots': ['9:00 AM', '10:30 AM', '3:00 PM'],
        'languages': ['Hindi', 'English', 'Gujarati'],
        'online': true,
        'avatar': 'PM',
      },
      {
        'id': 'd3',
        'name': 'Dr. Anil Kumar',
        'specialization': 'Cardiology',
        'qualification': 'MBBS, DM (Cardiology)',
        'experience': 20,
        'rating': 4.7,
        'consultationFee': 699,
        'availableSlots': ['11:00 AM', '3:00 PM', '5:00 PM'],
        'languages': ['Hindi', 'English'],
        'online': false,
        'avatar': 'AK',
      },
      {
        'id': 'd4',
        'name': 'Dr. Sneha Reddy',
        'specialization': 'Dermatology',
        'qualification': 'MBBS, MD (Derm)',
        'experience': 8,
        'rating': 4.6,
        'consultationFee': 399,
        'availableSlots': ['10:00 AM', '12:00 PM', '4:00 PM'],
        'languages': ['English', 'Telugu', 'Hindi'],
        'online': true,
        'avatar': 'SR',
      },
      {
        'id': 'd5',
        'name': 'Dr. Vikram Singh',
        'specialization': 'Orthopedics',
        'qualification': 'MBBS, MS (Ortho)',
        'experience': 18,
        'rating': 4.8,
        'consultationFee': 599,
        'availableSlots': ['9:30 AM', '2:30 PM'],
        'languages': ['Hindi', 'English', 'Punjabi'],
        'online': false,
        'avatar': 'VS',
      },
      {
        'id': 'd6',
        'name': 'Dr. Kavitha Nair',
        'specialization': 'Pediatrics',
        'qualification': 'MBBS, MD (Pediatrics)',
        'experience': 10,
        'rating': 4.9,
        'consultationFee': 349,
        'availableSlots': ['10:00 AM', '11:30 AM', '3:30 PM', '5:00 PM'],
        'languages': ['English', 'Malayalam', 'Hindi'],
        'online': true,
        'avatar': 'KN',
      },
      {
        'id': 'd7',
        'name': 'Dr. Amit Patel',
        'specialization': 'Psychiatry',
        'qualification': 'MBBS, MD (Psych)',
        'experience': 14,
        'rating': 4.5,
        'consultationFee': 599,
        'availableSlots': ['11:00 AM', '2:00 PM', '4:30 PM'],
        'languages': ['Hindi', 'English', 'Gujarati'],
        'online': true,
        'avatar': 'AP',
      },
      {
        'id': 'd8',
        'name': 'Dr. Meera Joshi',
        'specialization': 'ENT',
        'qualification': 'MBBS, MS (ENT)',
        'experience': 11,
        'rating': 4.7,
        'consultationFee': 399,
        'availableSlots': ['9:00 AM', '11:00 AM', '3:00 PM'],
        'languages': ['Hindi', 'English', 'Marathi'],
        'online': false,
        'avatar': 'MJ',
      },
    ];

    final List<String> specialties = [
      'All',
      'General Medicine',
      'Cardiology',
      'Dermatology',
      'Gynecology',
      'Pediatrics',
      'Orthopedics',
      'Psychiatry',
      'ENT',
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        String activeSpecialty = 'All';
        Map<String, dynamic>? selectedDoctor;
        String selectedDate = 'today'; // 'today', 'tomorrow', 'custom'
        String? selectedSlot;
        final customDateController = TextEditingController();

        return StatefulBuilder(
          builder: (context, setModalState) {
            final filteredDoctors = activeSpecialty == 'All'
                ? allDoctors
                : allDoctors.where((doc) => doc['specialization'] == activeSpecialty).toList();

            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(28.0),
                  topRight: Radius.circular(28.0),
                ),
              ),
              child: Column(
                children: [
                  const SizedBox(height: 12.0),
                  Container(
                    width: 48.0,
                    height: 4.0,
                    decoration: BoxDecoration(
                      color: colorScheme.onSurface.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(2.0),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          selectedDoctor == null ? 'Book Consultation' : 'Select Date & Time',
                          style: TextStyle(
                            fontSize: 20.0,
                            fontWeight: FontWeight.bold,
                            color: colorScheme.onSurface,
                          ),
                        ),
                        if (selectedDoctor != null)
                          TextButton(
                            onPressed: () {
                              setModalState(() {
                                selectedDoctor = null;
                                selectedSlot = null;
                              });
                            },
                            child: const Text('Back to Doctors'),
                          )
                        else
                          IconButton(
                            icon: const Icon(Icons.close),
                            onPressed: () => Navigator.pop(context),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Expanded(
                    child: selectedDoctor == null
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Specialties filter
                              SizedBox(
                                height: 40.0,
                                child: ListView.builder(
                                  scrollDirection: Axis.horizontal,
                                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                                  itemCount: specialties.length,
                                  itemBuilder: (context, index) {
                                    final spec = specialties[index];
                                    final isSelected = activeSpecialty == spec;
                                    return Container(
                                      margin: const EdgeInsets.only(right: 8.0),
                                      child: ChoiceChip(
                                        label: Text(
                                          spec,
                                          style: TextStyle(
                                            fontSize: 12.0,
                                            fontWeight: FontWeight.w600,
                                            color: isSelected ? Colors.white : colorScheme.onSurface.withOpacity(0.7),
                                          ),
                                        ),
                                        selected: isSelected,
                                        selectedColor: colorScheme.primary,
                                        backgroundColor: colorScheme.onSurface.withOpacity(0.04),
                                        onSelected: (val) {
                                          setModalState(() {
                                            activeSpecialty = spec;
                                          });
                                        },
                                      ),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(height: 16.0),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                                child: Text(
                                  '${filteredDoctors.length} Doctors available',
                                  style: TextStyle(
                                    fontSize: 12.0,
                                    color: colorScheme.onSurface.withOpacity(0.5),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8.0),
                              Expanded(
                                child: ListView.builder(
                                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
                                  itemCount: filteredDoctors.length,
                                  itemBuilder: (context, index) {
                                    final doc = filteredDoctors[index];
                                    return Container(
                                      margin: const EdgeInsets.only(bottom: 16.0),
                                      decoration: BoxDecoration(
                                        color: colorScheme.surface,
                                        borderRadius: BorderRadius.circular(20.0),
                                        border: Border.all(
                                          color: colorScheme.onSurface.withOpacity(0.08),
                                        ),
                                      ),
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              CircleAvatar(
                                                radius: 24.0,
                                                backgroundColor: colorScheme.primary.withOpacity(0.1),
                                                child: Text(
                                                  doc['avatar']!,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    color: colorScheme.primary,
                                                    fontSize: 16.0,
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 16.0),
                                              Expanded(
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Row(
                                                      children: [
                                                        Expanded(
                                                          child: Text(
                                                            doc['name']!,
                                                            style: const TextStyle(
                                                              fontWeight: FontWeight.bold,
                                                              fontSize: 15.0,
                                                            ),
                                                          ),
                                                        ),
                                                        Text(
                                                          '₹${doc['consultationFee']}',
                                                          style: TextStyle(
                                                            fontWeight: FontWeight.bold,
                                                            color: colorScheme.primary,
                                                            fontSize: 16.0,
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                    Text(
                                                      '${doc['qualification']} • ${doc['specialization']}',
                                                      style: TextStyle(
                                                        fontSize: 12.0,
                                                        color: colorScheme.onSurface.withOpacity(0.6),
                                                      ),
                                                    ),
                                                    const SizedBox(height: 6.0),
                                                    Row(
                                                      children: [
                                                        Icon(Icons.star_rounded, color: Colors.amber[600], size: 16.0),
                                                        const SizedBox(width: 4.0),
                                                        Text(
                                                          '${doc['rating']}',
                                                          style: const TextStyle(
                                                            fontSize: 12.0,
                                                            fontWeight: FontWeight.bold,
                                                          ),
                                                        ),
                                                        const SizedBox(width: 12.0),
                                                        Icon(Icons.history_rounded, color: colorScheme.onSurface.withOpacity(0.4), size: 16.0),
                                                        const SizedBox(width: 4.0),
                                                        Text(
                                                          '${doc['experience']} yrs exp',
                                                          style: TextStyle(
                                                            fontSize: 12.0,
                                                            color: colorScheme.onSurface.withOpacity(0.6),
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 12.0),
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Row(
                                                children: [
                                                  Icon(Icons.language_rounded, color: colorScheme.onSurface.withOpacity(0.4), size: 16.0),
                                                  const SizedBox(width: 6.0),
                                                  Text(
                                                    (doc['languages'] as List).join(', '),
                                                    style: TextStyle(
                                                      fontSize: 11.5,
                                                      color: colorScheme.onSurface.withOpacity(0.6),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                                                decoration: BoxDecoration(
                                                  color: doc['online'] ? Colors.green.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
                                                  borderRadius: BorderRadius.circular(8.0),
                                                ),
                                                child: Row(
                                                  children: [
                                                    Container(
                                                      width: 6.0,
                                                      height: 6.0,
                                                      decoration: BoxDecoration(
                                                        color: doc['online'] ? Colors.green : Colors.grey,
                                                        shape: BoxShape.circle,
                                                      ),
                                                    ),
                                                    const SizedBox(width: 6.0),
                                                    Text(
                                                      doc['online'] ? 'Online' : 'Offline',
                                                      style: TextStyle(
                                                        fontSize: 10.0,
                                                        fontWeight: FontWeight.bold,
                                                        color: doc['online'] ? Colors.green : Colors.grey,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                          const Divider(height: 24.0),
                                          ElevatedButton(
                                            onPressed: () {
                                              setModalState(() {
                                                selectedDoctor = doc;
                                              });
                                            },
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: colorScheme.primary,
                                              foregroundColor: Colors.white,
                                              shape: RoundedRectangleBorder(
                                                borderRadius: BorderRadius.circular(12.0),
                                              ),
                                              minimumSize: const Size(double.infinity, 44.0),
                                              elevation: 0,
                                            ),
                                            child: const Row(
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: [
                                                Icon(Icons.video_call_rounded, size: 18.0),
                                                SizedBox(width: 8.0),
                                                Text('Book Consultation', style: TextStyle(fontWeight: FontWeight.bold)),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          )
                        : Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                // Doctor info Summary
                                Container(
                                  padding: const EdgeInsets.all(16.0),
                                  decoration: BoxDecoration(
                                    color: colorScheme.primary.withOpacity(0.04),
                                    borderRadius: BorderRadius.circular(16.0),
                                    border: Border.all(color: colorScheme.primary.withOpacity(0.12)),
                                  ),
                                  child: Row(
                                    children: [
                                      CircleAvatar(
                                        radius: 20.0,
                                        backgroundColor: colorScheme.primary.withOpacity(0.1),
                                        child: Text(
                                          selectedDoctor!['avatar']!,
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: colorScheme.primary,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12.0),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              selectedDoctor!['name']!,
                                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                                            ),
                                            Text(
                                              '${selectedDoctor!['specialization']} • ${selectedDoctor!['qualification']}',
                                              style: TextStyle(
                                                fontSize: 11.5,
                                                color: colorScheme.onSurface.withOpacity(0.6),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Text(
                                        '₹${selectedDoctor!['consultationFee']}',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: colorScheme.primary,
                                          fontSize: 16.0,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 24.0),
                                Text(
                                  'Select Date',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14.0,
                                    color: colorScheme.onSurface.withOpacity(0.8),
                                  ),
                                ),
                                const SizedBox(height: 10.0),
                                Row(
                                  children: [
                                    Expanded(
                                      child: ElevatedButton(
                                        onPressed: () {
                                          setModalState(() {
                                            selectedDate = 'today';
                                          });
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: selectedDate == 'today' ? colorScheme.primary : colorScheme.onSurface.withOpacity(0.04),
                                          foregroundColor: selectedDate == 'today' ? Colors.white : colorScheme.onSurface,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                                          elevation: 0,
                                        ),
                                        child: const Text('Today'),
                                      ),
                                    ),
                                    const SizedBox(width: 8.0),
                                    Expanded(
                                      child: ElevatedButton(
                                        onPressed: () {
                                          setModalState(() {
                                            selectedDate = 'tomorrow';
                                          });
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: selectedDate == 'tomorrow' ? colorScheme.primary : colorScheme.onSurface.withOpacity(0.04),
                                          foregroundColor: selectedDate == 'tomorrow' ? Colors.white : colorScheme.onSurface,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                                          elevation: 0,
                                        ),
                                        child: const Text('Tomorrow'),
                                      ),
                                    ),
                                    const SizedBox(width: 8.0),
                                    Expanded(
                                      child: ElevatedButton(
                                        onPressed: () {
                                          setModalState(() {
                                            selectedDate = 'custom';
                                          });
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: selectedDate == 'custom' ? colorScheme.primary : colorScheme.onSurface.withOpacity(0.04),
                                          foregroundColor: selectedDate == 'custom' ? Colors.white : colorScheme.onSurface,
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                                          elevation: 0,
                                        ),
                                        child: const Text('Custom'),
                                      ),
                                    ),
                                  ],
                                ),
                                if (selectedDate == 'custom') ...[
                                  const SizedBox(height: 12.0),
                                  TextFormField(
                                    controller: customDateController,
                                    keyboardType: TextInputType.datetime,
                                    decoration: InputDecoration(
                                      hintText: 'YYYY-MM-DD',
                                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0)),
                                      suffixIcon: const Icon(Icons.calendar_today),
                                    ),
                                  ),
                                ],
                                const SizedBox(height: 24.0),
                                Text(
                                  'Select Time Slot',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14.0,
                                    color: colorScheme.onSurface.withOpacity(0.8),
                                  ),
                                ),
                                const SizedBox(height: 10.0),
                                GridView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 3,
                                    crossAxisSpacing: 8.0,
                                    mainAxisSpacing: 8.0,
                                    childAspectRatio: 2.2,
                                  ),
                                  itemCount: (selectedDoctor!['availableSlots'] as List).length,
                                  itemBuilder: (context, idx) {
                                    final slot = selectedDoctor!['availableSlots'][idx];
                                    final isSelected = selectedSlot == slot;
                                    return ElevatedButton(
                                      onPressed: () {
                                        setModalState(() {
                                          selectedSlot = slot;
                                        });
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: isSelected ? colorScheme.primary : colorScheme.onSurface.withOpacity(0.04),
                                        foregroundColor: isSelected ? Colors.white : colorScheme.onSurface,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                                        elevation: 0,
                                      ),
                                      child: Text(slot, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                                    );
                                  },
                                ),
                                const Spacer(),
                                ElevatedButton(
                                  onPressed: selectedSlot == null
                                      ? null
                                      : () {
                                          final dateStr = selectedDate == 'today'
                                              ? 'Today'
                                              : selectedDate == 'tomorrow'
                                                  ? 'Tomorrow'
                                                  : customDateController.text.trim().isEmpty
                                                      ? 'Selected Date'
                                                      : customDateController.text.trim();
                                          Navigator.pop(context);
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(
                                              content: Text('Consultation booked with ${selectedDoctor!['name']} for $dateStr at $selectedSlot!'),
                                              backgroundColor: colorScheme.primary,
                                            ),
                                          );
                                        },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: colorScheme.primary,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14.0),
                                    ),
                                    minimumSize: const Size(double.infinity, 50.0),
                                    elevation: 0,
                                  ),
                                  child: const Text('Confirm Booking', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15.0)),
                                ),
                                const SizedBox(height: 24.0),
                              ],
                            ),
                          ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showSupportBottomSheet(BuildContext context, ColorScheme colorScheme) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
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
              Text(
                'Medpac Support',
                style: TextStyle(
                  fontSize: 20.0,
                  fontWeight: FontWeight.bold,
                  color: colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 12.0),
              Text(
                'We are here to help you manage your Health OS ecosystem. Reach out to us through any of the channels below.',
                style: TextStyle(
                  fontSize: 13.5,
                  color: colorScheme.onSurface.withOpacity(0.7),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20.0),
              ListTile(
                leading: Icon(Icons.email_rounded, color: colorScheme.primary),
                title: const Text('Email Support', style: TextStyle(fontWeight: FontWeight.bold)),
                subtitle: const Text('support@medpac.in'),
                trailing: Icon(Icons.chevron_right_rounded, color: colorScheme.onSurface.withOpacity(0.3)),
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Opening email client to support@medpac.in...')),
                  );
                },
              ),
              const Divider(),
              ListTile(
                leading: Icon(Icons.phone_rounded, color: colorScheme.primary),
                title: const Text('Call Support', style: TextStyle(fontWeight: FontWeight.bold)),
                subtitle: const Text('+91 1800 555 9898 (Toll Free)'),
                trailing: Icon(Icons.chevron_right_rounded, color: colorScheme.onSurface.withOpacity(0.3)),
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Dialing toll-free support...')),
                  );
                },
              ),
              const Divider(),
              ListTile(
                leading: Icon(Icons.help_outline_rounded, color: colorScheme.primary),
                title: const Text('FAQs & Documentation', style: TextStyle(fontWeight: FontWeight.bold)),
                subtitle: const Text('Read user guides and tutorials'),
                trailing: Icon(Icons.chevron_right_rounded, color: colorScheme.onSurface.withOpacity(0.3)),
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Opening help documents...')),
                  );
                },
              ),
              const SizedBox(height: 24.0),
            ],
          ),
        );
      },
    );
  }

  void _showConsultationsBottomSheet(BuildContext context, ColorScheme colorScheme) {
    final List<Map<String, dynamic>> consultations = [
      {
        'doctor': 'Dr. Sarah Connor',
        'specialty': 'Cardiologist',
        'date': 'Today, 3:30 PM',
        'status': 'Upcoming',
        'icon': Icons.video_call_rounded,
      },
      {
        'doctor': 'Dr. Marcus Vance',
        'specialty': 'Endocrinologist',
        'date': 'May 28, 2026, 11:00 AM',
        'status': 'Scheduled',
        'icon': Icons.video_call_rounded,
      },
      {
        'doctor': 'Dr. Emily Chen',
        'specialty': 'General Physician',
        'date': 'Apr 12, 2026, 4:00 PM',
        'status': 'Completed',
        'icon': Icons.check_circle_rounded,
      },
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
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
              Text(
                'My Consultations',
                style: TextStyle(
                  fontSize: 20.0,
                  fontWeight: FontWeight.bold,
                  color: colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 16.0),
              ...consultations.map((c) => Container(
                margin: const EdgeInsets.only(bottom: 12.0),
                padding: const EdgeInsets.all(14.0),
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(
                    color: colorScheme.onSurface.withOpacity(0.08),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10.0),
                      decoration: BoxDecoration(
                        color: colorScheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Icon(c['icon'], color: colorScheme.primary),
                    ),
                    const SizedBox(width: 14.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            c['doctor'],
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                          ),
                          Text(
                            '${c['specialty']} • ${c['date']}',
                            style: TextStyle(fontSize: 12.0, color: colorScheme.onSurface.withOpacity(0.5)),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
                      decoration: BoxDecoration(
                        color: c['status'] == 'Upcoming'
                            ? colorScheme.primary.withOpacity(0.1)
                            : c['status'] == 'Scheduled'
                                ? Colors.blue.withOpacity(0.1)
                                : Colors.green.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Text(
                        c['status'],
                        style: TextStyle(
                          fontSize: 11.0,
                          fontWeight: FontWeight.bold,
                          color: c['status'] == 'Upcoming'
                              ? colorScheme.primary
                              : c['status'] == 'Scheduled'
                                  ? Colors.blue
                                  : Colors.green,
                        ),
                      ),
                    ),
                  ],
                ),
              )).toList(),
              const SizedBox(height: 16.0),
            ],
          ),
        );
      },
    );
  }
}
