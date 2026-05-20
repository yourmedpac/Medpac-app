import 'package:flutter/material.dart';
import '../user_state.dart';
import '../widgets/medpac_logo.dart';
import '../main.dart';
import '../widgets/wearable_sync_sheet.dart';

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
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: theme.brightness == Brightness.dark
                        ? [
                            colorScheme.surface,
                            colorScheme.primary.withOpacity(0.08),
                          ]
                        : [
                            colorScheme.surface,
                            colorScheme.primary.withOpacity(0.04),
                          ],
                  ),
                  borderRadius: BorderRadius.circular(28.0),
                  border: Border.all(
                    color: colorScheme.primary.withOpacity(0.15),
                    width: 1.0,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: colorScheme.primary.withOpacity(0.05),
                      blurRadius: 16.0,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    Positioned(
                      top: 0,
                      right: 0,
                      child: Opacity(
                        opacity: 0.15,
                        child: const MedpacLogo(size: 28.0, showBackground: false),
                      ),
                    ),
                    Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4.0),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: colorScheme.primary,
                              width: 2.0,
                            ),
                          ),
                          child: CircleAvatar(
                            radius: 46.0,
                            backgroundColor: colorScheme.primaryContainer,
                            backgroundImage: const NetworkImage(
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                            ),
                            onBackgroundImageError: (exception, stackTrace) {},
                            child: const SizedBox.shrink(),
                          ),
                        ),
                        const SizedBox(height: 16.0),
                        Text(
                          userState.userName,
                          style: TextStyle(
                            fontSize: 22.0,
                            fontWeight: FontWeight.bold,
                            color: colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 6.0),
                        Text(
                          '${userState.userEmail} • ${userState.userPhone}',
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                          style: TextStyle(
                            fontSize: 13.0,
                            fontWeight: FontWeight.w500,
                            color: colorScheme.onSurface.withOpacity(0.5),
                          ),
                        ),
                        const SizedBox(height: 16.0),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
                          decoration: BoxDecoration(
                            color: colorScheme.primary.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: Text(
                            'Patient ID: MP-894032',
                            style: TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.bold,
                              color: colorScheme.primary,
                            ),
                          ),
                        ),
                      ],
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
                        _buildSettingsRow(
                          Icons.devices_rounded,
                          'Connected Devices',
                          UserState().isWatchSynced ? 'Watch Synced ✓' : 'Tap to sync wearable',
                          colorScheme,
                          onTap: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (context) => WearableSyncSheet(
                                onSyncComplete: () {},
                              ),
                            );
                          },
                        ),
                        _buildSettingsRow(Icons.security_rounded, 'Privacy & Permissions', 'Manage data sharing', colorScheme),
                        _buildSettingsRow(
                          Icons.dark_mode_rounded,
                          Theme.of(context).brightness == Brightness.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
                          Theme.of(context).brightness == Brightness.dark ? 'Currently: Dark Theme' : 'Currently: Light Theme',
                          colorScheme,
                          onTap: () {
                            final newMode = Theme.of(context).brightness == Brightness.dark
                                ? ThemeMode.light
                                : ThemeMode.dark;
                            MedpacApp.setThemeMode(context, newMode);
                          },
                        ),
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
