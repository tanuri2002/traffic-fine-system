/// File: lib/screens/payment_screen.dart
/// Purpose: Payment form UI for processing card payments against a fine.
/// Author: Member 3
/// Date: May 2026
import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../models/test_payment_cards.dart';
import '../widgets/custom_button.dart';
import '../widgets/payment_text_field.dart';
import 'payment_success_screen.dart';
import 'payment_failure_screen.dart';

/// PaymentScreen
///
/// Presents a secure payment form (card number, expiry, CVV, name),
/// performs client-side validation and routes to success/failure
/// screens using `TestPaymentCards` during development.
class PaymentScreen extends StatefulWidget {
  final Fine fine;

  const PaymentScreen({
    Key? key,
    required this.fine,
  }) : super(key: key);

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _cardNumberController = TextEditingController();
  final _expiryDateController = TextEditingController();
  final _cvvController = TextEditingController();
  final _cardholderNameController = TextEditingController();
  bool _isProcessing = false;
  bool _agreedToTerms = false;

  @override
  void dispose() {
    _cardNumberController.dispose();
    _expiryDateController.dispose();
    _cvvController.dispose();
    _cardholderNameController.dispose();
    super.dispose();
  }

  String? _validateCardNumber(String? value) {
    /// Validates card number formatting (non-empty, 16 digits).
    if (value == null || value.isEmpty) {
      return 'Please enter card number';
    }
    String cleaned = value.replaceAll(' ', '');
    if (cleaned.length != 16) {
      return 'Card number must be 16 digits';
    }
    return null;
  }

  String? _validateExpiryDate(String? value) {
    /// Validates expiry date in MM/YY format.
    if (value == null || value.isEmpty) {
      return 'Please enter expiry date';
    }
    if (!RegExp(r'^(0[1-9]|1[0-2])\/\d{2}$').hasMatch(value)) {
      return 'Format: MM/YY';
    }
    return null;
  }

  String? _validateCVV(String? value) {
    /// Validates CVV (3 digits expected).
    if (value == null || value.isEmpty) {
      return 'Please enter CVV';
    }
    if (value.length != 3) {
      return 'CVV must be 3 digits';
    }
    return null;
  }

