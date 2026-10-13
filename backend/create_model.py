from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification
)

model_name = "distilbert-base-uncased"

tokenizer = DistilBertTokenizerFast.from_pretrained(
    model_name
)

model = DistilBertForSequenceClassification.from_pretrained(
    model_name,
    num_labels=6
)

SAVE_PATH = "./models/distilbert_expense_model"

tokenizer.save_pretrained(SAVE_PATH)

model.save_pretrained(SAVE_PATH)

print("Model saved successfully")