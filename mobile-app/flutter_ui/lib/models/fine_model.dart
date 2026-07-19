class Category {
  final int id;
  final String code;
  final String title;
  final double amountLkr;
  final String description;

  Category({
    required this.id,
    required this.code,
    required this.title,
    required this.amountLkr,
    required this.description,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? 0,
      code: json['code'] ?? '',
      title: json['title'] ?? '',
      amountLkr: (json['amountLkr'] ?? 0).toDouble(),
      description: json['description'] ?? '',
    );
  }
}

class Officer {
  final int id;
  final String badgeNumber;
  final String name;
  final String phone;
  final String district;
  final String role;

  Officer({
    required this.id,
    required this.badgeNumber,
    required this.name,
    required this.phone,
    required this.district,
    required this.role,
  });

  factory Officer.fromJson(Map<String, dynamic> json) {
    return Officer(
      id: json['id'] ?? 0,
      badgeNumber: json['badgeNumber'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      district: json['district'] ?? '',
      role: json['role'] ?? '',
    );
  }
}

class Fine {
  final String referenceNumber;
  final String status; // "PENDING" or "PAID", confirm exact values with backend team
  final Category category;
  final double amountLkr;
  final Officer officer;
  final String issuedAt;
  final String? paidAt;

  Fine({
    required this.referenceNumber,
    required this.status,
    required this.category,
    required this.amountLkr,
    required this.officer,
    required this.issuedAt,
    this.paidAt,
  });

  factory Fine.fromJson(Map<String, dynamic> json) {
    return Fine(
      referenceNumber: json['referenceNumber'] ?? '',
      status: json['status'] ?? '',
      category: Category.fromJson(json['category'] ?? {}),
      amountLkr: (json['amountLkr'] ?? 0).toDouble(),
      officer: Officer.fromJson(json['officer'] ?? {}),
      issuedAt: json['issuedAt'] ?? '',
      paidAt: json['paidAt'],
    );
  }
}