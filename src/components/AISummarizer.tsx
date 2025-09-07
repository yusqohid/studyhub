"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  MessageSquare,
  HelpCircle,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";
import { summarizeText, generateStudyQuestions, explainConcept, SummarizeOptions } from "@/lib/gemini";

// Simple toast notification (replace with your preferred toast library)
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`)
};

interface AISummarizerProps {
  content: string;
  title?: string;
  onSummaryGenerated?: (summary: string) => void;
}

export function AISummarizer({ content, title, onSummaryGenerated }: AISummarizerProps) {
  const [activeTab, setActiveTab] = useState<'summarize' | 'questions' | 'explain'>('summarize');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Summarization options
  const [options, setOptions] = useState<SummarizeOptions>({
    length: 'medium',
    style: 'bullet',
    focus: 'key_points',
    language: 'id'
  });
  
  // Study questions options
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Concept explanation
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast.error('Tidak ada konten untuk diringkas');
      return;
    }

    setLoading(true);
    try {
      const summary = await summarizeText(content, title, options);
      setResult(summary);
      onSummaryGenerated?.(summary);
      toast.success('Ringkasan berhasil dibuat!');
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error('Gagal membuat ringkasan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!content.trim()) {
      toast.error('Tidak ada konten untuk membuat pertanyaan');
      return;
    }

    setLoading(true);
    try {
      const questions = await generateStudyQuestions(content, title, difficulty);
      setResult(questions);
      toast.success('Pertanyaan belajar berhasil dibuat!');
    } catch (error) {
      console.error('Question generation error:', error);
      toast.error('Gagal membuat pertanyaan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleExplainConcept = async () => {
    if (!concept.trim()) {
      toast.error('Masukkan konsep yang ingin dijelaskan');
      return;
    }

    setLoading(true);
    try {
      const explanation = await explainConcept(concept, content, level);
      setResult(explanation);
      toast.success('Penjelasan konsep berhasil dibuat!');
    } catch (error) {
      console.error('Concept explanation error:', error);
      toast.error('Gagal menjelaskan konsep. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Hasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Gagal menyalin ke clipboard');
    }
  };

  const clearResult = () => {
    setResult('');
    setConcept('');
  };

  if (!content.trim()) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Masukkan konten catatan untuk menggunakan AI Summarizer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <CardTitle>AI Study Assistant</CardTitle>
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Gemini
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summarize" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Pertanyaan
            </TabsTrigger>
            <TabsTrigger value="explain" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Jelaskan
            </TabsTrigger>
          </TabsList>

          {/* Summarize Tab */}
          <TabsContent value="summarize" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Panjang</label>
                <Select 
                  value={options.length} 
                  onValueChange={(value: 'short' | 'medium' | 'long') => 
                    setOptions({...options, length: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Pendek</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="long">Panjang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Gaya</label>
                <Select 
                  value={options.style} 
                  onValueChange={(value: 'bullet' | 'paragraph' | 'outline') => 
                    setOptions({...options, style: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullet">Bullet Points</SelectItem>
                    <SelectItem value="paragraph">Paragraf</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fokus</label>
                <Select 
                  value={options.focus} 
                  onValueChange={(value: 'key_points' | 'concepts' | 'actionable') => 
                    setOptions({...options, focus: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="key_points">Poin Kunci</SelectItem>
                    <SelectItem value="concepts">Konsep</SelectItem>
                    <SelectItem value="actionable">Praktis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bahasa</label>
                <Select 
                  value={options.language} 
                  onValueChange={(value: 'id' | 'en') => 
                    setOptions({...options, language: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleSummarize} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Membuat ringkasan...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Buat Ringkasan
                </>
              )}
            </Button>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Level Kesulitan</label>
              <Select 
                value={difficulty} 
                onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Mudah</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="hard">Sulit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerateQuestions} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Membuat pertanyaan...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Buat Pertanyaan Belajar
                </>
              )}
            </Button>
          </TabsContent>

          {/* Explain Tab */}
          <TabsContent value="explain" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Konsep yang ingin dijelaskan</label>
              <Textarea
                placeholder="Contoh: Integral, Fotosintesis, Machine Learning..."
                value={concept}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConcept(e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Level Penjelasan</label>
              <Select 
                value={level} 
                onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Pemula</SelectItem>
                  <SelectItem value="intermediate">Menengah</SelectItem>
                  <SelectItem value="advanced">Lanjut</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleExplainConcept} 
              disabled={loading || !concept.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menjelaskan konsep...
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Jelaskan Konsep
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Result Section */}
        {result && (
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Hasil</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? 'Tersalin!' : 'Salin'}
                </Button>
                <Button variant="outline" size="sm" onClick={clearResult}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Bersihkan
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                {result}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
