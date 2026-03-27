import { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Phone, Video, Image, Smile, Paperclip, Mic, X, Play, Pause, Square, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import { users } from '@/data/mockData';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
  type: 'text' | 'image' | 'audio';
  mediaUrl?: string;
  audioDuration?: number;
}

const conversations = users.slice(0, 5).map((u, i) => ({
  user: u,
  lastMessage: ['Hey! How are you? 😊', 'That photo is amazing!', 'See you tomorrow 🎉', 'Thanks for sharing!', 'LOL 😂'][i],
  time: ['2m', '15m', '1h', '3h', '1d'][i],
  unread: i < 2,
  online: i < 3,
}));

const demoMessagesMap: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hey! Love your latest post 📸', fromMe: false, time: '2:30 PM', type: 'text' },
    { id: '2', text: 'Thank you so much! 😊', fromMe: true, time: '2:31 PM', type: 'text' },
    { id: '3', text: 'Where was that photo taken?', fromMe: false, time: '2:32 PM', type: 'text' },
    { id: '4', text: 'Santorini! You should visit sometime', fromMe: true, time: '2:33 PM', type: 'text' },
    { id: '5', text: "It's on my bucket list! 🏝️", fromMe: false, time: '2:34 PM', type: 'text' },
  ],
  '2': [
    { id: '1', text: 'That latte art is incredible!', fromMe: true, time: '1:00 PM', type: 'text' },
    { id: '2', text: 'Thanks! Took me months to learn 😅', fromMe: false, time: '1:02 PM', type: 'text' },
  ],
};

const emojis = ['😊', '😂', '❤️', '🔥', '👍', '😍', '🎉', '💯', '🙏', '✨', '😎', '🤔', '👋', '💪', '🌟', '😘'];

// Audio message component
const AudioMessage = ({ url, duration, fromMe }: { url: string; duration?: number; fromMe: boolean }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    const onEnd = () => { setPlaying(false); setProgress(0); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnd); };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <audio ref={audioRef} src={url} preload="metadata" />
      <button onClick={toggle} className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${fromMe ? 'bg-accent-foreground/20' : 'bg-foreground/10'}`}>
        {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
      </button>
      <div className="flex-1">
        <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
          <div className="h-full bg-current rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] mt-0.5 opacity-60">{duration ? `0:${String(Math.round(duration)).padStart(2, '0')}` : '0:00'}</p>
      </div>
    </div>
  );
};

// Conversation list component
const ConversationList = ({ onSelect }: { onSelect: (c: typeof conversations[0]) => void }) => {
  const navigate = useNavigate();
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
            <button key={i} onClick={() => onSelect(conv)} className="flex w-full items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors">
              <div className="relative">
                <img src={conv.user.avatar} alt="" className="h-12 w-12 rounded-full" />
                {conv.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />}
              </div>
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

// Chat view component
const ChatView = ({ conv, onBack }: { conv: typeof conversations[0]; onBack: () => void }) => {
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>(demoMessagesMap[conv.user.id] || [{ id: '1', text: 'Hey there! 👋', fromMe: false, time: 'Just now', type: 'text' }]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), text: newMsg, fromMe: true, time: now, type: 'text' }]);
    setNewMsg('');
    setShowEmoji(false);

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replies = ['That sounds great! 😊', 'Haha love it!', 'Nice! 🔥', 'Tell me more!', '👍', 'Absolutely! 💯', 'No way! 😮'];
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        fromMe: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      }]);
    }, 1200 + Math.random() * 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), text: '', fromMe: true, time: now, type: 'image', mediaUrl: url }]);
    toast.success('Image sent!');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { id: Date.now().toString(), text: '', fromMe: true, time: now, type: 'audio', mediaUrl: url, audioDuration: recordingTime }]);
        setRecordingTime(0);
        toast.success('Voice message sent!');
      };
      mr.start();
      setRecording(true);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current?.stop();
    chunksRef.current = [];
    setRecording(false);
    setRecordingTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const deleteMessage = (id: string) => setMessages(prev => prev.filter(m => m.id !== id));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DesktopSidebar />
      <div className="md:ml-[72px] xl:ml-[245px] flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 flex-shrink-0">
          <button onClick={onBack}><ChevronLeft size={24} /></button>
          <div className="relative">
            <img src={conv.user.avatar} alt="" className="h-8 w-8 rounded-full" />
            {conv.online && <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{conv.user.username}</p>
            <p className="text-[11px] text-muted-foreground">{conv.online ? 'Active now' : 'Active 2h ago'}</p>
          </div>
          <Phone size={20} strokeWidth={1.5} className="text-foreground cursor-pointer" />
          <Video size={20} strokeWidth={1.5} className="text-foreground ml-2 cursor-pointer" />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 group relative ${msg.fromMe ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground'}`}>
                {msg.type === 'image' && msg.mediaUrl ? (
                  <img src={msg.mediaUrl} alt="" className="rounded-lg max-w-full" />
                ) : msg.type === 'audio' && msg.mediaUrl ? (
                  <AudioMessage url={msg.mediaUrl} duration={msg.audioDuration} fromMe={msg.fromMe} />
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1 ${msg.fromMe ? 'text-accent-foreground/60' : 'text-muted-foreground'}`}>{msg.time}</p>
                {msg.fromMe && (
                  <button onClick={() => deleteMessage(msg.id)} className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-destructive/10">
                    <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmoji && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-border bg-card overflow-hidden">
              <div className="flex flex-wrap gap-2 p-3 max-w-[470px] mx-auto">
                {emojis.map(e => (
                  <button key={e} onClick={() => setNewMsg(prev => prev + e)} className="text-xl hover:scale-125 transition-transform p-1">{e}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="border-t border-border bg-card p-3 mb-16 md:mb-0 flex-shrink-0">
          <div className="flex items-center gap-2 max-w-[470px] mx-auto">
            {recording ? (
              <>
                <button onClick={cancelRecording} className="p-2"><X size={20} className="text-destructive" /></button>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-destructive">Recording {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}</span>
                </div>
                <button onClick={stopRecording} className="rounded-full bg-accent p-2"><Send size={16} className="text-accent-foreground" /></button>
              </>
            ) : (
              <>
                <button onClick={() => setShowEmoji(!showEmoji)}>
                  <Smile size={24} className="text-muted-foreground flex-shrink-0" />
                </button>
                <input
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Message..."
                  className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
                />
                <button onClick={() => fileRef.current?.click()}>
                  <Paperclip size={20} className="text-muted-foreground flex-shrink-0" />
                </button>
                <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                {newMsg.trim() ? (
                  <button onClick={sendMessage} className="rounded-full bg-accent p-2"><Send size={16} className="text-accent-foreground" /></button>
                ) : (
                  <button onClick={startRecording} className="p-1"><Mic size={22} className="text-muted-foreground hover:text-accent transition-colors" /></button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<typeof conversations[0] | null>(null);

  if (selectedChat) {
    return <ChatView conv={selectedChat} onBack={() => setSelectedChat(null)} />;
  }
  return <ConversationList onSelect={setSelectedChat} />;
};

export default Messages;
