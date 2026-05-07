import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApiCall } from "@/hooks/useApiCall";
import { API_ENDPOINTS } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingDots from "@/components/shared/LoadingDots";

export default function MessagesPage() {
  const { t } = useTranslation();
  const apiCall = useApiCall();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.DOCTOR_MESSAGES);
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [apiCall]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <h1 className="text-3xl font-bold">{t('doctorDashboard.sidebar.messages')}</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingDots />
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Contacts List */}
          <Card className="lg:col-span-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {messages.map((msg: any) => (
                <div key={msg.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                  <Avatar>
                    <AvatarImage src={msg.sender_picture} />
                    <AvatarFallback>{msg.sender_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium truncate">{msg.sender_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Window Placeholder */}
          <Card className="lg:col-span-2 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted-foreground text-center">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p>{t('doctorDashboard.selectMessage')}</p>
            </div>
            <div className="p-4 border-t flex gap-2">
              <Input placeholder={t('doctorDashboard.typeMessage')} />
              <Button size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
