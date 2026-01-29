
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Users, 
  Heart, 
  Share2, 
  Send,
  Plus,
  Star,
  MessageCircle,
  TrendingUp,
  Eye,
  Phone,
  Mail
} from "lucide-react";
import { format } from "date-fns";

export default function Community() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "General" });
  const [selectedPost, setSelectedPost] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    // Sample community posts - moved inside useEffect to avoid dependency warning
    const samplePosts = [
      {
        id: 1,
        author: "Adv. Priya Sharma",
        avatar: "PS",
        title: "New GST Rules 2024 - Impact on Small Businesses",
        content: "The recent GST amendments have significant implications for small businesses. Here's what you need to know about compliance requirements...",
        category: "Tax Law",
        likes: 24,
        comments: 8,
        views: 156,
        timestamp: "2024-01-25T10:30:00Z",
        tags: ["GST", "Tax", "Small Business", "Compliance"]
      },
      {
        id: 2,
        author: "Rajesh Kumar",
        avatar: "RK",
        title: "Property Registration Process in Delhi - Complete Guide",
        content: "Step-by-step guide for property registration in Delhi. Including required documents, fees, and timeline...",
        category: "Property Law",
        likes: 45,
        comments: 12,
        views: 234,
        timestamp: "2024-01-24T15:45:00Z",
        tags: ["Property", "Registration", "Delhi", "Real Estate"]
      },
      {
        id: 3,
        author: "Dr. Meera Patel",
        avatar: "MP",
        title: "Digital Personal Data Protection Act - Key Provisions",
        content: "Analysis of the new data protection law and its impact on businesses and individuals. What compliance measures are needed?",
        category: "Cyber Law",
        likes: 67,
        comments: 19,
        views: 389,
        timestamp: "2024-01-23T09:20:00Z",
        tags: ["Data Protection", "Privacy", "Compliance", "Digital"]
      }
    ];

    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not logged in");
      }
    };

    loadUser();
    setPosts(samplePosts);
  }, []); // Empty dependency array is now safe

  // Sample lawyers for chat
  const availableLawyers = [
    {
      id: 1,
      name: "Adv. Harish Salve",
      specialization: "Constitutional Law",
      experience: "35 years",
      phone: "+91 98765 43210",
      email: "harish@chambers.com",
      status: "online",
      avatar: "HS"
    },
    {
      id: 2,
      name: "Adv. Indira Jaising", 
      specialization: "Family Law",
      experience: "30 years",
      phone: "+91 98765 43211",
      email: "indira@chambers.com",
      status: "busy",
      avatar: "IJ"
    },
    {
      id: 3,
      name: "Adv. K.V. Viswanathan",
      specialization: "Tax Law",
      experience: "28 years", 
      phone: "+91 98765 43212",
      email: "kv@chambers.com",
      status: "offline",
      avatar: "KV"
    }
  ];

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    
    const post = {
      id: posts.length + 1,
      author: user?.full_name || "Anonymous User",
      avatar: user?.full_name?.split(' ').map(n => n[0]).join('') || "AU",
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      likes: 0,
      comments: 0,
      views: 0,
      timestamp: new Date().toISOString(),
      tags: []
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost({ title: "", content: "", category: "General" });
  };

  const startChat = (lawyer) => {
    setActiveChat(lawyer);
    setChatMessages([
      {
        id: 1,
        sender: lawyer.name,
        message: `Hello! I'm ${lawyer.name}, specialized in ${lawyer.specialization}. How can I help you with your legal query?`,
        timestamp: new Date().toISOString(),
        isLawyer: true
      }
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    const message = {
      id: chatMessages.length + 1,
      sender: user?.full_name || "You",
      message: newMessage,
      timestamp: new Date().toISOString(),
      isLawyer: false
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Simulate lawyer response
    setTimeout(() => {
      const lawyerResponse = {
        id: chatMessages.length + 2,
        sender: activeChat.name,
        message: "Thank you for your question. Let me provide you with some guidance on this matter...",
        timestamp: new Date().toISOString(),
        isLawyer: true
      };
      setChatMessages(prev => [...prev, lawyerResponse]);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Legal Community</h1>
          </div>
          <p className="text-xl text-indigo-100 mb-4">
            Connect, discuss, and get expert legal advice from professionals across India
          </p>
          <div className="flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span className="text-indigo-200">Join thousands of legal professionals and clients</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 -mt-8">
        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl p-1">
            <TabsTrigger value="discussions" className="rounded-lg">Discussions</TabsTrigger>
            <TabsTrigger value="expert-chat" className="rounded-lg">Expert Chat</TabsTrigger>
            <TabsTrigger value="feedback" className="rounded-lg">Feedback & Support</TabsTrigger>
          </TabsList>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <Card className="bg-white shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-indigo-600" />
                      Create New Discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Discussion title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({...prev, title: e.target.value}))}
                    />
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost(prev => ({...prev, category: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="General">General Discussion</option>
                      <option value="Constitutional Law">Constitutional Law</option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Civil Law">Civil Law</option>
                      <option value="Corporate Law">Corporate Law</option>
                      <option value="Tax Law">Tax Law</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Property Law">Property Law</option>
                    </select>
                    <Textarea
                      placeholder="Share your thoughts, questions, or insights..."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({...prev, content: e.target.value}))}
                      className="h-24"
                    />
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPost.title || !newPost.content}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Discussion
                    </Button>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                              {post.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{post.author}</h3>
                            <p className="text-sm text-gray-500">
                              {format(new Date(post.timestamp), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{post.category}</Badge>
                      </div>
                      <CardTitle className="text-xl hover:text-indigo-600 transition-colors cursor-pointer">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">{post.content}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-6">
                          <Button variant="ghost" size="sm" className="hover:text-red-600">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-blue-600">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:text-green-600">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <Card className="bg-white shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      Trending Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <span className="text-sm font-medium">#DataProtection</span>
                      <Badge variant="outline" className="text-xs">124 posts</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <span className="text-sm font-medium">#GST2024</span>
                      <Badge variant="outline" className="text-xs">89 posts</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <span className="text-sm font-medium">#CriminalLawReform</span>
                      <Badge variant="outline" className="text-xs">67 posts</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <span className="text-sm font-medium">#PropertyRights</span>
                      <Badge variant="outline" className="text-xs">45 posts</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Members */}
                <Card className="bg-white shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Active Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {availableLawyers.slice(0, 3).map((lawyer) => (
                      <div key={lawyer.id} className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                              {lawyer.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(lawyer.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{lawyer.name}</p>
                          <p className="text-xs text-gray-500">{lawyer.specialization}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Expert Chat Tab */}
          <TabsContent value="expert-chat" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lawyers List */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Available Experts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableLawyers.map((lawyer) => (
                    <div key={lawyer.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                         onClick={() => startChat(lawyer)}>
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {lawyer.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(lawyer.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{lawyer.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{lawyer.specialization}</p>
                          <p className="text-xs text-gray-500 mb-2">{lawyer.experience} experience</p>
                          
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-blue-600">
                              <Phone className="w-3 h-3" />
                              {lawyer.phone}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                            <Mail className="w-3 h-3" />
                            {lawyer.email}
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="mt-3 w-full bg-blue-600 hover:bg-blue-700"
                            disabled={lawyer.status === 'offline'}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {lawyer.status === 'offline' ? 'Offline' : 'Start Chat'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="bg-white shadow-xl border-0 h-96">
                  {activeChat ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {activeChat.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{activeChat.name}</CardTitle>
                            <p className="text-sm text-gray-500">{activeChat.specialization}</p>
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <div className={`w-3 h-3 ${getStatusColor(activeChat.status)} rounded-full`}></div>
                            <span className="text-sm text-gray-500 capitalize">{activeChat.status}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-0">
                        <div className="h-64 overflow-y-auto p-4 space-y-4">
                          {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.isLawyer ? 'justify-start' : 'justify-end'}`}>
                              <div className={`max-w-xs p-3 rounded-lg ${
                                msg.isLawyer 
                                  ? 'bg-gray-100 text-gray-900' 
                                  : 'bg-blue-600 text-white'
                              }`}>
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-xs mt-1 ${msg.isLawyer ? 'text-gray-500' : 'text-blue-100'}`}>
                                  {format(new Date(msg.timestamp), 'h:mm a')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t p-4">
                          <div className="flex gap-3">
                            <Input
                              placeholder="Type your legal question..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                              className="flex-1"
                            />
                            <Button 
                              onClick={sendMessage}
                              disabled={!newMessage.trim()}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">Select an Expert to Start Chatting</p>
                        <p className="text-sm">Get professional legal advice from experienced lawyers</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Submit Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Feedback Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>General Feedback</option>
                      <option>Bug Report</option>
                      <option>Feature Request</option>
                      <option>Content Suggestion</option>
                      <option>Technical Issue</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="Brief description of your feedback" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Details</label>
                    <Textarea 
                      placeholder="Please provide detailed feedback..."
                      className="h-32"
                    />
                  </div>
                  
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-100 text-green-800">Implemented</Badge>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm font-medium">Voice Search Feature</p>
                    <p className="text-xs text-gray-600">Added voice search capability to AI assistant</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      <span className="text-xs text-gray-500">1 week ago</span>
                    </div>
                    <p className="text-sm font-medium">Multi-language Support</p>
                    <p className="text-xs text-gray-600">Enhanced language support for regional languages</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                      <span className="text-xs text-gray-500">2 weeks ago</span>
                    </div>
                    <p className="text-sm font-medium">Mobile App Request</p>
                    <p className="text-xs text-gray-600">Native mobile application for iOS and Android</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
