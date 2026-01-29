import React, { useState } from "react";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Plus,
  Eye,
  Edit,
  Share2,
  Calendar,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";

export default function Documents() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Employment Agreement Template",
      type: "Contract",
      size: "2.3 MB",
      created: "2024-01-15",
      lastModified: "2024-01-20",
      status: "Active",
      tags: ["Employment", "HR", "Legal"],
      description: "Standard employment agreement template for Indian companies"
    },
    {
      id: 2,
      name: "Non-Disclosure Agreement (NDA)",
      type: "Agreement",
      size: "1.8 MB", 
      created: "2024-01-10",
      lastModified: "2024-01-18",
      status: "Draft",
      tags: ["NDA", "Confidentiality", "Business"],
      description: "Mutual non-disclosure agreement template"
    },
    {
      id: 3,
      name: "Property Sale Deed Format",
      type: "Legal Document",
      size: "3.1 MB",
      created: "2024-01-05",
      lastModified: "2024-01-22",
      status: "Active",
      tags: ["Property", "Sale", "Real Estate"],
      description: "Standard property sale deed format as per Indian laws"
    },
    {
      id: 4,
      name: "Company Incorporation Documents",
      type: "Corporate",
      size: "5.2 MB",
      created: "2024-01-01",
      lastModified: "2024-01-25",
      status: "Completed",
      tags: ["Incorporation", "ROC", "Corporate"],
      description: "Complete set of documents for company incorporation"
    }
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newDocument, setNewDocument] = useState({
    name: "",
    description: "",
    tags: "",
    category: "Contract"
  });

  const categories = ["all", "Contract", "Agreement", "Legal Document", "Corporate", "Compliance"];
  
  const statusColors = {
    "Active": "bg-green-100 text-green-800 border-green-200",
    "Draft": "bg-yellow-100 text-yellow-800 border-yellow-200", 
    "Completed": "bg-blue-100 text-blue-800 border-blue-200",
    "Archived": "bg-gray-100 text-gray-800 border-gray-200"
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      
      // Add to documents list
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        type: newDocument.category,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        created: format(new Date(), "yyyy-MM-dd"),
        lastModified: format(new Date(), "yyyy-MM-dd"),
        status: "Active",
        tags: newDocument.tags ? newDocument.tags.split(',').map(tag => tag.trim()) : [],
        description: newDocument.description || "Uploaded document",
        file_url
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      setNewDocument({ name: "", description: "", tags: "", category: "Contract" });
      
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const documentTemplates = [
    {
      name: "Rental Agreement Template",
      category: "Agreement",
      description: "Standard rental agreement template for Indian properties",
      downloadable: true
    },
    {
      name: "Partnership Deed Format",
      category: "Corporate",
      description: "Partnership deed template for business partnerships",
      downloadable: true
    },
    {
      name: "Power of Attorney Format",
      category: "Legal Document", 
      description: "General power of attorney template",
      downloadable: true
    },
    {
      name: "Will and Testament Template",
      category: "Legal Document",
      description: "Last will and testament template as per Indian laws",
      downloadable: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Smart Documents</h1>
          <p className="text-xl text-green-100 mb-4">
            Manage, create, and organize your legal documents with AI assistance
          </p>
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            <span className="text-green-200">Secure document management for legal professionals</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 -mt-8">
        <Tabs defaultValue="my-documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-lg rounded-xl p-1">
            <TabsTrigger value="my-documents" className="rounded-lg">My Documents</TabsTrigger>
            <TabsTrigger value="templates" className="rounded-lg">Templates</TabsTrigger>
            <TabsTrigger value="upload" className="rounded-lg">Upload & Create</TabsTrigger>
          </TabsList>

          {/* My Documents Tab */}
          <TabsContent value="my-documents" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </option>
                      ))}
                    </select>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      New Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                            {doc.name}
                          </CardTitle>
                          <Badge className={`${statusColors[doc.status]} border text-xs mt-2`}>
                            {doc.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{doc.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Size:</span>
                        <span className="text-gray-700">{doc.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Modified:</span>
                        <span className="text-gray-700">{format(new Date(doc.lastModified), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    
                    {doc.tags && doc.tags.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-3 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-white shadow-xl border-0 mb-6">
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
                <p className="text-gray-600">Ready-to-use legal document templates</p>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentTemplates.map((template, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                          {template.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{template.description}</p>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upload & Create Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    Upload Document
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Name</label>
                    <Input
                      value={newDocument.name}
                      onChange={(e) => setNewDocument(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter document name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newDocument.category}
                      onChange={(e) => setNewDocument(prev => ({...prev, category: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={newDocument.description}
                      onChange={(e) => setNewDocument(prev => ({...prev, description: e.target.value}))}
                      placeholder="Brief description of the document"
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                    <Input
                      value={newDocument.tags}
                      onChange={(e) => setNewDocument(prev => ({...prev, tags: e.target.value}))}
                      placeholder="legal, contract, important"
                    />
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {isUploading ? "Uploading..." : "Choose files or drag and drop"}
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX, TXT files up to 10MB
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                    <FileText className="w-4 h-4 mr-3" />
                    Create New Contract
                  </Button>
                  <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100">
                    <Edit className="w-4 h-4 mr-3" />
                    Draft Legal Notice
                  </Button>
                  <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100">
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Generate Agreement
                  </Button>
                  <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100">
                    <Calendar className="w-4 h-4 mr-3" />
                    Schedule Review
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
