
import React, { useState, useEffect } from "react";
import { LegalExpert } from "@/entities/LegalExpert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  Award, 
  Mail, 
  Scale,
  User,
  Briefcase,
  GraduationCap,
  Phone,         // Added Phone icon
  MessageSquare  // Added MessageSquare icon
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // getContactPhone is defined here, outside useEffect, but it's a pure function
  // that doesn't depend on component state/props, so it's stable across renders.
  const getContactPhone = (name) => {
    const phoneNumbers = {
      "Adv. Harish Salve": "+91 98765 43210",
      "Adv. Indira Jaising": "+91 98765 43211", 
      "Adv. K.V. Viswanathan": "+91 98765 43212",
      "Mukul Rohatgi": "+91 98765 43213",
      "Abhishek Manu Singhvi": "+91 98765 43214",
      "Menaka Guruswamy": "+91 98765 43215",
      "Prashant Bhushan": "+91 98765 43216",
      "Uday Holla": "+91 98765 43217",
      "Darius Khambata": "+91 98765 43218"
    };
    return phoneNumbers[name] || `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  };

  useEffect(() => {
    // loadExperts is now defined inside useEffect, making it part of the effect's closure.
    // This way, it doesn't need to be added to the dependency array.
    // setExperts and setIsLoading are stable dispatch functions from useState.
    const loadExperts = async () => {
      try {
        const data = await LegalExpert.list("-experience_years", 20);
        // Add contact numbers to the sample data
        const expertsWithContact = data.map(expert => ({
          ...expert,
          contact_phone: getContactPhone(expert.name)
        }));
        setExperts(expertsWithContact);
      } catch (error) {
        console.error("Error loading experts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExperts();
  }, []); // Empty dependency array is now safe as loadExperts is defined within this effect.

  const filteredExperts = experts.filter(expert => 
    expert.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.specialization?.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
    expert.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const designationColors = {
    "Senior Advocate": "bg-purple-100 text-purple-800 border-purple-200",
    "Advocate": "bg-blue-100 text-blue-800 border-blue-200",
    "Additional Solicitor General": "bg-red-100 text-red-800 border-red-200",
    "Solicitor General": "bg-red-100 text-red-800 border-red-200",
    "Attorney General": "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find Legal Experts</h1>
          <p className="text-xl text-blue-100 mb-8">
            Connect with experienced legal professionals across India
          </p>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name, specialization, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg rounded-full border-0 bg-white text-gray-900 placeholder-gray-500 shadow-xl"
              />
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 -mt-8">
        <Card className="bg-white shadow-xl border-0 mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLoading ? "Loading..." : `${filteredExperts.length} Legal Experts`}
              </h2>
              <p className="text-gray-600">
                Verified legal professionals with expertise across various practice areas
              </p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <Card key={expert.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {expert.name}
                        </CardTitle>
                        <Badge className={`${designationColors[expert.designation] || 'bg-gray-100 text-gray-800'} border text-xs mt-1`}>
                          {expert.designation}
                        </Badge>
                      </div>
                    </div>
                    {expert.experience_years && (
                      <Badge variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {expert.experience_years}y exp
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {expert.specialization && expert.specialization.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-1">
                        {expert.specialization.slice(0, 3).map((spec, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {spec}
                          </Badge>
                        ))}
                        {expert.specialization.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{expert.specialization.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {expert.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{expert.location}</span>
                    </div>
                  )}
                  
                  {expert.bar_council && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Scale className="w-4 h-4" />
                      <span>{expert.bar_council}</span>
                    </div>
                  )}
                  
                  {expert.education && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="truncate">{expert.education}</span>
                    </div>
                  )}
                  
                  {/* Contact Information */}
                  <div className="space-y-2">
                    {expert.contact_phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-green-600" />
                        <a href={`tel:${expert.contact_phone}`} className="hover:text-green-600 transition-colors">
                          {expert.contact_phone}
                        </a>
                      </div>
                    )}
                    
                    {expert.contact_email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <a href={`mailto:${expert.contact_email}`} className="hover:text-blue-600 transition-colors truncate">
                          {expert.contact_email}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {expert.courts_practice && expert.courts_practice.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Courts of Practice</p>
                      <div className="flex flex-wrap gap-1">
                        {expert.courts_practice.slice(0, 2).map((court, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-amber-50 text-amber-700">
                            {court}
                          </Badge>
                        ))}
                        {expert.courts_practice.length > 2 && (
                          <Badge variant="secondary" className="text-xs text-gray-500">
                            +{expert.courts_practice.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {expert.notable_cases && expert.notable_cases.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notable Cases</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {expert.notable_cases[0]}
                        {expert.notable_cases.length > 1 && ` and ${expert.notable_cases.length - 1} more cases`}
                      </p>
                    </div>
                  )}
                  
                  {/* Contact Actions */}
                  <div className="pt-3 border-t space-y-2">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 group-hover:bg-blue-50 group-hover:border-blue-300">
                        <Phone className="w-4 h-4 mr-2 text-green-600" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 group-hover:bg-green-50 group-hover:border-green-300">
                        <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                        Chat
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-50 group-hover:border-purple-300">
                      <Mail className="w-4 h-4 mr-2 text-purple-600" />
                      Email Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all experts</p>
          </div>
        )}
      </div>
    </div>
  );
}
