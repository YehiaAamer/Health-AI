import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { messagesApi } from "@/api/messages";
import { patientsApi } from "@/api/patients";
import type { ChatThread, ChatMessage, User, Prediction } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreHorizontal,
  Video,
  FileText,
  AlertTriangle,
  CheckCheck,
  Activity,
  Calendar,
  Pill,
  Sparkles,
  ArrowUpRight,
  X,
  Bot,
  ChevronDown,
  TrendingUp,
  MoreVertical,
  User as UserIcon
} from "lucide-react";
import LoadingDots from "@/components/shared/LoadingDots";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedConv, setSelectedConv] = useState<ChatThread | null>(null);
  const [patientProfile, setPatientProfile] = useState<(User & { predictions: Prediction[] }) | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');

  const [conversations, setConversations] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const data = await messagesApi.getThreads();
      setConversations(data);
      if (data.length > 0 && !selectedConv) {
        setSelectedConv(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (threadId: number) => {
    try {
      setMessagesLoading(true);
      const data = await messagesApi.getMessages(threadId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
      toast.error(isArabic ? "فشل تحميل الرسائل" : "Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch patient medical summary
  const fetchPatientProfile = async (patientId: string) => {
    try {
      // Use numeric ID from the string if it contains one (e.g., "8" from "8" or "8" from "PID-8")
      const numericId = parseInt(patientId?.replace(/^\D+/g, '') || '0');
      if (isNaN(numericId)) {
        console.warn("Invalid patient ID format:", patientId);
        return;
      }
      const data = await patientsApi.getPatientProfile(numericId);
      setPatientProfile(data);
    } catch (error) {
      console.error("Failed to fetch patient profile", error);
    }
  };

  useEffect(() => {
    fetchConversations();
    // Poll for new conversations every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
      fetchPatientProfile(selectedConv.patient_id);
      
      // Poll for new messages every 10 seconds
      const interval = setInterval(() => fetchMessages(selectedConv.id), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedConv]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    
    try {
      const sentMsg = await messagesApi.sendMessage(selectedConv.id, newMessage);
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage("");
      // Also update the local conversation preview
      setConversations(prev => prev.map(c => 
        c.id === selectedConv.id ? { ...c, last_message: newMessage, time: 'Just now' } : c
      ));
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error(isArabic ? "فشل إرسال الرسالة" : "Failed to send message");
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getRiskBadgeStyles = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'low': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const latestPrediction = patientProfile?.predictions?.[0];

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50/50">
        <LoadingDots />
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t('doctorDashboard.sidebar.messages.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4 overflow-hidden animate-in fade-in duration-700 bg-slate-50/30 p-2" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* COLUMN 1: CONVERSATIONS SIDEBAR */}
      <Card className="w-[320px] flex flex-col border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {t('doctorDashboard.sidebar.messages.title')}
            </h2>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative group mb-5">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors", isArabic ? "right-4" : "left-4")} />
            <Input
              placeholder={t('doctorDashboard.sidebar.messages.searchPlaceholder')}
              className={cn("h-11 bg-slate-50/50 border-transparent rounded-[1.25rem] text-[13px] font-bold focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all", isArabic ? "pr-11 pl-4" : "pl-11 pr-4")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: t('doctorDashboard.sidebar.messages.filters.all') },
              { id: 'unread', label: t('doctorDashboard.sidebar.messages.filters.unread') },
              { id: 'highRisk', label: t('doctorDashboard.sidebar.messages.filters.highRisk') }
            ].map((f) => (
              <button 
                key={f.id} 
                onClick={() => setActiveFilter(f.id)}
                className={`rounded-xl px-4 py-2 whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {filteredConversations.length === 0 ? (
              <div className="py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                {t('doctorDashboard.sidebar.messages.noConversations')}
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className={cn(
                    "p-4 rounded-[2rem] cursor-pointer transition-all flex items-center gap-4 group relative border-2",
                    selectedConv?.id === conv.id ? "bg-blue-50/50 border-blue-600/10 shadow-sm" : "hover:bg-slate-50 border-transparent"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-4 ring-slate-50">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-black text-xs">
                        {conv.patient_name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && <div className={cn("absolute bottom-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white", isArabic ? "left-0" : "right-0")} />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className={cn("flex items-center justify-between mb-0.5", isArabic && "flex-row-reverse")}>
                      <h4 className={cn("font-black text-slate-900 truncate text-[13.5px] tracking-tight", conv.unread_count > 0 && "text-blue-600")}>{conv.patient_name}</h4>
                      <span className="text-[9px] font-black text-slate-400 whitespace-nowrap uppercase tracking-tighter">{conv.time}</span>
                    </div>
                    <p className={cn("text-[11.5px] font-medium text-slate-500 truncate leading-tight mb-2", conv.unread_count > 0 && "text-slate-900 font-bold", isArabic && "text-right")}>{conv.last_message}</p>
                    <div className={cn("flex items-center gap-2", isArabic && "flex-row-reverse")}>
                      <Badge className={cn("px-2 py-0.5 h-4 text-[7px] font-black uppercase border tracking-widest rounded-lg shadow-none", getRiskBadgeStyles(conv.risk_level))}>
                        {isArabic ? (conv.risk_level === 'High' ? 'عالية الخطورة' : conv.risk_level === 'Medium' ? 'متوسطة الخطورة' : 'منخفضة الخطورة') : `${conv.risk_level} Risk`}
                      </Badge>
                    </div>
                  </div>
                  {conv.unread_count > 0 && selectedConv?.id !== conv.id && (
                    <div className={cn("absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30", isArabic ? "left-4" : "right-4")}>
                      <span className="text-[9px] font-black text-white">{conv.unread_count}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* COLUMN 2: CENTER CHAT AREA */}
      <Card className="flex-1 flex flex-col border-none shadow-2xl shadow-slate-200/40 rounded-[3rem] bg-white overflow-hidden relative">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className={cn("h-[80px] px-8 border-b border-slate-50 flex items-center justify-between bg-white shrink-0", isArabic && "flex-row-reverse")}>
              <div className={cn("flex items-center gap-4", isArabic && "flex-row-reverse")}>
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
                    <AvatarFallback className="bg-slate-100 text-slate-900 font-black text-sm">
                      {selectedConv.patient_name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("absolute -bottom-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white", isArabic ? "left-0.5" : "right-0.5")} />
                </div>
                <div className={cn("flex flex-col", isArabic ? "items-end text-right" : "items-start")}>
                  <div className={cn("flex items-center gap-3 mb-0.5", isArabic && "flex-row-reverse")}>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{selectedConv.patient_name}</h3>
                    <Badge className={cn("px-2.5 py-0.5 h-4.5 text-[8px] font-black uppercase tracking-widest rounded-lg", getRiskBadgeStyles(selectedConv.risk_level))}>
                      {isArabic ? (selectedConv.risk_level === 'High' ? 'عالية الخطورة' : selectedConv.risk_level === 'Medium' ? 'متوسطة الخطورة' : 'منخفضة الخطورة') : `${selectedConv.risk_level} RISK`}
                    </Badge>
                  </div>
                  <div className={cn("flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest", isArabic && "flex-row-reverse")}>
                    <span>{t('doctorDashboard.sidebar.messages.id')}: #{selectedConv.patient_id}</span>
                    <span className="h-1 w-1 bg-slate-200 rounded-full" />
                    <span className="text-blue-600">{t('doctorDashboard.sidebar.messages.activeConsultation')}</span>
                  </div>
                </div>
              </div>
              <div className={cn("flex items-center gap-3", isArabic && "flex-row-reverse")}>
                <Button variant="outline" className="rounded-2xl h-11 px-5 border-slate-100 text-slate-700 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm">
                  <Video className="h-4 w-4 text-blue-600" />
                  {t('doctorDashboard.sidebar.messages.videoCall')}
                </Button>
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-slate-300 hover:bg-slate-50 transition-all">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Emergency Banner */}
            {selectedConv.risk_level?.toLowerCase() === 'high' && (
              <div className={cn("bg-red-600 h-10 px-8 flex items-center justify-between animate-in slide-in-from-top-full duration-700 shrink-0 shadow-lg shadow-red-600/10", isArabic && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", isArabic && "flex-row-reverse")}>
                  <AlertTriangle className="h-4 w-4 text-white" />
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                    {t('doctorDashboard.sidebar.messages.chat.emergencyAlert')}
                  </p>
                </div>
                <button className="text-[9px] font-black text-white/80 hover:text-white uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg">
                  {t('doctorDashboard.sidebar.messages.viewIndicators')}
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <ScrollArea className="flex-1 bg-slate-50/20 px-8" ref={scrollRef}>
              <div className="py-8 space-y-6 max-w-4xl mx-auto w-full">
                {messagesLoading && messages.length === 0 ? (
                  <div className="flex justify-center py-10"><LoadingDots /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-300 font-black uppercase text-xs tracking-[0.2em]">
                    {t('doctorDashboard.sidebar.messages.startConversation', { name: selectedConv.patient_name })}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={cn("flex gap-4", msg.sender_user !== parseInt(selectedConv.patient_id?.replace(/^\D+/g, '') || '0') ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn("flex flex-col max-w-[75%]", msg.sender_user !== parseInt(selectedConv.patient_id?.replace(/^\D+/g, '') || '0') ? "items-end" : "items-start")}>
                        <div className={cn(
                          "p-4 px-6 rounded-[2.5rem] text-[13px] font-bold leading-relaxed shadow-sm",
                          msg.sender_user !== parseInt(selectedConv.patient_id?.replace(/^\D+/g, '') || '0')
                            ? "bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10" 
                            : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                          </span>
                          {msg.sender_user !== parseInt(selectedConv.patient_id?.replace(/^\D+/g, '') || '0') && <CheckCheck className="h-3.5 w-3.5 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-8 border-t border-slate-50 bg-white shrink-0">
              <div className={cn("flex items-center gap-4 bg-slate-50 border-2 border-transparent p-2 rounded-[2.25rem] focus-within:bg-white focus-within:border-blue-600/20 focus-within:ring-8 focus-within:ring-blue-600/5 transition-all shadow-inner", isArabic ? "pr-6 pl-2 flex-row-reverse" : "pl-6 pr-2")}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('doctorDashboard.sidebar.messages.typeMessage')}
                  className={cn("flex-1 bg-transparent border-none outline-none text-[13.5px] font-black text-slate-800 placeholder:text-slate-400", isArabic && "text-right")}
                />
                <div className={cn("flex items-center gap-1", isArabic ? "pl-1" : "pr-1")}>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-white rounded-2xl transition-all">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow-xl shadow-blue-600/20 font-black uppercase text-xs tracking-widest transition-all"
                  >
                    <Send className={cn("h-4 w-4", isArabic ? "ml-2" : "mr-2")} />
                    {t('doctorDashboard.sidebar.messages.send')}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 p-20">
            <div className="h-32 w-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-inner">
              <MessageSquare className="h-12 w-12 opacity-10" />
            </div>
            <p className="text-xs font-black text-slate-400 tracking-[0.3em] uppercase">
              {t('doctorDashboard.sidebar.messages.selectThread')}
            </p>
          </div>
        )}
      </Card>

      {/* COLUMN 3: PATIENT SUMMARY PANEL */}
      <Card className="w-[360px] flex flex-col border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden shrink-0">
        <div className={cn("h-[80px] px-8 border-b border-slate-50 flex items-center justify-between bg-white shrink-0", isArabic && "flex-row-reverse")}>
          <h2 className="text-[11px] font-black text-slate-900 tracking-[0.2em] uppercase">
            {t('doctorDashboard.sidebar.messages.summary.title')}
          </h2>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-10 pb-12">
            {patientProfile ? (
              <>
                {/* 1. Risk Status */}
                <div className={cn("space-y-5", isArabic && "text-right")}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    {t('doctorDashboard.sidebar.messages.summary.riskTrend')}
                  </p>
                  <div className="p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="relative z-10">
                      <div className={cn("flex items-baseline gap-2 mb-2", isArabic && "flex-row-reverse")}>
                        <span className="text-5xl font-black text-white tracking-tighter">{latestPrediction ? Math.round(latestPrediction.probability) : 0}%</span>
                        <Badge className={cn("px-2 py-0.5 text-[8px] font-black uppercase rounded-lg border-none shadow-lg", latestPrediction?.risk_level?.toLowerCase() === 'high' ? "bg-red-500 text-white" : "bg-green-500 text-white")}>
                          {isArabic ? (latestPrediction?.risk_level === 'High' ? 'خطورة عالية' : 'خطورة منخفضة') : `${latestPrediction?.risk_level || 'Low'} Risk`}
                        </Badge>
                      </div>
                      <div className={cn("flex items-center gap-2 text-slate-400", isArabic && "flex-row-reverse")}>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {isArabic ? `بناءً على ${patientProfile.predictions.length} تقييمات` : `Based on ${patientProfile.predictions.length} assessments`}
                        </span>
                      </div>
                    </div>
                    <Sparkles className="absolute -bottom-6 -right-6 h-24 w-24 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>

                {/* 2. Vital Indicators */}
                <div className="space-y-5">
                  <div className={cn("flex items-center justify-between px-2", isArabic && "flex-row-reverse")}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {t('doctorDashboard.sidebar.messages.summary.latestIndicators')}
                    </p>
                    <button className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest">
                      {t('doctorDashboard.sidebar.messages.fullRecord')}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: t('dashboard.glucose'), value: latestPrediction?.glucose || "--", unit: "mg/dL", color: latestPrediction?.glucose && latestPrediction.glucose > 140 ? "red" : "green" },
                      { label: t('dashboard.bmi'), value: latestPrediction?.bmi || "--", unit: "kg/m²", color: latestPrediction?.bmi && latestPrediction.bmi > 30 ? "red" : "green" },
                      { label: t('dashboard.bloodPressure'), value: latestPrediction?.blood_pressure || "--", unit: "mmHg", color: "blue" },
                      { label: t('dashboard.age'), value: latestPrediction?.age || "--", unit: isArabic ? "سنة" : "Years", color: "blue" },
                    ].map((ind, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-50 rounded-[1.75rem] transition-all hover:bg-white hover:shadow-lg hover:border-blue-100 group">
                        <p className={cn("text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors", isArabic && "text-right")}>{ind.label}</p>
                        <div className={cn("flex items-center justify-between", isArabic && "flex-row-reverse")}>
                          <p className="text-sm font-black text-slate-900 tracking-tight">
                            {ind.value} <span className="text-[10px] font-bold text-slate-400 ml-0.5">{ind.unit}</span>
                          </p>
                          <div className={cn("h-1.5 w-1.5 rounded-full ring-4 ring-opacity-10", `bg-${ind.color}-500 ring-${ind.color}-500`)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Recent Prediction History */}
                <div className={cn("space-y-5", isArabic && "text-right")}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                    {t('doctorDashboard.sidebar.messages.recentAssessments')}
                  </p>
                  <div className="space-y-3">
                    {patientProfile.predictions.slice(0, 3).map((pred) => (
                      <div key={pred.id} className={cn("p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer", isArabic && "flex-row-reverse")}>
                        <div className={cn("flex items-center gap-4", isArabic && "flex-row-reverse")}>
                          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center transition-colors", pred.risk_level?.toLowerCase() === 'high' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>
                            <Activity className="h-4.5 w-4.5" />
                          </div>
                          <div className={isArabic ? "text-right" : "text-left"}>
                            <p className="text-[11px] font-black text-slate-900 leading-tight">{new Date(pred.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}</p>
                            <p className={cn("text-[9px] font-black uppercase tracking-tighter mt-0.5", pred.risk_level?.toLowerCase() === 'high' ? "text-red-500" : "text-green-500")}>
                              {isArabic ? (pred.risk_level === 'High' ? 'خطورة عالية' : 'خطورة منخفضة') : `${pred.risk_level} Risk`} • {Math.round(pred.probability)}%
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className={cn("h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors", isArabic && "rotate-[-90deg]")} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Action Button */}
                <div className="pt-4">
                  <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 group">
                    <FileText className={cn("h-4 w-4 group-hover:scale-110 transition-transform", isArabic ? "ml-2" : "mr-2")} />
                    {t('doctorDashboard.sidebar.messages.openRecord')}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-200">
                <UserIcon className="h-12 w-12 opacity-10 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {t('doctorDashboard.sidebar.messages.loadingContext')}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
