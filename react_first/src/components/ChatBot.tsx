import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  Loader2,
  X,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiCall } from "@/lib/api";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [predictionId, setPredictionId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      loadLastPrediction();
    }
  }, [isChatOpen, messages.length]);

  const loadLastPrediction = async () => {
    try {
      const storedPredictions = localStorage.getItem("predictions");
      if (storedPredictions) {
        const predictions = JSON.parse(storedPredictions);
        if (predictions.length > 0) {
          const lastPred = predictions[0];
          setPredictionId(lastPred.id);

          setMessages([
            {
              role: "assistant",
              content: t("chatBot.welcomeWithPrediction", {
                probability: lastPred.probability.toFixed(1),
                riskLevel: lastPred.risk_level,
              }),
            },
          ]);
          return;
        }
      }

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
                content: t("chatBot.welcomeWithPrediction", {
                  probability: lastPred.probability.toFixed(1),
                  riskLevel: lastPred.risk_level,
                }),
              },
            ]);
            return;
          }
        } catch (err) {
          console.warn("Could not fetch predictions");
        }
      }

      setMessages([
        {
          role: "assistant",
          content: t("chatBot.welcomeDefault"),
        },
      ]);
    } catch (error) {
      console.error("Error loading prediction:", error);
      setMessages([
        {
          role: "assistant",
          content: t("chatBot.welcomeFallback"),
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
          timestamp: response.conversation_id
            ? new Date().toISOString()
            : undefined,
        },
      ]);

      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }
    } catch (error: any) {
      console.error("Chat error:", error);

      const fallbackResponses: Record<string, string> =
        i18n.language === "ar"
          ? {
              ليه: "النسبة بتتعتمد على عوامل كتير زي الجلوكوز، BMI، العمر، والعامل الوراثي.",
              ازاي:
                "من خلال تحليل البيانات الطبية بتاعتك ومقارنتها بآلاف الحالات المشابهة.",
              خطير:
                "مستوى الخطر بيتحدد بناءً على النسبة. لو النسبة فوق 50% ينصح بمراجعة طبيب.",
              علاج:
                "الخطوات الأساسية: نظام غذائي صحي، رياضة منتظمة، ومتابعة مع طبيب.",
            }
          : {
              why: "The percentage depends on several factors such as glucose, BMI, age, and family history.",
              how: "It works by analyzing your medical data and comparing it with thousands of similar cases.",
              serious:
                "Risk level is determined based on the percentage. If it is above 50%, it is recommended to consult a doctor.",
              treatment:
                "The main steps are a healthy diet, regular exercise, and follow-up with a doctor.",
            };

      let fallback = t("chatBot.fallbackError");

      for (const [key, value] of Object.entries(fallbackResponses)) {
        if (userMsg.toLowerCase().includes(key.toLowerCase())) {
          fallback = value;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallback + " " + t("chatBot.temporarilyDisabled"),
        },
      ]);

      toast.error(t("chatBot.unavailableToast"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-[999] h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 transition-all duration-200"
          aria-label={t("chatBot.openAriaLabel")}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isChatOpen && (
        <div
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          className={`fixed bottom-6 right-6 z-[999] w-[calc(100vw-2rem)] sm:w-[500px] bg-background border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col ${
            isMinimized ? "h-[76px]" : "h-[620px]"
          }`}
        >
          <div className="px-6 py-4 border-b bg-background shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold truncate">
                    {t("chatBot.title")}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {predictionId
                      ? t("chatBot.connectedToLastPrediction")
                      : t("chatBot.generalMode")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsMinimized((prev) => !prev)}
                  className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition"
                  aria-label={t("chatBot.minimizeAriaLabel")}
                >
                  <Minus className="h-4 w-4" />
                </button>

                <button
                  onClick={handleCloseChat}
                  className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition"
                  aria-label={t("chatBot.closeAriaLabel")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 px-6 py-4 min-h-0">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        {msg.timestamp && (
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString(
                              i18n.language === "ar" ? "ar-EG" : "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
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
                            {t("chatBot.typing")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="px-6 py-4 border-t shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={t("chatBot.inputPlaceholder")}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                    aria-label={t("chatBot.sendAriaLabel")}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-[4px] px-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span className="leading-tight break-words">
                    {t("chatBot.disclaimer")}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;