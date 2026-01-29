import React, { useState, useEffect } from "react";
import { LegalNews } from "@/entities/LegalNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Tag, ExternalLink, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function News() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await LegalNews.list("-publication_date", 50);
      setNews(data);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryColors = {
    "Supreme Court": "bg-red-100 text-red-800 border-red-200",
    "High Courts": "bg-blue-100 text-blue-800 border-blue-200",
    "Legislative Updates": "bg-green-100 text-green-800 border-green-200",
    "Legal Reforms": "bg-purple-100 text-purple-800 border-purple-200",
    "Bar Council News": "bg-orange-100 text-orange-800 border-orange-200",
    "Constitutional Amendments": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Legal Technology": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Legal Education": "bg-pink-100 text-pink-800 border-pink-200"
  };

  const filteredNews = activeCategory === "all" ? news : news.filter(item => item.category === activeCategory);
  const categories = ["all", ...new Set(news.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Legal News & Updates</h1>
          <p className="text-xl text-indigo-100 mb-4">
            Stay informed with the latest developments in Indian law and judiciary
          </p>
          <div className="flex items-center justify-center gap-2">
            <Newspaper className="w-5 h-5" />
            <span className="text-indigo-200">Updated daily with verified legal news</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 -mt-8">
        <Card className="bg-white shadow-xl border-0 mb-8">
          <CardContent className="p-6">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 bg-gray-100 mb-6">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="Supreme Court" className="text-xs">Supreme Court</TabsTrigger>
                <TabsTrigger value="High Courts" className="text-xs">High Courts</TabsTrigger>
                <TabsTrigger value="Legislative Updates" className="text-xs">Legislative</TabsTrigger>
                <TabsTrigger value="Legal Reforms" className="text-xs">Reforms</TabsTrigger>
                <TabsTrigger value="Bar Council News" className="text-xs">Bar Council</TabsTrigger>
                <TabsTrigger value="Legal Technology" className="text-xs">Technology</TabsTrigger>
                <TabsTrigger value="Legal Education" className="text-xs">Education</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl leading-tight hover:text-blue-600 transition-colors cursor-pointer mb-3">
                        {item.headline}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={`${categoryColors[item.category]} border`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(item.publication_date), "MMM d, yyyy")}
                        </div>
                        {item.source && (
                          <Badge variant="outline" className="text-xs">
                            {item.source}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {item.content}
                  </p>
                  
                  {item.related_cases && item.related_cases.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Related Cases</p>
                      <div className="flex flex-wrap gap-2">
                        {item.related_cases.map((case_name, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {case_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No news found</h3>
            <p className="text-gray-600">Try selecting a different category or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
}
