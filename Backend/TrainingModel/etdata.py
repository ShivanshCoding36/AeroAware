import requests
import json
import pandas as pd
from sys import exit # Used for clean exit on error

# -------------------------------
# CONFIGURATION
# -------------------------------
API_KEY = "72dd209011465d910f7b44d557d8764f26bfeb1d8306bd00bef2781308e44913"
LOCATION_ID = 3024966 
PARAMETER = "pm25"
LIMIT = 1000 
START_DATE = "2024-09-01"
END_DATE = "2025-09-01"

HEADERS = {
    "X-API-Key": API_KEY
}

PARAMS = {
    "date_from": START_DATE,
    "date_to": END_DATE,
    "limit": LIMIT
}


try:
    response = requests.get('https://api.openaq.org/v3/sensors/10326358/hours', headers=HEADERS, params=PARAMS)
    response.raise_for_status()
    data = response.json()
    
    results = data.get("results", [])
    
    if results:
        print(f"✅ Successfully fetched {len(results)} hourly PM2.5 entries.")
        
        # Process the Data (V3 format)
        aq_data = pd.DataFrame(results)
        
        # V3 response nests the date information under the 'period' field
        aq_data['datetime'] = pd.to_datetime(aq_data['period'].apply(lambda x: x['datetimeFrom']['utc']))
        aq_data['value'] = aq_data['value']
        
        print(f"--- First 5 Data Entries ---")
        for index, row in aq_data.head(5).iterrows():
            print(f"Time: {row['datetime']} | Value: {row['value']} | Interval: {row['period']['interval']}")
            
    else:
        print("⚠️ Request succeeded, but no measurements were found for the specified criteria.")

except requests.exceptions.HTTPError as e:
    print(f"❌ HTTP Error: {e}")
    print(f"Response content: {response.text}")
except requests.exceptions.RequestException as e:
    print(f"❌ An error occurred during the request: {e}")