class Fine {
  final String referenceNumber;
  final String categoryId;
  final String driverName;
  final String violationType;
  final double amount;
  final String dueDate;
  final String status; // Paid, Unpaid, Overdue
  final String issuedDate;

  Fine({
    required this.referenceNumber,
    required this.categoryId,
    required this.driverName,
    required this.violationType,
    required this.amount,
    required this.dueDate,
    required this.status,
    required this.issuedDate,
  });

  // Convert from JSON
  factory Fine.fromJson(Map<String, dynamic> json) {
    return Fine(
      referenceNumber: json['referenceNumber'] ?? '',
      categoryId: json['categoryId'] ?? '',
      driverName: json['driverName'] ?? '',
      violationType: json['violationType'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      dueDate: json['dueDate'] ?? '',
      status: json['status'] ?? 'Unpaid',
      issuedDate: json['issuedDate'] ?? '',
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'referenceNumber': referenceNumber,
      'categoryId': categoryId,
      'driverName': driverName,
      'violationType': violationType,
      'amount': amount,
      'dueDate': dueDate,
      'status': status,
      'issuedDate': issuedDate,
    };
  }
}
