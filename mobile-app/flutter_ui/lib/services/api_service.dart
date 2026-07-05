import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/fine_model.dart';
import '../models/payment_model.dart';

class ApiService {
  final String baseUrl; // e.g. http://10.0.2.2:5001/api

  ApiService({required this.baseUrl});

  Future<Fine> lookupFine(String referenceNumber, String categoryCode) async {
    final uri = Uri.parse('$baseUrl/fines/lookup').replace(queryParameters: {
      'referenceNumber': referenceNumber,
      'categoryCode': categoryCode,
    });

    final resp = await http.get(uri);

    if (resp.statusCode == 200) {
      final data = jsonDecode(resp.body);
      return Fine.fromJson(data);
    } else if (resp.statusCode == 404) {
      throw Exception('Fine not found');
    }
    throw Exception('Lookup failed: ${resp.statusCode} - ${resp.body}');
  }

  Future<PaymentResponse> submitPayment(
      String referenceNumber, PaymentRequest details) async {
    final uri = Uri.parse('$baseUrl/fines/$referenceNumber/pay');

    final resp = await http.patch(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(details.toJson()),
    );

    if (resp.statusCode == 200 || resp.statusCode == 201) {
      return PaymentResponse.fromJson(jsonDecode(resp.body));
    }
    throw Exception('Payment failed: ${resp.statusCode} - ${resp.body}');
  }
}