import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Timer, BarChart } from 'lucide-react';

interface Recipe {
    name: string;
    reason: string;
    time: string;
    difficulty: string;
}

interface RecipeRecommendationsProps {
    recipes: Recipe[];
}

const RecipeRecommendations: React.FC<RecipeRecommendationsProps> = ({ recipes }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <ChefHat className="text-primary h-6 w-6" />
                <h3 className="text-xl font-bold">Chef's Recommendations</h3>
                <span className="text-xs text-muted-foreground ml-2">Based on current freshness</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {recipes.map((recipe, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-primary/10">
                        {/* Visual Header - using pattern/gradient instead of real image since we don't have recipe images */}
                        <div className={`h-24 w-full bg-gradient-to-r flex items-center justify-center ${index === 0 ? 'from-orange-100 to-red-100' :
                                index === 1 ? 'from-green-100 to-blue-100' :
                                    'from-yellow-100 to-orange-100'
                            }`}>
                            <ChefHat className="h-8 w-8 text-muted-foreground/30" />
                        </div>

                        <CardContent className="p-4 bg-white/50">
                            <h4 className="font-bold text-lg mb-2 leading-tight">{recipe.name}</h4>

                            <div className="flex items-start gap-2 mb-4 bg-primary/5 p-2 rounded-lg">
                                <span className="text-[10px] font-bold text-primary uppercase mt-0.5">Why?</span>
                                <p className="text-xs text-muted-foreground leading-snug">
                                    {recipe.reason}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                                <div className="flex items-center gap-1">
                                    <Timer className="h-3 w-3" />
                                    <span>{recipe.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${recipe.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-700' :
                                            recipe.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {recipe.difficulty}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RecipeRecommendations;
