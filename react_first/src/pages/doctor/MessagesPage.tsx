import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useApiCall } from "@/hooks/useApiCall";
import { API_ENDPOINTS } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  User,
  Calendar,
  Pill,
  Sparkles,
  ArrowUpRight,
  X,
  Bot,
  ChevronDown,
  TrendingUp,
  Clock,
  MoreVertical
} from "lucide-react";
import LoadingDots from "@/components/shared/LoadingDots";

interface Message {
  id: string | number;
  sender: 'doctor' | 'patient' | 'ai';
  content: string;
  time: string;
  status: 'sent' | 'delivered' | 'seen';
}

interface Conversation {
  id: string | number;
  patient_name: string;
  patient_id: string;
  last_message: string;
  time: string;
  unread_count: number;
  online: boolean;
  risk_level: 'High' | 'Medium' | 'Low';
  avatar?: string;
  age?: string;
  gender?: string;
}

export default function MessagesPage() {
  const { i18n } = useTranslation();
  const apiCall = useApiCall();
  const isArabic = i18n.language === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock Data
  const mockConversations: Conversation[] = [
    {
      id: 1,
      patient_name: "Ahmed Ali",
      patient_id: "#P1001",
      last_message: "Doctor, I uploaded new glucose readings. Please check and advise.",
      time: "2m ago",
      unread_count: 3,
      online: true,
      risk_level: 'High',
      age: "35",
      gender: "Male"
    },
    {
      id: 2,
      patient_name: "Fatma Hassan",
      patient_id: "#P1002",
      last_message: "Thank you doctor, I will follow your advice.",
      time: "15m ago",
      unread_count: 1,
      online: false,
      risk_level: 'Medium',
      age: "42",
      gender: "Female"
    },
    {
      id: 3,
      patient_name: "Mohamed Tarek",
      patient_id: "#P1003",
      last_message: "When should I take the next test?",
      time: "1h ago",
      unread_count: 0,
      online: true,
      risk_level: 'Low',
      age: "29",
      gender: "Male"
    },
    {
      id: 4,
      patient_name: "Nour Ahmed",
      patient_id: "#P1004",
      last_message: "I have been feeling dizzy since yesterday.",
      time: "2h ago",
      unread_count: 2,
      online: false,
      risk_level: 'High',
      age: "51",
      gender: "Female"
    },
    {
      id: 5,
      patient_name: "Omar Samir",
      patient_id: "#P1005",
      last_message: "Okay, I will schedule the appointment.",
      time: "Yesterday",
      unread_count: 0,
      online: false,
      risk_level: 'Medium',
      age: "38",
      gender: "Male"
    }
  ];

  const mockMessages: Message[] = [
    {
      id: 1,
      sender: 'patient',
      content: "Doctor, I uploaded new glucose readings. Please check and advise.",
      time: "10:02 AM",
      status: 'seen'
    },
    {
      id: 2,
      sender: 'doctor',
      content: "Thanks Ahmed, I will review your readings and get back to you shortly.",
      time: "10:03 AM",
      status: 'seen'
    },
    {
      id: 3,
      sender: 'ai',
      content: "I've analyzed the latest data. Glucose levels are higher than normal. Consider medication adjustment and lifestyle modifications.",
      time: "10:04 AM",
      status: 'seen'
    },
    {
      id: 4,
      sender: 'patient',
      content: "I have been feeling more tired than usual, is that related?",
      time: "10:05 AM",
      status: 'seen'
    },
    {
      id: 5,
      sender: 'doctor',
      content: "Yes, it could be related to higher glucose levels. Please make sure to follow your diet and medication plan.",
      time: "10:06 AM",
      status: 'seen'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setConversations(mockConversations);
      setSelectedConv(mockConversations[0]);
      setMessages(mockMessages);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      sender: 'doctor',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const getRiskBadgeStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'low': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4 overflow-hidden animate-in fade-in duration-700 bg-slate-50/30 p-2">
      {/* COLUMN 1: CONVERSATIONS SIDEBAR */}
      <Card className="w-[300px] flex flex-col border border-slate-200/60 shadow-sm rounded-3xl bg-white overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Messages</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative group mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 h-9 bg-slate-50/50 border-slate-200/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-blue-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread', count: 5 },
              { id: 'highRisk', label: 'High Risk' },
              { id: 'followUp', label: 'Follow-up' }
            ].map((f) => (
              <button 
                key={f.id} 
                onClick={() => setActiveFilter(f.id)}
                className={`rounded-full px-3.5 py-1.5 whitespace-nowrap text-[11px] font-bold transition-all border ${activeFilter === f.id ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                {f.label}
                {f.count && <span className={`ml-1.5 ${activeFilter === f.id ? 'text-white/80' : 'text-blue-600'}`}>{f.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 group relative border ${selectedConv?.id === conv.id ? 'bg-blue-50/40 border-blue-100/50 shadow-sm' : 'hover:bg-slate-50/80 border-transparent'}`}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                      {conv.patient_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 truncate text-[12.5px]">{conv.patient_name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{conv.time}</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 truncate group-hover:text-slate-600 leading-tight mb-2">{conv.last_message}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`px-1.5 py-0 h-3.5 text-[7.5px] font-black uppercase border tracking-wider rounded-md shadow-none ${getRiskBadgeStyles(conv.risk_level)}`}>
                      {conv.risk_level} RISK
                    </Badge>
                  </div>
                </div>
                {conv.unread_count > 0 && selectedConv?.id !== conv.id && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <span className="text-[8px] font-black text-white">{conv.unread_count}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 bg-slate-50/30 mt-auto border-t border-slate-100">
          <Button variant="ghost" className="w-full text-slate-500 font-bold text-[11px] hover:bg-white hover:text-blue-600 hover:shadow-sm py-4 rounded-xl transition-all">
            Load more conversations
          </Button>
        </div>
      </Card>

      {/* COLUMN 2: CENTER CHAT AREA */}
      <Card className="flex-1 flex flex-col border border-slate-200/60 shadow-sm rounded-3xl bg-white overflow-hidden relative">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="h-[72px] px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <Avatar className="h-11 w-11 border border-slate-100 shadow-sm">
                    <AvatarFallback className="bg-slate-50 text-slate-900 font-bold text-sm">
                      {selectedConv.patient_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">{selectedConv.patient_name}</h3>
                    <Badge className="bg-red-50 text-red-600 border-red-100 px-1.5 py-0 h-4 text-[8px] font-black uppercase tracking-wider rounded-md">HIGH RISK</Badge>
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{selectedConv.age} years, {selectedConv.gender}</span>
                    <span className="h-1 w-1 bg-slate-200 rounded-full" />
                    <span>ID: {selectedConv.patient_id}</span>
                    <span className="h-1 w-1 bg-slate-200 rounded-full" />
                    <span className="text-blue-600 font-black">AI Prediction: 82%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Button variant="outline" className="rounded-xl h-9 px-4 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-[11px] gap-2 transition-all">
                  <FileText className="h-3.5 w-3.5" />
                  View Report
                </Button>
                <Button className="rounded-xl h-9 px-4 bg-blue-600 text-white hover:bg-blue-700 font-bold text-[11px] gap-2 shadow-lg shadow-blue-600/15 transition-all">
                  <Video className="h-3.5 w-3.5" />
                  Start Consultation
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                  <MoreHorizontal className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>

            {/* Emergency Alert Banner */}
            <div className="bg-red-50/60 h-10 px-6 flex items-center justify-between border-b border-red-100/30 animate-in slide-in-from-top-full duration-700 shrink-0">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest">
                  Critical indicators detected in latest prediction
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-[9px] font-black text-red-600 hover:underline uppercase tracking-widest">View Details</button>
                <X className="h-3.5 w-3.5 text-red-300 hover:text-red-500 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Messages Scroll Area */}
            <ScrollArea className="flex-1 bg-slate-50/20 px-6" ref={scrollRef}>
              <div className="py-6 space-y-5 max-w-3xl mx-auto w-full">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3.5 ${msg.sender === 'doctor' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender !== 'doctor' && (
                      <Avatar className={`h-9 w-9 shrink-0 border border-slate-100 shadow-sm ${msg.sender === 'ai' ? 'bg-purple-600' : ''}`}>
                        {msg.sender === 'ai' ? (
                          <div className="h-full w-full flex items-center justify-center text-white">
                            <Bot className="h-4.5 w-4.5" />
                          </div>
                        ) : (
                          <AvatarFallback className="bg-slate-200 text-[10px] font-bold text-slate-600">
                            AH
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <div className={`p-3.5 px-4.5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] text-[12.5px] font-medium leading-relaxed ${
                        msg.sender === 'doctor' ? 'bg-slate-900 text-white rounded-tr-none' : 
                        msg.sender === 'ai' ? 'bg-purple-50/80 text-purple-900 border border-purple-100/50 rounded-tl-none' : 
                        'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}>
                        {msg.sender === 'ai' && (
                          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-purple-200/40">
                            <Sparkles className="h-3 w-3 text-purple-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest">AI Insights</span>
                          </div>
                        )}
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-60">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{msg.time}</span>
                        {msg.sender === 'doctor' && (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center gap-2.5 px-1 py-2">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-blue-500/40 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-blue-500/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-blue-500/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest italic">
                    Ahmed Ali is typing...
                  </span>
                </div>
              </div>
            </ScrollArea>

            {/* Chat Footer / Input Area */}
            <div className="p-6 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3.5 bg-slate-50/50 p-2.5 pl-4 rounded-2xl border border-slate-200/60 group focus-within:ring-4 focus-within:ring-blue-100/20 focus-within:border-blue-300 transition-all mb-4">
                <Button variant="ghost" size="icon" className="h-8.5 w-8.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Paperclip className="h-4.5 w-4.5" />
                </Button>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none outline-none text-[12.5px] font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
                />
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8.5 w-8.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Smile className="h-4.5 w-4.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8.5 w-8.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Mic className="h-4.5 w-4.5" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  className="h-10 px-5 bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg shadow-slate-900/10 font-bold gap-2 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </Button>
              </div>

              {/* AI Suggested Replies */}
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full border border-purple-100/60 shrink-0">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Suggested</span>
                </div>
                {[
                  "Schedule follow-up", 
                  "Recommend new test", 
                  "Approve medication",
                  "Encourage lifestyle changes"
                ].map((s, i) => (
                  <button key={i} className="px-4 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-slate-600 rounded-full border border-slate-200 text-[10px] font-bold whitespace-nowrap transition-all shadow-sm">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 p-20">
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 opacity-20" />
            </div>
            <p className="text-sm font-black text-slate-300 tracking-widest uppercase">Select a conversation to start chatting</p>
          </div>
        )}
      </Card>

      {/* COLUMN 3: PATIENT SUMMARY PANEL */}
      <Card className="w-[340px] flex flex-col border border-slate-200/60 shadow-sm rounded-3xl bg-white overflow-hidden shrink-0">
        <div className="h-[72px] px-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-[14px] font-black text-slate-900 tracking-widest uppercase">Patient Summary</h2>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 rounded-lg"><MoreHorizontal className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 rounded-lg"><ChevronDown className="h-4 w-4" /></Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8 pb-10">
            {/* 1. Risk Status */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Risk Status</p>
              <div className="flex items-end justify-between gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                <div>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">82%</span>
                    <Badge className="bg-red-50 text-red-600 border-red-100 px-2 py-0.5 text-[8px] font-black uppercase rounded-md">High Risk</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-red-500">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-[9px] font-bold">Increasing risk (+4%)</span>
                  </div>
                </div>
                <div className="flex-1 h-12 flex items-end gap-1 px-1">
                  {[30, 45, 40, 55, 60, 50, 75, 82].map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-sm transition-all duration-500 ${i === 7 ? 'bg-red-500' : 'bg-red-200/40'}`} 
                      style={{ height: `${h}%` }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Latest Indicators Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Latest Indicators</p>
                <button className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-wider">View History</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Glucose", value: "190", unit: "mg/dL", color: "red" },
                  { label: "Blood Pressure", value: "140/90", unit: "mmHg", color: "orange" },
                  { label: "BMI", value: "35.2", color: "red" },
                  { label: "Insulin", value: "180", unit: "µU/mL", color: "red" },
                  { label: "Skin", value: "32", unit: "mm", color: "orange" },
                  { label: "Age", value: "35", color: "green" },
                ].map((ind, i) => (
                  <div key={i} className="p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100/50 transition-all hover:border-slate-200">
                    <p className="text-[8.5px] font-bold text-slate-400 uppercase leading-none mb-2">{ind.label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[12.5px] font-black text-slate-900 tracking-tight">
                        {ind.value} <span className="text-[9px] font-medium text-slate-400 ml-0.5">{ind.unit}</span>
                      </p>
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        ind.color === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                        ind.color === 'orange' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Last AI Prediction */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Predictions</p>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8.5 w-8.5 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">May 7, 02:15 PM</p>
                      <p className="text-[9px] font-bold text-red-500 uppercase tracking-tighter mt-0.5">82% High Risk</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-blue-600"><ArrowUpRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {/* 4. Current Medications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Medications</p>
                <button className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-wider">All (4)</button>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: "Metformin 500mg", dosage: "2x daily • After meal" },
                  { name: "Glimepiride 2mg", dosage: "1x daily • With meal" },
                ].map((med, i) => (
                  <div key={i} className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3.5 shadow-sm hover:border-slate-200 transition-all cursor-pointer group">
                    <div className="w-8.5 h-8.5 rounded-xl bg-blue-50/80 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11.5px] font-black text-slate-900 leading-tight">{med.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">{med.dosage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Last Review */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Doctor Review</p>
              <div className="p-4 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Approved</p>
                  </div>
                  <p className="text-[9px] font-bold text-white/50 uppercase">May 6</p>
                </div>
                <p className="text-[11px] font-medium text-white/80 leading-relaxed italic">"Continue current medication. Repeat test in 2 weeks."</p>
              </div>
            </div>

            {/* 6. Upcoming Appointment */}
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Appointment</p>
              <div className="p-4 bg-blue-50/50 border border-blue-100/60 rounded-2xl flex items-center justify-between transition-all hover:bg-blue-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11.5px] font-black text-slate-900 leading-tight">Follow-up Call</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">May 14 • 10:30 AM</p>
                  </div>
                </div>
                <Badge className="bg-white text-blue-600 border-blue-100 px-2 py-0 h-4 text-[7px] font-black uppercase rounded-md shadow-sm">Confirmed</Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
