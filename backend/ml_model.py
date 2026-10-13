import joblib
import numpy as np
from sympy import im
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification
)
import torch
from sklearn.ensemble import IsolationForest
import pandas as pd

MODEL_PATH = "./models/distilbert_expense_model"


tokenizer = DistilBertTokenizerFast.from_pretrained(
    MODEL_PATH,
    local_files_only=True
)

model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_PATH,
    local_files_only=True
)


encoder = joblib.load(
    "models/label_encoder.pkl"
)
# AUTO CATEGORY DETECTION
def auto_category(text):

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    with torch.no_grad():

        outputs = model(**inputs)

    predicted_class = torch.argmax(
        outputs.logits,
        dim=1
    ).item()

    category = encoder.inverse_transform(
        [predicted_class]
    )[0]

    return category


# LOAD DATASET
df = pd.read_csv(
    "data/expense_dataset.csv"
)


# PREPARE AMOUNT DATA
amounts = np.array(
    df["amount"]
).reshape(-1, 1)


# TRAIN ANOMALY MODEL
anomaly_model = IsolationForest(
    contamination=0.02,
    random_state=42
)

anomaly_model.fit(amounts)


# ANOMALY DETECTION
def detect_anomaly(amount):

    result = anomaly_model.predict(
        [[amount]]
    )

    return (
        "Anomaly"
        if result[0] == -1
        else "Normal"
    )