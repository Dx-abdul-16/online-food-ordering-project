import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, X, Send, Bot, User, 
  Loader2, Sparkles, ShoppingBag, Truck, Utensils 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: 'bot' | 'user';
  text: string;
  time: string;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      text: "Marhaba! 🕌 I'm your FoodExpress AI Assistant. Looking for a recommendation or checking an order?", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated AI Logic
    setTimeout(() => {
      let botResponse = "I'm processing that for you...";
      const lower = input.toLowerCase();

      if (lower.includes("recommend") || lower.includes("food") || lower.includes("eat")) {
        botResponse = "Our top recommendation today is the **Legendary Chicken Mandi** from Street Arabiya. It's smoky, tender, and authentic! 🍗";
      } else if (lower.includes("track") || lower.includes("order") || lower.includes("where")) {
        botResponse = "You can track your live orders in the **User Dashboard** under the 'Activity' tab. Would you like me to navigate you there? 🚚";
      } else if (lower.includes("hello") || lower.includes("hi")) {
        botResponse = "Hello! How can I assist your luxury dining experience today? 🕌";
      } else if (lower.includes("status")) {
        botResponse = "Current delivery status for order #FD-0004 is 'Out for Delivery'. Our partner is 2.4km away.";
      } else {
        botResponse = "I'm still learning! But I can help you find restaurants, track orders, or explain our menu items. 🥙";
      }

      const botMsg: Message = {
        role: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? "bg-red-500 rotate-90" : "bg-[#c9a84c]"
        }`}
      >
        {isOpen ? <X className="h-8 w-8 text-black" /> : <MessageSquare className="h-8 w-8 text-black" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
            1
          </span>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-[380px] h-[520px] bg-[#111111]/95 backdrop-blur-xl border-[#c9a84c]/30 shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
          <CardHeader className="bg-gradient-to-r from-[#c9a84c] to-[#8b6914] p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-black/20 flex items-center justify-center border border-black/10">
                <Bot className="h-6 w-6 text-black" />
              </div>
              <div>
                <CardTitle className="text-black text-lg font-black tracking-tighter">FOODEXPRESS AI</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">Always Online</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm relative ${
                  msg.role === 'user' 
                    ? "bg-[#c9a84c] text-black font-semibold rounded-br-none" 
                    : "bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] rounded-bl-none"
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] mt-1 block opacity-50 ${msg.role === 'user' ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-3 flex gap-1">
                  <span className="h-1.5 w-1.5 bg-[#c9a84c] rounded-full animate-bounce"></span>
                  <span className="h-1.5 w-1.5 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-4 border-t border-[#2a2a2a] bg-black/20">
            <div className="flex w-full gap-2 bg-[#0d0d0d] rounded-2xl border border-[#2a2a2a] p-1.5 focus-within:border-[#c9a84c]/50 transition-all">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your order..."
                className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-600 text-sm h-10"
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-[#c9a84c] hover:bg-[#b8943d] text-black rounded-xl h-10 w-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AIChatbot;
