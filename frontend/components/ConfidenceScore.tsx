import { cn } from "@/lib/utils";

interface ConfidenceScoreProps {
    score: number;
    className?: string;
}

export function ConfidenceScore({ score, className }: ConfidenceScoreProps) {
    // Determine color based on score
    let colorClass = "bg-red-500";
    let textClass = "text-red-500";
    let label = "Low Confidence";

    if (score >= 0.8) {
        colorClass = "bg-green-500";
        textClass = "text-green-500";
        label = "High Confidence";
    } else if (score >= 0.6) {
        colorClass = "bg-yellow-500";
        textClass = "text-yellow-500";
        label = "Medium Confidence";
    }

    const percentage = Math.round(score * 100);

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <div className="relative h-10 w-10 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-muted"
                    />
                    <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={100}
                        strokeDashoffset={100 - percentage}
                        className={cn("transition-all duration-500", textClass)}
                    />
                </svg>
                <span className="absolute text-[10px] font-bold text-foreground">
                    {percentage}%
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">Confidence</span>
                <span className={cn("text-xs font-bold", textClass)}>{label}</span>
            </div>
        </div>
    );
}
