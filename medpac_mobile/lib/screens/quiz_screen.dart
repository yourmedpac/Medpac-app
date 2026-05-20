import 'package:flutter/material.dart';

// --- Constants ---
const int totalSteps = 12;

const List<String> existingConditionsList = [
  'Diabetes', 'Hypertension', 'Thyroid', 'Heart Disease',
  'Asthma', 'Arthritis', 'PCOD/PCOS', 'None',
];

const List<String> familyHistoryList = [
  'Diabetes', 'Heart Disease', 'Cancer', 'Thyroid',
  'Hypertension', 'Stroke', 'None',
];

const List<String> healthGoalsList = [
  'Weight Management', 'Better Sleep', 'Stress Relief',
  'Fitness', 'Better Nutrition', 'Chronic Condition Management',
  "Women's Health",
];

const List<String> dietTypesList = [
  'Balanced Diet', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Low Carb', 'Intermittent Fasting'
];

class EatingPersonality {
  final String value;
  final String label;
  final String desc;
  const EatingPersonality({required this.value, required this.label, required this.desc});
}

const List<EatingPersonality> dietPersonalitiesList = [
  EatingPersonality(value: 'intuitive', label: 'Intuitive Eater', desc: 'Eat based on internal hunger cues'),
  EatingPersonality(value: 'emotional', label: 'Emotional Eater', desc: 'Eat in response to feelings or stress'),
  EatingPersonality(value: 'mindful', label: 'Mindful Nibbler', desc: 'Eat slowly, savoring every portion'),
  EatingPersonality(value: 'fuel', label: 'Fitness Fueler', desc: 'Eat to optimize physical energy and performance'),
  EatingPersonality(value: 'routine', label: 'Routine Eater', desc: 'Eat strict meals at exact scheduled times'),
];

const List<String> moodBehaviorsList = [
  'Calm & Focused', 'Stressed / Overwhelmed', 'Energetic',
  'Fatigued / Low Energy', 'Anxious', 'Mood Swings', 'Restless'
];

const List<String> focusAreasList = [
  'Gut & Digestion', 'Mental Health & Focus', 'Heart & Cardio',
  'Sleep Quality', 'Immune System', 'Joint & Muscle Strength'
];

const List<String> activityLevels = ['Sedentary', 'Light', 'Moderate', 'Active'];
const List<String> smokingOptions = ['Never', 'Former', 'Current'];
const List<String> alcoholOptions = ['None', 'Occasional', 'Moderate', 'Heavy'];

class QuizScreen extends StatefulWidget {
  final VoidCallback onQuizComplete;

  const QuizScreen({super.key, required this.onQuizComplete});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  int _currentStep = 0;
  bool _showResults = false;
  String _validationError = '';
  bool _isSaving = false;

  // Controllers
  final TextEditingController _ageController = TextEditingController();
  final TextEditingController _weightController = TextEditingController();
  final TextEditingController _heightController = TextEditingController();
  final TextEditingController _medicationInputController = TextEditingController();

  // State answers
  String? _gender;
  String _dietaryPreference = '';
  String _dietTypePersonality = '';
  int _mealCount = 3;
  double _waterIntake = 8.0;
  final List<String> _moodBehavior = [];
  String? _stressLevel;
  String _exerciseFrequency = '';
  String? _activityLevel;
  final List<String> _existingConditions = [];
  final List<String> _medications = [];
  final List<String> _familyHistory = [];
  double _sleepHours = 7.0;
  String? _smokingStatus;
  String? _alcoholConsumption;
  final List<String> _healthGoals = [];
  final List<String> _focusArea = [];

  @override
  void dispose() {
    _ageController.dispose();
    _weightController.dispose();
    _heightController.dispose();
    _medicationInputController.dispose();
    super.dispose();
  }

  // Helper: toggle items in list
  void _toggleItem(List<String> list, String item) {
    setState(() {
      _validationError = '';
      if (item == 'None') {
        if (list.contains('None')) {
          list.clear();
        } else {
          list.clear();
          list.add('None');
        }
        return;
      }
      list.remove('None');
      if (list.contains(item)) {
        list.remove(item);
      } else {
        list.add(item);
      }
    });
  }

