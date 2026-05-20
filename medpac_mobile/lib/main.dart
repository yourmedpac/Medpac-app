import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/ai_assistant_screen.dart';
import 'screens/medicines_screen.dart';
import 'screens/records_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/quiz_screen.dart';
import 'screens/login_screen.dart';
import 'user_state.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await UserState().loadPersistedState();
  runApp(const MedpacApp());
}

class MedpacApp extends StatefulWidget {
  const MedpacApp({super.key});

  static void setThemeMode(BuildContext context, ThemeMode mode) {
    _MedpacAppState.setThemeMode(context, mode);
  }

  @override
  State<MedpacApp> createState() => _MedpacAppState();
}

class _MedpacAppState extends State<MedpacApp> {
  static ThemeMode currentThemeMode = ThemeMode.dark;

  static void setThemeMode(BuildContext context, ThemeMode mode) {
    currentThemeMode = mode;
    final state = context.findAncestorStateOfType<_MedpacAppState>();
    state?.setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final userState = UserState();
    
    Widget homeWidget;
    if (!userState.isLoggedIn) {
      homeWidget = LoginScreen(
        onLoginSuccess: () {
          setState(() {});
        },
      );
    } else if (!userState.isQuizCompleted) {
      homeWidget = QuizScreen(
        onQuizComplete: () async {
          await userState.completeQuiz();
          setState(() {});
        },
      );
    } else {
      homeWidget = MainNavigationShell(
        onLogout: () {
          setState(() {});
        },
      );
    }

    return MaterialApp(
      title: 'Medpac Health OS',
      debugShowCheckedModeBanner: false,
      themeMode: currentThemeMode,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF006565),
          brightness: Brightness.light,
          primary: const Color(0xFF006565),
          secondary: const Color(0xFFAE2F34),
          surface: const Color(0xFFFFFFFF),
          background: const Color(0xFFF5F7F6),
        ),
        scaffoldBackgroundColor: const Color(0xFFF5F7F6),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: false,
          iconTheme: IconThemeData(color: Color(0xFF191C1B)),
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF006565),
          brightness: Brightness.dark,
          primary: const Color(0xFF00857A),
          secondary: const Color(0xFFCF5C60),
          surface: const Color(0xFF1A1F1E),
          background: const Color(0xFF111413),
        ),
        scaffoldBackgroundColor: const Color(0xFF111413),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: false,
          iconTheme: IconThemeData(color: Colors.white),
        ),
      ),
      home: homeWidget,
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  final VoidCallback onLogout;

  const MainNavigationShell({
    super.key,
    required this.onLogout,
  });

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      HomeScreen(
        onProfileTap: () {
          setState(() {
            _currentIndex = 4;
          });
        },
        onNavigateToTab: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
      const AiAssistantScreen(),
      const MedicinesScreen(),
      const RecordsScreen(),
      ProfileScreen(onLogout: widget.onLogout),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: colorScheme.surface.withOpacity(0.95),
          border: Border(
            top: BorderSide(
              color: colorScheme.onSurface.withOpacity(0.08),
              width: 1.0,
            ),
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.dashboard_rounded, 'Dashboard', colorScheme),
                _buildNavItem(1, Icons.psychology_rounded, 'AI Assistant', colorScheme),
                _buildNavItem(2, Icons.medication_rounded, 'Medicines', colorScheme),
                _buildNavItem(3, Icons.folder_shared_rounded, 'Records', colorScheme),
                _buildNavItem(4, Icons.person_rounded, 'Profile', colorScheme),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label, ColorScheme colorScheme) {
    final isSelected = _currentIndex == index;
    final activeColor = colorScheme.primary;
    final inactiveColor = colorScheme.onSurface.withOpacity(0.5);

    return GestureDetector(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
        decoration: BoxDecoration(
          color: isSelected ? activeColor.withOpacity(0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(16.0),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? activeColor : inactiveColor,
              size: 22.0,
            ),
            const SizedBox(height: 2.0),
            Text(
              label,
              style: TextStyle(
                fontSize: 9.0,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected ? activeColor : inactiveColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
