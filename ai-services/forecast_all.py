from forecast_service import predict_next_day
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        host="",
        database="",
        user="",
        password=""
    )

def forecast_all(vendor_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Step 1: Get all item_ids that this vendor has sold
    cursor.execute("""
        SELECT DISTINCT item_id FROM sales_logs
        WHERE vendor_id = %s
    """, (vendor_id,))
    item_ids = [row[0] for row in cursor.fetchall()]

    if not item_ids:
        return {"error": "No sales history found for this vendor."}

    forecasts = []

    for item_id in item_ids:
        prediction = predict_next_day(item_id)
        
        if "predicted_quantity" in prediction:
            # Step 2: Insert into forecasts table
            cursor.execute("""
                INSERT INTO forecasts (vendor_id, item_id, forecast_quantity, forecast_date)
                VALUES (%s, %s, %s, %s)
            """, (
                vendor_id,
                prediction['item_id'],
                prediction['predicted_quantity'],
                prediction['date']
            ))
            forecasts.append(prediction)

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "vendor_id": vendor_id,
        "forecasts": forecasts
    }