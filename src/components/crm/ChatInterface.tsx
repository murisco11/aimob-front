import { useState } from "react";
import { Send, Sparkles, Bot, Instagram, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Lead, Message, messages as mockMessages } from "@/data/mockData";

interface ChatInterfaceProps {
  lead: Lead;
}

const ChatInterface = ({ lead }: ChatInterfaceProps) => {
  const [autopilot, setAutopilot] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
              {lead.avatar}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-card" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">{lead.name}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {lead.origin === "instagram" ? (
                <><Instagram className="w-3 h-3 text-pink-500" /> Instagram DM</>
              ) : (
                <><MessageCircle className="w-3 h-3 text-green-500" /> WhatsApp</>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-card-foreground">AI Autopilot</span>
            <Switch checked={autopilot} onCheckedChange={setAutopilot} className="scale-75" />
          </div>
        </div>
      </div>

      {/* AI Summary Card */}
      <div className="mx-4 mt-3 p-3.5 bg-primary/5 border border-primary/15 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">AI Lead Summary</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Budget</p>
            <p className="text-sm font-medium text-card-foreground mt-0.5">{lead.budget}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Preferred Area</p>
            <p className="text-sm font-medium text-card-foreground mt-0.5">{lead.neighborhood}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {mockMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "lead" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${
                msg.sender === "lead"
                  ? "bg-chat-other text-chat-other-foreground rounded-bl-md"
                  : msg.sender === "ai"
                  ? "bg-primary/10 text-card-foreground rounded-br-md border border-primary/20"
                  : "bg-chat-self text-chat-self-foreground rounded-br-md"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="flex items-center gap-1 mb-1">
                  <Bot className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">AI Auto-reply</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${
                msg.sender === "lead" ? "text-muted-foreground" : msg.sender === "ai" ? "text-muted-foreground" : "text-chat-self-foreground/70"
              }`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none"
          />
          <button className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
