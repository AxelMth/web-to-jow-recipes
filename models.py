from dataclasses import dataclass
from typing import List, Optional, Dict, Any

# Source (Recipe1) Models
@dataclass
class Allergen:
    id: str
    name: str

@dataclass
class Cuisine:
    id: str
    name: str

@dataclass
class Nutrition:
    amount: float
    unit: str
    name: str

@dataclass
class Ingredient:
    id: str
    name: str
    imageLink: str
    amount: float
    unit: str

@dataclass
class Step:
    text: str
    imageUrl: Optional[str]

@dataclass
class Tag:
    id: str
    name: str

@dataclass
class Utensil:
    id: str
    name: str

@dataclass
class Yield:
    amount: int
    unit: str

@dataclass
class Recipe1:
    active: bool
    allergens: List[Allergen]
    averageRating: float
    canonical: str
    canonicalLink: str
    cardLink: Optional[str]
    category: Optional[str]
    clonedFrom: str
    comment: Optional[str]
    country: str
    createdAt: str
    cuisines: List[Cuisine]
    description: str
    descriptionHTML: str
    descriptionMarkdown: str
    difficulty: int
    favoritesCount: int
    headline: str
    id: str
    imageLink: str
    imagePath: str
    ingredients: List[Ingredient]
    isAddon: bool
    isComplete: Optional[bool]
    isPublished: bool
    label: Optional[str]
    link: str
    name: str
    nutrition: List[Nutrition]
    prepTime: str
    promotion: Optional[str]
    ratingsCount: int
    seoDescription: Optional[str]
    seoName: Optional[str]
    servingSize: int
    slug: str
    steps: List[Step]
    tags: List[Tag]
    totalTime: str
    uniqueRecipeCode: str
    updatedAt: str
    utensils: List[Utensil]
    uuid: str
    videoLink: Optional[str]
    websiteUrl: str
    yields: List[Yield]

# Jow (Recipe2) Models
@dataclass
class NaturalUnit:
    name: str
    ratio: float

@dataclass
class DisplayableUnit:
    name: str
    ratio: float

@dataclass
class AlternativeUnit:
    name: str
    ratio: float

@dataclass
class Score:
    name: str
    value: float

@dataclass
class JowIngredient:
    id: str
    name: str
    imageUrl: str
    naturalUnit: NaturalUnit
    displayableUnits: List[DisplayableUnit]
    isBasicIngredient: bool
    alternativeUnits: List[AlternativeUnit]
    isAdditionalConstituent: bool
    scores: List[Score]
    boldName: str

@dataclass
class Unit:
    name: str
    ratio: float

@dataclass
class Constituent:
    ingredient: JowIngredient
    quantityPerCover: float
    unit: Unit

@dataclass
class BackgroundPattern:
    color: str
    imageUrl: str

@dataclass
class Direction:
    description: str
    imageUrl: Optional[str]
    title: str

@dataclass
class Tool:
    id: str
    name: str

@dataclass
class Tip:
    content: str

@dataclass
class Recipe2:
    additionalConstituents: List[Constituent]
    backgroundPattern: BackgroundPattern
    constituents: List[Constituent]
    cookingTime: int
    directions: List[Direction]
    recipeFamily: str
    requiredTools: List[Tool]
    imageUrl: str
    placeHolderUrl: str
    preparationTime: int
    restingTime: int
    staticCoversCount: bool
    tip: Tip
    title: str
    userConstituents: List[Constituent]
    userCoversCount: int