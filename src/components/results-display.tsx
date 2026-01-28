"use client";

import { ArrowLeft, MessageCircle, Heart, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkerInput, markerInfo, parseMarkerValue } from "@/lib/fertility-markers";
import { useState } from "react";

interface ResultsDisplayProps {
  results: string;
  questions: string[];
  markers: MarkerInput;
  age: number;
  onStartOver: () => void;
}

export function ResultsDisplay({ 
  results, 
  questions, 
  markers, 
  age, 
  onStartOver 
}: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyQuestions = () => {
    const text = questions.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get markers that have values
  const activeMarkers = (Object.keys(markers) as Array<keyof MarkerInput>)
    .filter((key) => markers[key] && parseMarkerValue(markers[key]) !== null);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={onStartOver}
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Start over with new results
      </button>

      {/* Header Card */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Your Results Decoded</h1>
              <p className="text-muted-foreground text-sm">Personalized for age {age}</p>
            </div>
          </div>

          {/* Summary of values entered */}
          <div className="flex flex-wrap gap-2 mt-4">
            {activeMarkers.map((key) => (
              <span 
                key={key}
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                {markerInfo[key].fullName.split(" ")[0]}: {markers[key]} {markerInfo[key].unit}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interpretation */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center text-sm">
              📊
            </span>
            What Your Results Mean
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {results.split("\n").map((paragraph, index) => (
              <p key={index} className="text-foreground leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions for Doctor */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm">
                <MessageCircle className="h-4 w-4" />
              </span>
              Questions to Ask Your Doctor
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyQuestions}
              className="text-muted-foreground"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy all
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {questions.map((question, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs text-primary font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-foreground">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50/80 border-amber-200/50 shadow-sm mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Reminder</p>
              <p>
                This interpretation is for educational purposes only and should not replace 
                professional medical advice. Always discuss your results with your healthcare 
                provider who knows your complete medical history.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Decode Different Results
        </Button>
      </div>
    </div>
  );
}
