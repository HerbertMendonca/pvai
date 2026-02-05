import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Search, Phone, Info } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

interface Message {
  id: string;
  sender: "user" | "contact";
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export default function WhatsApp() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  // Sample conversations
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "João Silva",
      phone: "(11) 98765-4321",
      lastMessage: "Obrigado pela resposta!",
      timestamp: "14:32",
      unread: 2,
      avatar: "JS",
    },
    {
      id: "2",
      name: "Maria Santos",
      phone: "(11) 99876-5432",
      lastMessage: "Quando posso receber?",
      timestamp: "13:15",
      unread: 0,
      avatar: "MS",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      phone: "(11) 97654-3210",
      lastMessage: "Perfeito, obrigado!",
      timestamp: "11:42",
      unread: 0,
      avatar: "CO",
    },
  ];

  // Sample messages for selected conversation
  const messages: Message[] = [
    {
      id: "1",
      sender: "contact",
      content: "Olá, tudo bem?",
      timestamp: "14:20",
      status: "read",
    },
    {
      id: "2",
      sender: "user",
      content: "Oi! Tudo bem sim, e você?",
      timestamp: "14:21",
      status: "read",
    },
    {
      id: "3",
      sender: "contact",
      content: "Tudo ótimo! Gostaria de saber sobre o status do meu pedido",
      timestamp: "14:25",
      status: "read",
    },
    {
      id: "4",
      sender: "user",
      content: "Claro! Seu pedido está em processamento e será enviado em breve",
      timestamp: "14:28",
      status: "delivered",
    },
    {
      id: "5",
      sender: "contact",
      content: "Obrigado pela resposta!",
      timestamp: "14:32",
      status: "read",
    },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Send message via API
      setMessageInput("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">WhatsApp</h1>
        <p className="text-gray-600 mt-1">Gerencie suas conversas e mensagens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Conversas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar conversa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Conversations */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                      selectedConversation === conv.id
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-medium text-sm text-gray-900 truncate">{conv.name}</p>
                          <span className="text-xs text-gray-500 flex-shrink-0">{conv.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <div className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {selectedConv ? (
            <Card className="h-full flex flex-col">
              {/* Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {selectedConv.avatar}
                    </div>
                    <div>
                      <CardTitle>{selectedConv.name}</CardTitle>
                      <CardDescription>{selectedConv.phone}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite uma mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="gap-2 bg-green-500 hover:bg-green-600">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecione uma conversa para começar</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
