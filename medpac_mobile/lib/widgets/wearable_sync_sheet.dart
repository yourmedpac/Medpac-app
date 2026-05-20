import 'dart:async';
import 'package:flutter/material.dart';
import '../user_state.dart';

class WearableSyncSheet extends StatefulWidget {
  final VoidCallback onSyncComplete;

  const WearableSyncSheet({
    super.key,
    required this.onSyncComplete,
  });

  @override
  State<WearableSyncSheet> createState() => _WearableSyncSheetState();
}

class _WearableSyncSheetState extends State<WearableSyncSheet> {
  int _currentStep = 0; // 0: Select Device, 1: Syncing, 2: Success
  String _selectedDevice = '';
  String _syncStatusText = 'Searching for watch...';
  double _syncProgress = 0.0;
  Timer? _syncTimer;

  // Sync steps
  final List<String> _syncSteps = [
    'Locating wearable bluetooth signals...',
    'Establishing secure biometric handshakes...',
    'Reading heart rate logs & sensor streams...',
    'Analyzing sleep staging and hypnograms...',
    'Encrypting data packets...',
    'Syncing telemetry with Medpac Health Cloud...',
  ];

  void _startSync(String deviceName) {
    setState(() {
      _selectedDevice = deviceName;
      _currentStep = 1;
      _syncProgress = 0.0;
      _syncStatusText = _syncSteps[0];
    });

    int stepIndex = 0;
    _syncTimer = Timer.periodic(const Duration(milliseconds: 1200), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      stepIndex++;
      if (stepIndex < _syncSteps.length) {
        setState(() {
          _syncProgress = stepIndex / _syncSteps.length;
          _syncStatusText = _syncSteps[stepIndex];
        });
      } else {
        timer.cancel();
        setState(() {
          _currentStep = 2;
          _syncProgress = 1.0;
        });
      }
    });
  }

  @override
  void dispose() {
    _syncTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.background,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(28.0),
          topRight: Radius.circular(28.0),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
      child: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child: _buildCurrentStepView(colorScheme),
        ),
      ),
    );
  }

  Widget _buildCurrentStepView(ColorScheme colorScheme) {
    switch (_currentStep) {
      case 0:
        return _buildDeviceSelector(colorScheme);
      case 1:
        return _buildSyncProgressView(colorScheme);
      case 2:
        return _buildSyncSuccessView(colorScheme);
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildDeviceSelector(ColorScheme colorScheme) {
    return Column(
      key: const ValueKey('select_device'),
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Center(
          child: Container(
            width: 48.0,
            height: 4.0,
            decoration: BoxDecoration(
              color: colorScheme.onSurface.withOpacity(0.12),
              borderRadius: BorderRadius.circular(2.0),
            ),
          ),
        ),
        const SizedBox(height: 24.0),
        Text(
          'Connect Wearable Device',
          style: TextStyle(
            fontSize: 20.0,
            fontWeight: FontWeight.bold,
            color: colorScheme.onBackground,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8.0),
        Text(
          'Select your smart watch or fitness band to sync live sleep scores and heart rates.',
          style: TextStyle(
            fontSize: 13.5,
            color: colorScheme.onBackground.withOpacity(0.6),
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24.0),
        _buildDeviceTile('Apple Watch', 'Apple Health Kit Sync', Icons.watch_rounded, colorScheme),
        const SizedBox(height: 12.0),
        _buildDeviceTile('Fitbit Sense & Versa', 'Fitbit Cloud Connect', Icons.fitbit_rounded, colorScheme),
        const SizedBox(height: 12.0),
        _buildDeviceTile('Garmin Venu & Fenix', 'Garmin Connect SDK', Icons.directions_run_rounded, colorScheme),
        const SizedBox(height: 12.0),
        _buildDeviceTile('Samsung Galaxy Watch', 'Samsung Health Sync', Icons.watch_outlined, colorScheme),
        const SizedBox(height: 20.0),
      ],
    );
  }

  Widget _buildDeviceTile(String title, String subtitle, IconData icon, ColorScheme colorScheme) {
    return InkWell(
      onTap: () => _startSync(title),
      borderRadius: BorderRadius.circular(16.0),
      child: Container(
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          border: Border.all(color: colorScheme.onSurface.withOpacity(0.08)),
          borderRadius: BorderRadius.circular(16.0),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10.0),
              decoration: BoxDecoration(
                color: colorScheme.primary.withOpacity(0.08),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: colorScheme.primary, size: 24.0),
            ),
            const SizedBox(width: 16.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2.0),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12.0,
                      color: colorScheme.onBackground.withOpacity(0.5),
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right_rounded,
              color: colorScheme.onSurface.withOpacity(0.3),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSyncProgressView(ColorScheme colorScheme) {
    return Column(
      key: const ValueKey('syncing'),
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 20.0),
        SizedBox(
          height: 90.0,
          width: 90.0,
          child: Stack(
            alignment: Alignment.center,
            children: [
              CircularProgressIndicator(
                value: _syncProgress,
                strokeWidth: 6.0,
                valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
                backgroundColor: colorScheme.primary.withOpacity(0.12),
              ),
              Icon(
                Icons.sync_rounded,
                color: colorScheme.primary,
                size: 40.0,
              ),
            ],
          ),
        ),
        const SizedBox(height: 28.0),
        Text(
          'Syncing $_selectedDevice',
          style: const TextStyle(
            fontSize: 18.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8.0),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Text(
            _syncStatusText,
            style: TextStyle(
              fontSize: 13.5,
              color: colorScheme.onBackground.withOpacity(0.6),
            ),
            textAlign: TextAlign.center,
          ),
        ),
        const SizedBox(height: 32.0),
      ],
    );
  }

  Widget _buildSyncSuccessView(ColorScheme colorScheme) {
    return Column(
      key: const ValueKey('success'),
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Center(
          child: Container(
            width: 48.0,
            height: 4.0,
            decoration: BoxDecoration(
              color: colorScheme.onSurface.withOpacity(0.12),
              borderRadius: BorderRadius.circular(2.0),
            ),
          ),
        ),
        const SizedBox(height: 24.0),
        Center(
          child: Container(
            padding: const EdgeInsets.all(12.0),
            decoration: const BoxDecoration(
              color: Color(0xFFE8F5E9),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_rounded,
              color: Colors.green,
              size: 48.0,
            ),
          ),
        ),
        const SizedBox(height: 16.0),
        Text(
          'Biometrics Synced!',
          style: TextStyle(
            fontSize: 20.0,
            fontWeight: FontWeight.bold,
            color: colorScheme.onBackground,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6.0),
        Text(
          'Successfully retrieved biometric parameters from your watch.',
          style: TextStyle(
            fontSize: 13.0,
            color: colorScheme.onBackground.withOpacity(0.5),
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24.0),
        Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            color: colorScheme.primary.withOpacity(0.04),
            border: Border.all(color: colorScheme.primary.withOpacity(0.12)),
            borderRadius: BorderRadius.circular(16.0),
          ),
          child: Column(
            children: [
              _buildBiometricRow(
                Icons.favorite_rounded,
                'Heart Rate',
                '74 bpm',
                'Avg Resting: 62 bpm',
                Colors.red.shade400,
                colorScheme,
              ),
              const Divider(height: 24.0),
              _buildBiometricRow(
                Icons.bedtime_rounded,
                'Sleep Score',
                '85/100',
                '7h 48m • Restorative',
                Colors.indigo.shade400,
                colorScheme,
              ),
              const Divider(height: 24.0),
              _buildBiometricRow(
                Icons.directions_run_rounded,
                'Steps Count',
                '7,600 steps',
                'Goal: 10,000 steps',
                Colors.orange.shade400,
                colorScheme,
              ),
            ],
          ),
        ),
        const SizedBox(height: 24.0),
        ElevatedButton(
          onPressed: () async {
            // Update UserState and trigger Supabase Sync
            await UserState().updateWatchData('74 bpm', '85/100');
            widget.onSyncComplete();
            if (context.mounted) {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Row(
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Colors.white),
                      const SizedBox(width: 8.0),
                      Text('Successfully synced $_selectedDevice metrics with Supabase!'),
                    ],
                  ),
                  backgroundColor: const Color(0xFF006565),
                ),
              );
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16.0),
            ),
            elevation: 0,
          ),
          child: const Text(
            'Import Biometrics',
            style: TextStyle(fontSize: 15.0, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: 12.0),
      ],
    );
  }

  Widget _buildBiometricRow(
    IconData icon,
    String label,
    String value,
    String detail,
    Color iconColor,
    ColorScheme colorScheme,
  ) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.08),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 20.0),
        ),
        const SizedBox(width: 14.0),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12.0,
                  color: colorScheme.onBackground.withOpacity(0.5),
                ),
              ),
              const SizedBox(height: 2.0),
              Text(
                detail,
                style: const TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 16.0,
            fontWeight: FontWeight.bold,
            color: colorScheme.onBackground,
          ),
        ),
      ],
    );
  }
}
