import 'package:flutter/material.dart';
import '../models/officer_model.dart';
import '../services/officer_auth_service.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';

class AddFineScreen extends StatefulWidget {
  const AddFineScreen({Key? key}) : super(key: key);

  @override
  State<AddFineScreen> createState() => _AddFineScreenState();
}

class _AddFineScreenState extends State<AddFineScreen> {
  final _formKey = GlobalKey<FormState>();
  final _vehicleController = TextEditingController();
  final _feeController = TextEditingController();
  final _authService = OfficerAuthService();

  FineCategory? _selectedCategory;
  bool _isSubmitting = false;
  String? _error;
  String? _lastReferenceNumber;

  @override
  void dispose() {
    _vehicleController.dispose();
    _feeController.dispose();
    super.dispose();
  }

  void _onCategoryChanged(FineCategory? category) {
    setState(() {
      _selectedCategory = category;
      if (category != null) {
        _feeController.text = category.fee.toStringAsFixed(0);
      }
    });
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate() || _selectedCategory == null) {
      setState(() => _error = 'Please fill in category, vehicle number, and fee');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _error = null;
    });

    final result = await _authService.submitFine(
      categoryId: _selectedCategory!.id,
      vehicleNo: _vehicleController.text.trim().toUpperCase(),
      fee: double.tryParse(_feeController.text) ?? _selectedCategory!.fee,
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result != null) {
      setState(() {
        _lastReferenceNumber = result['referenceNumber']?.toString() ?? 'Pending from server';
        _vehicleController.clear();
        _selectedCategory = null;
        _feeController.clear();
      });
    } else {
      setState(() => _error = 'Failed to submit fine. Check your connection.');
    }
  }

  Future<void> _handleLogout() async {
    await _authService.logout();
    if (!mounted) return;
    Navigator.of(context).popUntil((route) => route.isFirst);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Issue a Fine'),
        backgroundColor: const Color(0xFF001F5C),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
            tooltip: 'Log out',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Record a fine at the point of stop. The driver gets a reference number to pay on-the-spot or later online.',
                  style: TextStyle(fontSize: 14, color: Colors.black54, height: 1.4),
                ),
                const SizedBox(height: 24),

                const Text(
                  'Fine Category',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF001F5C)),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<FineCategory>(
                  value: _selectedCategory,
                  isExpanded: true,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.grey[100],
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                  hint: const Text('Select a violation category'),
                  items: fineCategories
                      .map((c) => DropdownMenuItem(value: c, child: Text('${c.label} (${c.id})')))
                      .toList(),
                  onChanged: _onCategoryChanged,
                  validator: (v) => v == null ? 'Select a category' : null,
                ),
                const SizedBox(height: 20),

                CustomTextField(
                  label: 'Vehicle Number',
                  hintText: 'e.g., WP CAB-1234',
                  controller: _vehicleController,
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter the vehicle number' : null,
                ),

                CustomTextField(
                  label: 'Fee (LKR)',
                  hintText: 'Auto-filled from category, editable',
                  controller: _feeController,
                  keyboardType: TextInputType.number,
                  validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter the fee' : null,
                ),

                if (_error != null) ...[
                  Text(_error!, style: const TextStyle(color: Colors.red)),
                  const SizedBox(height: 12),
                ],

                CustomButton(
                  text: _isSubmitting ? 'Submitting...' : 'Issue Fine',
                  isLoading: _isSubmitting,
                  onPressed: _handleSubmit,
                ),

                if (_lastReferenceNumber != null) ...[
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.green[50],
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.green[200]!),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Fine issued successfully',
                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                        const SizedBox(height: 6),
                        Text('Reference: $_lastReferenceNumber'),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}