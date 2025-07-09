# forecast_service.py
import pandas as pd
from prophet import Prophet
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Step 1: Connect to the database
def get_db_connection():
    return psycopg2.connect(
        host="",
        database="",
        user="",
        password=""
    )

# Step 2: Load historical sales for a given item_id
def load_sales_data(item_id: int, vendor_id: int) -> pd.DataFrame:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT log_date, SUM(quantity)
        FROM sales_logs
        WHERE item_id = %s AND vendor_id = %s
        GROUP BY log_date
        ORDER BY log_date ASC
    """, (item_id, vendor_id))

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    # Prophet requires columns named 'ds' (date) and 'y' (value)
    df = pd.DataFrame(rows, columns=['ds', 'y'])
    return df

# Step 3: Predict next day's demand using Prophet
def predict_next_day(item_id: int, vendor_id: int):
    df = load_sales_data(item_id, vendor_id)


    if df.empty or len(df) < 2:
        return {"error": "Not enough data to predict"}

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=1)
    forecast = model.predict(future)

    next_day = forecast.iloc[-1][['ds', 'yhat']]
    return {
        "item_id": item_id,
        "date": str(next_day['ds'].date()),
        "predicted_quantity": round(next_day['yhat'])
    }

# Step 4: For CLI testing
if __name__ == "__main__":
    item_id = int(input("Enter item ID to forecast: "))
    result = predict_next_day(item_id)
    print(result)

