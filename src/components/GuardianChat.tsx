import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  MessageSquare, 
  Send, 
  Search, 
  ArrowLeft, 
  Phone, 
  Video,
  MoreVertical,
  User
} from 'lucide-react';
import { supabase } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: string;
  sender_id: string;
  sender_type: 'doctor' | 'guardian';
  content: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  patient_id: string;
  patient_name: string;
  guardian_name: string;
  guardian_email: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

interface GuardianChatProps {
  doctorData: any;
  onBack: () => void;
}

export function GuardianChat({ doctorData, onBack }: GuardianChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('guardian_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'guardian_messages' },
        (payload) => {
          handleNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.patient_id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      // Mock data for demo - in production, this would fetch from Supabase
      const mockConversations: Conversation[] = [
        {
          patient_id: '1',
          patient_name: 'Mary Johnson',
          guardian_name: 'Sarah Johnson',
          guardian_email: 'sarah.j@email.com',
          last_message: 'Thank you for the update on my mother',
          last_message_time: new Date(Date.now() - 3600000).toISOString(),
          unread_count: 2
        },
        {
          patient_id: '2',
          patient_name: 'Robert Smith',
          guardian_name: 'Emily Smith',
          guardian_email: 'emily.s@email.com',
          last_message: 'Could we schedule a consultation?',
          last_message_time: new Date(Date.now() - 7200000).toISOString(),
          unread_count: 0
        },
        {
          patient_id: '3',
          patient_name: 'Patricia Davis',
          guardian_name: 'Michael Davis',
          guardian_email: 'michael.d@email.com',
          last_message: 'She seems much better today',
          last_message_time: new Date(Date.now() - 86400000).toISOString(),
          unread_count: 1
        }
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (patientId: string) => {
    setIsLoading(true);
    try {
      // Mock messages for demo
      const mockMessages: Message[] = [
        {
          id: '1',
          sender_id: patientId,
          sender_type: 'guardian',
          content: 'Hello Doctor, I wanted to check on my mother\'s progress this week.',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        {
          id: '2',
          sender_id: 'doctor',
          sender_type: 'doctor',
          content: 'Hello! Your mother is doing well. Her mood has been consistently positive over the past week, with good survey completion rates.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          read: true
        },
        {
          id: '3',
          sender_id: patientId,
          sender_type: 'guardian',
          content: 'That\'s wonderful to hear! Thank you for the update. Are there any specific exercises or activities you recommend?',
          created_at: new Date(Date.now() - 43200000).toISOString(),
          read: true
        },
        {
          id: '4',
          sender_id: 'doctor',
          sender_type: 'doctor',
          content: 'I recommend continuing with daily walks and social activities. The mood tracking shows these activities correlate with improved emotional wellbeing.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: true
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (selectedConversation && message.sender_id === selectedConversation.patient_id) {
      setMessages(prev => [...prev, message]);
    }
    // Update conversations list
    loadConversations();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: 'doctor',
      sender_type: 'doctor',
      content: newMessage,
      created_at: new Date().toISOString(),
      read: false
    };

    try {
      // In production, save to Supabase
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      toast.success('Message sent to guardian');
      
      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => 
          conv.patient_id === selectedConversation.patient_id
            ? { ...conv, last_message: newMessage, last_message_time: message.created_at }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.guardian_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedConversation) {
    // Conversations list view
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessageSquare className="w-7 h-7 text-blue-600" />
              Guardian Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No conversations yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Messages with guardians will appear here
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.patient_id}
                    onClick={() => setSelectedConversation(conv)}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {conv.guardian_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900">{conv.guardian_name}</h3>
                        {conv.last_message_time && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.last_message_time)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Guardian of {conv.patient_name}
                      </p>
                      {conv.last_message && (
                        <p className="text-sm text-gray-500 truncate">
                          {conv.last_message}
                        </p>
                      )}
                    </div>
                    {conv.unread_count > 0 && (
                      <Badge className="bg-blue-600 text-white">
                        {conv.unread_count}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chat view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setSelectedConversation(null)} className="gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Conversations
        </Button>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm">
        {/* Chat Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {selectedConversation.guardian_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{selectedConversation.guardian_name}</h3>
                <p className="text-sm text-gray-600">
                  Guardian of {selectedConversation.patient_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <ScrollArea className="h-[500px] p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isDoctor = message.sender_type === 'doctor';
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isDoctor ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isDoctor ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}>
                          {isDoctor ? 'Dr' : 'G'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${isDoctor ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isDoctor
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-h-[60px] max-h-[120px] resize-none"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
