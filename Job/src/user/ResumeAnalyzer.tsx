import { useState } from "react";
import resumeAPI from "../API/resume";
import UserNavbar from "./UserNavbar";
import {
  Upload, FileText, Sparkles, CheckCircle2, XCircle,
  AlertCircle, Loader2, Award, TrendingUp, Target,
  Zap, Download, RefreshCw, Brain
} from "lucide-react";

interface AnalysisResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations: Array<{
    priority: string;
    recommendation: string;
  }>;
  keywordDensity?: number;
  summary?: string;
  details?: {
    skillMatch: number;
    keywordMatch: number;
    formattingScore: number;
  };
  aiPowered?: boolean;
}

function ResumeAnalyzer() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      
      if (allowedTypes.includes(file.type)) {
        setResume(file);
        setErrorMessage(null);
      } else {
        setErrorMessage("Please upload a PDF or DOCX file only");
      }
    }
  };

  const handleButtonClick = async () => {
    setErrorMessage(null);

    if (!resume) {
      setErrorMessage("Please upload your resume (PDF or DOCX)");
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 100) {
      setErrorMessage("Please enter a job description (minimum 100 characters)");
      return;
    }

    setResultData(null);
    setLoading(true);

    try {
      const response = await resumeAPI.analyzeResume(resume, jobDescription);
      
      if (response.data && response.data.analysis) {
        setResultData(response.data.analysis);
        console.log('✅ Analysis complete:', response.data.analysis);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error("❌ Analysis request failed:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.details || error.message || "Something went wrong. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResume(null);
    setJobDescription("");
    setResultData(null);
    setErrorMessage(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "Excellent!", color: "bg-green-100 text-green-700 border-green-200" };
    if (score >= 60) return { text: "Good", color: "bg-blue-100 text-blue-700 border-blue-200" };
    if (score >= 40) return { text: "Needs Improvement", color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { text: "Poor Match", color: "bg-red-100 text-red-700 border-red-200" };
  };

  return (
    <>
      <UserNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 text-center space-y-4 text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles size={16} className="text-yellow-300" />
                <span>AI-Powered ATS Analysis</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                📑 Resume Analyzer
              </h1>

              <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
                Get instant insights on your resume's ATS compatibility and match score
              </p>
            </div>
          </div>

          {/* Upload Section */}
          {!resultData && (
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
              
              {/* Resume Upload */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Upload Resume</h2>
                    <p className="text-sm text-slate-600">PDF or DOCX, max 5MB</p>
                  </div>
                </div>

                <label
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : resume
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-center space-y-4">
                    {resume ? (
                      <>
                        <CheckCircle2 className="mx-auto text-green-600" size={48} />
                        <div>
                          <p className="font-bold text-slate-900">{resume.name}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {(resume.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setResume(null);
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-semibold"
                        >
                          Remove File
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload className="mx-auto text-slate-400" size={48} />
                        <div>
                          <p className="font-semibold text-slate-900">Drop your resume here</p>
                          <p className="text-sm text-slate-600 mt-1">or click to browse</p>
                        </div>
                        <p className="text-xs text-slate-500">Supports: PDF, DOCX (Max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        setResume(file);
                        setErrorMessage(null);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Job Description</h2>
                    <p className="text-sm text-slate-600">Paste the job requirements</p>
                  </div>
                </div>

                <textarea
                  rows={10}
                  placeholder="Paste the job description here...&#10;&#10;Include:&#10;• Required skills&#10;• Experience level&#10;• Responsibilities&#10;• Qualifications"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full border-2 border-slate-200 p-4 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-700 placeholder-slate-400"
                />
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {jobDescription.length} characters
                  </span>
                  {jobDescription && (
                    <button
                      onClick={() => setJobDescription("")}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {!resultData && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleButtonClick}
                disabled={loading || !resume || !jobDescription}
                className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    <span>Analyze Resume</span>
                    <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>

              {errorMessage && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Results Section */}
          {resultData && (
            <div className="space-y-8">
              
              {/* Reset Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  <RefreshCw size={18} />
                  Analyze Another Resume
                </button>
              </div>

              {/* ATS Score Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 bg-gradient-to-r ${getScoreColor(resultData.score)} rounded-xl`}>
                    <Award className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">ATS Compatibility Score</h2>
                    <p className="text-slate-600">How well your resume matches the job description</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Circular Progress */}
                  <div className="flex justify-center">
                    <div className="relative w-64 h-64">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="128"
                          cy="128"
                          r="110"
                          stroke="#e5e7eb"
                          strokeWidth="20"
                          fill="none"
                        />
                        <circle
                          cx="128"
                          cy="128"
                          r="110"
                          stroke={`url(#scoreGradient)`}
                          strokeWidth="20"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 110}`}
                          strokeDashoffset={`${2 * Math.PI * 110 * (1 - resultData.score / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={resultData.score >= 80 ? "#10b981" : resultData.score >= 60 ? "#3b82f6" : resultData.score >= 40 ? "#f59e0b" : "#ef4444"} />
                            <stop offset="100%" stopColor={resultData.score >= 80 ? "#059669" : resultData.score >= 60 ? "#06b6d4" : resultData.score >= 40 ? "#f97316" : "#ec4899"} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-7xl font-black text-slate-900">{resultData.score}</span>
                        <span className="text-2xl text-slate-600 font-bold">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="space-y-6">
                    <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border font-bold ${getScoreBadge(resultData.score).color}`}>
                      <Award size={20} />
                      {getScoreBadge(resultData.score).text}
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">Keyword Match</span>
                          <span className="text-sm font-bold text-slate-900">
                            {resultData.matchedSkills.length} / {resultData.matchedSkills.length + resultData.missingSkills.length}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${getScoreColor(resultData.score)} h-2 rounded-full`}
                            style={{ width: `${(resultData.matchedSkills.length / (resultData.matchedSkills.length + resultData.missingSkills.length)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-slate-700">
                          {resultData.score >= 80 
                            ? "Your resume is well-optimized for ATS systems!"
                            : resultData.score >= 60
                            ? "Your resume has good potential with some improvements."
                            : "Consider optimizing your resume for better ATS compatibility."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Matched Skills */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle2 className="text-green-600" size={28} />
                    <h3 className="text-2xl font-bold text-green-600">Matched Skills</h3>
                  </div>
                  
                  {resultData.matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {resultData.matchedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold border border-green-200 hover:scale-105 transition-transform"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No matched skills found</p>
                  )}
                </div>

                {/* Missing Skills */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <XCircle className="text-red-600" size={28} />
                    <h3 className="text-2xl font-bold text-red-600">Missing Skills</h3>
                  </div>
                  
                  {resultData.missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {resultData.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold border border-red-200 hover:scale-105 transition-transform"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Excellent! All key skills are present</p>
                  )}
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    {resultData.aiPowered ? <Brain className="text-white" size={24} /> : <Sparkles className="text-white" size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                      {resultData.aiPowered ? "AI-Powered" : ""} Recommendations
                    </h2>
                    <p className="text-slate-600">Actionable tips to improve your resume</p>
                  </div>
                </div>

                {resultData.summary && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <p className="text-slate-700 font-medium">{resultData.summary}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {resultData.recommendations && resultData.recommendations.length > 0 ? (
                    resultData.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-purple-50 hover:from-purple-50 hover:to-pink-50 rounded-xl border border-slate-100 hover:border-purple-200 transition-all group"
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          rec.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          <Target size={18} />
                        </div>
                        <div className="flex-1">
                          <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full mb-2 ${
                            rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {rec.priority} Priority
                          </span>
                          <p className="text-slate-800 font-medium group-hover:text-purple-700 transition-colors">
                            {rec.recommendation}
                          </p>
                        </div>
                        <Zap size={16} className="text-slate-400 group-hover:text-purple-600 flex-shrink-0 mt-1" />
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No recommendations available</p>
                  )}
                </div>

                {/* Strengths and Weaknesses */}
                {(resultData.strengths || resultData.weaknesses) && (
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {resultData.strengths && resultData.strengths.length > 0 && (
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle2 size={18} />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {resultData.strengths.map((strength, idx) => (
                            <li key={idx} className="text-sm text-green-700">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {resultData.weaknesses && resultData.weaknesses.length > 0 && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                          <AlertCircle size={18} />
                          Areas to Improve
                        </h4>
                        <ul className="space-y-2">
                          {resultData.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="text-sm text-red-700">• {weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Download Report Button */}
              <div className="text-center">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all hover:scale-105">
                  <Download size={20} />
                  Download Full Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResumeAnalyzer;
