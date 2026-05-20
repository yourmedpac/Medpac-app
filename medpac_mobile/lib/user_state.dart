import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class UserState {
  static final UserState _instance = UserState._internal();
  factory UserState() => _instance;
  UserState._internal();

  final _storage = const FlutterSecureStorage();

  // API URL Configuration
  // Fallback to local network loopback for Android emulator, or you can point to hosted staging/production
  String apiBaseUrl = 'http://10.0.2.2:3000';

  bool isLoggedIn = false;
  bool isQuizCompleted = false;
  String? userId;
  String? token;
  String userName = 'Prabh';
  String userEmail = 'prabh@medpac.io';
  String userPhone = '+91 98765 43210';
  String loginMethod = 'Phone';

  // Load state from secure storage
  Future<void> loadPersistedState() async {
    try {
      isLoggedIn = (await _storage.read(key: 'isLoggedIn')) == 'true';
      isQuizCompleted = (await _storage.read(key: 'isQuizCompleted')) == 'true';
      userId = await _storage.read(key: 'userId');
      token = await _storage.read(key: 'token');
      userName = await _storage.read(key: 'userName') ?? 'Prabh';
      userEmail = await _storage.read(key: 'userEmail') ?? 'prabh@medpac.io';
      userPhone = await _storage.read(key: 'userPhone') ?? '+91 98765 43210';
      loginMethod = await _storage.read(key: 'loginMethod') ?? 'Phone';
    } catch (_) {
      isLoggedIn = false;
      isQuizCompleted = false;
    }
  }

  Future<bool> login({
    required String name,
    required String email,
    required String phone,
    required String method,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/api/auth/mobile-sync'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email.isEmpty ? null : email,
          'phone': phone.isEmpty ? null : phone,
          'loginMethod': method,
        }),
      ).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          isLoggedIn = true;
          token = data['token'];
          final user = data['user'];
          userId = user['id'];
          userName = user['name'] ?? name;
          userEmail = user['email'] ?? email;
          userPhone = user['phone'] ?? phone;
          isQuizCompleted = user['isQuizCompleted'] ?? false;
          loginMethod = method;

          await _storage.write(key: 'isLoggedIn', value: 'true');
          await _storage.write(key: 'token', value: token);
          await _storage.write(key: 'userId', value: userId);
          await _storage.write(key: 'userName', value: userName);
          await _storage.write(key: 'userEmail', value: userEmail);
          await _storage.write(key: 'userPhone', value: userPhone);
          await _storage.write(key: 'isQuizCompleted', value: isQuizCompleted ? 'true' : 'false');
          await _storage.write(key: 'loginMethod', value: loginMethod);
          return true;
        }
      }
    } catch (e) {
      print('Network login error: $e');
    }

    // Fallback: local login if API is offline
    isLoggedIn = true;
    userName = name;
    userEmail = email;
    userPhone = phone;
    loginMethod = method;
    await _storage.write(key: 'isLoggedIn', value: 'true');
    await _storage.write(key: 'userName', value: name);
    await _storage.write(key: 'userEmail', value: email);
    await _storage.write(key: 'userPhone', value: phone);
    await _storage.write(key: 'loginMethod', value: method);
    return true;
  }

  Future<bool> submitQuiz(Map<String, dynamic> quizData) async {
    try {
      final response = await http.post(
        Uri.parse('$apiBaseUrl/api/profile/quiz'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'userId': userId,
          ...quizData,
        }),
      ).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          isQuizCompleted = true;
          await _storage.write(key: 'isQuizCompleted', value: 'true');
          return true;
        }
      }
    } catch (e) {
      print('Network quiz submission error: $e');
    }

    // Fallback
    isQuizCompleted = true;
    await _storage.write(key: 'isQuizCompleted', value: 'true');
    return true;
  }

  Future<void> completeQuiz() async {
    isQuizCompleted = true;
    await _storage.write(key: 'isQuizCompleted', value: 'true');
  }

  Future<void> logout() async {
    isLoggedIn = false;
    isQuizCompleted = false;
    userName = 'Prabh';
    userEmail = 'prabh@medpac.io';
    userPhone = '+91 98765 43210';
    loginMethod = 'Phone';
    userId = null;
    token = null;

    await _storage.deleteAll();
  }
}
