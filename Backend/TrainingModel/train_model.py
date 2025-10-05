import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib

# -------------------------------
# 1. Load your dataset
# -------------------------------
# For demonstration, we combine OpenAQ + weather data
# Replace this CSV with actual collected/merged data
# Columns: ['pm25', 'temperature', 'humidity', 'precipitation']
df = pd.read_csv("air_quality_weather.csv")

# Ensure numeric and no missing values
df = df.dropna()
for col in ['pm25', 'temperature', 'humidity', 'precipitation']:
    df[col] = pd.to_numeric(df[col], errors='coerce')
df = df.dropna()

# -------------------------------
# 2. Split data
# -------------------------------
X = df[['pm25', 'temperature', 'humidity', 'precipitation']]  # features
y = df['pm25']  # target (next hour/day PM2.5 prediction)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------------
# 3. Train model
# -------------------------------
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
model.fit(X_train, y_train)

# -------------------------------
# 4. Evaluate
# -------------------------------
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred, squared=False)

print(f"MAE: {mae:.2f}")
print(f"RMSE: {rmse:.2f}")

# -------------------------------
# 5. Save trained model
# -------------------------------
joblib.dump(model, "./models/forecast_model.pkl")
print("Model saved to ./models/forecast_model.pkl")
