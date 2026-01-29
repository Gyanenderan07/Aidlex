import React, { useState } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Scale, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Brain,
  Gavel,
  Target
} from "lucide-react";

export default function CasePredictor() {
  const [caseDetails, setCaseDetails] = useState({
    caseType: "",
    description: "",
    court: "",
    opponent: "",
    evidence: "",
    legalBasis: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const caseTypes = [
    "Civil Dispute", 
    "Criminal Case", 
    "Corporate Law", 
    "Family Law", 
    "Property Dispute",
    "Contract Breach",
    "Employment Law",
    "Intellectual Property",
    "Tax Law",
    "Constitutional Law"
  ];

  const courts = [
    "Supreme Court of India",
    "Delhi High Court",
    "Bombay High Court", 
    "Madras High Court",
    "Calcutta High Court",
    "Karnataka High Court",
    "District Court",
    "Family Court",
    "Consumer Court"
  ];

  const handlePredict = async () => {
    if (!caseDetails.caseType || !caseDetails.description) {
      alert("Please fill in at least case type and description");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await InvokeLLM({
        prompt: `You are an expert legal AI analyst for Indian courts. Based on the following case details, provide a comprehensive case outcome prediction with statistical analysis:

Case Type: ${caseDetails.caseType}
Description: ${caseDetails.description}
Court: ${caseDetails.court || "Not specified"}
Opponent: ${caseDetails.opponent || "Not specified"}
Evidence: ${caseDetails.evidence || "Not specified"}
Legal Basis: ${caseDetails.legalBasis || "Not specified"}

Please provide a detailed analysis including:
1. Win Probability (0-100%)
2. Key Success Factors
3. Potential Challenges
4. Similar Case Precedents
5. Recommended Strategy
6. Timeline Estimation
7. Cost Analysis Range
8. Risk Assessment

Format your response as a structured JSON with these fields:
{
  "winProbability": number,
  "successFactors": array,
  "challenges": array,
  "precedents": array,
  "strategy": array,
  "timelineMonths": number,
  "costRange": string,
  "riskLevel": "Low|Medium|High",
  "summary": string
}`,
        response_json_schema: {
          type: "object",
          properties: {
            winProbability: { type: "number" },
            successFactors: { type: "array", items: { type: "string" } },
            challenges: { type: "array", items: { type: "string" } },
            precedents: { type: "array", items: { type: "string" } },
            strategy: { type: "array", items: { type: "string" } },
            timelineMonths: { type: "number" },
            costRange: { type: "string" },
            riskLevel: { type: "string" },
            summary: { type: "string" }
          }
        }
      });

      setPrediction(response);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Error analyzing case. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleCases = [
    {
      title: "Property Dispute Resolution",
      type: "Property Dispute",
      winRate: 78,
      avgDuration: "18 months",
      description: "Boundary dispute between neighbors resolved in favor of plaintiff"
    },
    {
      title: "Contract Breach Case",
      type: "Contract Breach", 
      winRate: 65,
      avgDuration: "12 months",
      description: "Service agreement breach with substantial damages awarded"
    },
    {
      title: "Employment Termination",
      type: "Employment Law",
      winRate: 82,
      avgDuration: "8 months", 
      description: "Wrongful termination case settled with compensation"
    }
  ];

  const getRiskColor = (risk) => {
    switch(risk) {
      case "Low": return "text-green-700 bg-green-100";
      case "Medium": return "text-yellow-700 bg-yellow-100";
      case "High": return "text-red-700 bg-red-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const getProbabilityColor = (prob) => {
    if (prob >= 70) return "text-green-700";
    if (prob >= 50) return "text-yellow-700";
    return "text-red-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Case Predictor</h1>
          </div>
          <p className="text-xl text-purple-100 mb-4">
            AI-powered case outcome prediction and legal strategy analysis
          </p>
          <div className="flex items-center justify-center gap-2">
            <Brain className="w-5 h-5" />
            <span className="text-purple-200">Advanced machine learning algorithms trained on Indian case law</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 -mt-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                Case Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Case Type *</label>
                <select
                  value={caseDetails.caseType}
                  onChange={(e) => setCaseDetails(prev => ({...prev, caseType: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select case type</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Court</label>
                <select
                  value={caseDetails.court}
                  onChange={(e) => setCaseDetails(prev => ({...prev, court: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select court</option>
                  {courts.map(court => (
                    <option key={court} value={court}>{court}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Case Description *</label>
                <Textarea
                  value={caseDetails.description}
                  onChange={(e) => setCaseDetails(prev => ({...prev, description: e.target.value}))}
                  placeholder="Provide detailed description of your case including key facts and circumstances..."
                  className="h-24 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Opponent/Other Party</label>
                <Input
                  value={caseDetails.opponent}
                  onChange={(e) => setCaseDetails(prev => ({...prev, opponent: e.target.value}))}
                  placeholder="Name of opposing party or organization"
                  className="focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Evidence Available</label>
                <Textarea
                  value={caseDetails.evidence}
                  onChange={(e) => setCaseDetails(prev => ({...prev, evidence: e.target.value}))}
                  placeholder="List key evidence, documents, witnesses available..."
                  className="h-20 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Legal Basis</label>
                <Textarea
                  value={caseDetails.legalBasis}
                  onChange={(e) => setCaseDetails(prev => ({...prev, legalBasis: e.target.value}))}
                  placeholder="Relevant laws, acts, sections, constitutional provisions..."
                  className="h-20 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <Button 
                onClick={handlePredict}
                disabled={isAnalyzing || !caseDetails.caseType || !caseDetails.description}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Case...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Predict Case Outcome
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Prediction Results */}
          {prediction ? (
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Case Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Win Probability */}
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getProbabilityColor(prediction.winProbability)}`}>
                    {prediction.winProbability}%
                  </div>
                  <p className="text-gray-600 mb-4">Predicted Win Probability</p>
                  <Progress value={prediction.winProbability} className="w-full h-3" />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold">{prediction.timelineMonths} months</div>
                    <div className="text-xs text-gray-600">Est. Duration</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold">{prediction.costRange}</div>
                    <div className="text-xs text-gray-600">Cost Range</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <Badge className={`text-xs ${getRiskColor(prediction.riskLevel)}`}>
                      {prediction.riskLevel} Risk
                    </Badge>
                    <div className="text-xs text-gray-600 mt-1">Risk Level</div>
                  </div>
                </div>

                {/* Success Factors */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Success Factors
                  </h4>
                  <div className="space-y-2">
                    {prediction.successFactors?.map((factor, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    Potential Challenges
                  </h4>
                  <div className="space-y-2">
                    {prediction.challenges?.map((challenge, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategy Recommendations */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-blue-600" />
                    Recommended Strategy
                  </h4>
                  <div className="space-y-2">
                    {prediction.strategy?.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Analysis Summary</h4>
                  <p className="text-sm text-gray-700">{prediction.summary}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Sample Cases
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  Sample Case Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleCases.map((case_item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{case_item.title}</h4>
                        <Badge variant="outline">{case_item.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{case_item.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className={`font-semibold ${getProbabilityColor(case_item.winRate)}`}>
                            {case_item.winRate}% win rate
                          </span>
                          <span className="text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {case_item.avgDuration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
