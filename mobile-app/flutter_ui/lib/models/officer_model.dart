class Officer {
  final int id;
  final String badgeNumber;
  final String name;
  final String phone;

  Officer({
    required this.id,
    required this.badgeNumber,
    required this.name,
    required this.phone,
  });

  factory Officer.fromJson(Map<String, dynamic> json) {
    return Officer(
      id: json['id'] ?? 0,
      badgeNumber: json['badgeNumber'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
    );
  }
}

class FineCategory {
  final String id;
  final String label;
  final double fee;

  const FineCategory({required this.id, required this.label, required this.fee});
}

// Mirrors the categories used in the officer web portal - keep in sync
const List<FineCategory> fineCategories = [
  FineCategory(id: 'CAT001', label: 'Speed Limit Violation', fee: 5000),
  FineCategory(id: 'CAT002', label: 'No Parking Zone', fee: 3500),
  FineCategory(id: 'CAT003', label: 'Traffic Light Violation', fee: 7500),
  FineCategory(id: 'CAT004', label: 'No Helmet / Seatbelt', fee: 2500),
  FineCategory(id: 'CAT005', label: 'Driving Without License', fee: 10000),
  FineCategory(id: 'CAT006', label: 'Mobile Phone Usage While Driving', fee: 4000),
];