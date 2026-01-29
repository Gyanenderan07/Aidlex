import React, { useState, useEffect } from "react";
import { LegalCase } from "@/entities/LegalCase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Scale, 
  Building, 
  Calculator, 
  Users, 
  Shield, 
  Home,
  Briefcase,
  Leaf,
  Lightbulb
} from "lucide-react";

import LegalAreas from "../components/law/LegalAreas";
import RecentCases from "../components/law/RecentCases";
import PopularTopics from "../components/law/PopularTopics";

export default function LawExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentCases, setRecentCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentCases();
  }, []);

  const loadRecentCases = async () => {
    try {
      const cases = await LegalCase.list("-judgment_date", 10);
      setRecentCases(cases);
    } catch (error) {
      console.error("Error loading cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const legalAreas = [
    {
      title: "Constitutional Law",
      description: "Fundamental rights and directive principles",
      icon: Scale,
      color: "bg-blue-500",
      articles: ["Article 14", "Article 19", "Article 21"]
    },
    {
      title: "Corporate Law",
      description: "Company formations and corporate governance",
      icon: Building,
      color: "bg-green-500",
      acts: ["Companies Act 2013", "SEBI Act", "Insolvency Code"]
    },
    {
      title: "Tax Law",
      description: "GST, Income Tax and regulatory compliance",
      icon: Calculator,
      color: "bg-orange-500",
      acts: ["Income Tax Act 1961", "GST Act 2017"]
    },
    {
      title: "Family Law",
      description: "Marriage, divorce and family disputes",
      icon: Users,
      color: "bg-pink-500",
      acts: ["Hindu Marriage Act", "Special Marriage Act"]
    },
    {
      title: "Criminal Law",
      description: "Bharatiya Nyaya Sanhita and criminal procedures",
      icon: Shield,
      color: "bg-red-500",
      acts: ["BNS 2023", "BNSS 2023", "BSA 2023"]
    },
    {
      title: "Property Law",
      description: "Real estate and property transactions",
      icon: Home,
      color: "bg-purple-500",
      acts: ["Transfer of Property Act", "Registration Act"]
    },
    {
      title: "Labor Law",
      description: "Employment and industrial relations",
      icon: Briefcase,
      color: "bg-indigo-500",
      acts: ["Industrial Relations Code", "Wage Code"]
    },
    {
      title: "Environmental Law",
      description: "Environmental protection and regulations",
      icon: Leaf,
      color: "bg-green-600",
      acts: ["Environment Protection Act", "Water Act"]
    },
    {
      title: "Intellectual Property",
      description: "Patents, trademarks and copyrights",
      icon: Lightbulb,
      color: "bg-yellow-500",
      acts: ["Patent Act 1970", "Trade Marks Act 1999"]
    }
  ];

  const popularTopics = [
    "Right to Information (RTI)",
    "Goods and Services Tax (GST)",
    "Digital Personal Data Protection",
    "Insolvency and Bankruptcy",
    "Arbitration and Conciliation",
    "Consumer Protection",
    "Competition Law (Antitrust)",
    "Cyber Crime and IT Act"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Law Explorer
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Navigate the complexities of Indian law with AI-powered research
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search legal topics, cases, statutes, constitutional articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg rounded-full border-0 bg-white text-gray-900 placeholder-gray-500 shadow-xl focus:ring-2 focus:ring-yellow-400"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full px-8 py-2"
              >
                <Search className="w-5 h-5" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 -mt-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="recent" className="rounded-lg">Recent Cases</TabsTrigger>
            <TabsTrigger value="topics" className="rounded-lg">Popular Topics</TabsTrigger>
            <TabsTrigger value="areas" className="rounded-lg">Legal Areas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <LegalAreas areas={legalAreas} />
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <RecentCases cases={recentCases} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <PopularTopics topics={popularTopics} />
          </TabsContent>

          <TabsContent value="areas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {legalAreas.map((area, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-xl ${area.color} bg-opacity-20`}>
                        <area.icon className={`w-6 h-6 ${area.color.replace('bg-', 'text-')}`} />
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {area.title}
                      </CardTitle>
                    </div>
                    <p className="text-gray-600">{area.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {area.articles && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Key Articles:</p>
                          <div className="flex flex-wrap gap-2">
                            {area.articles.map((article, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {article}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {area.acts && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Key Acts:</p>
                          <div className="flex flex-wrap gap-2">
                            {area.acts.slice(0, 2).map((act, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {act}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
