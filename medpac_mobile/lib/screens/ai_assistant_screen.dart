import 'package:flutter/material.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'isUser': false,
      'text': 'Hello Prabh! I am your Medpac AI Health Assistant. You can ask me health questions or upload medical reports for analysis. How can I help you today?',
      'time': '10:00 AM',
    },
  ];

  final List<String> _suggestions = [
    'Analyze blood test',
    'Symptoms of Migraine',
    'Vitamin D usage',
    'Explain hypertension',
  ];

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'isUser': true,
        'text': _messageController.text.trim(),
        'time': 'Just now',
      });
      final userQuery = _messageController.text.trim().toLowerCase();
      _messageController.clear();

      // Trigger automatic realistic AI mock response
      Future.delayed(const Duration(seconds: 1), () {
        if (mounted) {
          setState(() {
            _messages.add({
              'isUser': false,
              'text': _getMockAiResponse(userQuery),
              'time': 'Just now',
            });
          });
        }
      });
    });
  }

  String _getMockAiResponse(String query) {
    if (query.contains('blood') || query.contains('analyze')) {
      return 'I would be happy to analyze your blood test report. Please tap the attachment (+) icon to select your PDF report. I will extract details like Hemoglobin, Cholesterol, and Vitamin levels and summarize them for you.';
    } else if (query.contains('migraine') || query.contains('headache')) {
      return 'Migraine is a neurological condition that frequently causes intense, debilitating headaches. Symptoms include throbbing pain (usually on one side), sensitivity to light/sound, and nausea. It is best to avoid triggers like stress, caffeine, or lack of sleep. If symptoms persist, consulting a neurologist is recommended.';
    } else if (query.contains('vitamin')) {
      return 'Vitamin D is crucial for maintaining healthy bones and supporting immune function. Standard maintenance dose is around 1,000–2,000 IU daily, but if you have a severe deficiency, a doctor might prescribe a weekly dose of 50,000 IU. It is best taken with a meal containing fats to aid absorption.';
    } else {
      return 'That sounds interesting. As an AI health assistant, I can give you general guidance, but I recommend discussing any specific symptoms or changes with Dr. Sarah Connor during your appointment today at 3:30 PM.';
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 10.0,
              height: 10.0,
              decoration: const BoxDecoration(
                color: Color(0xFF10B981), // Emerald green
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8.0),
            Text(
              'Medpac AI',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: colorScheme.onBackground,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.info_outline_rounded),
          )
        ],
      ),
      body: Column(
        children: [
          // Suggestions header
          if (_messages.length == 1)
            Container(
              height: 50.0,
              margin: const EdgeInsets.only(top: 8.0),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                itemCount: _suggestions.length,
                itemBuilder: (context, index) {
                  return GestureDetector(
                    onTap: () {
                      _messageController.text = _suggestions[index];
                      _sendMessage();
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 8.0, bottom: 8.0, top: 4.0),
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                      decoration: BoxDecoration(
                        color: colorScheme.primary.withOpacity(0.08),
                        border: Border.all(color: colorScheme.primary.withOpacity(0.2)),
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      child: Center(
                        child: Text(
                          _suggestions[index],
                          style: TextStyle(
                            fontSize: 12.0,
                            fontWeight: FontWeight.w600,
                            color: colorScheme.primary,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

          // Messages View
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['isUser'];

                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.78,
                    ),
                    margin: const EdgeInsets.only(bottom: 12.0),
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: isUser
                          ? colorScheme.primary
                          : colorScheme.surface,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16.0),
                        topRight: const Radius.circular(16.0),
                        bottomLeft: isUser ? const Radius.circular(16.0) : Radius.zero,
                        bottomRight: isUser ? Radius.zero : const Radius.circular(16.0),
                      ),
                      border: isUser
                          ? null
                          : Border.all(color: colorScheme.onSurface.withOpacity(0.08)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg['text'],
                          style: TextStyle(
                            color: isUser ? Colors.white : colorScheme.onSurface,
                            fontSize: 14.5,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 6.0),
                        Align(
                          alignment: Alignment.bottomRight,
                          child: Text(
                            msg['time'],
                            style: TextStyle(
                              color: isUser ? Colors.white60 : colorScheme.onSurface.withOpacity(0.4),
                              fontSize: 10.0,
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

          // Input Bar
          Container(
            padding: const EdgeInsets.all(16.0),
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
                IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.add_rounded, color: colorScheme.primary),
                ),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    decoration: BoxDecoration(
                      color: colorScheme.background,
                      borderRadius: BorderRadius.circular(24.0),
                      border: Border.all(
                        color: colorScheme.onSurface.withOpacity(0.08),
                      ),
                    ),
                    child: TextField(
                      controller: _messageController,
                      onSubmitted: (_) => _sendMessage(),
                      decoration: InputDecoration(
                        hintText: 'Type your message...',
                        hintStyle: TextStyle(
                          color: colorScheme.onSurface.withOpacity(0.4),
                          fontSize: 14.0,
                        ),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8.0),
                IconButton(
                  onPressed: _sendMessage,
                  icon: const Icon(Icons.send_rounded),
                  color: colorScheme.primary,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
