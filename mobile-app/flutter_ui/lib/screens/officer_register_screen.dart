import 'package:flutter/material.dart';
import '../services/officer_auth_service.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';

class OfficerRegisterScreen extends StatefulWidget {
  const OfficerRegisterScreen({Key? key}) : super(key: key);

  @override
  State<OfficerRegisterScreen> createState() => _OfficerRegisterScreenState();
}

class _OfficerRegisterScreenState extends State<OfficerRegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _badgeNumberController = TextEditingController();
  final _roleController = TextEditingController();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _districtController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = OfficerAuthService();

  bool _isLoading = false;
  bool _obscure = true;
  String? _error;

  @override
  void dispose() {
    _badgeNumberController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _districtController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    final result = await _authService.register(
      badgeNumber: _badgeNumberController.text.trim(),
      name: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      district: _districtController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Registration successful. Please log in.')),
      );
      Navigator.pop(context);
    } else {
      setState(() => _error = result['message'] ?? 'Registration failed');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Officer Registration'),
        backgroundColor: const Color(0xFF001F5C),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 12),
                    Container(
                      width: 80,
                      height: 80,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: const Color(0xFF001F5C),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.shield, color: Colors.white, size: 40),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Create officer account',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF001F5C)),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Register with your badge details to issue fines',
                      style: TextStyle(fontSize: 14, color: Colors.black54),
                    ),
                    const SizedBox(height: 28),

                    CustomTextField(
                      label: 'Full Name',
                      hintText: 'e.g., Nimal Perera',
                      controller: _nameController,
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter full name' : null,
                    ),

                    CustomTextField(
                      label: 'Badge Number',
                      hintText: 'e.g., OFC-1024',
                      controller: _badgeNumberController,
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your badge number' : null,
                    ),
                    
                    CustomTextField(
                      label: 'Role',
                      hintText: 'e.g., Officer',
                      controller: _roleController,
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your role' : null,
                    ),

                    CustomTextField(
                      label: 'Phone',
                      hintText: 'e.g., 0771234567',
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your phone number' : null,
                    ),

                    CustomTextField(
                      label: 'District',
                      hintText: 'e.g., Colombo',
                      controller: _districtController,
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your district' : null,
                    ),

                    const Text(
                      'Password',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF001F5C)),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscure,
                      validator: (v) {
                        final s = v ?? '';
                        if (s.isEmpty) return 'Enter password';
                        if (s.length < 6) return 'Password must be at least 6 characters';
                        return null;
                      },
                      decoration: InputDecoration(
                        hintText: 'At least 6 characters',
                        filled: true,
                        fillColor: Colors.grey[100],
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        suffixIcon: IconButton(
                          onPressed: () => setState(() => _obscure = !_obscure),
                          icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    const Text(
                      'Confirm Password',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF001F5C)),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: _confirmPasswordController,
                      obscureText: _obscure,
                      validator: (v) {
                        if (v != _passwordController.text) return 'Passwords do not match';
                        return null;
                      },
                      decoration: InputDecoration(
                        hintText: 'Re-enter password',
                        filled: true,
                        fillColor: Colors.grey[100],
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                    ),
                    const SizedBox(height: 12),

                    if (_error != null) ...[
                      Text(_error!, style: const TextStyle(color: Colors.red)),
                      const SizedBox(height: 12),
                    ],

                    const SizedBox(height: 12),
                    CustomButton(
                      text: 'Register',
                      isLoading: _isLoading,
                      onPressed: _handleRegister,
                    ),
                    const SizedBox(height: 12),

                    Align(
                      alignment: Alignment.center,
                      child: TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text(
                          'Already have an account? Login',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}