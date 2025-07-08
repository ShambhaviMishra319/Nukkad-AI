import re
from typing import List, Dict

def parse_sales_text(text: str) -> List[Dict[str, any]]:
    # Normalize text
    text = text.lower()

    # Example: "sold 10 bananas and 5 apples"
    pattern = r'(\d+)\s+([a-zA-Z]+)'
    matches = re.findall(pattern, text)

    parsed = []
    for qty, item in matches:
        parsed.append({
            "item": item.rstrip('s'),  # Remove plural if any
            "quantity": int(qty)
        })

    return parsed
