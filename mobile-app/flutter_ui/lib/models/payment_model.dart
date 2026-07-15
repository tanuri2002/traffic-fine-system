class PaymentRequest {
  final String fineReferenceNumber;
  final String categoryId;
  final double amount;
  final String cardNumber;
  final String expiryDate;
  final String cvv;
  final String cardholderName;

  PaymentRequest({
    required this.fineReferenceNumber,
    required this.categoryId,
    required this.amount,
    required this.cardNumber,
    required this.expiryDate,
    required this.cvv,
    required this.cardholderName,
  });

  Map<String, dynamic> toJson() {
    return {
      'fineReferenceNumber': fineReferenceNumber,
      'categoryId': categoryId,
      'amount': amount,
      'cardNumber': cardNumber,
      'expiryDate': expiryDate,
      'cvv': cvv,
      'cardholderName': cardholderName,
    };
  }
}

class PaymentResponse {
  final bool success;
  final String message;
  final String? transactionId;
  final String? timestamp;

  PaymentResponse({
    required this.success,
    required this.message,
    this.transactionId,
    this.timestamp,
  });

  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      transactionId: json['transactionId'],
      timestamp: json['timestamp'],
    );
  }
}