  // Helper: calculate BMI
  double get _calculatedBMI {
    final double? weight = double.tryParse(_weightController.text);
    final double? height = double.tryParse(_heightController.text);
    if (weight != null && height != null && weight > 0 && height > 0) {
      final double heightInMeters = height / 100;
      return double.parse((weight / (heightInMeters * heightInMeters)).toStringAsFixed(1));
    }
    return 0.0;
  }

  // Helper: get BMI Status
  String? get _bmiStatusLabel {
    final double bmi = _calculatedBMI;
    if (bmi == 0.0) return null;
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25.0) return 'Normal';
    if (bmi < 30.0) return 'Overweight';
    return 'Obese';
  }

  Color get _bmiColor {
    final String? label = _bmiStatusLabel;
    if (label == 'Normal') return Colors.green;
    if (label == 'Overweight') return Colors.amber;
    if (label == 'Obese') return Colors.red;
    if (label == 'Underweight') return Colors.blue;
    return Colors.grey;
  }

  bool _validateStep() {
    setState(() {
      _validationError = '';
    });

    switch (_currentStep) {
      case 0:
        final int? age = int.tryParse(_ageController.text);
        if (age == null || age < 1 || age > 120) {
          setState(() {
            _validationError = 'Please enter a valid age (1-120)';
          });
          return false;
        }
        if (_gender == null) {
          setState(() {
            _validationError = 'Please select your gender';
          });
          return false;
        }
        return true;

      case 1:
        final double? w = double.tryParse(_weightController.text);
        final double? h = double.tryParse(_heightController.text);
        if (w == null || w < 10 || w > 300) {
          setState(() {
            _validationError = 'Please enter a valid weight (10kg - 300kg)';
          });
          return false;
        }
        if (h == null || h < 50 || h > 250) {
          setState(() {
            _validationError = 'Please enter a valid height (50cm - 250cm)';
          });
          return false;
        }
        return true;

      case 2:
        if (_dietaryPreference.isEmpty) {
          setState(() {
            _validationError = 'Please select your dietary preference';
          });
          return false;
        }
        if (_dietTypePersonality.isEmpty) {
          setState(() {
            _validationError = 'Please select your eating personality';
          });
          return false;
        }
        return true;

      case 3:
        return true;

      case 4:
        if (_moodBehavior.isEmpty) {
          setState(() {
            _validationError = 'Please select at least one mood trait';
          });
          return false;
        }
        if (_stressLevel == null) {
          setState(() {
            _validationError = 'Please select your stress level';
          });
          return false;
        }
        return true;

      case 5:
        if (_exerciseFrequency.isEmpty) {
          setState(() {
            _validationError = 'Please select your exercise frequency';
          });
          return false;
        }
        if (_activityLevel == null) {
          setState(() {
            _validationError = 'Please select your routine activity level';
          });
          return false;
        }
        return true;

      case 6:
        if (_existingConditions.isEmpty) {
          setState(() {
            _validationError = 'Please select at least one condition';
          });
          return false;
        }
        return true;

      case 7:
        return true;

      case 8:
        if (_familyHistory.isEmpty) {
          setState(() {
            _validationError = 'Please select family history conditions';
          });
          return false;
        }
        return true;

      case 9:
        if (_alcoholConsumption == null) {
          setState(() {
            _validationError = 'Please select alcohol consumption status';
          });
          return false;
        }
        return true;

      case 10:
        if (_healthGoals.isEmpty) {
          setState(() {
            _validationError = 'Please select at least one health goal';
          });
          return false;
        }
        return true;

      case 11:
        if (_focusArea.isEmpty) {
          setState(() {
            _validationError = 'Please select at least one focus area';
          });
          return false;
        }
        return true;

      default:
        return true;
    }
  }

  void _goNext() {
    if (!_validateStep()) return;
    if (_currentStep < totalSteps - 1) {
      setState(() {
        _currentStep++;
      });
    } else {
      setState(() {
        _showResults = true;
      });
    }
  }

  void _goBack() {
    setState(() {
      _validationError = '';
    });
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _showResults ? 'Health Profile Summary' : 'Personalization Quiz',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        leading: _currentStep > 0 && !_showResults
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: _goBack,
              )
            : null,
      ),
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child: _showResults ? _buildResultsView(colorScheme) : _buildQuizView(colorScheme),
        ),
      ),
    );
  }

  Widget _buildQuizView(ColorScheme colorScheme) {
    final progress = (_currentStep + 1) / totalSteps;

    return Column(
      children: [
        // Progress Bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Step ${_currentStep + 1} of $totalSteps',
                    style: TextStyle(
                      fontSize: 12.0,
                      fontWeight: FontWeight.bold,
                      color: colorScheme.primary,
                    ),
                  ),
                  Text(
                    '${(progress * 100).toInt()}% Complete',
                    style: TextStyle(
                      fontSize: 12.0,
                      color: colorScheme.onBackground.withOpacity(0.6),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8.0),
              ClipRRect(
                borderRadius: BorderRadius.circular(8.0),
                child: LinearProgressIndicator(
                  value: progress,
                  minHeight: 6.0,
                  backgroundColor: colorScheme.primary.withOpacity(0.12),
                  valueColor: AlwaysStoppedAnimation<Color>(colorScheme.primary),
                ),
              ),
            ],
          ),
        ),

        // Step Content Area
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_validationError.isNotEmpty) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                    decoration: BoxDecoration(
                      color: colorScheme.errorContainer.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(12.0),
                      border: Border.all(color: colorScheme.error.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.error_outline_rounded, color: colorScheme.onErrorContainer),
                        const SizedBox(width: 12.0),
                        Expanded(
                          child: Text(
                            _validationError,
                            style: TextStyle(color: colorScheme.onErrorContainer, fontSize: 13.0, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20.0),
                ],
                _buildStepContent(colorScheme),
              ],
            ),
          ),
        ),

        // Navigation Footer
        Container(
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: colorScheme.surface,
            border: Border(
              top: BorderSide(
                color: colorScheme.onSurface.withOpacity(0.08),
              ),
            ),
          ),
          child: Row(
            children: [
              if (_currentStep > 0)
                Expanded(
                  child: OutlinedButton(
                    onPressed: _goBack,
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                    ),
                    child: const Text('Back'),
                  ),
                ),
              if (_currentStep > 0) const SizedBox(width: 16.0),
              Expanded(
                flex: 2,
                child: FilledButton(
                  onPressed: _goNext,
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16.0),
                    backgroundColor: colorScheme.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16.0),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _currentStep == totalSteps - 1 ? 'Finish' : 'Continue',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16.0),
                      ),
                      const SizedBox(width: 8.0),
                      const Icon(Icons.arrow_forward_rounded, size: 18.0),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStepContent(ColorScheme colorScheme) {
    switch (_currentStep) {
      case 0:
        return _buildStepBasicInfo(colorScheme);
      case 1:
        return _buildStepBodyMetrics(colorScheme);
      case 2:
        return _buildStepDietPreference(colorScheme);
      case 3:
        return _buildStepEatingHabits(colorScheme);
      case 4:
        return _buildStepMoodStress(colorScheme);
      case 5:
        return _buildStepExerciseActivity(colorScheme);
      case 6:
        return _buildStepConditions(colorScheme);
      case 7:
        return _buildStepMedications(colorScheme);
      case 8:
        return _buildStepFamilyHistory(colorScheme);
      case 9:
        return _buildStepHabitsSleep(colorScheme);
      case 10:
        return _buildStepGoals(colorScheme);
      case 11:
        return _buildStepFocusAreas(colorScheme);
      default:
        return const SizedBox.shrink();
    }
  }

  // --- Step Content View Builders ---

  Widget _buildStepBasicInfo(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Tell us about yourself',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8.0),
        Text(
          'This helps us calculate correct clinical baselines.',
          style: TextStyle(fontSize: 14.0, color: colorScheme.onBackground.withOpacity(0.6)),
        ),
        const SizedBox(height: 24.0),
        Text(
          'What is your age?',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold, color: colorScheme.onBackground),
        ),
        const SizedBox(height: 8.0),
        TextField(
          controller: _ageController,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: 'Enter your age',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16.0)),
            prefixIcon: const Icon(Icons.cake_rounded),
          ),
        ),
        const SizedBox(height: 24.0),
        Text(
          'What is your gender?',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold, color: colorScheme.onBackground),
        ),
        const SizedBox(height: 12.0),
        Row(
          children: ['male', 'female', 'other'].map((genderOption) {
            final isSelected = _gender == genderOption;
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: ChoiceChip(
                  label: Container(
                    alignment: Alignment.center,
                    child: Text(
                      genderOption[0].toUpperCase() + genderOption.substring(1),
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : colorScheme.onSurface,
                      ),
                    ),
                  ),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() {
                      _gender = val ? genderOption : null;
                    });
                  },
                  selectedColor: colorScheme.primary,
                  backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0)),
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepBodyMetrics(ColorScheme colorScheme) {
    final double bmi = _calculatedBMI;
    final String? label = _bmiStatusLabel;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Body Metrics',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8.0),
        Text(
          'Please enter your current physical parameters.',
          style: TextStyle(fontSize: 14.0, color: colorScheme.onBackground.withOpacity(0.6)),
        ),
        const SizedBox(height: 24.0),
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Weight (kg)', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8.0),
                  TextField(
                    controller: _weightController,
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText: 'e.g. 75',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16.0)),
                      prefixIcon: const Icon(Icons.scale_rounded),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Height (cm)', style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8.0),
                  TextField(
                    controller: _heightController,
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText: 'e.g. 175',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16.0)),
                      prefixIcon: const Icon(Icons.height_rounded),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        if (bmi > 0) ...[
          const SizedBox(height: 32.0),
          Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: colorScheme.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(24.0),
              border: Border.all(color: colorScheme.primary.withOpacity(0.15)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'ESTIMATED BMI',
                      style: TextStyle(
                        fontSize: 11.0,
                        fontWeight: FontWeight.w800,
                        color: colorScheme.primary,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      '$bmi',
                      style: TextStyle(
                        fontSize: 36.0,
                        fontWeight: FontWeight.w900,
                        color: colorScheme.onBackground,
                      ),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 6.0),
                      decoration: BoxDecoration(
                        color: _bmiColor,
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      child: Text(
                        label ?? '',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8.0),
                    Text(
                      label == 'Normal' ? 'Healthy weight range' : 'Personal advice ready',
                      style: TextStyle(
                        fontSize: 11.0,
                        color: colorScheme.onBackground.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildStepDietPreference(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Dietary Preference',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 24.0),
        Text(
          'What is your dietary preference?',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold, color: colorScheme.onBackground),
        ),
        const SizedBox(height: 12.0),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children: dietTypesList.map((type) {
            final isSelected = _dietaryPreference == type;
            return ChoiceChip(
              label: Text(type),
              selected: isSelected,
              onSelected: (val) {
                setState(() {
                  _dietaryPreference = val ? type : '';
                });
              },
              selectedColor: colorScheme.primary,
              backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : colorScheme.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            );
          }).toList(),
        ),
        const SizedBox(height: 32.0),
        Text(
          'Select your eating personality',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold, color: colorScheme.onBackground),
        ),
        const SizedBox(height: 12.0),
        Column(
          children: dietPersonalitiesList.map((p) {
            final isSelected = _dietTypePersonality == p.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: InkWell(
                onTap: () {
                  setState(() {
                    _dietTypePersonality = p.value;
                  });
                },
                borderRadius: BorderRadius.circular(16.0),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: isSelected ? colorScheme.primary.withOpacity(0.08) : Colors.transparent,
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(
                      color: isSelected ? colorScheme.primary : colorScheme.onSurface.withOpacity(0.08),
                      width: isSelected ? 2.0 : 1.0,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        p.label,
                        style: TextStyle(
                          fontSize: 14.0,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? colorScheme.primary : colorScheme.onBackground,
                        ),
                      ),
                      const SizedBox(height: 4.0),
                      Text(
                        p.desc,
                        style: TextStyle(
                          fontSize: 12.0,
                          color: colorScheme.onBackground.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepEatingHabits(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Eating & Hydration',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 24.0),
        const Text(
          'How many meals do you consume per day?',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12.0),
        Container(
          padding: const EdgeInsets.all(6.0),
          decoration: BoxDecoration(
            color: colorScheme.surfaceVariant.withOpacity(0.3),
            borderRadius: BorderRadius.circular(16.0),
          ),
          child: Row(
            children: [1, 2, 3, 4, 5].map((m) {
              final isSelected = _mealCount == m;
              return Expanded(
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _mealCount = m;
                    });
                  },
                  borderRadius: BorderRadius.circular(12.0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12.0),
                    decoration: BoxDecoration(
                      color: isSelected ? colorScheme.primary : Colors.transparent,
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      m == 5 ? '5+' : '$m',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : colorScheme.onSurface,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 32.0),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Daily Water Intake',
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
            ),
            Text(
              '${_waterIntake.toInt()} Glasses',
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w900, color: colorScheme.primary),
            ),
          ],
        ),
        const SizedBox(height: 12.0),
        Slider(
          value: _waterIntake,
          min: 2,
          max: 16,
          divisions: 14,
          label: '${_waterIntake.toInt()} glasses',
          onChanged: (val) {
            setState(() {
              _waterIntake = val;
            });
          },
          activeColor: colorScheme.primary,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('2 Glasses (Low)', style: TextStyle(fontSize: 11.0, color: colorScheme.onBackground.withOpacity(0.5))),
              Text('8 Glasses (Target)', style: TextStyle(fontSize: 11.0, color: colorScheme.onBackground.withOpacity(0.5))),
              Text('16 Glasses', style: TextStyle(fontSize: 11.0, color: colorScheme.onBackground.withOpacity(0.5))),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStepMoodStress(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Mood & Mental Energy',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 24.0),
        const Text(
          'Select your mood & energy levels (Select all)',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12.0),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children: moodBehaviorsList.map((mood) {
            final isSelected = _moodBehavior.contains(mood);
            return FilterChip(
              label: Text(mood),
              selected: isSelected,
              onSelected: (val) {
                _toggleItem(_moodBehavior, mood);
              },
              selectedColor: colorScheme.primary.withOpacity(0.2),
              checkmarkColor: colorScheme.primary,
              backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? colorScheme.primary : colorScheme.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            );
          }).toList(),
        ),
        const SizedBox(height: 32.0),
        const Text(
          'How would you rate your typical stress level?',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12.0),
        Row(
          children: ['low', 'moderate', 'high'].map((lvl) {
            final isSelected = _stressLevel == lvl;
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: ChoiceChip(
                  label: Container(
                    alignment: Alignment.center,
                    child: Text(
                      lvl[0].toUpperCase() + lvl.substring(1),
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : colorScheme.onSurface,
                      ),
                    ),
                  ),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() {
                      _stressLevel = val ? lvl : null;
                    });
                  },
                  selectedColor: colorScheme.primary,
                  backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0)),
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepExerciseActivity(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Exercise & Routine',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 24.0),
        const Text(
          'How often do you exercise?',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12.0),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children: ['Rarely', '1-2 times/week', '3-4 times/week', 'Daily'].map((freq) {
            final isSelected = _exerciseFrequency == freq;
            return ChoiceChip(
              label: Text(freq),
              selected: isSelected,
              onSelected: (val) {
                setState(() {
                  _exerciseFrequency = val ? freq : '';
                });
              },
              selectedColor: colorScheme.primary,
              backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : colorScheme.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            );
          }).toList(),
        ),
        const SizedBox(height: 32.0),
        const Text(
          'Select your routine activity level',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12.0),
        Row(
          children: activityLevels.map((level) {
            final isSelected = _activityLevel == level;
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: ChoiceChip(
                  label: Container(
                    alignment: Alignment.center,
                    child: Text(
                      level,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : colorScheme.onSurface,
                        fontSize: 11.0,
                      ),
                    ),
                  ),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() {
                      _activityLevel = val ? level : null;
                    });
                  },
                  selectedColor: colorScheme.primary,
                  backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0)),
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepConditions(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Health Conditions',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8.0),
        Text(
          'Select any existing chronic conditions you are diagnosed with.',
          style: TextStyle(fontSize: 14.0, color: colorScheme.onBackground.withOpacity(0.6)),
        ),
        const SizedBox(height: 24.0),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children: existingConditionsList.map((cond) {
            final isSelected = _existingConditions.contains(cond);
            return FilterChip(
              label: Text(cond),
              selected: isSelected,
              onSelected: (val) {
                _toggleItem(_existingConditions, cond);
              },
              selectedColor: colorScheme.primary.withOpacity(0.2),
              checkmarkColor: colorScheme.primary,
              backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? colorScheme.primary : colorScheme.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepMedications(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Prescriptions',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8.0),
        Text(
          'Add any ongoing medications you are currently taking.',
          style: TextStyle(fontSize: 14.0, color: colorScheme.onBackground.withOpacity(0.6)),
        ),
        const SizedBox(height: 24.0),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _medicationInputController,
                decoration: InputDecoration(
                  hintText: 'Enter medication name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16.0)),
                ),
                onSubmitted: (_) => _addMedication(),
              ),
            ),
            const SizedBox(width: 8.0),
            IconButton.filledTonal(
              onPressed: _addMedication,
              icon: const Icon(Icons.add),
              style: IconButton.styleFrom(
                padding: const EdgeInsets.all(16.0),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20.0),
        if (_medications.isNotEmpty) ...[
          Wrap(
            spacing: 8.0,
            runSpacing: 8.0,
            children: _medications.map((med) {
              return Chip(
                label: Text(med),
                deleteIcon: const Icon(Icons.close, size: 14.0),
                onDeleted: () {
                  setState(() {
                    _medications.remove(med);
                  });
                },
                backgroundColor: colorScheme.primary.withOpacity(0.08),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  side: BorderSide(color: colorScheme.primary.withOpacity(0.12)),
                ),
              );
            }).toList(),
          ),
        ] else ...[
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20.0),
            child: Text(
              'No medications added — click "Continue" if none apply.',
              style: TextStyle(fontStyle: FontStyle.italic, color: colorScheme.onBackground.withOpacity(0.5), fontSize: 13.0),
            ),
          ),
        ],
      ],
    );
  }

  void _addMedication() {
    final String text = _medicationInputController.text.trim();
    if (text.isNotEmpty && !_medications.contains(text)) {
      setState(() {
        _medications.add(text);
        _medicationInputController.clear();
      });
    }
  }

  Widget _buildStepFamilyHistory(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Family Medical History',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8.0),
        Text(
          'Select conditions that run in your immediate family.',
          style: TextStyle(fontSize: 14.0, color: colorScheme.onBackground.withOpacity(0.6)),
        ),
        const SizedBox(height: 24.0),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children: familyHistoryList.map((cond) {
            final isSelected = _familyHistory.contains(cond);
            return FilterChip(
              label: Text(cond),
              selected: isSelected,
              onSelected: (val) {
                _toggleItem(_familyHistory, cond);
              },
              selectedColor: colorScheme.primary.withOpacity(0.2),
              checkmarkColor: colorScheme.primary,
              backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? colorScheme.primary : colorScheme.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepHabitsSleep(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Sleep & Habits',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 24.0),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Average Sleep Hours',
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
            ),
            Text(
              '${_sleepHours.toStringAsFixed(1)} Hours',
              style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w900, color: colorScheme.primary),
            ),
          ],
        ),
        const SizedBox(height: 12.0),
        Slider(
          value: _sleepHours,
          min: 4,
          max: 12,
          divisions: 16,
          label: '${_sleepHours.toStringAsFixed(1)}h',
          onChanged: (val) {
            setState(() {
              _sleepHours = val;
            });
          },
          activeColor: colorScheme.primary,
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('4h', style: TextStyle(fontSize: 11.0, color: colorScheme.onBackground.withOpacity(0.5))),
              Text('8h (Healthy Target)', style: TextStyle(fontSize: 11.0, color: colorScheme.onBackground.withOpacity(0.5))),
              Text('12h', style: TextStyle(fontSize: 11.0, color: colorScheme.onBackground.withOpacity(0.5))),
            ],
          ),
        ),
        const SizedBox(height: 32.0),
        const Text(
          'Smoking Status',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12.0),
        Row(
          children: smokingOptions.map((opt) {
            final isSelected = _smokingStatus == opt;
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: ChoiceChip(
                  label: Container(
                    alignment: Alignment.center,
                    child: Text(
                      opt,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : colorScheme.onSurface,
                      ),
                    ),
                  ),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() {
                      _smokingStatus = val ? opt : null;
                    });
                  },
                  selectedColor: colorScheme.primary,
                  backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0)),
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 32.0),
        const Text(
          'Alcohol Consumption',
          style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12.0),
        Row(
          children: alcoholOptions.map((opt) {
            final isSelected = _alcoholConsumption == opt;
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 2.0),
                child: ChoiceChip(
                  label: Container(
                    alignment: Alignment.center,
                    child: Text(
                      opt,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : colorScheme.onSurface,
                        fontSize: 11.0,
                      ),
                    ),
                  ),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() {
                      _alcoholConsumption = val ? opt : null;
                    });
                  },
                  selectedColor: colorScheme.primary,
                  backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16.0)),
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepGoals(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Primary Health Goals',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8.0),
        Text(
          'What are your main wellness objectives?',
          style: TextStyle(fontSize: 14.0, color: colorScheme.onBackground.withOpacity(0.6)),
        ),
        const SizedBox(height: 24.0),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children: healthGoalsList.map((goal) {
            final isSelected = _healthGoals.contains(goal);
            return FilterChip(
              label: Text(goal),
              selected: isSelected,
              onSelected: (val) {
                _toggleItem(_healthGoals, goal);
              },
              selectedColor: colorScheme.primary.withOpacity(0.2),
              checkmarkColor: colorScheme.primary,
              backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? colorScheme.primary : colorScheme.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStepFocusAreas(ColorScheme colorScheme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Specific Focus Areas',
          style: TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8.0),
        Text(
          'Select organs or biological focus areas to prioritize.',
          style: TextStyle(fontSize: 14.0, color: colorScheme.onBackground.withOpacity(0.6)),
        ),
        const SizedBox(height: 24.0),
        Wrap(
          spacing: 8.0,
          runSpacing: 8.0,
          children: focusAreasList.map((area) {
            final isSelected = _focusArea.contains(area);
            return FilterChip(
              label: Text(area),
              selected: isSelected,
              onSelected: (val) {
                _toggleItem(_focusArea, area);
              },
              selectedColor: colorScheme.primary.withOpacity(0.2),
              checkmarkColor: colorScheme.primary,
              backgroundColor: colorScheme.surfaceVariant.withOpacity(0.3),
              labelStyle: TextStyle(
                color: isSelected ? colorScheme.primary : colorScheme.onSurface,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
            );
          }).toList(),
        ),
      ],
    );
  }

  // --- Results View Builder ---

  Widget _buildResultsView(ColorScheme colorScheme) {
    final double bmi = _calculatedBMI;
    final String? label = _bmiStatusLabel;

    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  const SizedBox(height: 12.0),
                  Container(
                    width: 70.0,
                    height: 70.0,
                    decoration: BoxDecoration(
                      color: colorScheme.primary.withOpacity(0.12),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.auto_awesome_rounded, color: colorScheme.primary, size: 36.0),
                  ),
                  const SizedBox(height: 16.0),
                  const Text(
                    'Your Personalized Profile',
                    style: TextStyle(fontSize: 26.0, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    'We have analyzed your metrics and mapped out a custom Health OS roadmap.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13.0, color: colorScheme.onBackground.withOpacity(0.6)),
                  ),
                  const SizedBox(height: 28.0),

                  // BMI Report card
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24.0),
                      side: BorderSide(color: colorScheme.onSurface.withOpacity(0.08)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.scale_rounded, color: colorScheme.primary),
                                  const SizedBox(width: 8.0),
                                  const Text('BMI Status Report', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.0)),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 4.0),
                                decoration: BoxDecoration(
                                  color: _bmiColor,
                                  borderRadius: BorderRadius.circular(12.0),
                                ),
                                child: Text(
                                  label ?? '',
                                  style: const TextStyle(color: Colors.white, fontSize: 11.0, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: 32.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Your BMI', style: TextStyle(fontSize: 12.0, color: colorScheme.onBackground.withOpacity(0.5))),
                                  const SizedBox(height: 4.0),
                                  Text('$bmi', style: const TextStyle(fontSize: 32.0, fontWeight: FontWeight.w900)),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    'Height: ${_heightController.text}cm',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.0),
                                  ),
                                  Text(
                                    'Weight: ${_weightController.text}kg',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.0),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 20.0),
                          // Visual Scale
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8.0),
                            child: SizedBox(
                              height: 8.0,
                              child: Row(
                                children: [
                                  Expanded(flex: 185, child: Container(color: Colors.blue.shade400)),
                                  Expanded(flex: 65, child: Container(color: Colors.green)),
                                  Expanded(flex: 50, child: Container(color: Colors.amber)),
                                  Expanded(flex: 100, child: Container(color: Colors.red.shade400)),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 6.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('<18.5 (Under)', style: TextStyle(fontSize: 9.0, color: colorScheme.onBackground.withOpacity(0.5))),
                              Text('18.5-25 (Normal)', style: TextStyle(fontSize: 9.0, color: colorScheme.onBackground.withOpacity(0.5))),
                              Text('25-30 (Over)', style: TextStyle(fontSize: 9.0, color: colorScheme.onBackground.withOpacity(0.5))),
                              Text('30+ (Obese)', style: TextStyle(fontSize: 9.0, color: colorScheme.onBackground.withOpacity(0.5))),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16.0),

                  // Health Summary Bullet List Card
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24.0),
                      side: BorderSide(color: colorScheme.onSurface.withOpacity(0.08)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.dashboard_customize_rounded, color: colorScheme.primary),
                              const SizedBox(width: 8.0),
                              const Text('Dynamic Health Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.0)),
                            ],
                          ),
                          const Divider(height: 32.0),
                          _buildSummaryRow('Diet Preference', _dietaryPreference),
                          _buildSummaryRow('Hydration Target', '${_waterIntake.toInt()} glasses/day'),
                          _buildSummaryRow('Physical Routine', _activityLevel ?? 'Sedentary'),
                          _buildSummaryRow('Focus Areas', _focusArea.join(', ')),
                          _buildSummaryRow('Chronic Status', _existingConditions.contains('None') ? 'No existing conditions' : _existingConditions.join(', ')),
                          _buildSummaryRow('Active Goals', _healthGoals.join(', ')),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          FilledButton(
            onPressed: _isSaving
                ? null
                : () async {
                    setState(() {
                      _isSaving = true;
                    });
                    
                    final payload = {
                      'age': _ageController.text,
                      'gender': _gender,
                      'weight': _weightController.text,
                      'height': _heightController.text,
                      'bmi': _calculatedBMI,
                      'bmiCategory': _bmiStatusLabel,
                      'dietaryPreference': _dietaryPreference,
                      'dietTypePersonality': _dietTypePersonality,
                      'mealCount': _mealCount,
                      'waterIntake': _waterIntake,
                      'moodBehavior': _moodBehavior,
                      'stressLevel': _stressLevel,
                      'exerciseFrequency': _exerciseFrequency,
                      'activityLevel': _activityLevel,
                      'existingConditions': _existingConditions,
                      'medications': _medications,
                      'familyHistory': _familyHistory,
                      'sleepHours': _sleepHours,
                      'smokingStatus': _smokingStatus,
                      'alcoholConsumption': _alcoholConsumption,
                      'healthGoals': _healthGoals,
                      'focusArea': _focusArea,
                    };
                    
                    await UserState().submitQuiz(payload);
                    
                    if (mounted) {
                      setState(() {
                        _isSaving = false;
                      });
                      widget.onQuizComplete();
                    }
                  },
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 18.0),
              backgroundColor: colorScheme.primary,
              minimumSize: const Size(double.infinity, 54.0),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18.0),
              ),
            ),
            child: _isSaving
                ? const SizedBox(
                    height: 20.0,
                    width: 20.0,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : const Text(
                    'Save Profile & Sync Health OS',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16.0),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: TextStyle(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value.isEmpty ? 'Not specified' : value,
              style: const TextStyle(fontSize: 13.0, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
