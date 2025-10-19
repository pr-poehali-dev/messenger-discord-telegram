import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Server {
  id: string;
  name: string;
  icon: string;
  unread?: number;
}

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'stream';
  users?: number;
}

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
  role?: string;
  roleColor?: string;
}

const Index = () => {
  const [selectedServer, setSelectedServer] = useState('1');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [messageInput, setMessageInput] = useState('');

  const servers: Server[] = [
    { id: '1', name: 'Главный сервер', icon: '🎮', unread: 3 },
    { id: '2', name: 'Геймеры', icon: '🔥' },
    { id: '3', name: 'Разработка', icon: '💻', unread: 1 },
    { id: '4', name: 'Музыка', icon: '🎵' },
  ];

  const channels: Channel[] = [
    { id: 'general', name: 'общий', type: 'text' },
    { id: 'memes', name: 'мемы', type: 'text' },
    { id: 'voice-1', name: 'Голосовой чат', type: 'voice', users: 5 },
    { id: 'stream-1', name: 'Стрим', type: 'stream', users: 2 },
    { id: 'gaming', name: 'игры', type: 'text' },
  ];

  const messages: Message[] = [
    {
      id: '1',
      author: 'SpaceRanger',
      avatar: '🚀',
      content: 'Всем привет! Кто сегодня играет?',
      timestamp: '14:32',
      reactions: [
        { emoji: '👋', count: 5 },
        { emoji: '🎮', count: 3 },
      ],
      role: 'ADMIN',
      roleColor: 'text-destructive',
    },
    {
      id: '2',
      author: 'CyberNinja',
      avatar: '⚡',
      content: 'Я в деле! Поднимаем сервер через 10 минут',
      timestamp: '14:35',
      reactions: [{ emoji: '🔥', count: 2 }],
      role: 'MOD',
      roleColor: 'text-primary',
    },
    {
      id: '3',
      author: 'PixelMaster',
      avatar: '🎨',
      content: 'Закинул новые скины в файлы, проверьте!',
      timestamp: '14:38',
    },
    {
      id: '4',
      author: 'CodeBot',
      avatar: '🤖',
      content: '🎉 Новый участник присоединился к серверу!',
      timestamp: '14:40',
      role: 'BOT',
      roleColor: 'text-accent',
    },
  ];

  const friends = [
    { name: 'SpaceRanger', status: 'online', game: 'CS:GO' },
    { name: 'CyberNinja', status: 'online', game: 'Dota 2' },
    { name: 'PixelMaster', status: 'idle' },
    { name: 'ShadowKnight', status: 'offline' },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Серверы - левая панель */}
      <div className="w-20 bg-sidebar flex flex-col items-center gap-2 py-4 border-r border-sidebar-border">
        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-2xl bg-primary hover:bg-primary/80 hover:rounded-xl transition-all duration-300 glow-purple"
        >
          <Icon name="Home" size={28} />
        </Button>
        
        <Separator className="w-8" />

        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center gap-2 px-2">
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => setSelectedServer(server.id)}
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 hover:rounded-xl ${
                  selectedServer === server.id
                    ? 'bg-primary rounded-xl glow-purple-strong'
                    : 'bg-muted hover:bg-primary/50'
                }`}
              >
                {server.icon}
                {server.unread && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-xs p-0 flex items-center justify-center">
                    {server.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-2xl bg-muted hover:bg-accent transition-all duration-300 hover:rounded-xl"
        >
          <Icon name="Plus" size={24} />
        </Button>
      </div>

      {/* Каналы - вторая панель */}
      <div className="w-60 bg-sidebar-accent flex flex-col border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="font-bold text-lg">Главный сервер</h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="mb-4">
              <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Текстовые каналы
              </h3>
              {channels
                .filter((ch) => ch.type === 'text')
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full px-2 py-1.5 rounded flex items-center gap-2 text-sm transition-colors ${
                      selectedChannel === channel.id
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <Icon name="Hash" size={16} />
                    {channel.name}
                  </button>
                ))}
            </div>

            <div>
              <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Голосовые каналы
              </h3>
              {channels
                .filter((ch) => ch.type === 'voice' || ch.type === 'stream')
                .map((channel) => (
                  <button
                    key={channel.id}
                    className="w-full px-2 py-1.5 rounded flex items-center gap-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    <Icon
                      name={channel.type === 'stream' ? 'Radio' : 'Volume2'}
                      size={16}
                      className={channel.users ? 'animate-pulse-glow' : ''}
                    />
                    <span className="flex-1 text-left">{channel.name}</span>
                    {channel.users && (
                      <Badge variant="secondary" className="text-xs">
                        {channel.users}
                      </Badge>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 bg-sidebar border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-sm">🚀</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">SpaceRanger</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                В сети
              </div>
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Icon name="Settings" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Основной чат */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Hash" size={20} />
            <h2 className="font-semibold text-lg">общий</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Pin" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Users" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Search" size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="group hover:bg-muted/30 -mx-4 px-4 py-2 transition-colors"
              >
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-lg">
                      {message.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{message.author}</span>
                      {message.role && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${message.roleColor}`}
                        >
                          {message.role}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    {message.reactions && (
                      <div className="flex gap-2 mt-2">
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="px-2 py-1 rounded bg-muted hover:bg-muted/70 transition-colors flex items-center gap-1 text-sm"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-xs text-muted-foreground">
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                        <button className="w-7 h-7 rounded bg-muted hover:bg-muted/70 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Icon name="Plus" size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Icon name="Plus" size={20} />
            </Button>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Написать в #общий..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Icon name="Smile" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Icon name="Paperclip" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Боковая панель с друзьями */}
      <div className="w-60 bg-sidebar-accent border-l border-sidebar-border">
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-4">Друзья онлайн — {friends.filter(f => f.status === 'online').length}</h3>
          <div className="space-y-3">
            {friends.map((friend, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-xs">
                      {friend.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar-accent ${
                      friend.status === 'online'
                        ? 'bg-green-500'
                        : friend.status === 'idle'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{friend.name}</div>
                  {friend.game && (
                    <div className="text-xs text-muted-foreground truncate">
                      Играет в {friend.game}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
