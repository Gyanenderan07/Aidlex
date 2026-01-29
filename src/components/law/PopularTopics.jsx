import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function PopularTopics({ topics }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Legal Topics</h2>
        <p className="text-gray-600">Most searched legal areas and current legal discussions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-gradient-to-r from-white to-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      #{index + 1}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {topic}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Stay Updated with Legal Trends</h3>
          <p className="text-blue-100 mb-4">Get personalized legal insights and trending topics delivered to your dashboard</p>
          <Badge className="bg-white text-blue-600 hover:bg-gray-100">
            <TrendingUp className="w-4 h-4 mr-2" />
            View All Trends
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
