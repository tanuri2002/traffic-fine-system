import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../widgets/fine_detail_item.dart';
import '../widgets/custom_button.dart';
import 'payment_screen.dart';

class FineDetailsScreen extends StatelessWidget {
  final Fine fine;

  const FineDetailsScreen({
    Key? key,
    required this.fine,
  }) : super(key: key);

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'paid':
        return Colors.green;
      case 'overdue':
        return Colors.red;
      default:
        return Colors.orange;
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
                        'Fine Details',
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
              child: Column(
                children: [
                  // Status Badge
                  Chip(
                    label: Text(
                      fine.status,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    backgroundColor: _getStatusColor(fine.status),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Fine Details Card
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.1),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        FineDetailItem(
                          icon: Icons.person,
                          label: 'Driver Name',
                          value: fine.driverName,
                          iconColor: Colors.blue,
                          iconBackgroundColor: Colors.blue.withOpacity(0.1),
                        ),
                        const Divider(height: 24),
                        FineDetailItem(
                          icon: Icons.warning_rounded,
                          label: 'Violation Type',
                          value: fine.violationType,
                          iconColor: Colors.orange,
                          iconBackgroundColor: Colors.orange.withOpacity(0.1),
                        ),
                        const Divider(height: 24),
                        FineDetailItem(
                          icon: Icons.attach_money,
                          label: 'Fine Amount',
                          value: 'Rs. ${fine.amount.toStringAsFixed(2)}',
                          iconColor: Colors.green,
                          iconBackgroundColor: Colors.green.withOpacity(0.1),
                        ),
                        const Divider(height: 24),
                        FineDetailItem(
                          icon: Icons.calendar_today,
                          label: 'Due Date',
                          value: fine.dueDate,
                          iconColor: Colors.purple,
                          iconBackgroundColor: Colors.purple.withOpacity(0.1),
                        ),
                        const Divider(height: 24),
                        FineDetailItem(
                          icon: Icons.confirmation_number,
                          label: 'Reference Number',
                          value: fine.referenceNumber,
                          iconColor: const Color(0xFF001F5C),
                          iconBackgroundColor:
                              const Color(0xFF001F5C).withOpacity(0.1),
                        ),
                        const Divider(height: 24),
                        FineDetailItem(
                          icon: Icons.category,
                          label: 'Category ID',
                          value: fine.categoryId,
                          iconColor: Colors.indigo,
                          iconBackgroundColor: Colors.indigo.withOpacity(0.1),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Warning Note
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.amber.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.amber.withOpacity(0.3),
                      ),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(
                          Icons.info_outline,
                          color: Colors.orange,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Note: Late payment may result in additional penalties and legal action.',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey[800],
                              height: 1.4,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Proceed to Payment Button
                  CustomButton(
                    text: 'Proceed to Payment',
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => PaymentScreen(fine: fine),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),

                  // Back to Search Button
                  CustomButton(
                    text: 'Back to Search',
                    onPressed: () => Navigator.pop(context),
                    backgroundColor: Colors.grey[300],
                    textColor: const Color(0xFF001F5C),
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
