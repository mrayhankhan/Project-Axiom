"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Citation } from "@/lib/api";

interface EvidenceViewerProps {
    citations: Citation[];
}

export function EvidenceViewer({ citations }: EvidenceViewerProps) {
    const [expanded, setExpanded] = useState<string | null>(null);

    if (!citations || citations.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Supporting Evidence ({citations.length})
            </h3>

            <div className="grid gap-3">
                {citations.map((citation, index) => {
                    const id = `citation-${index}`;
                    const isExpanded = expanded === id;

                    return (
                        <div
                            key={index}
                            className="rounded-lg border border-border bg-card overflow-hidden"
                        >
                            <button
                                onClick={() => setExpanded(isExpanded ? null : id)}
                                className="flex w-full items-center justify-between p-3 text-left hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {citation.document}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            Section: {citation.section}
                                        </p>
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="p-3 pt-0 bg-accent/20 border-t border-border/50">
                                    <div className="mt-2 text-sm text-muted-foreground italic flex items-start">
                                        <Quote className="h-3 w-3 mr-2 mt-1 flex-shrink-0 opacity-50" />
                                        <span>
                                            Relevance Score: {Math.round((citation.relevance_score || 0) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
