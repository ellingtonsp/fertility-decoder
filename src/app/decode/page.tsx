"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { UploadSection } from "@/components/upload-section";
import { ManualEntryForm } from "@/components/manual-entry-form";
import { ResultsDisplay } from "@/components/results-display";
import { MarkerInput, defaultMarkers } from "@/lib/fertility-markers";

export default function DecodePage() {
  const [age, setAge] = useState(32);
  const [markers, setMarkers] = useState<MarkerInput>(defaultMarkers);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [step, setStep] = useState<"input" | "results">("input");

  const handleMarkersExtracted = (extractedMarkers: Partial<MarkerInput>) => {
    setMarkers((prev) => ({ ...prev, ...extractedMarkers }));
  };

  const handleAnalyze = async () => {
    // Check if at least one marker has a value
    const hasValues = Object.values(markers).some((v) => v && v.trim() !== "");
    if (!hasValues) {
      alert("Please enter at least one marker value");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markers, age }),
      });

      if (!response.ok) throw new Error("Failed to analyze");

      const data = await response.json();
      setResults(data.interpretation);
      setQuestions(data.questions);
      setStep("results");
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setMarkers(defaultMarkers);
    setResults(null);
    setQuestions([]);
    setStep("input");
  };

  return (
    <div className="min-h-screen gradient-soft">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold text-foreground">Fertility Decoder</span>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 pb-16">
        {step === "input" ? (
          <>
            {/* Back Link */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            {/* Age Slider */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <Label className="text-base font-medium mb-4 block">
                  Your Age: <span className="text-primary font-semibold">{age}</span>
                </Label>
                <Slider
                  value={[age]}
                  onValueChange={(value) => setAge(value[0])}
                  min={20}
                  max={50}
                  step={1}
                  className="py-4"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Fertility markers are interpreted differently based on age. This helps us give you relevant context.
                </p>
              </div>
            </div>

            {/* Input Tabs */}
            <div className="max-w-2xl mx-auto">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Upload PDF</TabsTrigger>
                  <TabsTrigger value="manual">Enter Manually</TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <UploadSection onMarkersExtracted={handleMarkersExtracted} />
                  
                  {/* Show extracted values */}
                  {Object.values(markers).some((v) => v) && (
                    <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                      <h3 className="font-medium mb-4">Extracted Values (edit if needed)</h3>
                      <ManualEntryForm markers={markers} onChange={setMarkers} />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                    <p className="text-muted-foreground mb-6">
                      Enter the values from your lab results. You can skip any markers you don&apos;t have.
                    </p>
                    <ManualEntryForm markers={markers} onChange={setMarkers} />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Analyze Button */}
              <div className="mt-8 text-center">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="text-lg px-8 py-6 rounded-full"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="animate-gentle-pulse">Analyzing...</span>
                    </>
                  ) : (
                    "Decode My Results"
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <ResultsDisplay
            results={results!}
            questions={questions}
            markers={markers}
            age={age}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
}
