import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/officer_model.dart';

class OfficerAuthService {
  static const String baseUrl = 'http://10.0.2.2:5000/api';
  static const String _tokenKey = 'officer_jwt_token';
  static const String _demoTokenPrefix = 'demo-token:';

  // Local fallback so the officer flow can be tested without a backend.
  static const Map<String, String> _demoCredentials = {
    'OFC-1024': '1234',
    'OFC-2048': '4567',
    'OFC-4096': '7890',
  };

  static const Map<String, String> _demoOfficerNames = {
    'OFC-1024': 'Sergeant N. Perera',
    'OFC-2048': 'Inspector A. Fernando',
    'OFC-4096': 'Constable R. Silva',
  };

  Future<bool> login(String officerId, String password) async {
    if (_demoCredentials[officerId] == password) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, '$_demoTokenPrefix$officerId');
      return true;
    }

    try {
      final resp = await http.post(
        Uri.parse('$baseUrl/auth/officer/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'officerId': officerId, 'password': password}),
      );

      if (resp.statusCode == 200) {
        final body = jsonDecode(resp.body);
        final token = body['token'] ?? body['accessToken'];
        if (token != null) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString(_tokenKey, token);
          return true;
        }
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  Future<Map<String, dynamic>?> submitFine({
    required String categoryId,
    required String vehicleNo,
    required double fee,
  }) async {
    final token = await getToken();
    if (token == null) return null;

    if (token.startsWith(_demoTokenPrefix)) {
      final officerId = token.substring(_demoTokenPrefix.length);
      return {
        'referenceNumber': 'DF-${DateTime.now().millisecondsSinceEpoch}',
        'officerId': officerId,
        'officerName': _demoOfficerNames[officerId] ?? 'Demo Officer',
        'categoryId': categoryId,
        'vehicleNo': vehicleNo,
        'fee': fee,
        'status': 'issued',
      };
    }

    try {
      final resp = await http.post(
        Uri.parse('$baseUrl/fines'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'categoryId': categoryId,
          'vehicleNo': vehicleNo,
          'fee': fee,
        }),
      );

      if (resp.statusCode == 200 || resp.statusCode == 201) {
        return jsonDecode(resp.body);
      }
      return null;
    } catch (_) {
      return null;
    }
  }
}