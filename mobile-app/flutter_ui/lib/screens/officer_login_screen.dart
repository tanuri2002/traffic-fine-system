import 'package:flutter/material.dart';
import '../services/officer_auth_service.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';
import 'add_fine_screen.dart';

class OfficerLoginScreen extends StatefulWidget {
  const OfficerLoginScreen({Key? key}) : super(key: key);

  @override
  State<OfficerLoginScreen> createState() => _OfficerLoginScreenState();
}

class _OfficerLoginScreenState extends State<OfficerLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _officerIdController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = OfficerAuthService();

  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _officerIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    final success = await _authService.login(
      _officerIdController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (success) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const AddFineScreen()),
      );
    } else {
      setState(() => _error = 'Invalid officer ID or password');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Officer Login'),
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
                      'Sign in to issue fines',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF001F5C)),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Authorized traffic police personnel only',
                      style: TextStyle(fontSize: 14, color: Colors.black54),
                    ),
                    const SizedBox(height: 28),

                    CustomTextField(
                      label: 'Officer ID',
                      hintText: 'e.g., OFC-1024',
                      controller: _officerIdController,
                      validator: (v) => (v == null || v.trim().isEmpty) ? 'Enter your officer ID' : null,
                    ),

                    const Text(
                      'Password',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF001F5C)),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      validator: (v) => (v == null || v.isEmpty) ? 'Enter your password' : null,
                      decoration: InputDecoration(
                        hintText: 'Enter your password',
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
                      text: 'Officer Login',
                      isLoading: _isLoading,
                      onPressed: _handleLogin,
                    ),
                    const SizedBox(height: 12),
                    Align(
                      alignment: Alignment.center,
                      child: TextButton(
                        onPressed: () => Navigator.pushNamed(context, '/officer-register'),
                        child: const Text(
                          "Don't have an account? Register",
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