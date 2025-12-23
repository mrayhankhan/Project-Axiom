import { cn } from "@/lib/utils";

interface RiskBadgeProps {
    category: string;
    className?: string;
}

export function RiskBadge({ category, className }: RiskBadgeProps) {
    const getCategoryStyles = (cat: string) => {
        switch (cat.toLowerCase()) {
            case "bias":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "explainability":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "data":
                return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
            case "deployment":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "compliance":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                getCategoryStyles(category),
                className
            )}
        >
            {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
    );
}
