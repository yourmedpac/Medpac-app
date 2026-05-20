import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

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
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Hello, Prabh',
                          style: TextStyle(
                            fontSize: 22.0,
                            fontWeight: FontWeight.bold,
                            color: colorScheme.onBackground,
                          ),
                        ),
                        const SizedBox(height: 2.0),
                        Text(
                          'How are you feeling today?',
                          style: TextStyle(
                            fontSize: 13.0,
                            color: colorScheme.onBackground.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: () {},
                          icon: Icon(
                            Icons.notifications_outlined,
                            color: colorScheme.onBackground,
                          ),
                        ),
                        CircleAvatar(
                          radius: 20.0,
                          backgroundColor: colorScheme.primary,
                          child: const Icon(Icons.person, color: Colors.white),
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
                        '72 bpm',
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
                      ),
                      _buildActionCard(
                        Icons.notifications_active_rounded,
                        'Pill Reminder',
                        'Upcoming medication',
                        colorScheme.secondary,
                        colorScheme,
                      ),
                      _buildActionCard(
                        Icons.upload_file_rounded,
                        'Upload Report',
                        'Analyze PDF reports',
                        Colors.purple,
                        colorScheme,
                      ),
                      _buildActionCard(
                        Icons.support_agent_rounded,
                        'Medpac Support',
                        'Help & FAQs',
                        Colors.amber.shade700,
                        colorScheme,
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
                        onPressed: () {},
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
  ) {
    return Container(
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
    );
  }
}
