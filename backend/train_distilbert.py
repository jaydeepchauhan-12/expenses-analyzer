import pandas as pd
import joblib

from datasets import Dataset

from sklearn.preprocessing import LabelEncoder

from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)


# LOAD DATASET
df = pd.read_csv(
    "data/expense_dataset.csv"
)


# CREATE TEXT COLUMN
df["text"] = df["description"].astype(str)


# LABEL ENCODING
encoder = LabelEncoder()

df["label"] = encoder.fit_transform(
    df["category"]
)


# SAVE LABEL ENCODER
joblib.dump(
    encoder,
    "models/label_encoder.pkl"
)


# CREATE DATASET
dataset = Dataset.from_pandas(
    df[["text", "label"]]
)


# LOAD TOKENIZER
tokenizer = DistilBertTokenizerFast.from_pretrained(
    "distilbert-base-uncased"
)


# TOKENIZE FUNCTION
def tokenize(batch):

    return tokenizer(

        batch["text"],

        padding="max_length",

        truncation=True,

        max_length=32
    )


# TOKENIZE DATASET
dataset = dataset.map(tokenize)


# CONVERT TO TORCH FORMAT
dataset.set_format(

    type="torch",

    columns=[
        "input_ids",
        "attention_mask",
        "label"
    ]
)


# LOAD MODEL
model = DistilBertForSequenceClassification.from_pretrained(

    "distilbert-base-uncased",

    num_labels=len(
        encoder.classes_
    )
)


# TRAINING SETTINGS
training_args = TrainingArguments(

    output_dir="./results",

    evaluation_strategy="no",

    save_strategy="epoch",

    learning_rate=2e-5,

    per_device_train_batch_size=8,

    num_train_epochs=1,

    weight_decay=0.01,

    logging_steps=50,

    save_total_limit=1
)


# TRAINER
trainer = Trainer(

    model=model,

    args=training_args,

    train_dataset=dataset
)


# TRAIN MODEL
trainer.train()


# SAVE MODEL
model.save_pretrained(
    "./models/distilbert_expense_model"
)

tokenizer.save_pretrained(
    "./models/distilbert_expense_model"
)


print("\nDistilBERT Training Complete")