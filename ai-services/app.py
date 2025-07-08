from fastapi import FastAPI
from nlp_parser import parse_sales_text
from pydantic import BaseModel
from forecast_service import predict_next_day
from forecast_all import forecast_all

from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

#"Hey! If someone wants to send me data, they must send a thing called text, and it has to be a string (like a sentence)."
#ex. { "text": "Sold 3 bananas and 2 oranges" }
class SalesLogRequest(BaseModel):
    text:str

# Allow calls from Node.js (CORS enabled)
#his tells FastAPI: "It's okay to accept requests from anywhere."
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your backend origin later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#"If someone sends a POST request to /parse-log, call this function."
@app.post('/parse-log')
async def parsr_log(req:SalesLogRequest):
    parsed_item=parse_sales_text(req.text)
    return { "parsed_items": parsed_item } 

@app.get('/forecast/{item_id}')
async def forecast(item_id:int):
    predicted_value=predict_next_day(item_id)
    return {"predicted value":predicted_value}

@app.get("/forecast-all/{vendor_id}")
async def forecastAll(vendorId:int):
    res=forecast_all(vendorId)
    return {
        "result":res
    }




