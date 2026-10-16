import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if key is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Endpoint: AI Lead Intent Analysis
app.post('/api/ai/analyze-lead', async (req, res) => {
  try {
    const { lead } = req.body;
    if (!lead) {
      return res.status(400).json({ error: 'Lead data is required' });
    }

    if (!aiClient) {
      // Fallback deterministic analysis if no API key is provided
      const visitScore = lead.intentSignals?.siteVisitRequested ? 'High' : 'Medium';
      return res.json({
        intentSummary: `Prospect ${lead.name} exhibits ${lead.conversionScore}% conversion probability interested in ${lead.propertyInterest?.projectName} (${lead.propertyInterest?.unitType}). Engagement depth is strong with ${lead.engagementHistory?.totalMessagesExchanged || 0} exchanged messages.`,
        buyingUrgency: lead.conversionScore >= 75 ? 'High' : lead.conversionScore >= 50 ? 'Medium' : 'Low',
        keyObjections: [
          lead.intentSignals?.budgetConfirmed ? 'Budget aligned' : 'Awaiting firm pricing/payment plan confirmation',
          lead.intentSignals?.siteVisitScheduledDate ? 'Visit pending' : 'Needs visit slot commitment'
        ],
        recommendedAction: lead.intentSignals?.siteVisitRequested
          ? 'Confirm specific site visit time with site manager contact and Google Maps pin.'
          : 'Send exclusive floor plan PDF and offer 2 upcoming private walkthrough slots.',
        suggestedMessage: `Hi ${lead.name.split(' ')[0]}, thanks for reviewing ${lead.propertyInterest?.projectName}! I noticed you were looking for ${lead.propertyInterest?.unitType}. Would you prefer a quick 15-minute walkthrough this Saturday at 11 AM or Sunday at 3 PM?`
      });
    }

    const transcriptText = (lead.engagementHistory?.chatTranscript || [])
      .map((t: { sender: string; message: string; timestamp: string }) => `[${t.sender.toUpperCase()}]: ${t.message}`)
      .join('\n');

    const prompt = `You are an elite real estate sales qualification expert analyzing high-intent WhatsApp ad leads.
Analyze this lead's profile and WhatsApp chat transcript:

Lead Name: ${lead.name}
Property: ${lead.propertyInterest?.projectName} (${lead.propertyInterest?.unitType})
Budget: ${lead.propertyInterest?.budgetRange}
Timeline: ${lead.propertyInterest?.timeline}
Ad Campaign: ${lead.adCampaign}
Current Algorithmic Conversion Score: ${lead.conversionScore}%
Site Visit Requested: ${lead.intentSignals?.siteVisitRequested ? 'YES' : 'NO'}
Mortgage Pre-approved: ${lead.intentSignals?.mortgagePreApproved ? 'YES' : 'NO'}

Chat Transcript:
${transcriptText || 'No transcript available. Inbound ad click.'}

Provide your analysis strictly in JSON format with the following keys:
{
  "intentSummary": "2-3 sentences concise assessment of their actual buying interest and nuance",
  "buyingUrgency": "High" | "Medium" | "Low",
  "keyObjections": ["list", "of", "1-3", "potential", "hesitations", "or", "questions"],
  "recommendedAction": "Immediate step the sales agent must take on WhatsApp to close visit/booking",
  "suggestedMessage": "The exact high-converting, personalized WhatsApp message to send right now (friendly, direct, real estate focused, with a low-friction question)"
}

Do not include markdown code block formatting; return pure JSON.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const responseText = response.text?.trim() || '{}';
    let parsedData;
    try {
      const cleanJson = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = {
        intentSummary: responseText.slice(0, 200),
        buyingUrgency: lead.conversionScore >= 75 ? 'High' : 'Medium',
        keyObjections: ['Requires scheduling confirmation'],
        recommendedAction: 'Contact prospect via WhatsApp',
        suggestedMessage: `Hi ${lead.name.split(' ')[0]}, I have the latest pricing and layout sheet for ${lead.propertyInterest?.projectName}. Can I share it here on WhatsApp?`
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini lead analysis error:', error);
    return res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Endpoint: AI Follow-Up Generator
app.post('/api/ai/generate-followup', async (req, res) => {
  try {
    const { lead, goal, tone } = req.body;
    if (!lead) {
      return res.status(400).json({ error: 'Lead data is required' });
    }

    if (!aiClient) {
      const firstName = lead.name.split(' ')[0];
      const message = goal === 'site_visit'
        ? `Hi ${firstName}, we have opened 3 VIP walkthrough slots for ${lead.propertyInterest?.projectName} this weekend. Would Saturday 11:30 AM or Sunday 2:00 PM work better for you?`
        : `Hi ${firstName}, following up with the detailed floor plan and payment schedule for ${lead.propertyInterest?.projectName} (${lead.propertyInterest?.unitType}). Let me know if you would like me to lock in the Phase 1 pricing for you today!`;
      return res.json({ followUpMessage: message });
    }

    const prompt = `Write a high-converting, concise WhatsApp follow-up message from a real estate luxury sales consultant to ${lead.name}.
Property: ${lead.propertyInterest?.projectName} (${lead.propertyInterest?.unitType})
Budget: ${lead.propertyInterest?.budgetRange}
Follow-up Objective: ${goal || 'Schedule Site Visit'}
Tone: ${tone || 'Polite, exclusive, high-value, conversational'}
Context: The prospect came via WhatsApp Click-to-Chat ads and their last message was: "${lead.engagementHistory?.lastUserMessageSnippet || 'Inquired about availability'}".

Rules for WhatsApp messages:
- Keep it under 65 words.
- Use natural conversational phrasing suitable for WhatsApp.
- Include a specific, low-friction call-to-action question at the end.
- Output ONLY the message text without quotes or explanations.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const followUpMessage = response.text?.trim() || '';
    return res.json({ followUpMessage });
  } catch (error: any) {
    console.error('Gemini follow-up generation error:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

async function startServer() {
  // Mount Vite development middlewares in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EstatePulse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
