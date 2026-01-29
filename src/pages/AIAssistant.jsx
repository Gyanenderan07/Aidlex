
import React, { useState, useEffect } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Scale, Lightbulb, Users } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = {
    en: "English",
    hi: "हिंदी", 
    ta: "தமிழ்",
    te: "తెలుగు",
    bn: "বাংলা",
    mr: "मराठी",
    gu: "ગુજરાતી",
    kn: "ಕನ್ನಡ",
    ml: "മലയാളം",
    pa: "ਪੰਜਾਬੀ"
  };

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('aidlex-lang') || 'en';
    setSelectedLanguage(savedLang);

    // This local function is specifically for handling the voice query from URL on initial load.
    // It captures `savedLang` from this effect's scope to ensure the language is correct for the initial query.
    const handleSubmitVoiceOnLoad = async (voiceQuery) => {
      const userQuestion = voiceQuery;
      setConversation(prev => [...prev, { type: "user", content: userQuestion }]);
      setIsLoading(true);

      try {
        const langPrompt = savedLang !== 'en' 
          ? `Please respond in ${languages[savedLang]} language. ` 
          : '';

        const response = await InvokeLLM({
          prompt: `${langPrompt}You are an expert Indian legal assistant with comprehensive knowledge of Indian law, constitution, and jurisprudence. Answer the following legal question with accurate information about Indian law, citing relevant constitutional articles, acts, and landmark cases where appropriate.

User question: ${userQuestion}

Please provide a detailed answer covering:
1. Direct answer to the question
2. Relevant constitutional provisions or legal acts
3. Key case laws if applicable
4. Practical implications
5. Recent developments if any

Format your response in a clear, structured manner.`,
          add_context_from_internet: true
        });

        setConversation(prev => [...prev, { type: "assistant", content: response }]);
      } catch (error) {
        const errorMsg = savedLang === 'hi' 
          ? "क्षमा करें, मुझे कानूनी जानकारी प्राप्त करने में समस्या हो रही है। कृपया फिर से कोशिश करें।"
          : savedLang === 'ta'
          ? "மன்னிக்கவும், சட்டத் தகவலை அணுகுவதில் சிக்கல் உள்ளது. மீண்டும் முயற்சிக்கவும்."
          : "I apologize, but I'm having trouble accessing legal information right now. Please try again or consult with a qualified legal professional for important legal matters.";
        
        setConversation(prev => [...prev, { 
          type: "assistant", 
          content: errorMsg
        }]);
      } finally {
        setIsLoading(false);
        setQuestion("");
      }
    };

    // Check for voice query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const voiceQuery = urlParams.get('voice');
    if (voiceQuery) {
      setQuestion(voiceQuery);
      // Auto-submit voice query after a short delay
      setTimeout(() => {
        handleSubmitVoiceOnLoad(voiceQuery);
      }, 500);
    }
  }, []); // Empty dependency array is safe here because `handleSubmitVoiceOnLoad` captures `savedLang` directly,
          // and other dependencies (setters, InvokeLLM, languages) are stable or imported.

  // This `handleSubmitVoice` is for all subsequent user interactions (form submission, suggested questions).
  // It uses the `selectedLanguage` from state, which can change after initial load.
  const handleSubmitVoice = async (voiceQuery) => {
    const userQuestion = voiceQuery;
    setConversation(prev => [...prev, { type: "user", content: userQuestion }]);
    setIsLoading(true);

    try {
      const langPrompt = selectedLanguage !== 'en' 
        ? `Please respond in ${languages[selectedLanguage]} language. ` 
        : '';

      const response = await InvokeLLM({
        prompt: `${langPrompt}You are an expert Indian legal assistant with comprehensive knowledge of Indian law, constitution, and jurisprudence. Answer the following legal question with accurate information about Indian law, citing relevant constitutional articles, acts, and landmark cases where appropriate.

User question: ${userQuestion}

Please provide a detailed answer covering:
1. Direct answer to the question
2. Relevant constitutional provisions or legal acts
3. Key case laws if applicable
4. Practical implications
5. Recent developments if any

Format your response in a clear, structured manner.`,
        add_context_from_internet: true
      });

      setConversation(prev => [...prev, { type: "assistant", content: response }]);
    } catch (error) {
      const errorMsg = selectedLanguage === 'hi' 
        ? "क्षमा करें, मुझे कानूनी जानकारी प्राप्त करने में समस्या हो रही है। कृपया फिर से कोशिश करें।"
        : selectedLanguage === 'ta'
        ? "மன்னிக்கவும், சட்டத் தகவலை அணுகுவதில் சிக்கல் உள்ளது. மீண்டும் முயற்சிக்கவும்."
        : "I apologize, but I'm having trouble accessing legal information right now. Please try again or consult with a qualified legal professional for important legal matters.";
      
      setConversation(prev => [...prev, { 
        type: "assistant", 
        content: errorMsg
      }]);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    await handleSubmitVoice(question);
  };

  const suggestedQuestions = {
    en: [
      "What are the key provisions of Article 21 of the Indian Constitution?",
      "Explain the procedure for filing a PIL in the Supreme Court",
      "What are the recent amendments to the Companies Act 2013?",
      "How does the GST Act 2017 impact small businesses?",
      "What is the significance of the Basic Structure Doctrine?",
      "Explain the Bharatiya Nyaya Sanhita 2023 changes"
    ],
    hi: [
      "भारतीय संविधान के अनुच्छेद 21 के मुख्य प्रावधान क्या हैं?",
      "सुप्रीम कोर्ट में PIL दाखिल करने की प्रक्रिया बताएं",
      "कंपनी अधिनियम 2013 में हाल के संशोधन क्या हैं?",
      "GST अधिनियम 2017 छोटे व्यवसायों को कैसे प्रभावित करता है?",
      "मूल संरचना सिद्धांत का क्या महत्व है?",
      "भारतीय न्याय संहिता 2023 के बदलाव समझाएं"
    ],
    ta: [
      "இந்திய அரசியலமைப்பின் பிரிவு 21 இன் முக்கிய விதிகள் என்ன?",
      "உச்ச நீதிமன்றத்தில் PIL தாக்கல் செய்வதற்கான செயல்முறையை விளக்கவும்",
      "நிறுவனங்கள் சட்டம் 2013 இல் சமீபத்திய திருத்தங்கள் என்ன?",
      "GST சட்டம் 2017 சிறு வணிகங்களை எவ்வாறு பாதிக்கிறது?",
      "அடிப்படை கட்டமைப்பு கோட்பாட்டின் முக்கியத்துவம் என்ன?",
      "பாரதிய நியாய சமிதா 2023 மாற்றங்களை விளக்கவும்"
    ]
  };

  const handleSuggestedQuestion = (suggestedQ) => {
    setQuestion(suggestedQ);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12" />
            <h1 className="text-4xl font-bold">AI Law Assistant</h1>
          </div>
          <p className="text-xl text-blue-100 mb-4">
            {selectedLanguage === 'hi' ? 'अपने भारतीय कानून के सवालों के तुरंत जवाब पाएं' :
             selectedLanguage === 'ta' ? 'உங்கள் இந்திய சட்ட கேள்விகளுக்கு உடனடி பதில்களைப் பெறுங்கள்' :
             'Get instant answers to your Indian law questions'}
          </p>
          <p className="text-blue-200 text-sm">
            {selectedLanguage === 'hi' ? 'भारतीय संविधान, अधिनियम और मामले के कानून के व्यापक ज्ञान के साथ AI द्वारा संचालित' :
             selectedLanguage === 'ta' ? 'இந்திய அரசியலமைப்பு, சட்டங்கள் மற்றும் வழக்கு சட்டங்களின் விரிவான அறிவுடன் AI ஆல் இயக்கப்படுகிறது' :
             'Powered by AI with comprehensive knowledge of Indian Constitution, Acts, and case law'}
          </p>
          
          {/* Language Selector */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                localStorage.setItem('aidlex-lang', e.target.value);
              }}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg border-0 shadow-lg"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 -mt-8">
        {/* Chat Interface */}
        <Card className="bg-white shadow-xl border-0 mb-6">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              {selectedLanguage === 'hi' ? 'कानूनी सहायक चैट' :
               selectedLanguage === 'ta' ? 'சட்ட உதவியாளர் அரட்டை' :
               'Legal Assistant Chat'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Conversation Display */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {conversation.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    {selectedLanguage === 'hi' ? 'AI कानूनी सहायक में आपका स्वागत है' :
                     selectedLanguage === 'ta' ? 'AI சட்ட உதவியாளருக்கு வரவேற்கிறோம்' :
                     'Welcome to AI Legal Assistant'}
                  </p>
                  <p className="text-sm">
                    {selectedLanguage === 'hi' ? 'भारतीय कानून, संविधान या कानूनी प्रक्रियाओं के बारे में मुझसे कुछ भी पूछें' :
                     selectedLanguage === 'ta' ? 'இந்திய சட்டம், அரசியலமைப்பு அல்லது சட்ட நடைமுறைகள் பற்றி என்னிடம் எதையும் கேளுங்கள்' :
                     'Ask me anything about Indian law, constitution, or legal procedures'}
                  </p>
                </div>
              )}
              
              {conversation.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-4 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white ml-12' 
                        : 'bg-gray-100 text-gray-900 mr-12'
                    }`}>
                      {message.type === 'user' ? (
                        <p>{message.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {message.type === 'user' ? (
                        <Users className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="max-w-3xl bg-gray-100 p-4 rounded-lg mr-12">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {selectedLanguage === 'hi' ? 'आपके कानूनी प्रश्न का विश्लेषण कर रहे हैं...' :
                         selectedLanguage === 'ta' ? 'உங்கள் சட்ட கேள்வியை ஆராய்கிறது...' :
                         'Analyzing your legal query...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input Form */}
            <div className="border-t p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    selectedLanguage === 'hi' ? 'यहां अपना कानूनी प्रश्न पूछें... (जैसे, हिंदू विवाह अधिनियम के तहत तलाक के आधार क्या हैं?)' :
                    selectedLanguage === 'ta' ? 'உங்கள் சட்ட கேள்வியை இங்கே கேளுங்கள்... (எ.கா., இந்து திருமண சட்டத்தின் கீழ் விவாகரத்துக்கான அடிப்படைகள் என்ன?)' :
                    'Ask your legal question here... (e.g., What are the grounds for divorce under Hindu Marriage Act?)'
                  }
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={!question.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Questions */}
        <Card className="bg-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              {selectedLanguage === 'hi' ? 'सुझाए गए प्रश्न' :
               selectedLanguage === 'ta' ? 'பரிந்துரைக்கப்பட்ட கேள்விகள்' :
               'Suggested Questions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(suggestedQuestions[selectedLanguage] || suggestedQuestions.en).map((suggestedQ, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
                  onClick={() => handleSuggestedQuestion(suggestedQ)}
                >
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                      {suggestedQ}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">
                    {selectedLanguage === 'hi' ? 'कानूनी अस्वीकरण' :
                     selectedLanguage === 'ta' ? 'சட்ட மறுப்பு' :
                     'Legal Disclaimer'}
                  </h4>
                  <p className="text-sm text-yellow-700">
                    This AI assistant provides general legal information for educational purposes only. 
                    For specific legal advice, please consult with a qualified legal professional. 
                    The information provided should not be considered as legal advice or substitute for professional legal consultation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
