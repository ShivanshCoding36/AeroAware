import requests
import pandas as pd

# Example: Get Delhi PM2.5 data
url = "https://api.openaq.org/v3/measurements"
headers={"X-API-Key": "72dd209011465d910f7b44d557d8764f26bfeb1d8306bd00bef2781308e44913"}
params = {
    "country": "US",
    # "city": "",
    "parameter": "pm25",
    "limit": 1000,
    "date_from": "2024-01-01",
    "date_to": "2024-02-01",
    
}

r = requests.get(url, headers=headers, params=params)
print(r.json())
data = r.json()["results"]

df = pd.DataFrame([{
    "datetime": d["date"]["utc"],
    "location": d["location"],
    "pm25": d["value"]
} for d in data])

df.to_csv("openaq_pm25.csv", index=False)
print("Saved openaq_pm25.csv")
