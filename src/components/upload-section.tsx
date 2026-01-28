"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkerInput } from "@/lib/fertility-markers";

interface UploadSectionProps {
  onMarkersExtracted: (markers: Partial<MarkerInput>) => void;
}

export function UploadSection({ onMarkersExtracted }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setUploadStatus("error");
      setStatusMessage("Please upload a PDF file");
      return;
    }

    setIsProcessing(true);
    setUploadStatus("idle");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const data = await response.json();
      
      if (data.markers && Object.keys(data.markers).length > 0) {
        onMarkersExtracted(data.markers);
        setUploadStatus("success");
        setStatusMessage(`Found ${Object.keys(data.markers).filter(k => data.markers[k]).length} marker(s) in your lab results`);
      } else {
        setUploadStatus("error");
        setStatusMessage("Could not find fertility markers in this PDF. Try entering values manually.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setStatusMessage("Error processing PDF. Please try entering values manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center transition-all
          ${isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50"
          }
          ${isProcessing ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-gentle-pulse">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">Processing your lab results...</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <p className="text-foreground font-medium mb-2">
              Drop your lab results PDF here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </>
        )}
      </div>

      {/* Status Message */}
      {uploadStatus !== "idle" && (
        <div className={`
          mt-4 p-4 rounded-xl flex items-start gap-3
          ${uploadStatus === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}
        `}>
          {uploadStatus === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{statusMessage}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Your file is processed securely and not stored. We support most standard lab report formats.
      </p>
    </div>
  );
}
