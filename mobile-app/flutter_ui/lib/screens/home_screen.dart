/// File: lib/screens/home_screen.dart
/// Purpose: Home screen for the Traffic Fine Payment app. Provides a
/// fine reference lookup form and navigation to fine details.
/// Author: Member 3
/// Date: May 2026
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../models/fine_model.dart';
import '../controllers/fine_controller.dart';

// Sample fine data for testing
final unpaidFine = Fine(
  referenceNumber: 'TF20240512345',
  categoryId: 'CAT001',
  driverName: 'Nimal Perera',
  violationType: 'Speed Limit Violation',
  amount: 5000.00,
  dueDate: '2026-05-31',
  status: 'Unpaid',
  issuedDate: '2026-04-15',
);

final paidFine = Fine(
  referenceNumber: 'TF20240423156',
  categoryId: 'CAT002',
  driverName: 'Samantha Silva',
  violationType: 'No Parking Zone',
  amount: 3500.00,
  dueDate: '2026-05-20',
  status: 'Paid',
  issuedDate: '2026-03-20',
);

final overdueFine = Fine(
  referenceNumber: 'TF20240201789',
  categoryId: 'CAT003',
  driverName: 'Rajith Kumar',
  violationType: 'Traffic Light Violation',
  amount: 7500.00,
  dueDate: '2026-04-15',
  status: 'Overdue',
  issuedDate: '2026-02-15',
);

/// HomeScreen
///
/// Stateful screen that allows users to lookup a traffic fine by
/// reference number and category. Validates inputs and navigates to
/// `FineDetailsScreen` with a `Fine` model instance.
class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _referenceNumberController = TextEditingController();
  final _categoryIdController = TextEditingController();

  @override
  void dispose() {
    _referenceNumberController.dispose();
    _categoryIdController.dispose();
    super.dispose();
  }

  Future<void> _checkFine() async {
    /// Triggered when the user submits the lookup form.
    /// Validates inputs, shows a loading state, and navigates to
    /// `FineDetailsScreen`. In production this would call the backend.
    if (_formKey.currentState!.validate()) {
      final controller = context.read<FineController>();
      await controller.searchFine(
        _referenceNumberController.text,
        _categoryIdController.text,
      );

      if (!mounted) return;
      if (controller.fine != null) {
        Navigator.pushNamed(context, '/fineDetails', arguments: controller.fine);
      } else if (controller.error != null) {
        final err = controller.error!.toLowerCase();
        if (err.contains('unauthorized')) {
          Navigator.pushReplacementNamed(context, '/login');
          return;
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(controller.error!)),
        );
      }
    }
  }

  String? _validateReferenceNumber(String? value) {
    /// Validator for the fine reference number field.
    /// Ensures non-empty and minimum length.
    if (value == null || value.isEmpty) {
      return 'Please enter fine reference number';
    }
    if (value.length < 10) {
      return 'Reference number must be at least 10 characters';
    }
    return null;
  }

  String? _validateCategoryId(String? value) {
    /// Validator for the category ID field.
    /// Ensures the field is not empty.
    if (value == null || value.isEmpty) {
      return 'Please enter category ID';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header with Logo
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFF001F5C),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
              ),
              padding: const EdgeInsets.symmetric(
                vertical: 40,
                horizontal: 20,
              ),
              child: Column(
                children: [
                  // Logo Container
                  Container(
                    width: 100,
                    height: 100,
                    decoration: const BoxDecoration(
                      color: Color(0xFF001F5C),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Image.asset(
                        'assets/images/police_logo.png',
                        width: 70,
                        height: 70,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.security,
                            size: 50,
                            color: Color(0xFF001F5C),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Sri Lanka Police',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Traffic Fine Payment System',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),

            // Main Content
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Subtitle
                  Text(
                    'Enter your fine reference number and category ID to view and pay your traffic fine',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Form
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        CustomTextField(
                          label: 'Fine Reference Number',
                          hintText: 'e.g., TF20240512345',
                          controller: _referenceNumberController,
                          validator: _validateReferenceNumber,
                          keyboardType: TextInputType.text,
                        ),
                        CustomTextField(
                          label: 'Category ID',
                          hintText: 'e.g., CAT001',
                          controller: _categoryIdController,
                          validator: _validateCategoryId,
                          keyboardType: TextInputType.text,
                        ),
                      ],
                    ),
                  ),

                  // Check Fine Button
                  Consumer<FineController>(
                    builder: (context, controller, _) => CustomButton(
                      text: 'Check Fine',
                      onPressed: _checkFine,
                      isLoading: controller.loading,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Info Text
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Your fine details can be found on the citation notice issued by the traffic officer',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[600],
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
