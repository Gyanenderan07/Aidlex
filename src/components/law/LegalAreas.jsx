import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LegalAreas({ areas }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Legal Practice Areas</h2>
        <p className="text-gray-600">Explore comprehensive coverage of Indian legal domains</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${area.color} bg-opacity-20`}>
                  <area.icon className={`w-6 h-6 ${area.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                </div>
              </div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {area.title}
              </CardTitle>
              <p className="text-gray-600 text-sm">{area.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {area.articles && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Constitutional Articles</p>
                    <div className="flex flex-wrap gap-1">
                      {area.articles.map((article, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {article}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {area.acts && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Legislation</p>
                    <div className="flex flex-wrap gap-1">
                      {area.acts.slice(0, 2).map((act, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-gray-300">
                          {act}
                        </Badge>
                      ))}
                      {area.acts.length > 2 && (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          +{area.acts.length - 2} more
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
