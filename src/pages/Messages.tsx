import { useState } from 'react';
import { Send, ChevronLeft, Phone, Video, Info, Image, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { users } from '@/data/mockData';

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

const conversations = users.slice(0, 4).map(u => ({
  user: u,
  lastMessage: 'Hey! How are you? 😊',
  time: '2h',
  unread: Math.random() > 0.5,
}));

const demoMessages: Message[] = [
  { id: '1', text: 'Hey! Love your latest post 📸', fromMe: false, time: '2:30 PM' },
  { id: '2', text: 'Thank you so much! 😊', fromMe: true, time: '2:31 PM' },
  { id: '3', text: 'Where was that photo taken?', fromMe: false, time: '2:32 PM' },
  { id: '4', text: 'Santorini! You should visit sometime', fromMe: true, time: '2:33 PM' },
  { id: '5', text: "It's on my bucket list! 🏝️", fromMe: false, time: '2:34 PM' },
];

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<typeof conversations[0] | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState(demoMessages);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: newMsg, fromMe: true, time: 'Now' }]);
    setNewMsg('');
  };

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <DesktopSidebar />
        <div className="md:ml-[72px] xl:ml-[245px] flex flex-col h-screen">
          {/* Chat header */}
          <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
            <button onClick={() => setSelectedChat(null)}><ChevronLeft size={24} /></button>
            <img src={selectedChat.user.avatar} alt="" className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{selectedChat.user.username}</p>
              <p className="text-[11px] text-muted-foreground">Active now</p>
            </div>
            <Phone size={20} strokeWidth={1.5} className="text-foreground" />
            <Video size={20} strokeWidth={1.5} className="text-foreground ml-2" />
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.fromMe ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.fromMe ? 'text-accent-foreground/60' : 'text-muted-foreground'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-3 mb-16 md:mb-0">
            <div className="flex items-center gap-2 max-w-[470px] mx-auto">
              <Smile size={24} className="text-muted-foreground flex-shrink-0" />
              <input
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Message..."
                className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <Image size={24} className="text-muted-foreground flex-shrink-0" />
              {newMsg.trim() && (
                <button onClick={sendMessage} className="text-accent font-semibold text-sm">Send</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px]">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="md:hidden"><ChevronLeft size={24} /></button>
            <h2 className="font-display font-bold text-lg">Messages</h2>
          </div>
        </header>
        <div className="max-w-[470px] mx-auto pb-20 md:pb-4">
          {conversations.map((conv, i) => (
            <button
              key={i}
              onClick={() => setSelectedChat(conv)}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors"
            >
              <img src={conv.user.avatar} alt="" className="h-12 w-12 rounded-full" />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">{conv.user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage} · {conv.time}</p>
              </div>
              {conv.unread && <div className="h-2 w-2 rounded-full bg-accent" />}
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Messages;
