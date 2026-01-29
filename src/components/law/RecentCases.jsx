import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Scale } from "lucide-react";
import { format } from "date-fns";

const courtColors = {
  "Supreme Court of India": "bg-red-100 text-red-800 border-red-200",
  "Delhi High Court": "bg-blue-100 text-blue-800 border-blue-200",
  "Bombay High Court": "bg-green-100 text-green-800 border-green-200",
  "Madras High Court": "bg-purple-100 text-purple-800 border-purple-200",
  "Calcutta High Court": "bg-orange-100 text-orange-800 border-orange-200",
  "Karnataka High Court": "bg-pink-100 text-pink-800 border-pink-200",
};

export default function RecentCases({ cases, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Judgments</h2>
          <p className="text-gray-600">Latest decisions from Indian courts</p>
        </div>
        
        <div className="grid gap-6">
          {Array(5).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Judgments</h2>
        <p className="text-gray-600">Latest decisions from Indian courts</p>
      </div>
      
      <div className="grid gap-6">
        {cases.map((case_item) => (
          <Card key={case_item.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                    {case_item.case_title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Badge className={`${courtColors[case_item.court_name] || 'bg-gray-100 text-gray-800'} border`}>
                      <Scale className="w-3 h-3 mr-1" />
                      {case_item.court_name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {case_item.case_number}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {case_item.legal_area?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
                {case_item.judgment_date && (
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(case_item.judgment_date), "MMM d, yyyy")}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {case_item.summary && (
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {case_item.summary}
                </p>
              )}
              
              <div className="space-y-3">
                {case_item.judges && case_item.judges.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Presiding Judges</p>
                    <div className="flex flex-wrap gap-2">
                      {case_item.judges.map((judge, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {judge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {case_item.constitutional_articles && case_item.constitutional_articles.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Constitutional Provisions</p>
                    <div className="flex flex-wrap gap-2">
                      {case_item.constitutional_articles.map((article, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100">
                          {article}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {case_item.keywords && case_item.keywords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Legal Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {case_item.keywords.slice(0, 6).map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100">
                          {keyword}
                        </Badge>
                      ))}
                      {case_item.keywords.length > 6 && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          +{case_item.keywords.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
