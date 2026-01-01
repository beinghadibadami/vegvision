import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Info } from 'lucide-react';

interface ShelfLifeProps {
    shelfLife: {
        days: string;
        stage: string;
        storage_tips: string;
    };
}

const ShelfLife: React.FC<ShelfLifeProps> = ({ shelfLife }) => {
    const stages = ["Ripening", "Ripe", "Peak Fresh", "Overripe"];
    const currentStageIndex = stages.findIndex(s => s.toLowerCase() === shelfLife.stage.toLowerCase());
    const effectiveIndex = currentStageIndex === -1 ? 1 : currentStageIndex; // Default to Ripe if unknown

    return (
        <Card className="neo-card h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Clock className="text-primary h-5 w-5" />
                        <CardTitle className="text-lg">Eat Me When</CardTitle>
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
                        {shelfLife.days} left
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                {/* Timeline */}
                <div className="relative pt-6 pb-2 px-2 mb-6">
                    <div className="h-1 w-full bg-muted rounded-full absolute top-1/2 transform -translate-y-1/2 z-0"></div>
                    <div className="relative z-10 flex justify-between w-full">
                        {stages.map((stage, index) => {
                            const isActive = index === effectiveIndex;
                            const isPast = index < effectiveIndex;

                            return (
                                <div key={stage} className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-primary border-primary scale-125' :
                                            isPast ? 'bg-primary/50 border-primary/50' : 'bg-background border-muted-foreground'
                                        }`}></div>
                                    <span className={`text-[10px] mt-2 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {stage}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tip */}
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex gap-3">
                    <div className="mt-1 bg-white p-1.5 rounded-full shadow-sm h-fit">
                        <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-primary mb-1">Storage Expert</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {shelfLife.storage_tips}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ShelfLife;
