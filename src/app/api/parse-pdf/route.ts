import { NextRequest, NextResponse } from "next/server";

// Dynamic import for pdf-parse to avoid edge runtime issues
async function parsePDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}

interface ExtractedMarkers {
  amh?: string;
  fsh?: string;
  lh?: string;
  estradiol?: string;
  tsh?: string;
  prolactin?: string;
  afc?: string;
}

function extractMarkers(text: string): ExtractedMarkers {
  const markers: ExtractedMarkers = {};
  
  // Normalize text
  const normalizedText = text.replace(/\s+/g, " ").toLowerCase();
  
  // AMH patterns
  const amhPatterns = [
    /anti[- ]?m[üu]llerian[^:]*:?\s*([\d.]+)/i,
    /\bamh\b[^:]*:?\s*([\d.]+)/i,
    /amh.*?([\d.]+)\s*ng\/ml/i,
  ];
  
  // FSH patterns
  const fshPatterns = [
    /follicle[- ]?stimulating[^:]*:?\s*([\d.]+)/i,
    /\bfsh\b[^:]*:?\s*([\d.]+)/i,
    /fsh.*?([\d.]+)\s*m?iu\/ml/i,
  ];
  
  // LH patterns
  const lhPatterns = [
    /luteinizing[^:]*:?\s*([\d.]+)/i,
    /\blh\b[^:]*:?\s*([\d.]+)/i,
    /lh.*?([\d.]+)\s*m?iu\/ml/i,
  ];
  
  // Estradiol patterns
  const estradiolPatterns = [
    /estradiol[^:]*:?\s*([\d.]+)/i,
    /\be2\b[^:]*:?\s*([\d.]+)/i,
    /estradiol.*?([\d.]+)\s*pg\/ml/i,
  ];
  
  // TSH patterns
  const tshPatterns = [
    /thyroid[- ]?stimulating[^:]*:?\s*([\d.]+)/i,
    /\btsh\b[^:]*:?\s*([\d.]+)/i,
    /tsh.*?([\d.]+)\s*m?iu\/[lm]l/i,
  ];
  
  // Prolactin patterns
  const prolactinPatterns = [
    /prolactin[^:]*:?\s*([\d.]+)/i,
    /\bprl\b[^:]*:?\s*([\d.]+)/i,
  ];
  
  // AFC patterns
  const afcPatterns = [
    /antral[- ]?follicle[^:]*:?\s*(\d+)/i,
    /\bafc\b[^:]*:?\s*(\d+)/i,
    /follicle count[^:]*:?\s*(\d+)/i,
  ];
  
  // Helper to extract value
  const extractValue = (patterns: RegExp[], text: string): string | undefined => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return undefined;
  };
  
  // Try original text first, then normalized
  const textsToSearch = [text, normalizedText];
  
  for (const searchText of textsToSearch) {
    if (!markers.amh) markers.amh = extractValue(amhPatterns, searchText);
    if (!markers.fsh) markers.fsh = extractValue(fshPatterns, searchText);
    if (!markers.lh) markers.lh = extractValue(lhPatterns, searchText);
    if (!markers.estradiol) markers.estradiol = extractValue(estradiolPatterns, searchText);
    if (!markers.tsh) markers.tsh = extractValue(tshPatterns, searchText);
    if (!markers.prolactin) markers.prolactin = extractValue(prolactinPatterns, searchText);
    if (!markers.afc) markers.afc = extractValue(afcPatterns, searchText);
  }
  
  return markers;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Parse PDF
    const text = await parsePDF(buffer);
    
    // Extract markers
    const markers = extractMarkers(text);
    
    return NextResponse.json({ 
      markers,
      rawText: text.substring(0, 500) // For debugging, limited
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
