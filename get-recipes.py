import os
import json
import requests
from dataclasses import asdict
from dotenv import load_dotenv
from typing import List, Dict, Any
from models import Recipe1, Recipe2
from mapper import map_recipe1_to_recipe2

# Load environment variables
load_dotenv()

SOURCE_URL = os.getenv('SOURCE_URL')
JOW_URL = os.getenv('JOW_URL')

def get_paginated_recipes(page: int = 1) -> Dict[str, Any]:
    """Fetch recipes from source with pagination"""
    response = requests.get(
        f"{SOURCE_URL}?country=fr&locale=fr-FR&not-author=thermomix&order=-date&product=classic-box%7Cclassic-menu%7Cclassic-plan&skip={page-1}&take={1}",
        headers={"Authorization": f"Bearer {os.getenv('SOURCE_BEARER_TOKEN')}"}
    )
    response.raise_for_status()
    return response.json()

class DataclassJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '__dict__'):
            return asdict(obj)
        return super().default(obj)

def post_recipe_to_jow(recipe: Recipe2) -> None:
    """Post a single recipe to Jow API with custom JSON serialization"""
    json_data = json.dumps(recipe, cls=DataclassJSONEncoder)
    response = requests.post(
        JOW_URL, 
        data=json_data,
        headers={
            'Authorization': f"Bearer {os.getenv('JOW_BEARER_TOKEN')}",
            'Content-Type': 'application/json'
        }
    )
    print(json_data)
    print(response.json())
    response.raise_for_status()
    print(f"Successfully posted recipe: {recipe.title}")

def main():
    current_page = 1
    has_more = True

    while has_more:
        try:
            print(f"Processing page {current_page}")
            data = get_paginated_recipes(current_page)
            recipes = data.get("items", [])
            has_more = data.get("hasMore", False)
            
            for source_recipe in recipes:
                jow_recipe = map_recipe1_to_recipe2(source_recipe)
                post_recipe_to_jow(jow_recipe)
            
            current_page += 1
            
        except requests.RequestException as e:
            print(f"Error processing page {current_page}: {str(e)}")
            break

if __name__ == "__main__":
    main()