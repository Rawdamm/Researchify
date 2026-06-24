# Researchify — AI Research Engine

Researchify turns a natural-language question into a synthesized, citation-backed
answer. It pulls from six live sources, ranks them with semantic relevance,
detects opposing viewpoints, builds a knowledge graph, and synthesizes a grounded
response with an LLM — all from a single query.

## Architecture

```
researchify/
├── frontend/   React 19 + Vite + Tailwind UI
└── backend/    Python async intelligence pipeline (Starlette)
```

The frontend sends a query to the backend, which runs a 7-stage pipeline and
returns ranked sources, a debate analysis, a knowledge graph, and an LLM summary.

## Backend — intelligence pipeline

`plan → fetch → filter → score → debate → graph → synthesize`

| Stage | What it does |
|-------|--------------|
| **Plan** | Detects query intent and weights sources accordingly |
| **Fetch** | Concurrently queries arXiv, GitHub, Reddit, StackOverflow, Wikipedia, and News (`asyncio` + `httpx`) |
| **Filter** | Fuzzy de-duplication (rapidfuzz) and quality/intent filtering |
| **Score** | Dense semantic reranking with `sentence-transformers` (MiniLM) fused with authority, freshness-decay, engagement, and intent-fit signals into an explainable confidence score |
| **Debate** | Extracts pro/con sides, agreements, disagreements, and numeric conflicts |
| **Graph** | spaCy NER entity extraction → knowledge graph (React Flow nodes/edges) |
| **Synthesize** | Groq Llama 3.3 70B generates a structured, schema-validated, source-grounded answer |

**Stack:** Python, Starlette (ASGI), sentence-transformers, spaCy, rapidfuzz,
Groq (Llama 3.3 70B), NumPy, httpx.

### Run the backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
# set GROQ_API_KEY (and optionally NEWS_API_KEY) in a .env file
uvicorn app:app --reload --port 8000
```

API docs are served at `http://localhost:8000/docs`.

## Frontend

React 19 + Vite + Tailwind v4, with an interactive knowledge graph
(`@xyflow/react`), live pipeline-progress visualization, debate cards, a
consensus meter, and Framer Motion animations.

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend reads the backend URL from the API constant in `src/Pages/Home.jsx`.
