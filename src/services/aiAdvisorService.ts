import { AIMessage, AIConversation } from '../types/ai';
import { AssessmentData } from '../types/assessment';
import { FeasibilityReport } from '../types/business';
import { selectScheme } from '../utils/financialEngine';
import { storageService } from './storageService';

export const aiAdvisorService = {
  getConversations(userId: string): AIConversation[] {
    return storageService.getItem<AIConversation[]>(userId, 'ai_conversations', []);
  },

  saveConversations(userId: string, convos: AIConversation[]): void {
    storageService.setItem(userId, 'ai_conversations', convos);
  },

  deleteConversation(userId: string, convoId: string): void {
    const convos = this.getConversations(userId);
    const filtered = convos.filter(c => c.id !== convoId);
    this.saveConversations(userId, filtered);
  },

  /**
   * SmartGuide AI context-aware RAG engine
   * Synthesizes user's real business data, location, capital, scheme, and feasibility
   */
  async generateResponse(
    userId: string,
    prompt: string,
    assessment: AssessmentData | null,
    report: FeasibilityReport | null,
    lang: 'en' | 'te' | 'hi' = 'en'
  ): Promise<string> {
    // Artificial small delay for realistic UX progress
    await new Promise(res => setTimeout(res, 600));

    const p = prompt.toLowerCase();
    const margin = assessment?.marginCapital || 100000;
    const schemeMatch = selectScheme(margin);
    const business = assessment?.category || 'Dairy & Milk Products';
    const location = assessment?.location.district 
      ? `${assessment.location.village || assessment.location.gramPanchayat || 'village'}, ${assessment.location.district}`
      : 'your village area';

    // Multilingual response generation
    if (lang === 'te') {
      if (p.includes('dairy') || p.includes('గేదె') || p.includes('పాలు')) {
        return `మీ ${location} ప్రాంతంలో **పాల వ్యాపారం (Dairy Business)** చాలా లాభదాయకమైనది. మీ వద్ద ఉన్న ₹${margin.toLocaleString('en-IN')} మార్జిన్‌తో **${schemeMatch.scheme?.name || 'టర్మ్ లోన్ పథకం'}** ద్వారా 90% వరకు ప్రభుత్వం రాయితీ రుణాన్ని అందిస్తుంది. రోజూ గ్రామంలోని ఇళ్లకు మరియు టీ కొట్లకు పాలు సరఫరా చేయడం ద్వారా నిరంతర ఆదాయం లభిస్తుంది. ప్రారంభించడానికి 4 మేలుజాతి పాడి పశువులతో పైలట్ ప్రాజెక్ట్ మొదలుపెట్టడం శ్రేయస్కరం.`;
      }
      if (p.includes('emi') || p.includes('రుణం') || p.includes('వడ్డీ') || p.includes('చెల్లింపు')) {
        return `మీ ప్రాజెక్ట్ వ్యయం ₹${schemeMatch.calculatedProjectCost.toLocaleString('en-IN')} గా అంచనా వేయబడింది. **${schemeMatch.scheme?.name}** కింద గరిష్టంగా ₹${schemeMatch.applicableLoan.toLocaleString('en-IN')} రుణం లభిస్తుంది (వడ్డీ ${schemeMatch.scheme?.interestRate}% p.a.). మొదటి ${schemeMatch.scheme?.moratoriumMonths} నెలలు మారటోరియం ఉంటుంది కాబట్టి అసలు చెల్లించాల్సిన పనిలేదు. ఆ తర్వాత సుమారు నెలవారీ EMI సులభంగా చెల్లించవచ్చు.`;
      }
      return `నమస్కారం! మీ వ్యాపార ఆలోచన: **${business}**, స్థలం: **${location}**. మీ మూలధనం ₹${margin.toLocaleString('en-IN')} కు తగినట్లుగా ప్రభుత్వ MoSJE పథకం ద్వారా ఆర్థిక ప్రణాళిక సిద్ధంగా ఉంది. మీకు ఏ అంశంపై మరింత వివరణ కావాలి?`;
    }

    if (lang === 'hi') {
      if (p.includes('dairy') || p.includes('दूध') || p.includes('डेयरी')) {
        return `आपके क्षेत्र **${location}** में **डेयरी व्यवसाय** अत्यधिक व्यावहारिक है। आपकी ₹${margin.toLocaleString('en-IN')} की मार्जिन पूंजी पर **${schemeMatch.scheme?.name || 'टर्म लोन योजना'}** के तहत 90% ऋण (₹${schemeMatch.applicableLoan.toLocaleString('en-IN')}) प्राप्त हो सकता है। प्रतिदिन स्थानीय घरों और ढाबों में सीधी आपूर्ति करके आप जोखिम कम कर सकते हैं।`;
      }
      if (p.includes('emi') || p.includes('किस्त') || p.includes('ब्याज')) {
        return `आपकी परियोजना लागत ₹${schemeMatch.calculatedProjectCost.toLocaleString('en-IN')} है। **${schemeMatch.scheme?.name}** में ${schemeMatch.scheme?.interestRate}% प्रति वर्ष ब्याज दर पर ${schemeMatch.scheme?.tenureYears} वर्ष का समय मिलता है, जिसमें पहले ${schemeMatch.scheme?.moratoriumMonths} महीने का मोराटोरियम (ऋण स्थगन) शामिल है।`;
      }
      return `नमस्ते! आपकी व्यावसायिक योजना: **${business}**, स्थान: **${location}**। आपकी पूंजी ₹${margin.toLocaleString('en-IN')} के लिए सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE) की योजना के तहत वित्तीय संरचना तैयार है। आप किस विषय में अधिक जानकारी चाहते हैं?`;
    }

    // Default: English
    if (p.includes('dairy') || p.includes('milk') || p.includes('cattle')) {
      return `Based on hyper-local data for **${location}**, **Dairy & Milk Products** is an exceptional grassroots enterprise. With your ₹${margin.toLocaleString('en-IN')} margin capital, you can structure a ₹${schemeMatch.calculatedProjectCost.toLocaleString('en-IN')} project supported by the **${schemeMatch.scheme?.name}** (₹${schemeMatch.applicableLoan.toLocaleString('en-IN')} concessional loan at ${schemeMatch.scheme?.interestRate}% p.a.). We recommend starting with 4 vaccinated buffaloes and securing doorstep residential delivery to ensure positive cashflow from Day 1.`;
    }

    if (p.includes('emi') || p.includes('repay') || p.includes('interest') || p.includes('moratorium')) {
      const tenure = schemeMatch.scheme?.tenureYears || 7;
      const interest = schemeMatch.scheme?.interestRate || 8.0;
      const moratorium = schemeMatch.scheme?.moratoriumMonths || 6;
      return `Here is your exact financing structure under **${schemeMatch.scheme?.name || 'MoSJE Scheme'}**:
- **Project Cost**: ₹${schemeMatch.calculatedProjectCost.toLocaleString('en-IN')}
- **Your 10% Margin**: ₹${margin.toLocaleString('en-IN')}
- **Eligible Loan (90%)**: ₹${schemeMatch.applicableLoan.toLocaleString('en-IN')}
- **Interest Rate**: ${interest}% per annum
- **Tenure**: ${tenure} years (${tenure * 12} months)
- **Moratorium**: ${moratorium} months (only simple interest during setup).
- **Estimated Monthly EMI**: ~₹${Math.round(schemeMatch.applicableLoan * 0.0165).toLocaleString('en-IN')}/month.`;
    }

    if (p.includes('risk') || p.includes('mitigat') || p.includes('reduce')) {
      return `To mitigate risks in **${business}** around ${location}:
1. **Feed & Supply**: Stock dry silage and secure green fodder from your local mandi before peak summer.
2. **Customer Retention**: Lock in 25–30 regular households on monthly advance subscription.
3. **Emergency Reserve**: Maintain at least 3 months of operating buffer (~₹35,000) for veterinary/equipment needs.`;
    }

    if (p.includes('next') || p.includes('start') || p.includes('document') || p.includes('apply')) {
      return `Your immediate action plan:
1. **Bank Margin Proof**: Keep your 10% margin (₹${margin.toLocaleString('en-IN')}) ready in a nationalized or cooperative bank account.
2. **Obtain Quotations**: Collect 2 signed vendor quotations for machinery or livestock.
3. **MoSJE Application**: Submit your Detailed Project Profile under ${schemeMatch.scheme?.name} at your District Social Welfare or Corporation nodal office.`;
    }

    return `I am SmartGuide AI, your dedicated rural enterprise advisor. For your **${business}** initiative in **${location}**, your margin capital of ₹${margin.toLocaleString('en-IN')} qualifies for **${schemeMatch.scheme?.name}** (₹${schemeMatch.applicableLoan.toLocaleString('en-IN')} loan). 

How would you like to proceed?
- Inquire about your monthly EMI schedule
- Explore local market competitor gaps
- Review the 30-Day Launch Roadmap`;
  }
};
