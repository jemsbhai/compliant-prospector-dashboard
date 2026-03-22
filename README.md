# The Compliant Prospector — Dashboard

> FINRA/SEC-compliant prospecting engine powered by the Compliance Algebra.
> Built for Pulse Miami 2026 Hackathon.

## Architecture

```
Next.js (Vercel)  ←→  FastAPI (Cloud Run)  ←→  Compliance Engine + Gemini 2.5 Flash
   Dashboard             API Backend              36 rules, 7 regulations
```

## Features

- **Regulation toggle** — check/uncheck FINRA, SEC, CAN-SPAM, MiFID II, NY State, NASAA, SOX
- **Algebra vs Binary mode** — see how Subjective Logic opinions differ from pass/fail
- **Per-rule audit trail** — expand any rule to see l/v/u values, flagged phrases, suggested fixes
- **Jurisdictional meet J⊓** — step-by-step visualization of the multiplicative conjunction
- **Self-correction diff** — see what was changed and the improvement delta
- **Temporal decay** — visualize how compliance opinions degrade over time
- **Gemini deep analysis** — rules analyzed by Gemini 2.5 Flash are marked with ✦

## Setup

```bash
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

```bash
npm run dev
```

Make sure the FastAPI backend is running:
```bash
cd ../Teambright-
uvicorn backend:app --reload --port 8000
```

## Deploy to Vercel

```bash
npx vercel
```

Set the environment variable `NEXT_PUBLIC_API_URL` to your Cloud Run backend URL.

## Credits

- **Compliance Algebra**: Syed, Silaghi, Abujar, Alssadi (2026) — Subjective Logic for regulatory compliance
- **LLM**: Gemini 2.5 Flash — compliance checking + outreach drafting
- **Hackathon**: Pulse Miami, March 2026
