import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Mail, MessageCircle, Send, Loader2, X } from "lucide-react";
import Header from "@/components/Shared/Header";
import Footer from "@/components/Shared/Footer";
import { useIsVisible } from "@/hooks/useIsVisible";
import { useAuth } from "@/hooks/useAuth";
import { apiCall } from "@/lib/api";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [predictionId, setPredictionId] = useState<number | null>(null);

  // scroll animation refs
  const heroRef = useRef();
  const faqRef = useRef();
  const contactRef = useRef();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const heroVisible = useIsVisible(heroRef);
  const faqVisible = useIsVisible(faqRef);
  const contactVisible = useIsVisible(contactRef);

  const { user } = useAuth();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialize chat with last prediction
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      loadLastPrediction();
    }
  }, [isChatOpen]);

  const faqs = [
    {
      question: "Is the AI diagnosis a replacement for a doctor?",
      answer:
        "No, HealthAI is a powerful tool designed to provide preliminary insights and information based on your symptoms...",
    },
    {
      question: "How secure is my medical data?",
      answer:
        "Your privacy and security are our top priorities...",
    },
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password?' link...",
    },
    {
      question: "Can I download my reports?",
      answer:
        "Yes! You can download your health reports in PDF format...",
    },
  ];

  const loadLastPrediction = async () => {
    try {
      // Get last prediction from localStorage or API
      const storedPredictions = localStorage.getItem("predictions");
      if (storedPredictions) {
        const predictions = JSON.parse(storedPredictions);
        if (predictions.length > 0) {
          const lastPred = predictions[0];
          setPredictionId(lastPred.id);
          
          // Add welcome message
          setMessages([
            {
              role: "assistant",
              content: `مرحباً! أنا مساعدك الطبي الذكي. لدي نتيجة تحليلك الأخيرة (${lastPred.probability.toFixed(1)}% - ${lastPred.risk_level}). كيف يمكنني مساعدتك؟`,
            },
          ]);
          return;
        }
      }

      // If no stored predictions, try to fetch from API
      if (user) {
        try {
          const data = await apiCall<{ predictions: any[] }>(
            `${import.meta.env.VITE_API_URL}/api/predictions/`,
            { method: "GET" }
          );
          if (data.predictions && data.predictions.length > 0) {
            const lastPred = data.predictions[0];
            setPredictionId(lastPred.id);
            setMessages([
              {
                role: "assistant",
                content: `مرحباً! أنا مساعدك الطبي الذكي. لدي نتيجة تحليلك الأخيرة (${lastPred.probability.toFixed(1)}% - ${lastPred.risk_level}). كيف يمكنني مساعدتك؟`,
              },
            ]);
            return;
          }
        } catch (err) {
          console.warn("Could not fetch predictions");
        }
      }

      // Default welcome message
      setMessages([
        {
          role: "assistant",
          content: "مرحباً! أنا مساعدك الطبي الذكي. اسألني أي سؤال عن السكري، التحاليل، أو صحتك العامة.",
        },
      ]);
    } catch (error) {
      console.error("Error loading prediction:", error);
      setMessages([
        {
          role: "assistant",
          content: "مرحباً! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك؟",
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // If we don't have a prediction ID, use a default one or create context
      const predId = predictionId || 1;

      const response = await apiCall<{
        bot_response: string;
        conversation_id: number;
      }>(`${import.meta.env.VITE_API_URL}/api/chatbot/`, {
        method: "POST",
        body: JSON.stringify({
          prediction_id: predId,
          message: userMsg,
          conversation_id: conversationId || undefined,
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.bot_response,
          timestamp: response.conversation_id ? new Date().toISOString() : undefined,
        },
      ]);

      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      
      // Fallback response if chatbot is disabled
      const fallbackResponses: Record<string, string> = {
        "ليه": "النسبة بتتعتمد على عوامل كتير زي الجلوكوز، BMI، العمر، والعامل الوراثي.",
        "ازاي": "من خلال تحليل البيانات الطبية بتاعتك ومقارنتها بآلاف الحالات المشابهة.",
        "خطير": "مستوى الخطر بيتحدد بناءً على النسبة. لو النسبة فوق 50% ينصح بمراجعة طبيب.",
        "علاج": "الخطوات الأساسية: نظام غذائي صحي، رياضة منتظمة، ومتابعة مع طبيب.",
      };

      let fallback = "عذراً، هناك مشكلة تقنية حالياً. يرجى المحاولة لاحقاً أو استشارة طبيب.";
      
      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (userMsg.toLowerCase().includes(key)) {
          fallback = value;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallback + " (Chatbot معطل مؤقتاً)",
        },
      ]);
      
      toast.error("Chatbot غير متاح حالياً");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    // Don't clear messages - keep them for next time
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">

          {/* HERO SECTION */}
          <div
            ref={heroRef}
            className={`text-center mb-12 transition-all duration-700 ease-out`}
          >
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find quick answers to common questions or reach out to our
              dedicated support team.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search your question here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6"
              />
            </div>
          </div>

          {/* FAQ SECTION */}
          <div
            ref={faqRef}
            className={`mb-16 transition-all duration-700 ease-out delay-100
              ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CONTACT SECTION */}
          <div
            ref={contactRef}
            className={`transition-all duration-700 ease-out delay-200
              ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              Still have questions?
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Our team is here to help you.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-accent/30 p-8 rounded-lg text-center hover:bg-cyan-50 transition-all duration-200">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Get a detailed response within 24 hours.
                </p>
                <a
                  href="mailto:support@healthai.com"
                  className="text-primary hover:underline"
                >
                  support@healthai.com
                </a>
              </div>

              <div className="bg-accent/30 p-8 rounded-lg text-center hover:bg-cyan-50 transition-all duration-200">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Chat with AI medical assistant instantly.
                </p>
                <Button onClick={() => setIsChatOpen(true)}>
                  Start Chat
                </Button>
              </div>
            </div>

            {/* Additional Links */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold text-center mb-4">
                صفحات مهمة
              </h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  📋 سياسة الخصوصية
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  📄 شروط الخدمة
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  📞 اتصل بنا
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CHAT MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">المساعد الطبي الذكي</DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {predictionId ? "متصل بتحليلك الأخير" : "وضع عام"}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-accent rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        جاري الكتابة...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="px-6 py-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب سؤالك هنا..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              ⚠️ هذا مساعد ذكي ولا يغني عن استشارة طبيب متخصص
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Help;
