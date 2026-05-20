import 'package:flutter/material.dart';
import '../user_state.dart';

class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const LoginScreen({
    super.key,
    required this.onLoginSuccess,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _isWhatsAppLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _validateAndSubmit() {
    setState(() {
      _errorMessage = null;
    });

    final phone = _phoneController.text.trim();
    if (phone.length != 10 || !RegExp(r'^[6-9]\d{9}$').hasMatch(phone)) {
      setState(() {
        _errorMessage = 'Please enter a valid 10-digit Indian mobile number';
      });
      return;
    }

    setState(() {
      _isLoading = true;
    });

    // Simulate OTP sending
    Future.delayed(const Duration(milliseconds: 1000), () {
      setState(() {
        _isLoading = false;
      });
      _showOTPDialog(phone);
    });
  }

  void _showOTPDialog(String phone) {
    final List<TextEditingController> controllers = List.generate(6, (_) => TextEditingController());
    final List<FocusNode> focusNodes = List.generate(6, (_) => FocusNode());
    bool isVerifying = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                left: 24.0,
                right: 24.0,
                top: 32.0,
                bottom: MediaQuery.of(context).viewInsets.bottom + 32.0,
              ),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28.0)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 48,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 24.0),
                  CircleAvatar(
                    radius: 28.0,
                    backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                    child: Icon(
                      Icons.security,
                      size: 30.0,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                  ),
                  const SizedBox(height: 20.0),
                  Text(
                    'Verify Phone',
                    style: TextStyle(
                      fontSize: 22.0,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    'We sent a 6-digit OTP to +91 ${phone.substring(0, 2)}******${phone.substring(8)}',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14.0,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 28.0),
                  // OTP input row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: List.generate(6, (index) {
                      return SizedBox(
                        width: 44.0,
                        height: 56.0,
                        child: TextFormField(
                          controller: controllers[index],
                          focusNode: focusNodes[index],
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          maxLength: 1,
                          style: const TextStyle(
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                          decoration: InputDecoration(
                            counterText: '',
                            contentPadding: EdgeInsets.zero,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12.0),
                              borderSide: BorderSide(
                                color: Theme.of(context).colorScheme.outline.withOpacity(0.3),
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12.0),
                              borderSide: BorderSide(
                                color: Theme.of(context).colorScheme.primary,
                                width: 2.0,
                              ),
                            ),
                          ),
                          onChanged: (value) {
                            if (value.isNotEmpty) {
                              if (index < 5) {
                                focusNodes[index + 1].requestFocus();
                              } else {
                                focusNodes[index].unfocus();
                              }
                            } else if (value.isEmpty && index > 0) {
                              focusNodes[index - 1].requestFocus();
                            }
                            
                            // Check if all fields are filled
                            final enteredOTP = controllers.map((c) => c.text).join();
                            if (enteredOTP.length == 6) {
                              setModalState(() {
                                isVerifying = true;
                              });
                              
                              // Simulate OTP verify
                              Future.delayed(const Duration(milliseconds: 1000), () async {
                                Navigator.pop(context); // Close bottom sheet
                                
                                await UserState().login(
                                  name: 'Arjun Mehta',
                                  email: 'arjun.mehta@gmail.com',
                                  phone: '+91 $phone',
                                  method: 'Phone',
                                );
                                
                                widget.onLoginSuccess();
                              });
                            }
                          },
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 32.0),
                  if (isVerifying)
                    const CircularProgressIndicator()
                  else
                    TextButton(
                      onPressed: () {
                        // Mock resend
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('OTP resent successfully')),
                        );
                      },
                      child: Text(
                        'Resend Code',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _handleGoogleLogin() {
    setState(() {
      _isGoogleLoading = true;
    });

    Future.delayed(const Duration(milliseconds: 1200), () async {
      if (mounted) {
        setState(() {
          _isGoogleLoading = false;
        });
        
        await UserState().login(
          name: 'Arjun Mehta',
          email: 'arjun.mehta@gmail.com',
          phone: '+91 98765 43210',
          method: 'Google',
        );

        widget.onLoginSuccess();
      }
    });
  }

  void _handleWhatsAppLogin() {
    setState(() {
      _isWhatsAppLoading = true;
    });

    Future.delayed(const Duration(milliseconds: 1200), () async {
      if (mounted) {
        setState(() {
          _isWhatsAppLoading = false;
        });

        await UserState().login(
          name: 'Arjun Mehta',
          email: 'arjun.mehta@gmail.com',
          phone: '+91 98765 43210',
          method: 'WhatsApp',
        );

        widget.onLoginSuccess();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: theme.brightness == Brightness.dark
                ? [
                    colorScheme.background,
                    colorScheme.primary.withOpacity(0.05),
                  ]
                : [
                    Colors.white,
                    colorScheme.primary.withOpacity(0.03),
                  ],
          ),
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: constraints.maxHeight - 64.0,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Header Logo Area
                      Center(
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(20.0),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    colorScheme.primary,
                                    colorScheme.secondary,
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(24.0),
                                boxShadow: [
                                  BoxShadow(
                                    color: colorScheme.primary.withOpacity(0.3),
                                    blurRadius: 16.0,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.favorite,
                                size: 48.0,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 24.0),
                            Text(
                              'Welcome to Medpac',
                              style: TextStyle(
                                fontSize: 26.0,
                                fontWeight: FontWeight.bold,
                                color: colorScheme.onBackground,
                              ),
                            ),
                            const SizedBox(height: 8.0),
                            Text(
                              'Sign in to access your health ecosystem',
                              style: TextStyle(
                                fontSize: 14.0,
                                color: colorScheme.onBackground.withOpacity(0.6),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 48.0),

                      // Login Card Form
                      Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(24.0),
                          side: BorderSide(
                            color: colorScheme.onSurface.withOpacity(0.08),
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                'Phone Number',
                                style: TextStyle(
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.bold,
                                  color: colorScheme.onSurface,
                                ),
                              ),
                              const SizedBox(height: 8.0),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    height: 56.0,
                                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                                    decoration: BoxDecoration(
                                      color: colorScheme.onSurface.withOpacity(0.04),
                                      borderRadius: BorderRadius.circular(14.0),
                                      border: Border.all(
                                        color: colorScheme.onSurface.withOpacity(0.12),
                                      ),
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      '+91',
                                      style: TextStyle(
                                        fontSize: 16.0,
                                        fontWeight: FontWeight.bold,
                                        color: colorScheme.onSurface.withOpacity(0.7),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12.0),
                                  Expanded(
                                    child: TextFormField(
                                      controller: _phoneController,
                                      keyboardType: TextInputType.phone,
                                      maxLength: 10,
                                      style: const TextStyle(
                                        fontSize: 16.0,
                                        fontWeight: FontWeight.w500,
                                      ),
                                      decoration: InputDecoration(
                                        counterText: '',
                                        hintText: 'Enter 10-digit number',
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(14.0),
                                        ),
                                        enabledBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(14.0),
                                          borderSide: BorderSide(
                                            color: colorScheme.onSurface.withOpacity(0.12),
                                          ),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(14.0),
                                          borderSide: BorderSide(
                                            color: colorScheme.primary,
                                            width: 2.0,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              if (_errorMessage != null) ...[
                                const SizedBox(height: 8.0),
                                Text(
                                  _errorMessage!,
                                  style: const TextStyle(
                                    fontSize: 12.0,
                                    color: Colors.redAccent,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                              const SizedBox(height: 24.0),

                              // Send OTP Button
                              ElevatedButton(
                                onPressed: _isLoading || _isGoogleLoading || _isWhatsAppLoading
                                    ? null
                                    : _validateAndSubmit,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: colorScheme.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14.0),
                                  ),
                                  elevation: 0,
                                ),
                                child: _isLoading
                                    ? const SizedBox(
                                        height: 20.0,
                                        width: 20.0,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2.5,
                                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                        ),
                                      )
                                    : const Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Icon(Icons.phone_iphone, size: 18.0),
                                          SizedBox(width: 8.0),
                                          Text(
                                            'Send OTP',
                                            style: TextStyle(
                                              fontSize: 16.0,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                              ),
                              const SizedBox(height: 24.0),

                              // Divider
                              Row(
                                children: [
                                  Expanded(
                                    child: Divider(color: colorScheme.onSurface.withOpacity(0.08)),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                                    child: Text(
                                      'OR',
                                      style: TextStyle(
                                        fontSize: 11.0,
                                        fontWeight: FontWeight.bold,
                                        color: colorScheme.onSurface.withOpacity(0.4),
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: Divider(color: colorScheme.onSurface.withOpacity(0.08)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24.0),

                              // Google Login Button
                              OutlinedButton(
                                onPressed: _isLoading || _isGoogleLoading || _isWhatsAppLoading
                                    ? null
                                    : _handleGoogleLogin,
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 14.0),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14.0),
                                  ),
                                  side: BorderSide(
                                    color: colorScheme.onSurface.withOpacity(0.12),
                                  ),
                                ),
                                child: _isGoogleLoading
                                    ? SizedBox(
                                        height: 20.0,
                                        width: 20.0,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2.0,
                                          valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
                                        ),
                                      )
                                    : Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Image.network(
                                            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png',
                                            height: 20.0,
                                            errorBuilder: (context, error, stackTrace) => const Icon(Icons.g_mobiledata, size: 24),
                                          ),
                                          const SizedBox(width: 12.0),
                                          Text(
                                            'Continue with Google',
                                            style: TextStyle(
                                              fontSize: 15.0,
                                              fontWeight: FontWeight.bold,
                                              color: colorScheme.onSurface,
                                            ),
                                          ),
                                        ],
                                      ),
                              ),
                              const SizedBox(height: 12.0),

                              // WhatsApp Login Button
                              OutlinedButton(
                                onPressed: _isLoading || _isGoogleLoading || _isWhatsAppLoading
                                    ? null
                                    : _handleWhatsAppLogin,
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 14.0),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14.0),
                                  ),
                                  side: BorderSide(
                                    color: Colors.green.withOpacity(0.3),
                                  ),
                                  backgroundColor: Colors.green.withOpacity(0.04),
                                ),
                                child: _isWhatsAppLoading
                                    ? const SizedBox(
                                        height: 20.0,
                                        width: 20.0,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2.0,
                                          valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                                        ),
                                      )
                                    : const Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Icon(Icons.message, color: Colors.green, size: 20.0),
                                          SizedBox(width: 12.0),
                                          Text(
                                            'Continue with WhatsApp',
                                            style: TextStyle(
                                              fontSize: 15.0,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.green,
                                            ),
                                          ),
                                        ],
                                      ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24.0),

                      // Footnote links
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          'By continuing, you agree to our Terms of Service & Privacy Policy',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12.0,
                            height: 1.5,
                            color: colorScheme.onBackground.withOpacity(0.5),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
