import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

interface MarkerInput {
  amh: string;
  fsh: string;
  lh: string;
  estradiol: string;
  tsh: string;
  prolactin: string;
  afc: string;
}

function getAgeContext(age: number): string {
  if (age < 30) {
    return "under 30, typically in peak reproductive years";
  } else if (age < 35) {
    return "30-34, still in good reproductive years but with gradually declining reserves";
  } else if (age < 38) {
    return "35-37, when fertility typically begins declining more noticeably";
  } else if (age < 40) {
    return "38-39, when fertility decline accelerates";
  } else if (age < 43) {
    return "40-42, when egg quality and quantity are significantly reduced";
  } else {
    return "43+, when natural conception becomes more challenging";
  }
}

function buildMarkersSummary(markers: MarkerInput): string {
  const entries: string[] = [];
  
  if (markers.amh) entries.push(`AMH (Anti-Müllerian Hormone): ${markers.amh} ng/mL`);
  if (markers.fsh) entries.push(`FSH (Follicle-Stimulating Hormone): ${markers.fsh} mIU/mL`);
  if (markers.lh) entries.push(`LH (Luteinizing Hormone): ${markers.lh} mIU/mL`);
  if (markers.estradiol) entries.push(`Estradiol (E2): ${markers.estradiol} pg/mL`);
  if (markers.tsh) entries.push(`TSH (Thyroid-Stimulating Hormone): ${markers.tsh} mIU/L`);
  if (markers.prolactin) entries.push(`Prolactin: ${markers.prolactin} ng/mL`);
  if (markers.afc) entries.push(`AFC (Antral Follicle Count): ${markers.afc} follicles`);
  
  return entries.join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const { markers, age } = await request.json() as { markers: MarkerInput; age: number };
    
    const markersSummary = buildMarkersSummary(markers);
    const ageContext = getAgeContext(age);
    
    if (!markersSummary) {
      return NextResponse.json(
        { error: "No marker values provided" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a compassionate fertility health educator helping women understand their lab results. 
Your tone should be warm, reassuring, and informative — like a knowledgeable friend who also happens to be a nurse.

Important guidelines:
- Explain results in plain, accessible language
- Always contextualize values for the patient's age
- Be honest but not alarming — frame challenges as information, not diagnoses
- Never provide definitive medical diagnoses or treatment recommendations
- Emphasize that these are just numbers and their doctor can provide full context
- If values suggest a concern, frame it gently as "something to discuss with your doctor"
- Use encouraging language while being truthful`;

    const interpretationPrompt = `A ${age}-year-old woman (${ageContext}) has the following fertility test results:

${markersSummary}

Please provide a warm, clear interpretation of these results. For each marker present:
1. Explain what this marker measures in simple terms
2. Whether their value falls in a typical, low, or high range for their age
3. What this might mean for their fertility journey

Keep the explanation conversational and supportive. End with a brief encouraging summary that acknowledges both their results and the importance of discussing with their healthcare provider.`;

    const questionsPrompt = `Based on these fertility test results for a ${age}-year-old woman:

${markersSummary}

Generate 5-7 specific, thoughtful questions she could ask her doctor at her next appointment. 

Questions should:
- Be specific to her actual results (reference specific values when relevant)
- Help her understand what these results mean for her personally
- Address potential next steps or additional testing that might be helpful
- Be empowering and help her feel prepared for the conversation

Format as a simple list of questions, one per line. No numbering or bullets.`;

    // Generate interpretation
    const interpretationResult = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: interpretationPrompt,
    });

    // Generate questions
    const questionsResult = await generateText({
      model: openai("gpt-4o-mini"),
      system: "You are a helpful fertility health educator. Generate clear, specific questions for a patient to ask their doctor.",
      prompt: questionsPrompt,
    });

    // Parse questions into array
    const questions = questionsResult.text
      .split("\n")
      .map(q => q.replace(/^[\d\.\-\*]+\s*/, "").trim())
      .filter(q => q.length > 10);

    return NextResponse.json({
      interpretation: interpretationResult.text,
      questions,
    });
  } catch (error) {
    console.error("Interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to generate interpretation" },
      { status: 500 }
    );
  }
}
