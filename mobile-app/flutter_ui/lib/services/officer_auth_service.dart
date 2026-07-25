import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';


class OfficerAuthService {
  // TODO: replace with the real backend base URL once backend-auth exists
  static const String baseUrl = 'http://localhost:5001/api';
  static const String _tokenKey = 'officer_jwt_token';

  Future<bool> login(String officerId, String password) async {
    try {
      final resp = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'badgeNumber': officerId, 'password': password}),
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
  Future<Map<String, dynamic>> register({
  required String badgeNumber,
  required String name,
  required String phone,
  required String district,
  required String password,
}) async {
  try {
    final resp = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'badgeNumber': badgeNumber,
        'name': name,
        'phone': phone,
        'district': district,
        'password': password,
      }),
    );

    if (resp.statusCode == 201 || resp.statusCode == 200) {
      return {'success': true};
    }

    final body = jsonDecode(resp.body);
    return {
      'success': false,
      'message': body['message'] ?? 'Registration failed',
    };
  } catch (_) {
    return {'success': false, 'message': 'Could not reach server'};
  }
}
  Future<List<Map<String, dynamic>>> getCategories() async {
    final resp = await http.get(Uri.parse('$baseUrl/categories'));
    if (resp.statusCode == 200) {
    final List data = jsonDecode(resp.body);
    return data.cast<Map<String, dynamic>>();
  }
  throw Exception('Failed to load categories');
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