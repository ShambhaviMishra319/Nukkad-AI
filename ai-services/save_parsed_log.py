from pydantic import BaseModel
from typing import List
from fastapi import APIRouter
from datetime import date
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# ---------- Models ----------
class ParsedItem(BaseModel):
    item: str
    quantity: int

class SaveParsedLogRequest(BaseModel):
    vendorId: int
    items: List[ParsedItem]

# ---------- DB Connection ----------
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "l"),
        database=os.getenv("DB_NAME", ""),
        user=os.getenv("DB_USER", ""),
        password=os.getenv("DB_PASS", ""),
    )

# ---------- API Route ----------
@router.post("/save-parsed-log")
async def save_parsed_log(data: SaveParsedLogRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    today = date.today()

    for item in data.items:
        # Get item_id from items table
        cursor.execute(
            "SELECT id FROM items WHERE LOWER(name) = LOWER(%s) LIMIT 1",
            (item.item,)
        )
        result = cursor.fetchone()

        if not result:
            print(f" Item '{item.item}' not found in DB.")
            continue

        item_id = result[0]

        # Insert into sales_logs
        cursor.execute("""
            INSERT INTO sales_logs (vendor_id, item_id, quantity, log_date)
            VALUES (%s, %s, %s, %s)
        """, (data.vendorId, item_id, item.quantity, today))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Sales log saved successfully"}