  String? _validateCardholderName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter cardholder name';
    }
    return null;
  }

  void _formatCardNumber(String value) {
    /// Formats a raw card number into groups of 4 digits for display.
    String cleaned = value.replaceAll(' ', '');
    if (cleaned.length > 16) {
      cleaned = cleaned.substring(0, 16);
    }

    String formatted = '';
    for (int i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 == 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }

    _cardNumberController.value = TextEditingValue(
      text: formatted,
      selection: TextSelection.fromPosition(
        TextPosition(offset: formatted.length),
      ),
    );
  }

  void _formatExpiryDate(String value) {
    /// Auto-formats expiry date input into `MM/YY` as the user types.
    String cleaned = value.replaceAll('/', '');
    if (cleaned.length > 4) {
      cleaned = cleaned.substring(0, 4);
    }

    String formatted = '';
    if (cleaned.length >= 2) {
      formatted = '${cleaned.substring(0, 2)}/${cleaned.substring(2)}';
    } else {
      formatted = cleaned;
    }

    _expiryDateController.value = TextEditingValue(
      text: formatted,
      selection: TextSelection.fromPosition(
        TextPosition(offset: formatted.length),
      ),
    );
  }

  void _processPayment() {
    /// Performs client-side checks, simulates processing and routes to
    /// the appropriate outcome screen. Uses `TestPaymentCards` to
    /// determine success/failure in development mode.
    if (_formKey.currentState!.validate()) {
      if (!_agreedToTerms) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please agree to the security notice'),
          ),
        );
        return;
      }

      setState(() {
        _isProcessing = true;
      });

      // Simulate payment processing
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            _isProcessing = false;
          });

          // Check test card and process accordingly
          final cleanedCardNumber =
              _cardNumberController.text.replaceAll(' ', '');
          final testCard = TestPaymentCards.getTestCard(cleanedCardNumber);
          final transactionId = 'TXN${DateTime.now().millisecondsSinceEpoch}';

          if (testCard != null && testCard.status == 'Success') {
            // Success case
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => PaymentSuccessScreen(
                  fine: widget.fine,
                  transactionId: transactionId,
                ),
              ),
            );
          } else if (testCard != null) {
            // Failure case
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => PaymentFailureScreen(
                  fine: widget.fine,
                  failureReason: testCard.status,
                  transactionId: transactionId,
                ),
              ),
            );
          } else {
            // Unknown card - simulate success
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => PaymentSuccessScreen(
                  fine: widget.fine,
                  transactionId: transactionId,
                ),
              ),
            );
          }
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFF001F5C),
              ),
              padding: const EdgeInsets.only(
                top: 16,
                bottom: 24,
                left: 20,
                right: 20,
              ),
              child: SafeArea(
                child: Column(
                  children: [
                    Row(
                      children: [
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Row(
                            children: [
                              Icon(
                                Icons.arrow_back,
                                color: Colors.white,
                                size: 24,
                              ),
                              SizedBox(width: 8),
                              Text(
                                'Back',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Secure Payment',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Main Content
            Padding(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Secure Gateway Badge
                    Center(
                      child: Chip(
                        label: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(
                              Icons.lock,
                              color: Colors.green,
                              size: 16,
                            ),
                            SizedBox(width: 6),
                            Text(
                              'Secure Payment Gateway',
                              style: TextStyle(
                                color: Colors.green,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        backgroundColor: Colors.green.withValues(alpha: 0.1),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Total Amount
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: Colors.blue.withValues(alpha: 0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                              child: Icon(
                                Icons.wallet,
                                color: Colors.blue,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Total Amount',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Rs. ${widget.fine.amount.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF001F5C),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Card Number
                    PaymentTextField(
                      label: 'Card Number',
                      hintText: '1234 5678 9012 3456',
                      controller: _cardNumberController,
                      validator: _validateCardNumber,
                      keyboardType: TextInputType.number,
                      maxLength: 19,
                      onChanged: _formatCardNumber,
                    ),

                    // Expiry Date and CVV Row
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Expiry Date',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF001F5C),
                                ),
                              ),
                              const SizedBox(height: 8),
                              TextFormField(
                                controller: _expiryDateController,
                                keyboardType: TextInputType.number,
                                maxLength: 5,
                                validator: _validateExpiryDate,
                                decoration: InputDecoration(
                                  hintText: 'MM/YY',
                                  hintStyle: TextStyle(
                                    color: Colors.grey[400],
                                    fontSize: 14,
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[50],
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: Colors.grey[300]!,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: Colors.grey[300]!,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: const BorderSide(
                                      color: Color(0xFF001F5C),
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                  counterText: '',
                                ),
                                onChanged: _formatExpiryDate,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'CVV',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF001F5C),
                                ),
                              ),
                              const SizedBox(height: 8),
                              TextFormField(
                                controller: _cvvController,
                                keyboardType: TextInputType.number,
                                maxLength: 3,
                                obscureText: true,
                                validator: _validateCVV,
                                decoration: InputDecoration(
                                  hintText: '123',
                                  hintStyle: TextStyle(
                                    color: Colors.grey[400],
                                    fontSize: 14,
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[50],
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: Colors.grey[300]!,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: Colors.grey[300]!,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: const BorderSide(
                                      color: Color(0xFF001F5C),
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                  counterText: '',
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Cardholder Name
                    PaymentTextField(
                      label: 'Cardholder Name',
                      hintText: 'JOHN DOE',
                      controller: _cardholderNameController,
                      validator: _validateCardholderName,
                      keyboardType: TextInputType.text,
                    ),

                    // Pay Now Button
                    CustomButton(
                      text: 'Pay Now',
                      onPressed: _processPayment,
                      isLoading: _isProcessing,
                    ),
                    const SizedBox(height: 16),

                    // Security Notice
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.blue.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.blue.withValues(alpha: 0.2),
                        ),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.lock,
                            color: Colors.blue,
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Your payment is secured with 256-bit SSL encryption. Card details are not stored on our servers.',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[700],
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Test Card Info
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.amber.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: Colors.amber.withValues(alpha: 0.3),
                        ),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Test Cards:',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[800],
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '✓ 1111111111111111 | Success\n✗ 2222222222222222 | Declined\n✗ 3333333333333333 | Expired',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[700],
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Terms Checkbox
                    Row(
                      children: [
                        Checkbox(
                          value: _agreedToTerms,
                          onChanged: (value) {
                            setState(() {
                              _agreedToTerms = value ?? false;
                            });
                          },
                          activeColor: const Color(0xFF001F5C),
                        ),
                        Expanded(
                          child: Text(
                            'I agree to the payment terms and conditions',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[700],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
