import 'package:flutter/material.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import '../models/fine_model.dart';
import 'fine_details_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _referenceNumberController = TextEditingController();
  final _categoryIdController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _referenceNumberController.dispose();
    _categoryIdController.dispose();
    super.dispose();
  }

  void _checkFine() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      // TODO: Call API to fetch fine details
      // For now, simulate a delay
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });

          // Create sample fine data
          final fine = Fine(
            referenceNumber: _referenceNumberController.text,
            categoryId: _categoryIdController.text,
            driverName: 'Nimal Perera',
            violationType: 'Speed Limit Violation',
            amount: 5000.00,
            dueDate: '2026-05-31',
            status: 'Unpaid',
            issuedDate: '2026-04-15',
          );

          // Navigate to FineDetailsScreen
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => FineDetailsScreen(fine: fine),
            ),
          );
        }
      });
    }
  }

  String? _validateReferenceNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter fine reference number';
    }
    if (value.length < 10) {
      return 'Reference number must be at least 10 characters';
    }
    return null;
  }

  String? _validateCategoryId(String? value) {
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
                  CustomButton(
                    text: 'Check Fine',
                    onPressed: _checkFine,
                    isLoading: _isLoading,
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
