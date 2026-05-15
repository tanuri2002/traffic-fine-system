import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../widgets/custom_button.dart';

class PaymentFailureScreen extends StatelessWidget {
  final Fine fine;
  final String failureReason;
  final String transactionId;

  const PaymentFailureScreen({
    Key? key,
    required this.fine,
    required this.failureReason,
    required this.transactionId,
  }) : super(key: key);

  Color _getStatusColor(String reason) {
    switch (reason.toLowerCase()) {
      case 'declined':
        return Colors.red;
      case 'expired':
        return Colors.orange;
      case 'limit exceeded':
        return Colors.purple;
      case 'processing error':
        return Colors.red;
      default:
        return Colors.red;
    }
  }

  String _getFailureMessage(String reason) {
    switch (reason.toLowerCase()) {
      case 'declined':
        return 'Your card was declined. Please check your card details and try again.';
      case 'expired':
        return 'Your card has expired. Please use a valid card.';
      case 'limit exceeded':
        return 'Transaction limit exceeded. Please contact your bank.';
      case 'processing error':
        return 'A processing error occurred. Please try again later.';
      default:
        return 'Payment failed. Please try again.';
    }
  }

  IconData _getFailureIcon(String reason) {
    switch (reason.toLowerCase()) {
      case 'declined':
        return Icons.cancel;
      case 'expired':
        return Icons.schedule;
      case 'limit exceeded':
        return Icons.warning;
      case 'processing error':
        return Icons.error;
      default:
        return Icons.cancel;
    }
  }

  @override
  Widget build(BuildContext context) {
    Color statusColor = _getStatusColor(failureReason);
    String message = _getFailureMessage(failureReason);
    IconData icon = _getFailureIcon(failureReason);

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Failure Header
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: statusColor,
              ),
              padding: const EdgeInsets.symmetric(
                vertical: 40,
                horizontal: 20,
              ),
              child: Column(
                children: [
                  Icon(
                    icon,
                    color: Colors.white,
                    size: 80,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Payment Failed',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    failureReason,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white.withValues(alpha: 0.9),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),

            // Failure Details
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Error Message Card
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: statusColor.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: statusColor.withValues(alpha: 0.3),
                      ),
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.info_outline,
                              color: statusColor,
                              size: 24,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'Error Details',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: statusColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          padding: const EdgeInsets.all(12),
                          child: Text(
                            message,
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[800],
                              height: 1.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Fine Details Summary
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withValues(alpha: 0.1),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Fine Information',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[800],
                          ),
                        ),
                        const SizedBox(height: 16),
                        _DetailRow(
                          label: 'Reference Number',
                          value: fine.referenceNumber,
                        ),
                        const Divider(height: 16),
                        _DetailRow(
                          label: 'Driver Name',
                          value: fine.driverName,
                        ),
                        const Divider(height: 16),
                        _DetailRow(
                          label: 'Amount Due',
                          value: 'Rs. ${fine.amount.toStringAsFixed(2)}',
                          isHighlight: true,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // What to do next
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.blue.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.blue.withValues(alpha: 0.2),
                      ),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'What to do next?',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[800],
                          ),
                        ),
                        const SizedBox(height: 12),
                        _ActionItem(
                          number: '1',
                          text:
                              'Review your card details and ensure they are correct',
                        ),
                        const SizedBox(height: 8),
                        _ActionItem(
                          number: '2',
                          text: 'Try again with the correct information',
                        ),
                        const SizedBox(height: 8),
                        _ActionItem(
                          number: '3',
                          text: 'Contact your bank if the issue persists',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Action Buttons
                  CustomButton(
                    text: 'Try Again',
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                  const SizedBox(height: 12),
                  CustomButton(
                    text: 'Back to Fine Details',
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                    backgroundColor: Colors.grey[300],
                    textColor: const Color(0xFF001F5C),
                  ),
                  const SizedBox(height: 12),
                  CustomButton(
                    text: 'Back to Home',
                    onPressed: () {
                      Navigator.popUntil(context, (route) => route.isFirst);
                    },
                    backgroundColor: Colors.grey[200],
                    textColor: Colors.grey[700],
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

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isHighlight;

  const _DetailRow({
    Key? key,
    required this.label,
    required this.value,
    this.isHighlight = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey[600],
            fontWeight: FontWeight.w500,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: isHighlight ? FontWeight.bold : FontWeight.w600,
            color: isHighlight ? Colors.red : const Color(0xFF001F5C),
          ),
        ),
      ],
    );
  }
}

class _ActionItem extends StatelessWidget {
  final String number;
  final String text;

  const _ActionItem({
    Key? key,
    required this.number,
    required this.text,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: Colors.blue,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              number,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[700],
              height: 1.4,
            ),
          ),
        ),
      ],
    );
  }
}
