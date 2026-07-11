import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/fine_model.dart';
import '../models/payment_model.dart';

class ApiService {
  final String baseUrl;        // backend-auth, e.g. http://10.0.2.2:5001/api
  final String paymentBaseUrl; // backend-payment, e.g. http://10.0.2.2:3001

  ApiService({required this.baseUrl, required this.paymentBaseUrl});

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
    final uri = Uri.parse('$paymentBaseUrl/pay');

    final resp = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'referenceNumber': referenceNumber,
        'paymentChannel': 'MOBILE',
      }),
    );

    if (resp.statusCode == 200) {
      return PaymentResponse.fromJson(jsonDecode(resp.body));
    }
    throw Exception('Payment failed: ${resp.statusCode} - ${resp.body}');
  }
}