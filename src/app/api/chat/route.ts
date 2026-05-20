import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, quizData } = body;

    // Build system message with health context
    let systemMessage = `You are Medpac AI, a compassionate and knowledgeable health assistant for Indian families. You provide general health information, medicine guidance, lifestyle recommendations, and help understand medical reports.

Important guidelines:
- Always clarify you are an AI, not a doctor. Recommend consulting healthcare professionals for medical decisions.
- Be culturally sensitive to Indian dietary habits, lifestyle, and healthcare practices.
- Use simple, clear language. Avoid unnecessary medical jargon.
- When discussing medicines, mention both brand names and generic names common in India.
- For pricing, use Indian Rupees (₹).
- Be supportive and empathetic, especially for chronic conditions like diabetes, hypertension, and thyroid disorders.
- If someone describes an emergency, urge them to call emergency services (112 in India) immediately.`;

    if (quizData) {
      const conditions = quizData.existingConditions?.join(', ') || 'none reported';
      const goals = quizData.healthGoals?.join(', ') || 'general wellness';
      const medications = quizData.medications?.join(', ') || 'none reported';
      const activityLevel = quizData.activityLevel || 'not specified';

      systemMessage += `\n\nPatient Profile:
- Age: ${quizData.age || 'not specified'}
- Gender: ${quizData.gender || 'not specified'}
- Existing Conditions: ${conditions}
- Current Medications: ${medications}
- Health Goals: ${goals}
- Activity Level: ${activityLevel}
- Smoking Status: ${quizData.smokingStatus || 'not specified'}
- Stress Level: ${quizData.stressLevel || 'not specified'}

Tailor your responses based on this profile. Be especially attentive to their conditions and goals.`;
    }

    // Use z-ai-web-dev-sdk for LLM
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      const chatMessages = [
        { role: 'system' as const, content: systemMessage },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ];

      const completion = await zai.chat.completions.create({
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const reply = completion.choices?.[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';

      return NextResponse.json({ reply });
    } catch (aiError) {
      console.error('AI SDK error:', aiError);

      // Fallback: generate a helpful response based on the last user message
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

      let reply = "I'm your Medpac AI Health Assistant. While I'm currently experiencing high demand, I can still help! Here are some general health tips:\n\n";

      if (lastMessage.includes('diabetes') || lastMessage.includes('sugar') || lastMessage.includes('blood sugar')) {
        reply = "For diabetes management in the Indian context:\n\n1. **Monitor regularly**: Check fasting and post-meal blood sugar levels\n2. **Diet**: Focus on whole grains (bajra, jowar), dal, vegetables. Limit rice and refined carbs\n3. **Medicine timing**: Take Metformin with meals to reduce stomach upset\n4. **Exercise**: 30 minutes of brisk walking after meals helps control blood sugar\n5. **HbA1c**: Get it checked every 3 months\n\n⚠️ Always consult your doctor before making changes to your medication. Would you like specific advice on any of these points?";
      } else if (lastMessage.includes('blood pressure') || lastMessage.includes('hypertension') || lastMessage.includes('bp')) {
        reply = "For blood pressure management:\n\n1. **Monitor daily**: Check BP at the same time each day, preferably morning\n2. **Salt reduction**: Limit to 5g/day. Avoid pickles, papad, and processed foods\n3. **DASH diet**: Include fruits, vegetables, low-fat dairy, whole grains\n4. **Medicine adherence**: Never skip doses, even if you feel fine\n5. **Stress management**: Practice pranayama and meditation\n\n⚠️ Uncontrolled BP can lead to stroke and heart disease. Please consult your cardiologist regularly.";
      } else if (lastMessage.includes('thyroid') || lastMessage.includes('tsh') || lastMessage.includes('hypothyroid')) {
        reply = "For thyroid management:\n\n1. **Medicine timing**: Take Thyronorm/Levothyroxine on an empty stomach, 30 minutes before breakfast\n2. **Avoid interference**: Don't take calcium, iron supplements within 4 hours of thyroid medicine\n3. **Diet**: Include iodine-rich foods. Limit raw cruciferous vegetables (cabbage, cauliflower)\n4. **Regular testing**: TSH every 6-8 weeks until stable, then every 6 months\n5. **Weight management**: Thyroid issues can affect metabolism — stay active\n\n⚠️ Never adjust your dose without consulting your endocrinologist.";
      } else if (lastMessage.includes('medicine') || lastMessage.includes('drug') || lastMessage.includes('tablet')) {
        reply = "I can help with medicine information! Here are some common guidelines:\n\n1. **Always complete antibiotic courses** — don't stop early even if you feel better\n2. **Take pain relievers** (like Crocin/Dolo) with food to protect your stomach\n3. **Never crush or split** extended-release tablets\n4. **Store medicines properly** — some need refrigeration (like insulin)\n5. **Check expiry dates** — expired medicines can be harmful\n\nWhich specific medicine would you like to know more about? I can provide dosage information, side effects, and interactions.";
      } else if (lastMessage.includes('diet') || lastMessage.includes('food') || lastMessage.includes('nutrition')) {
        reply = "Here are healthy eating guidelines for Indian diets:\n\n1. **Balanced plate**: 50% vegetables, 25% protein (dal, paneer, chicken), 25% whole grains\n2. **Morning**: Warm water with lemon, followed by nuts (5-6 almonds, 2 walnuts)\n3. **Lunch**: Roti + sabzi + dal + curd — the traditional thali is balanced!\n4. **Dinner**: Light and early — soup, salad, or khichdi\n5. **Hydration**: 8-10 glasses of water. Buttermilk and coconut water are great alternatives\n6. **Limit**: Sugar, maida, deep-fried foods, and excessive tea/coffee\n\nWould you like a diet plan tailored to any specific condition?";
      } else if (lastMessage.includes('report') || lastMessage.includes('test') || lastMessage.includes('lab')) {
        reply = "I can help you understand your lab reports! Here's what common tests mean:\n\n1. **CBC (Complete Blood Count)**: Checks hemoglobin, WBC, platelets\n2. **Lipid Profile**: Total cholesterol, HDL, LDL, triglycerides\n3. **Thyroid Profile**: T3, T4, TSH levels\n4. **HbA1c**: Average blood sugar over 3 months (below 5.7% is normal)\n5. **Liver Function (LFT)**: SGOT, SGPT, bilirubin\n6. **Kidney Function (KFT)**: Creatinine, BUN, eGFR\n\nUpload your report through the Report Analyzer for detailed AI-powered analysis with personalized insights!";
      } else {
        reply = "Hello! I'm your Medpac AI Health Assistant. I can help you with:\n\n🏥 **Health Conditions** — Diabetes, Thyroid, Heart, BP management\n💊 **Medicine Information** — Dosage, side effects, interactions\n🥗 **Diet & Nutrition** — Indian diet plans, nutritional advice\n📋 **Report Analysis** — Understanding your lab test results\n🧘 **Lifestyle** — Exercise, stress management, sleep tips\n👨‍👩‍👧‍👦 **Family Health** — Care plans for elderly, children\n\nJust type your question and I'll do my best to help. For medical emergencies, please call 112 immediately.";
      }

      return NextResponse.json({ reply });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { reply: 'I apologize, but I encountered an error. Please try again in a moment. For medical emergencies, call 112.' },
      { status: 500 }
    );
  }
}
