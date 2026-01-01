import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple } from 'lucide-react';

interface MacroScannerProps {
    macros: {
        calories: number;
        carbs: number;
        protein: number;
        fat: number;
        fiber: number;
        vitamins: string[];
    };
}

const MacroItem = ({ label, value, unit, colorClass }: { label: string, value: number, unit: string, colorClass: string }) => (
    <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
        <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center ${colorClass} bg-opacity-20`}>
            <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        </div>
        <span className="text-lg font-bold text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{unit}</span>
        <span className="text-[10px] font-medium text-muted-foreground mt-1">{label}</span>
    </div>
);

const MacroScanner: React.FC<MacroScannerProps> = ({ macros }) => {
    return (
        <Card className="neo-card">
            <CardHeader className="pb-2 border-b-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Apple className="text-green-600 h-5 w-5" />
                        <CardTitle className="text-lg">Macro Scanner</CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground">per 100g (est)</span>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6">
                    <MacroItem label="Calories" value={macros.calories} unit="kcal" colorClass="bg-red-500 text-red-500" />
                    <MacroItem label="Carbs" value={macros.carbs} unit="g" colorClass="bg-yellow-500 text-yellow-500" />
                    <MacroItem label="Protein" value={macros.protein} unit="g" colorClass="bg-blue-500 text-blue-500" />
                    <MacroItem label="Fiber" value={macros.fiber} unit="g" colorClass="bg-green-500 text-green-500" />
                    <MacroItem label="Fat" value={macros.fat} unit="g" colorClass="bg-orange-500 text-orange-500" />
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Vitamins & Minerals</p>
                    <div className="flex flex-wrap gap-2">
                        {macros.vitamins.map((vitamin, i) => (
                            <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                {vitamin}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MacroScanner;
