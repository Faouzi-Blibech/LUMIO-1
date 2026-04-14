import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sampleResponses = [
  "Based on your recent sessions, your focus tends to peak between 10-11 AM. Try scheduling your hardest subjects during that window! 📚",
  "I noticed you had a great study streak this week — 4 sessions with 80%+ focus! Keep it up, and you'll earn the **Focus Champion** badge soon. 🏆",
  "Here's a tip: Try the Pomodoro technique — 25 minutes of focused study followed by a 5-minute break. It works well for maintaining attention. ⏱️",
  "Your distraction patterns show that **fatigue** is the most common cause. Consider getting 8+ hours of sleep and taking short movement breaks between sessions. 💪",
  "Great question! Your average focus this week was **82%**, which is a 5% improvement from last week. You're on a positive trend! 📈",
];

interface ChatInterfaceProps {
  onClose: () => void;
}

export const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Hi there! 👋 I'm LUMIO, your AI study companion. Ask me anything about your focus, study tips, or progress!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: messages.length,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      const assistantMsg: Message = {
        id: messages.length + 1,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
            <img
              src="/assets/Logos/logo icon/lumio icon white.png"
              alt="LUMIO"
              className="w-5 h-5 object-contain"
            />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-foreground">LUMIO AI</h3>
            <p className="text-[11px] text-muted-foreground font-body flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-primary/10"
                  : "bg-secondary/10"
              }`}>
                {msg.role === "assistant" ? (
                  <Bot size={14} className="text-primary" />
                ) : (
                  <User size={14} className="text-secondary" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-body leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-muted/30 text-foreground rounded-tl-md"
                    : "bg-primary text-primary-foreground rounded-tr-md"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot size={14} className="text-primary" />
            </div>
            <div className="bg-muted/30 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border">
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
            placeholder="Ask LUMIO anything..."
            className="flex-1 h-10 px-4 rounded-xl bg-muted/30 border border-border text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="h-10 w-10 rounded-xl bg-gradient-primary hover:opacity-90 disabled:opacity-40"
          >
            <Send size={16} />
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground/60 font-body text-center mt-2">
          LUMIO is an AI assistant — responses are for educational support only.
        </p>
      </div>
    </div>
  );
};
