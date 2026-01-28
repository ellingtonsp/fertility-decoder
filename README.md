# Fertility Test Decoder

A compassionate web app that helps women understand their fertility bloodwork in plain English, with age-appropriate context and questions to ask their doctor.

## Features

- **PDF Upload**: Drag-and-drop your lab results PDF with automatic marker extraction
- **Manual Entry**: Enter your values directly if PDF parsing doesn't work
- **Age-Adjusted Insights**: Fertility markers mean different things at 28 vs 38 - get context that applies to you
- **Plain-English Explanations**: No medical jargon - understand what your results actually mean
- **Doctor Questions**: Generate personalized questions to bring to your next appointment
- **Privacy-Focused**: We don't store your data - it's processed and forgotten

## Markers We Decode

- AMH (Anti-Müllerian Hormone) - Ovarian reserve indicator
- FSH (Follicle-Stimulating Hormone) - Ovarian function
- LH (Luteinizing Hormone) - Ovulation timing
- Estradiol (E2) - Key estrogen for reproductive health
- TSH (Thyroid-Stimulating Hormone) - Thyroid function affects fertility
- Prolactin - High levels can affect ovulation
- AFC (Antral Follicle Count) - Visible follicles on ultrasound

## Tech Stack

- Next.js 14 with App Router
- Tailwind CSS + shadcn/ui
- Vercel AI SDK with OpenAI GPT-4o-mini
- pdf-parse for PDF text extraction

## Deployment

### Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `fertility-decoder` repository from GitHub
3. Add the environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Click Deploy

### Local Development

```bash
# Clone the repo
git clone https://github.com/ellingtonsp/fertility-decoder.git
cd fertility-decoder

# Install dependencies
npm install

# Add your OpenAI API key
cp .env.example .env.local
# Edit .env.local with your key

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Required for GPT-powered interpretation |

## Important Disclaimer

This tool is for educational purposes only and should not replace professional medical advice. Always discuss your results with your healthcare provider who knows your complete medical history.

## License

MIT
