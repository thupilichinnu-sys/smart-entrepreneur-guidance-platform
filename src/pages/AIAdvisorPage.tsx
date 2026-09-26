import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, User as UserIcon, Volume2, Trash2, 
  Building2, Coins, MapPin, Landmark, ArrowRight, CornerDownLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { aiAdvisorService } from '../services/aiAdvisorService';
import { businessService } from '../services/businessService';
import { reportService } from '../services/reportService';
import { activityService } from '../services/activityService';
import { AudioSpeakerButton } from '../components/common/AudioSpeakerButton';
import { AIMessage, AIConversation } from '../types/ai';
import { formatCurrencyINR } from '../utils/formatting';

export const AIAdvisorPage: React.FC<{ navigate: (r: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string>('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${user?.fullName || 'Entrepreneur'}! I am SmartGuide AI, your dedicated rural enterprise and MoSJE scheme advisor. I am grounded in your local area and financial capacity. Ask me any question regarding business viability, loan calculations, or launch steps.`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assessment = user ? businessService.getAssessment(user.id) : null;
  const reports = user ? reportService.getReports(user.id) : [];
  const latestReport = reports.length > 0 ? reports[0] : null;

  useEffect(() => {
    if (user) {
      const savedConvos = aiAdvisorService.getConversations(user.id);
      setConversations(savedConvos);
      if (savedConvos.length > 0) {
        setActiveConvoId(savedConvos[0].id);
        setMessages(savedConvos[0].messages);
      }
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading || !user) return;

    const userMsg: AIMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
      language
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    // Context-aware RAG generation
    const replyText = await aiAdvisorService.generateResponse(
      user.id,
      query,
      assessment,
      latestReport,
      language
    );

    const assistantMsg: AIMessage = {
      id: 'ai_' + Date.now(),
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toISOString(),
      language
    };

    const finalMessages = [...updated, assistantMsg];
    setMessages(finalMessages);
    setIsLoading(false);

    // Save to user's conversation history
    const convoId = activeConvoId || 'convo_' + Date.now();
    const existingConvo = conversations.find(c => c.id === convoId);
    let newConvos: AIConversation[];

    if (existingConvo) {
      newConvos = conversations.map(c => c.id === convoId ? {
        ...c,
        messages: finalMessages,
        lastMessageAt: new Date().toISOString()
      } : c);
    } else {
      const newC: AIConversation = {
        id: convoId,
        userId: user.id,
        title: query.slice(0, 30) + '...',
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messages: finalMessages
      };
      newConvos = [newC, ...conversations];
      setActiveConvoId(convoId);
    }

    setConversations(newConvos);
    aiAdvisorService.saveConversations(user.id, newConvos);

    activityService.logActivity(user.id, {
      type: 'AI_ADVISOR_USED',
      title: 'SmartGuide AI Consulted',
      description: `Inquired: "${query.slice(0, 45)}..."`
    });
  };

  const handleQuickPrompt = (p: string) => {
    handleSend(p);
  };

  const handleDeleteConvo = (id: string) => {
    if (!user) return;
    aiAdvisorService.deleteConversation(user.id, id);
    const remaining = conversations.filter(c => c.id !== id);
    setConversations(remaining);
    if (activeConvoId === id) {
      if (remaining.length > 0) {
        setActiveConvoId(remaining[0].id);
        setMessages(remaining[0].messages);
      } else {
        setActiveConvoId('');
        setMessages([{
          id: 'welcome',
          sender: 'assistant',
          text: 'How can I assist your enterprise journey today?',
          timestamp: new Date().toISOString()
        }]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200">
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span>Context-Aware RAG Decision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            SMARTGUIDE AI ADVISOR
          </h1>
          <p className="text-xs text-slate-500">
            Multilingual grassroots business and financial advisory.
          </p>
        </div>

        {/* Current Active Context Badge */}
        {assessment && (
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">{assessment.category}</span>
              <span className="text-[10px] text-slate-500">
                {assessment.location.village || assessment.location.district} • Margin: {formatCurrencyINR(assessment.marginCapital, true)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left 1 Col: Saved Conversations & Context */}
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Saved Conversations</span>
              <span className="text-[10px] font-bold text-slate-400">{conversations.length}</span>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-3 text-center">No previous chats</p>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer ${
                      activeConvoId === c.id ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                    onClick={() => {
                      setActiveConvoId(c.id);
                      setMessages(c.messages);
                    }}
                  >
                    <span className="truncate max-w-[140px]">{c.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConvo(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Context Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">AI Memory & Context</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              SmartGuide AI has instant access to your location, 10% margin sizing, MoSJE scheme cap rules, and local feasibility scores.
            </p>
          </div>
        </div>

        {/* Right 3 Cols: Active Chat Stream */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[640px] overflow-hidden">
          
          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                    isAssistant 
                      ? 'bg-slate-50 border border-slate-100 text-slate-800' 
                      : 'bg-emerald-600 text-white'
                  }`}>
                    <div className="whitespace-pre-line">{m.text}</div>
                    
                    {isAssistant && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <AudioSpeakerButton textToSpeak={m.text} size="sm" />
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-slate-500 italic">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <span>Analyzing rural market context & scheme rules...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-6 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">Suggested:</span>
            {[
              "Is dairy suitable for my village?",
              "Explain my EMI and moratorium simply.",
              "How can I reduce operational risk?",
              "What documents should I prepare for the bank?",
              "Explain my feasibility in Telugu"
            ].map((qp) => (
              <button
                key={qp}
                onClick={() => handleQuickPrompt(qp)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200 whitespace-nowrap shadow-2xs transition-all text-[11px]"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SmartGuide AI a question (English, తెలుగు, हिन्दी)..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
};
