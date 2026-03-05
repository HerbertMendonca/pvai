import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Search, Phone, Info, MoreVertical, Paperclip, Smile, Check, CheckCheck, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";

interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  status: "online" | "offline";
}

interface Message {
  id: string;
  sender: "user" | "contact";
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export default function WhatsApp() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConversation]);

  const conversations: Conversation[] = [
    { id: "1", name: "João Silva", phone: "(11) 98765-4321", lastMessage: "Obrigado pela resposta!", timestamp: "14:32", unread: 2, avatar: "JS", status: "online" },
    { id: "2", name: "Maria Santos", phone: "(11) 99876-5432", lastMessage: "Quando posso receber?", timestamp: "13:15", unread: 0, avatar: "MS", status: "online" },
    { id: "3", name: "Carlos Oliveira", phone: "(11) 97654-3210", lastMessage: "Perfeito, obrigado!", timestamp: "11:42", unread: 0, avatar: "CO", status: "offline" },
    { id: "4", name: "Ana Paula", phone: "(11) 96543-2109", lastMessage: "Pode me enviar o boleto?", timestamp: "Ontem", unread: 5, avatar: "AP", status: "online" },
    { id: "5", name: "Ricardo Souza", phone: "(11) 95432-1098", lastMessage: "Vou verificar aqui.", timestamp: "Ontem", unread: 0, avatar: "RS", status: "offline" },
  ];

  const messages: Message[] = [
    { id: "1", sender: "contact", content: "Olá, tudo bem? Gostaria de saber sobre o status do meu pedido de proteção.", timestamp: "14:20", status: "read" },
    { id: "2", sender: "user", content: "Oi João! Tudo bem sim. Seu pedido está em fase final de análise técnica.", timestamp: "14:21", status: "read" },
    { id: "3", sender: "contact", content: "Entendi. Tem alguma previsão de quando será ativado?", timestamp: "14:25", status: "read" },
    { id: "4", sender: "user", content: "A previsão é que até o final do dia de hoje já esteja tudo ok. Te aviso por aqui!", timestamp: "14:28", status: "read" },
    { id: "5", sender: "contact", content: "Obrigado pela resposta! Fico no aguardo.", timestamp: "14:32", status: "read" },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-slate-50/50 overflow-hidden">
        {/* Lista de Conversas - Compacta */}
        <div className="w-80 border-r bg-white flex flex-col flex-shrink-0">
          <div className="p-3 border-b space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                Mensagens
              </h2>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Buscar conversa..."
                className="pl-8 h-8 text-xs bg-slate-50 border-0 focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-1.5 space-y-0.5">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left p-2 rounded-lg transition-all group ${
                    selectedConversation === conv.id
                      ? "bg-slate-100 shadow-sm"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarFallback className="bg-green-50 text-green-700 font-bold text-xs">
                          {conv.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conv.status === 'online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="text-xs font-bold text-slate-900 truncate">{conv.name}</p>
                        <span className="text-[10px] font-medium text-slate-400">{conv.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] text-slate-500 truncate font-medium max-w-[140px]">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="h-4 min-w-[16px] px-1 bg-green-500 text-white text-[9px] border-0 flex items-center justify-center">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Área do Chat - Alta Densidade */}
        <div className="flex-1 flex flex-col bg-[#efeae2] relative">
          {/* Wallpaper pattern overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://wweb.dev/resources/whatsapp-chat-wallpaper.png')] bg-repeat" />
          
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="h-14 border-b px-4 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border shadow-sm">
                    <AvatarFallback className="bg-green-50 text-green-700 font-bold text-xs">
                      {selectedConv.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedConv.name}</h3>
                    <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider">
                      {selectedConv.status === 'online' ? 'Online' : 'Visto por último hoje'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><Phone className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><Search className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><MoreVertical className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full" ref={scrollRef}>
                  <div className="p-4 space-y-2 max-w-3xl mx-auto">
                    <div className="flex justify-center mb-4">
                      <Badge variant="secondary" className="bg-white/80 text-slate-500 text-[10px] font-bold border-0 shadow-sm px-3">
                        HOJE
                      </Badge>
                    </div>
                    
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] px-2.5 py-1.5 rounded-lg shadow-sm relative group ${
                            msg.sender === "user"
                              ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none"
                              : "bg-white text-slate-800 rounded-tl-none"
                          }`}
                        >
                          <p className="text-[12px] leading-relaxed pr-12">{msg.content}</p>
                          <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              {msg.timestamp}
                            </span>
                            {msg.sender === "user" && (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area - Compacta */}
              <div className="p-2.5 bg-[#f0f2f5] border-t z-10">
                <div className="max-w-4xl mx-auto flex items-center gap-2">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-green-600"><Smile className="w-5 h-5" /></Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-green-600"><Paperclip className="w-5 h-5" /></Button>
                  </div>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite uma mensagem..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="h-9 text-xs bg-white border-0 focus-visible:ring-1 shadow-sm rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!messageInput.trim()}
                    size="icon"
                    className={`h-9 w-9 rounded-full transition-all shadow-md ${
                      messageInput.trim() ? 'bg-green-600 text-white' : 'bg-slate-400 text-white'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-green-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-700">WhatsApp Web</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Selecione uma conversa para começar a gerenciar seus atendimentos em tempo real.
                </p>
              </div>
              <Badge variant="outline" className="bg-white text-green-600 border-green-200 px-3 py-1 font-bold">
                Conectado via n8n
              </Badge>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
