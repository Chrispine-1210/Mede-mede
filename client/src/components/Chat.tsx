import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatProps {
  orderId?: string;
  role?: string;
  title?: string;
}

export function Chat({ orderId, role, title = "Support Chat" }: ChatProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/chat", orderId, role],
    refetchInterval: 3000, // Poll every 3 seconds for real-time feel
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      await apiRequest("POST", "/api/chat", {
        content: text,
        orderId,
        role: role === "admin" ? "admin" : undefined,
      });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat", orderId, role] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMessageMutation.mutate(content);
  };

  return (
    <Card className="flex flex-col h-[400px] shadow-lg">
      <CardHeader className="py-3 border-b bg-primary/5">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.senderId === user?.id
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-muted-foreground rounded-tl-none"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {new Date(msg.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="p-3 border-t bg-background flex gap-2">
          <Input
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={sendMessageMutation.isPending}
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button size="icon" type="submit" disabled={sendMessageMutation.isPending || !content.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
