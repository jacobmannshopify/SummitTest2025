# Product Context: Test Research AI Agent

## Why This Project Exists
Traditional web search and note-taking tools require users to manually sift through information, copy snippets, and organise findings. Modern large language models can automate much of this cognitive overhead. The Test Research AI Agent consolidates discovery, synthesis, and collaboration into a single experience, dramatically accelerating research workflows for knowledge workers, students, and teams.

## Problems It Solves
1. Time-consuming information gathering across disparate sources.
2. Difficulty maintaining consistent context over long research sessions.
3. Manual citation tracking and knowledge base compilation.
4. Fragmented collaboration where insights, notes, and discussions live in separate tools.

## How It Should Work
- Users initiate a research session via a chat-style interface.
- The agent queries LLMs and web/search APIs, retrieves relevant documents, and produces structured answers with citations.
- Documents are chunked and embedded into a vector database for semantic retrieval throughout the session.
- Users can upload PDFs, websites, or plaintext to extend the knowledge base.
- Real-time collaboration allows multiple participants to see updates instantly and co-edit notes.
- Research outputs (summaries, citations, datasets) can be exported to common formats (Markdown, PDF, CSV).

## User Experience Goals
- Frictionless sign-up with OAuth and guest/demo mode.
- Responsive UI optimised for desktop and mobile, using Shadcn/ui components.
- Clear, threaded conversation view with syntax-highlighted code blocks and citation links.
- Non-blocking AI responses with streaming tokens for perceived speed.
- Transparent token usage and cost estimates.
- Easy switching between different LLM models and temperature settings.
- Accessibility compliance (WCAG 2.1 AA) and dark/light themes. 