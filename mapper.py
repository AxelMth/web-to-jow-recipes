from dataclasses import dataclass
from typing import List, Optional, Union
from models import Recipe1, Recipe2, Constituent, Unit, Direction, Tool, BackgroundPattern, Tip, Ingredient, JowIngredient, NaturalUnit

def map_ingredient_to_jow(source_ingredient: Ingredient) -> JowIngredient:
    return JowIngredient(
        id=source_ingredient.get("id", ""),
        name=source_ingredient.get("name", ""),
        imageUrl=source_ingredient.get("imageLink", ""),
        naturalUnit=NaturalUnit(name="", ratio=1),
        displayableUnits=[],
        isBasicIngredient=True,
        alternativeUnits=[],
        isAdditionalConstituent=False,
        scores=[],
        boldName=source_ingredient.get("name", "")
    )

def map_recipe1_to_recipe2(recipe1: Recipe1) -> Recipe2:

    # Map constituents from ingredients
    constituents = [
        Constituent(
            ingredient=map_ingredient_to_jow(ing),
            quantityPerCover=1.0,
            unit=Unit(name="", ratio=1)
        ) for ing in recipe1.get("ingredients")
    ]

    prep_time = recipe1.get("prepTime", 0)
    total_time = recipe1.get("totalTime", 0)

    # Convert preparation time (assuming format "PT30M" -> 30)
    prep_time = int(prep_time.replace("PT", "").replace("M", "")) if prep_time else 0
    total_time = int(total_time.replace("PT", "").replace("M", "")) if total_time else 0
    
    return Recipe2(
        additionalConstituents=[],
        backgroundPattern=BackgroundPattern(color="white", imageUrl=""),
        constituents=constituents,
        cookingTime=total_time - prep_time,  # Cooking time is total - prep
        directions=[
            Direction(
                description=step.get("text", ""),
                imageUrl=step.imageUrl if hasattr(step, 'imageUrl') else None,
                title=f"Step {idx + 1}"
            ) for idx, step in enumerate(recipe1.get("steps", []))
        ],
        recipeFamily="",
        requiredTools=[
            Tool(id=utensil.get("id", ""), name=utensil.get("name", ""))
            for utensil in recipe1.get("utensils", [])
        ],
        imageUrl=recipe1.get("imageLink", ""),
        placeHolderUrl="",
        preparationTime=prep_time,
        restingTime=0,
        staticCoversCount=False,
        tip=Tip(content=""),
        title=recipe1.get("name", ""),
        userConstituents=[],
        userCoversCount=recipe1.get("servingSize", 0)
    )