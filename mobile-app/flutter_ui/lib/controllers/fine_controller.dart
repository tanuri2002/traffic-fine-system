import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../models/payment_model.dart';
import '../services/api_service.dart';

class FineController extends ChangeNotifier {
  final ApiService apiService;

  Fine? fine;
  bool loading = false;
  String? error;

  FineController({required this.apiService});

  Future<void> searchFine(String refNumber, String categoryId) async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      fine = await apiService.lookupFine(refNumber, categoryId);
    } catch (e) {
      error = e.toString();
      fine = null;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<PaymentResponse?> pay(String fineId, PaymentRequest details) async {
    loading = true;
    error = null;
    notifyListeners();
    try {
      final resp = await apiService.submitPayment(fineId, details);
      return resp;
    } catch (e) {
      error = e.toString();
      return null;
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}
