import { CheckCircle2, Circle } from "lucide-react";

export const TodoListWidget = () => {
    return (
        <div className="hidden md:flex flex-col gap-1.5 p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl backdrop-blur-md w-48 shadow-xl">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Daily Goals</span>
                <span className="text-[10px] font-medium text-red-500">2/3</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="line-through decoration-neutral-600 text-neutral-500">Morning Cardio</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="line-through decoration-neutral-600 text-neutral-500">Protein Intake</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white shadow-sm rounded px-1 -ml-1 bg-red-900/10 border border-red-900/20">
                <Circle className="w-3.5 h-3.5 text-red-500" />
                <span className="font-medium">Heavy Back Day</span>
            </div>
        </div>
    );
};
