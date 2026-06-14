import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/fine_model.dart';
import '../models/payment_model.dart';
import 'auth_service.dart';

class ApiService {
  final String baseUrl;
  final AuthService authService;

  ApiService({required this.baseUrl, required this.authService});

  Future<http.Response> _get(String path) async {
    final token = await authService.getToken();
    final headers = <String, String>{};
    if (token != null) headers['Authorization'] = 'Bearer $token';
    return http.get(Uri.parse('$baseUrl$path'), headers: headers);
  }

  Future<http.Response> _post(String path, Map<String, dynamic> body) async {
    final token = await authService.getToken();
    final headers = {'Content-Type': 'application/json'};
    if (token != null) headers['Authorization'] = 'Bearer $token';
    return http.post(Uri.parse('$baseUrl$path'), headers: headers, body: jsonEncode(body));
  }

  Future<Fine> lookupFine(String refNumber, String categoryId) async {
    final resp = await _get('/fines?ref=$refNumber&category=$categoryId');
    if (resp.statusCode == 200) {
      final data = jsonDecode(resp.body);
      return Fine.fromJson(data);
    } else if (resp.statusCode == 401) {
      // try refresh once
      final refreshed = await authService.tryRefresh();
      if (refreshed) return lookupFine(refNumber, categoryId);
      throw Exception('Unauthorized');
    } else if (resp.statusCode == 404) {
      throw Exception('Fine not found');
    }
    // Helps you see API output in the Flutter run logs.
    throw Exception('Lookup failed: ${resp.statusCode} - ${resp.body}');
  }


  Future<PaymentResponse> submitPayment(String fineId, PaymentRequest details) async {
    final resp = await _post('/payments', details.toJson());
    if (resp.statusCode == 200 || resp.statusCode == 201) {
      return PaymentResponse.fromJson(jsonDecode(resp.body));
    } else if (resp.statusCode == 401) {
      final refreshed = await authService.tryRefresh();
      if (refreshed) return submitPayment(fineId, details);
      throw Exception('Unauthorized');
    }
    throw Exception('Payment failed: ${resp.statusCode} - ${resp.body}');
  }
}
