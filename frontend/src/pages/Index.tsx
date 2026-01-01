
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import AnalyzerAnimation from "@/components/AnalyzerAnimation";
import ResultsDisplay from "@/components/ResultsDisplay";
import { analyzeImage, analyzeImageUrl } from "@/services/api";
import { ArrowDown, Leaf, Sparkles, Apple, Carrot, BarChart4 } from 'lucide-react';

interface AnalysisResult {
  name: string;
  quality: number;
  moisture: number;
  size: string;
  insight: string;
  price?: string;
  quantity?: string;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelected = useCallback((file: File) => {
    setSelectedFile(file);
    setSelectedUrl(null);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const handleUrlSubmit = useCallback((url: string) => {
    setSelectedUrl(url);
    setSelectedFile(null);
    setPreviewUrl(url);
    setResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile && !selectedUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image or provide a URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      let analysisResult;

      if (selectedFile) {
        analysisResult = await analyzeImage(selectedFile);
      } else if (selectedUrl) {
        analysisResult = await analyzeImageUrl(selectedUrl);
      }

      // Add a short delay to show the analysis animation
      setTimeout(() => {
        if (analysisResult) {
          setResult(analysisResult);
        }
        setIsAnalyzing(false);
      }, 1500);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing your image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  }, [selectedFile, selectedUrl, toast]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setSelectedUrl(null);
    setPreviewUrl(null);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-28 overflow-hidden">
          <div className="circle-blur bg-primary/30 top-0 left-1/4 transform -translate-x-1/2"></div>
          <div className="circle-blur bg-secondary/30 bottom-0 right-1/4 transform translate-x-1/2"></div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center md:space-x-12">
              <div className="text-left max-w-xl mb-12 md:mb-0 md:w-1/2">
                <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="mr-1 h-4 w-4" />
                  <span>AI-Powered Produce Analysis</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                  See Your <span className="text-primary">Produce</span> in a Whole New Light
                </h1>

                <p className="text-lg text-muted-foreground mb-8">
                  Discover the hidden quality, moisture content, and market value of any fruit or vegetable with just a photo. Our AI does the work for you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="rounded-full text-base px-8 shadow-lg shadow-primary/20" onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}>
                    Try It Now
                  </Button>

                </div>
              </div>

              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full"></div>
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/20 rounded-full"></div>

                  <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 border border-primary/10 transform rotate-2 transition-transform hover:rotate-0 duration-500">
                    <div className="bg-gradient-to-br from-muted via-white to-muted p-8 backdrop-blur-sm">
                      <div className="flex space-x-6 mb-8">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-green-100 p-4 mb-2">
                            <Apple className="h-8 w-8 text-primary" />
                          </div>
                          <span className="text-sm font-medium">Fruits</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-orange-100 p-4 mb-2">
                            <Carrot className="h-8 w-8 text-accent" />
                          </div>
                          <span className="text-sm font-medium">Vegetables</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-blue-100 p-4 mb-2">
                            <BarChart4 className="h-8 w-8 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium">Analysis</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white shadow-sm border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Apple (Red Delicious)</span>
                            <span className="text-primary font-bold">92%</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: "92%" }}></div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">Quality Score</div>
                        </div>

                        <div className="p-4 rounded-lg bg-white shadow-sm border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">Moisture Content</span>
                            <span className="text-blue-500 font-bold">86%</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: "86%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-14 animate-bounce-light">
              <ArrowDown className="text-primary h-8 w-8" />
            </div>
          </div>
        </section>

        {/* Analyzer Section */}
        <section id="analyzer" className="py-20 relative">
          <div className="circle-blur bg-secondary/20 top-20 right-20"></div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upload & Analyze</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload an image of any fruit or vegetable to get detailed analysis on quality,
                moisture content, size, and current market price.
              </p>
            </div>

            <div className="max-w-3xl mx-auto mb-8 rounded-xl shadow-xl overflow-hidden border border-primary/10">
              <UploadSection
                onImageSelected={handleImageSelected}
                onUrlSubmit={handleUrlSubmit}
                isLoading={isAnalyzing}
              />
            </div>

            {previewUrl && !result && !isAnalyzing && (
              <div className="flex justify-center mt-8 animate-fade-in">
                <Button size="lg" className="rounded-full text-base px-10 py-6 shadow-lg shadow-primary/20" onClick={handleAnalyze}>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Now
                </Button>
              </div>
            )}

            {result && previewUrl && (
              <div className="mt-12">
                <ResultsDisplay
                  result={result}
                  imageUrl={previewUrl}
                  onReset={handleReset}
                />
              </div>
            )}
          </div>

          {/* Analyzer Animation */}
          <AnalyzerAnimation isAnalyzing={isAnalyzing} />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-background">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-700">What you'll discover</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* Card 1: Quality Analysis */}
              <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-green-100/50 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Quality Analysis</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  AI-powered scoring & visual insights
                </p>
              </div>

              {/* Card 2: Fair Price Meter */}
              <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-cyan-100/50 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-cyan-600">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Fair Price Meter</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Real-time market price comparison
                </p>
              </div>

              {/* Card 3: Eat Me When */}
              <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-orange-100/50 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-orange-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Eat Me When</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Smart shelf-life predictions
                </p>
              </div>

              {/* Card 4: Smart Recipes */}
              <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-red-100/50 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-red-500">
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                    <line x1="6" y1="17" x2="18" y2="17"></line>
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Smart Recipes</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Context-aware recipe suggestions
                </p>
              </div>

              {/* Card 5: Macro Scanner */}
              <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-green-100/50 flex items-center justify-center mb-4">
                  <Apple className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Macro Scanner</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Detailed nutritional breakdown
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
