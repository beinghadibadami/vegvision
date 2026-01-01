import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface PriceAnalysisProps {
    price?: string;
    quantity?: string;
    analysis?: {
        verdict: string;
        difference: number;
        average: number;
    };
}

const PriceAnalysis: React.FC<PriceAnalysisProps> = ({ price, quantity, analysis }) => {
    if (!price) return null;

    const isGoodDeal = analysis?.verdict === 'Great Deal';
    const isHighPrice = analysis?.verdict === 'High Price';

    return (
        <Card className="neo-card h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="text-primary h-5 w-5" />
                        <CardTitle className="text-lg">Market Price</CardTitle>
                    </div>
                    <span className="text-[10px] text-muted-foreground">via BigBasket</span>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-foreground">{price}</span>
                    <span className="text-sm text-muted-foreground font-medium">/ {quantity}</span>
                </div>

                {analysis && analysis.verdict !== 'Unknown' && (
                    <div className="flex items-center justify-between">
                        <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold ${isGoodDeal ? 'bg-green-100 text-green-700' :
                                isHighPrice ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>
                            {isGoodDeal ? <TrendingDown className="h-4 w-4" /> :
                                isHighPrice ? <TrendingUp className="h-4 w-4" /> :
                                    <Minus className="h-4 w-4" />}
                            {analysis.verdict}
                        </div>

                        <div className={`text-xs font-medium flex items-center gap-1 ${isGoodDeal ? 'text-green-600' :
                                isHighPrice ? 'text-red-500' :
                                    'text-muted-foreground'
                            }`}>
                            {analysis.difference !== 0 && (
                                <>
                                    {isGoodDeal ? '▼' : '▲'} {Math.abs(analysis.difference)}% {isGoodDeal ? 'below' : 'above'} avg
                                </>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PriceAnalysis;
