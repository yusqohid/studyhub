"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  MessageSquare,
  HelpCircle,
  Wand2,
  RefreshCw,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface SummarizeOptions {
  length?: 'short' | 'medium' | 'long';
  style?: 'bullet' | 'paragraph' | 'outline';
  focus?: 'key_points' | 'concepts' | 'actionable';
  language?: 'id' | 'en';
}

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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  
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

  // Estimate processing time based on content length
  const estimateProcessingTime = (contentLength: number, type: string) => {
    const baseTime = type === 'summarize' ? 10 : type === 'questions' ? 15 : 12;
    const lengthFactor = Math.ceil(contentLength / 500);
    return Math.min(baseTime + (lengthFactor * 3), 45); // Max 45 seconds
  };

  // Progress simulation
  const simulateProgress = (duration: number) => {
    setProgress(0);
    const interval = 100;
    const increment = 100 / (duration * 1000 / interval);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 95); // Stop at 95% until actual completion
      });
    }, interval);
    
    return timer;
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast.error('Tidak ada konten untuk diringkas');
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');
    
    const estimatedDuration = estimateProcessingTime(content.length, 'summarize');
    setEstimatedTime(estimatedDuration);
    
    const progressTimer = simulateProgress(estimatedDuration);

    try {
      toast.loading('Membuat ringkasan dengan AI...', { id: 'summarize' });
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          type: 'summarize',
          options
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data = await response.json();
      setProgress(100);
      clearInterval(progressTimer);
      
      setResult(data.result);
      onSummaryGenerated?.(data.result);
      
      toast.success('Ringkasan berhasil dibuat! 🎉', { id: 'summarize' });
    } catch (error) {
      console.error('Summarization error:', error);
      clearInterval(progressTimer);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat ringkasan';
      setError(errorMessage);
      toast.error(`Gagal membuat ringkasan: ${errorMessage}`, { id: 'summarize' });
    } finally {
      setLoading(false);
      setEstimatedTime(null);
      setTimeout(() => setProgress(0), 1000); // Reset progress after delay
    }
  };

  const handleGenerateQuestions = async () => {
    if (!content.trim()) {
      toast.error('Tidak ada konten untuk membuat pertanyaan');
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');
    
    const estimatedDuration = estimateProcessingTime(content.length, 'questions');
    setEstimatedTime(estimatedDuration);
    
    const progressTimer = simulateProgress(estimatedDuration);

    try {
      toast.loading('Membuat pertanyaan belajar...', { id: 'questions' });
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          type: 'questions',
          options: { difficulty }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setProgress(100);
      clearInterval(progressTimer);
      
      setResult(data.result);
      toast.success('Pertanyaan belajar berhasil dibuat! 📚', { id: 'questions' });
    } catch (error) {
      console.error('Question generation error:', error);
      clearInterval(progressTimer);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat pertanyaan';
      setError(errorMessage);
      toast.error(`Gagal membuat pertanyaan: ${errorMessage}`, { id: 'questions' });
    } finally {
      setLoading(false);
      setEstimatedTime(null);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleExplainConcept = async () => {
    if (!concept.trim()) {
      toast.error('Masukkan konsep yang ingin dijelaskan');
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');
    
    const estimatedDuration = estimateProcessingTime(concept.length + content.length, 'explain');
    setEstimatedTime(estimatedDuration);
    
    const progressTimer = simulateProgress(estimatedDuration);

    try {
      toast.loading('Menjelaskan konsep...', { id: 'explain' });
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title,
          type: 'explain',
          options: { concept, context: content, level }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to explain concept');
      }

      const data = await response.json();
      setProgress(100);
      clearInterval(progressTimer);
      
      setResult(data.result);
      toast.success('Penjelasan konsep berhasil dibuat! 💡', { id: 'explain' });
    } catch (error) {
      console.error('Concept explanation error:', error);
      clearInterval(progressTimer);
      
      const errorMessage = error instanceof Error ? error.message : 'Gagal menjelaskan konsep';
      setError(errorMessage);
      toast.error(`Gagal menjelaskan konsep: ${errorMessage}`, { id: 'explain' });
    } finally {
      setLoading(false);
      setEstimatedTime(null);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Hasil disalin ke clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = result;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      toast.success('Hasil disalin ke clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearResult = () => {
    setResult('');
    setConcept('');
    setError(null);
    toast.success('Hasil telah dibersihkan');
  };

  const shareResult = async () => {
    if (!result) return;
    
    const shareData = {
      title: `AI Study Assistant - ${title || 'Hasil'}`,
      text: `${title ? title + '\n\n' : ''}${result}`,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Berhasil dibagikan!');
      } else {
        // Fallback to copying
        await copyToClipboard();
      }
    } catch (error) {
      console.error('Share error:', error);
      await copyToClipboard();
    }
  };

  const downloadResult = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-study-${activeTab}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('File berhasil diunduh! 📥');
  };

  if (!content.trim()) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">AI Study Assistant Siap Membantu</h3>
              <p className="text-gray-600">Masukkan konten catatan untuk mulai menggunakan fitur AI</p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Ringkasan Cerdas</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <span>Pertanyaan Belajar</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Penjelasan Konsep</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Study Assistant
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Ringkas, analisis, dan jelaskan konten dengan AI
              </p>
            </div>
          </div>
          {content && (
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{content.length.toLocaleString()} karakter</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Target className="w-4 h-4" />
                <span>~{Math.ceil(content.split(' ').length / 200)} menit baca</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        {loading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="font-medium">
                  {activeTab === 'summarize' && 'Membuat ringkasan cerdas...'}
                  {activeTab === 'questions' && 'Menyusun pertanyaan belajar...'}
                  {activeTab === 'explain' && 'Menjelaskan konsep...'}
                </span>
              </div>
              {estimatedTime && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>~{estimatedTime}s</span>
                </div>
              )}
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              AI sedang memproses konten Anda dengan cermat...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'summarize' | 'questions' | 'explain')}>
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="summarize" className="flex flex-col items-center gap-1 py-3 h-auto">
              <Brain className="w-4 h-4" />
              <span className="font-medium">Ringkasan</span>
              <span className="text-xs text-gray-500">Poin-poin penting</span>
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex flex-col items-center gap-1 py-3 h-auto">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Pertanyaan</span>
              <span className="text-xs text-gray-500">Uji pemahaman</span>
            </TabsTrigger>
            <TabsTrigger value="explain" className="flex flex-col items-center gap-1 py-3 h-auto">
              <HelpCircle className="w-4 h-4" />
              <span className="font-medium">Jelaskan</span>
              <span className="text-xs text-gray-500">Konsep detail</span>
            </TabsTrigger>
          </TabsList>

          {/* Summarize Tab */}
          <TabsContent value="summarize" className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-blue-900">Ringkasan Cerdas</h3>
                  <p className="text-sm text-blue-700">
                    Buat ringkasan yang disesuaikan dengan kebutuhan belajar Anda
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  Panjang
                </label>
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
                    <SelectItem value="short">
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        <span>Pendek (150-200 kata)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <span>📝</span>
                        <span>Sedang (300-400 kata)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="long">
                      <div className="flex items-center gap-2">
                        <span>📚</span>
                        <span>Panjang (500-600 kata)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-gray-500" />
                  Gaya
                </label>
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
                    <SelectItem value="bullet">
                      <div className="flex items-center gap-2">
                        <span>•</span>
                        <span>Bullet Points</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="paragraph">
                      <div className="flex items-center gap-2">
                        <span>¶</span>
                        <span>Paragraf</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="outline">
                      <div className="flex items-center gap-2">
                        <span>📋</span>
                        <span>Outline</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  Fokus
                </label>
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
                    <SelectItem value="key_points">
                      <div className="flex items-center gap-2">
                        <span>🎯</span>
                        <span>Poin Kunci</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="concepts">
                      <div className="flex items-center gap-2">
                        <span>🧠</span>
                        <span>Konsep</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="actionable">
                      <div className="flex items-center gap-2">
                        <span>⚡</span>
                        <span>Praktis</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span className="w-4 h-4 text-center text-xs">🌐</span>
                  Bahasa
                </label>
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
                    <SelectItem value="id">
                      <div className="flex items-center gap-2">
                        <span>🇮🇩</span>
                        <span>Indonesia</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span>🇺🇸</span>
                        <span>English</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleSummarize} 
              disabled={loading}
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Membuat ringkasan...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-3" />
                  Buat Ringkasan Cerdas
                </>
              )}
            </Button>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-green-900">Pertanyaan Belajar</h3>
                  <p className="text-sm text-green-700">
                    Generate pertanyaan untuk menguji dan memperdalam pemahaman
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  Level Kesulitan
                </label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Mudah</div>
                          <div className="text-xs text-gray-500">Pertanyaan dasar & pemahaman konsep</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Sedang</div>
                          <div className="text-xs text-gray-500">Analisis & aplikasi konsep</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="hard">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Sulit</div>
                          <div className="text-xs text-gray-500">Sintesis & evaluasi tingkat tinggi</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Yang akan dihasilkan:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    5-7 pertanyaan berkualitas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Variasi jenis pertanyaan (definisi, analisis, aplikasi)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Disesuaikan dengan level kesulitan
                  </li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateQuestions} 
              disabled={loading}
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Membuat pertanyaan...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Buat Pertanyaan Belajar
                </>
              )}
            </Button>
          </TabsContent>

          {/* Explain Tab */}
          <TabsContent value="explain" className="space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-amber-900">Penjelasan Konsep</h3>
                  <p className="text-sm text-amber-700">
                    Dapatkan penjelasan mendalam tentang konsep tertentu
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-gray-500" />
                  Konsep yang ingin dijelaskan
                </label>
                <Textarea
                  placeholder="Contoh: Integral, Fotosintesis, Machine Learning, Struktur Data, dll..."
                  value={concept}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConcept(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Masukkan konsep, teori, atau topik yang ingin Anda pahami lebih dalam
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  Level Penjelasan
                </label>
                <Select 
                  value={level} 
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setLevel(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Pemula</div>
                          <div className="text-xs text-gray-500">Bahasa sederhana dengan analogi</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Menengah</div>
                          <div className="text-xs text-gray-500">Detail dengan contoh praktis</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Lanjut</div>
                          <div className="text-xs text-gray-500">Analisis mendalam & kompleks</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {concept.trim() && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Format penjelasan akan mencakup:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Definisi singkat dan jelas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Penjelasan detail dengan contoh
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Aplikasi praktis atau relevansi
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Tips untuk memahami/mengingat
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleExplainConcept} 
              disabled={loading || !concept.trim()}
              className="w-full h-12 text-lg font-medium"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Menjelaskan konsep...
                </>
              ) : (
                <>
                  <HelpCircle className="w-5 h-5 mr-3" />
                  Jelaskan Konsep
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Result Section */}
        {result && (
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Hasil AI</h3>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {activeTab === 'summarize' && 'Ringkasan'}
                  {activeTab === 'questions' && 'Pertanyaan'}
                  {activeTab === 'explain' && 'Penjelasan'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Salin
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={shareResult}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResult}>
                  <Download className="w-4 h-4 mr-2" />
                  Unduh
                </Button>
                <Button variant="outline" size="sm" onClick={clearResult}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Bersihkan
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Generated with Gemini AI</span>
                  <span>{new Date().toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-medium">
                    {result}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
                  <span>{result.length} karakter • {result.split(' ').length} kata</span>
                  <span>~{Math.ceil(result.split(' ').length / 200)} menit baca</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
