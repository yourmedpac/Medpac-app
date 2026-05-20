import 'package:flutter/material.dart';
import '../user_state.dart';

class ProfileScreen extends StatelessWidget {
  final VoidCallback onLogout;

  const ProfileScreen({
    super.key,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final userState = UserState();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Profile',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: colorScheme.onBackground,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Premium Profile Header Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
              child: Container(
                padding: const EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(24.0),
                  border: Border.all(
                    color: colorScheme.onSurface.withOpacity(0.08),
                  ),
                ),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 46.0,
                      backgroundColor: colorScheme.primary,
                      child: const Icon(
                        Icons.person,
                        size: 50.0,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    Text(
                      userState.userName,
                      style: TextStyle(
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,
                        color: colorScheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      '${userState.userEmail} • ${userState.userPhone}',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                    const SizedBox(height: 12.0),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
                      decoration: BoxDecoration(
                        color: colorScheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Text(
                        'Patient ID: MP-894032',
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.bold,
                          color: colorScheme.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Emergency Medical ID Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Emergency Medical ID',
                    style: TextStyle(
                      fontSize: 17.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onBackground,
                    ),
                  ),
                  const SizedBox(height: 12.0),
                  Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: colorScheme.surface,
                      borderRadius: BorderRadius.circular(20.0),
                      border: Border.all(
                        color: colorScheme.onSurface.withOpacity(0.08),
                      ),
                    ),
                    child: Column(
                      children: [
                        _buildMedicalIdRow('Blood Group', 'O+', colorScheme),
                        const Divider(height: 24.0),
                        _buildMedicalIdRow('Allergies', 'Penicillin, Peanuts', colorScheme),
                        const Divider(height: 24.0),
                        _buildMedicalIdRow('Chronic Conditions', 'Mild Hypertension', colorScheme),
                        const Divider(height: 24.0),
                        _buildMedicalIdRow('Emergency Contact', 'Dad (+91 98765 43211)', colorScheme),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Settings List Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Settings',
                    style: TextStyle(
                      fontSize: 17.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.onBackground,
                    ),
                  ),
                  const SizedBox(height: 12.0),
                  Container(
                    padding: const EdgeInsets.all(8.0),
                    decoration: BoxDecoration(
                      color: colorScheme.surface,
                      borderRadius: BorderRadius.circular(20.0),
                      border: Border.all(
                        color: colorScheme.onSurface.withOpacity(0.08),
                      ),
                    ),
                    child: Column(
                      children: [
                         _buildSettingsRow(Icons.shield_rounded, 'Insurance Details', 'Aetna • Policy #8493', colorScheme),
                        _buildSettingsRow(Icons.devices_rounded, 'Connected Devices', 'Apple Health, Fitbit', colorScheme),
                        _buildSettingsRow(Icons.security_rounded, 'Privacy & Permissions', 'Manage data sharing', colorScheme),
                        _buildSettingsRow(Icons.dark_mode_rounded, 'Dark Mode', 'Default to Slate Theme', colorScheme),
                        _buildSettingsRow(
                          Icons.logout_rounded,
                          'Log Out',
                          'Sign out of your account',
                          colorScheme,
                          isDestructive: true,
                          onTap: () async {
                            await userState.logout();
                            onLogout();
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16.0),
          ],
        ),
      ),
    );
  }

  Widget _buildMedicalIdRow(String label, String value, ColorScheme colorScheme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onSurface.withOpacity(0.6),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 14.0,
            fontWeight: FontWeight.bold,
            color: colorScheme.onSurface,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsRow(
    IconData icon,
    String title,
    String value,
    ColorScheme colorScheme, {
    bool isDestructive = false,
    VoidCallback? onTap,
  }) {
    final titleColor = isDestructive ? Colors.red.shade400 : colorScheme.onSurface;
    final iconColor = isDestructive ? Colors.red.shade400 : colorScheme.primary;

    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: iconColor.withOpacity(0.08),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: iconColor, size: 20.0),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 14.5,
          fontWeight: FontWeight.w600,
          color: titleColor,
        ),
      ),
      subtitle: Text(
        value,
        style: TextStyle(
          fontSize: 11.5,
          color: colorScheme.onSurface.withOpacity(0.4),
        ),
      ),
      trailing: Icon(
        Icons.chevron_right_rounded,
        color: colorScheme.onSurface.withOpacity(0.3),
      ),
      onTap: onTap,
    );
  }
}
