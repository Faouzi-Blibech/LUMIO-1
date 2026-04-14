---
name: lumio-ai-chatbot
description: Floating LUMIO AI assistant button and chatbot panel behavior for each role. Read when implementing or modifying the chatbot UI or logic.
---

# Floating AI Chatbot

## Overview

A universal **floating AI assistant button** is present on all authenticated pages. This button provides contextual help and insights based on the current user's role, utilizing the backend RAG engine.

**Component name:** `<LumioAIButton />`

## UI/UX

### The Button
- Fixed position: bottom right corner (`bottom-6 right-6`)
- Circular shape (48×48px or 56×56px)
- Contains the LUMIO logo inside
- Subtle pulse animation or glow to encourage interaction
- Hover tooltip: "Ask LUMIO" 

### The Chat Panel
- When clicked, opens a side panel (slide-in from the right, `shadcn Sheet` component) or a modal (`shadcn Dialog`)
- Clean chat interface (`ChatInterface.tsx` pattern)
  - Message area (scrollable)
  - Input field at bottom + send button
- Supports markdown rendering for RAG responses (lists, bolding)
- "Source references" accordion or pills below messages where applicable

## Role-Based Behavior

The chatbot explicitly tailors its tone and functionality based on the user's role (handled by the RAG engine personas).

### 1. Student Persona
- **Tone:** Encouraging, age-appropriate (10–18 years), simple language, supportive.
- **Capabilities:**
  - Study tips (e.g., "How should I prepare for my math test?")
  - Explanations of concepts
  - Reminders about recent focus trends ("I noticed you focused well yesterday, keeping it up!")
- **Restrictions:** Cannot see diagnostic data, risk scores, or teacher/parent private notes.

### 2. Teacher Persona
- **Tone:** Professional, clinical, analytical, action-oriented.
- **Capabilities:**
  - Class-wide insights ("Who struggled in the last session?")
  - Individual student deep-dives ("What distractions are affecting Yassine?")
  - Intervention recommendations based on clinical notes
  - **Full access** to risk scores and `suggested_actions`
- **Context injection:** The backend RAG automatically injects the teacher's class context.

### 3. Parent Persona
- **Tone:** Warm, practical, supportive, assuring.
- **Capabilities:**
  - Home support suggestions (sleep, routine, screen time)
  - Summary of child's recent activity ("How was Ahmed's focus this week?")
- **Restrictions:**
  - **NEVER** shows raw `risk_score` or `risk_tier` ("needs attention").
  - **NEVER** uses diagnostic language (ADHD, disorder).
  - Only returns `for_parent` suggestions from the RAG pipeline.

### 4. Admin Persona
- **Tone:** Administrative, strategic, overarching.
- **Capabilities:**
  - School-wide statistics analysis ("Which classes have the lowest focus?")
  - Teacher performance insights
  - System-wide alert summaries

## Implementation Example

```tsx
// LumioAIButton.tsx
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatInterface } from "@/components/ChatInterface";

export const LumioAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button 
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary shadow-elevated flex items-center justify-center hover:scale-105 transition-transform z-50 group"
          aria-label="Ask LUMIO AI"
        >
          {/* LUMIO Logo SVG */}
          <div className="group-hover:animate-pulse-soft">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {/* Logo paths */}
            </svg>
          </div>
        </button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-border bg-card">
        {/* ChatInterface handles the actual messaging logic, knowing the user's role via Context */}
        <ChatInterface onClose={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};
```

## Backend Integration
- `POST /rag/query` → Request body includes `{ "query": string, "role": string, "user_id": string, "context_id": string (optional) }`
- The backend RAG service routes the query to the correct FAISS index/persona prompt based on the `role`.
