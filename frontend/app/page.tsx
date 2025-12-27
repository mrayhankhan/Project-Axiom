'use client';

import React, { useEffect } from 'react';
import { Hero } from '@/components/landing/Hero';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { VisualDocIngest } from '@/components/landing/visuals/VisualDocIngest';
import { VisualVectorize } from '@/components/landing/visuals/VisualVectorize';
import { VisualQA } from '@/components/landing/visuals/VisualQA';
import { VisualExplainability } from '@/components/landing/visuals/VisualExplainability';
import { VisualRisk } from '@/components/landing/visuals/VisualRisk';
import { VisualAnalytics } from '@/components/landing/visuals/VisualAnalytics';
import { FloatingCTA } from '@/components/landing/FloatingCTA';
import initGSAP from '@/lib/scroll/gsap-init';

export default function LandingPage() {

  useEffect(() => {
    initGSAP();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-surface-a10 dark:bg-surface-a20">
      <Hero />

      <FeatureSection
        id="feature-ingest"
        title="Unified Knowledge Base"
        description="Bring all your documents together. Ingest policies, reports, and technical documentation from S3, SharePoint, and local drives into a single, searchable knowledge base."
        visualComponent={VisualDocIngest}
        align="left"
      />

      <FeatureSection
        id="feature-vectorize"
        title="Intelligent Vectorization"
        description="Transform unstructured text into semantic embeddings. Our advanced chunking and embedding strategies ensure that the most relevant context is always retrieved."
        visualComponent={VisualVectorize}
        align="right"
      />

      <FeatureSection
        id="feature-qa"
        title="Intelligent Q&A"
        description="Answers, not just search results. Ask complex questions about your model risk policies and get instant, accurate answers generated from your own data."
        visualComponent={VisualQA}
        align="left"
      />

      <FeatureSection
        id="feature-explain"
        title="Explainable AI"
        description="Trace every decision back to the source. Axiom provides exact citations for every answer, so you can verify the information and trust the results."
        visualComponent={VisualExplainability}
        align="right"
      />

      <FeatureSection
        id="feature-risk"
        title="Proactive Risk Management"
        description="Catch compliance issues before they happen. Automatically detect gaps in your model documentation and get alerts for potential policy violations."
        visualComponent={VisualRisk}
        align="left"
      />

      <FeatureSection
        id="feature-analytics"
        title="Performance Analytics"
        description="Monitor the health and accuracy of your AI models. Track key performance indicators and get insights into usage patterns and model drift."
        visualComponent={VisualAnalytics}
        align="right"
      />

      <FloatingCTA />

      {/* Footer Spacer */}
      <div className="h-24 w-full bg-surface-a10 dark:bg-surface-a20" />
    </main>
  );
}
