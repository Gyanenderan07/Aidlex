import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Scale, 
  Search, 
  FileText, 
  Users, 
  Newspaper, 
  TrendingUp, 
  MessageSquare,
  Bot,
  Gavel,
  Sun,
  Moon,
  Monitor,
  Contrast,
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
  Mic,
  MicOff
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "AI Law Assistant",
    url: createPageUrl("AIAssistant"),
    icon: Bot,
  },
  {
    title: "Law Explorer",
    url: createPageUrl("LawExplorer"),
    icon: Search,
  },
  {
    title: "Smart Documents",
    url: createPageUrl("Documents"),
    icon: FileText,
  },
  {
    title: "Find Experts",
    url: createPageUrl("Experts"),
    icon: Users,
  },
  {
    title: "Legal News",
    url: createPageUrl("News"),
    icon: Newspaper,
  },
  {
    title: "Case Predictor",
    url: createPageUrl("CasePredictor"),
    icon: TrendingUp,
  },
  {
    title: "Community",
    url: createPageUrl("Community"),
    icon: MessageSquare,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [theme, setTheme] = useState('default');
  const [user, setUser] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    loadUser();
    initializeVoiceRecognition();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('aidlex-theme') || 'default';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const initializeVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Default to English India
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Navigate to AI Assistant with voice query
        window.location.href = createPageUrl("AIAssistant") + "?voice=" + encodeURIComponent(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  };

  const startVoiceRecognition = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error("Voice recognition error:", error);
      }
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    switch (themeName) {
      case 'dark':
        root.style.setProperty('--bg-primary', '#1a1a1a');
        root.style.setProperty('--bg-secondary', '#2d2d2d');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#a0a0a0');
        root.style.setProperty('--border-color', '#404040');
        document.body.className = 'dark';
        break;
      case 'light':
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8f9fa');
        root.style.setProperty('--text-primary', '#1a1a1a');
        root.style.setProperty('--text-secondary', '#6b7280');
        root.style.setProperty('--border-color', '#e5e7eb');
        document.body.className = 'light';
        break;
      case 'contrast':
        root.style.setProperty('--bg-primary', '#000000');
        root.style.setProperty('--bg-secondary', '#ffffff');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#000000');
        root.style.setProperty('--border-color', '#ffffff');
        document.body.className = 'high-contrast';
        break;
      default:
        root.style.setProperty('--bg-primary', '#fafaf9');
        root.style.setProperty('--bg-secondary', '#ffffff');
        root.style.setProperty('--text-primary', '#1f2937');
        root.style.setProperty('--text-secondary', '#6b7280');
        root.style.setProperty('--border-color', '#e5e7eb');
        document.body.className = '';
        break;
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('aidlex-theme', newTheme);
    applyTheme(newTheme);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const themeIcons = {
    default: Monitor,
    light: Sun,
    dark: Moon,
    contrast: Contrast,
  };

  return (
    <>
      <style>{`
        .dark {
          background: #1a1a1a;
          color: #ffffff;
        }
        .dark .bg-white {
          background: #2d2d2d !important;
          color: #ffffff !important;
        }
        .dark .text-gray-900 {
          color: #ffffff !important;
        }
        .dark .text-gray-600 {
          color: #a0a0a0 !important;
        }
        .dark .border-gray-200 {
          border-color: #404040 !important;
        }
        .light .bg-gray-50 {
          background: #ffffff !important;
        }
        .high-contrast {
          background: #000000 !important;
          color: #ffffff !important;
        }
        .high-contrast * {
          background: #000000 !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
        }
      `}</style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
          <Sidebar className="border-r" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)'}}>
            <SidebarHeader className="border-b p-4" style={{borderColor: 'var(--border-color)'}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">AIDLEX</h1>
                  <p className="text-xs text-blue-600 font-medium">AI Legal Intelligence Platform for India</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-2">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider px-3 py-2" style={{color: 'var(--text-secondary)'}}>
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4" style={{borderColor: 'var(--border-color)'}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    <Gavel className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Legal Professional</p>
                    <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Powered by AI & Indian Law</p>
                  </div>
                </div>
                
                {/* Voice Assistant Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isListening ? 'bg-red-100 text-red-600' : 'hover:bg-blue-50'} transition-colors`}
                  onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col min-h-screen">
            {/* Mobile and Desktop header */}
            <header className="border-b px-4 py-3" style={{borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)'}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                  <div className="md:hidden flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <span className="font-bold">AIDLEX</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Language Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        🌐 भाषा
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'en')}>
                        🇮🇳 English
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'hi')}>
                        🇮🇳 हिंदी
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'ta')}>
                        🇮🇳 தமிழ்
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'te')}>
                        🇮🇳 తెలుగు
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'bn')}>
                        🇮🇳 বাংলা
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'mr')}>
                        🇮🇳 मराठी
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'gu')}>
                        🇮🇳 ગુજરાતી
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'kn')}>
                        🇮🇳 ಕನ್ನಡ
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'ml')}>
                        🇮🇳 മലയാളം
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => localStorage.setItem('aidlex-lang', 'pa')}>
                        🇮🇳 ਪੰਜਾਬੀ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Theme Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {React.createElement(themeIcons[theme], { className: "w-4 h-4" })}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => changeTheme('default')}>
                        <Monitor className="w-4 h-4 mr-2" />
                        Default
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeTheme('light')}>
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeTheme('dark')}>
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeTheme('contrast')}>
                        <Contrast className="w-4 h-4 mr-2" />
                        High Contrast
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Voice Assistant */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-blue-50'} transition-colors hidden md:flex`}
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    title="Voice Assistant (Click and speak)"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  
                  {/* User Profile */}
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 px-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-left hidden md:block">
                            <p className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>{user.full_name}</p>
                            <p className="text-xs" style={{color: 'var(--text-secondary)'}}>{user.role}</p>
                          </div>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <UserIcon className="w-4 h-4 mr-2" />
                          Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="w-4 h-4 mr-2" />
                          Account Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button 
                      onClick={() => User.login()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Login
                    </Button>
                  )}
                </div>
              </div>
              
              {isListening && (
                <div className="mt-2">
                  <Badge className="bg-red-100 text-red-700 animate-pulse">
                    <Mic className="w-3 h-3 mr-1" />
                    Listening... Speak your legal question
                  </Badge>
                </div>
              )}
            </header>

            <div className="flex-1">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}
