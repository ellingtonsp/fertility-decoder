"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Heart, MessageCircle, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen gradient-soft">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            <span className="text-xl font-semibold text-foreground">Fertility Decoder</span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="py-16 md:py-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            Finally understand what your lab results mean
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your fertility bloodwork,{" "}
            <span className="text-primary">explained in plain English</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Upload your lab results and get personalized, easy-to-understand interpretations 
            based on your age — plus the right questions to ask your doctor.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/decode">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full">
                Decode My Results
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Free to use • No account required • Your data stays private
          </p>
        </section>

        {/* Features */}
        <section className="py-16 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Your Labs</h3>
                <p className="text-muted-foreground">
                  Upload a PDF of your bloodwork or enter values manually. We extract the key fertility markers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-7 w-7 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Age-Adjusted Insights</h3>
                <p className="text-muted-foreground">
                  Fertility markers mean different things at 28 vs 38. Get context that actually applies to you.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="pt-8 text-center">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Questions for Your Doctor</h3>
                <p className="text-muted-foreground">
                  Get a personalized list of questions to bring to your next appointment.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Markers We Analyze */}
        <section className="py-16 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
            Fertility markers we decode
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            The key tests that tell the story of your ovarian reserve and hormonal health
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {["AMH", "FSH", "LH", "Estradiol (E2)", "TSH", "Prolactin", "AFC"].map((marker) => (
              <span 
                key={marker}
                className="px-4 py-2 bg-white/80 rounded-full text-sm font-medium text-foreground shadow-sm"
              >
                {marker}
              </span>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 max-w-3xl mx-auto text-center">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="py-10 px-8">
              <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Your privacy matters</h3>
              <p className="text-muted-foreground leading-relaxed">
                We don&apos;t store your lab results or personal information. Your data is processed 
                securely and never shared. This tool is for educational purposes — always consult 
                your healthcare provider for medical advice.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Ready to understand your results?
          </h2>
          <p className="text-muted-foreground mb-8">
            It takes less than 2 minutes to get your personalized interpretation.
          </p>
          <Link href="/decode">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              Start Decoding
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" fill="currentColor" />
            <span>Fertility Test Decoder</span>
          </div>
          <p>
            For educational purposes only. Not medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
