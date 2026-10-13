import re
from paddleocr import PaddleOCR
from sqlalchemy.orm import Session
from models import Transaction
from ml_model import (
    auto_category,
    detect_anomaly
)


# OCR INITIALIZATION
ocr = PaddleOCR(
    use_angle_cls=False,
    lang='en',
    show_log=False
)


def extract_transactions(image_path, db: Session):

    # OCR SCAN
    result = ocr.ocr(image_path)

    print("\n===== OCR RESULT =====\n")
    print(result)

    transactions = []

    # SAFETY CHECK
    if not result:
        return []

    # LOOP THROUGH OCR PAGES
    for page in result:

        if page is None:
            continue

        # LOOP THROUGH LINES
        for line in page:

            try:

                # EXTRACT OCR TEXT
                text = line[1][0]

                print("OCR TEXT:", text)

                # FIND AMOUNT
                # SUPPORTS:
                # 150
                # 45
                # 220.50
                amount_match = re.search(
                    r'\d+(?:\.\d{1,2})?',
                    text
                )

                # SKIP IF NO AMOUNT
                if not amount_match:
                    continue

                amount = float(
                    amount_match.group()
                )

                # REMOVE AMOUNT FROM DESCRIPTION
                description = re.sub(
                    r'\d+(?:\.\d{1,2})?',
                    '',
                    text
                )

                # REMOVE RUPEE SYMBOL
                description = description.replace(
                    '₹',
                    ''
                )

                # REMOVE EXTRA SPACES
                description = " ".join(
                    description.split()
                )

                print("DESCRIPTION:", description)
                print("AMOUNT:", amount)

                # SKIP VERY SHORT TEXT
                if len(description) < 3:
                    continue

                # SKIP TOTAL/SUBTOTAL/TAX LINES
                lower_text = description.lower()

                if (
                    "total" in lower_text
                    or "subtotal" in lower_text
                    or "cgst" in lower_text
                    or "sgst" in lower_text
                    or "invoice" in lower_text
                    or "date" in lower_text
                ):
                    continue

                # CATEGORY PREDICTION
                category = auto_category(
                    description
                )

                # ANOMALY DETECTION
                status = detect_anomaly(
                    amount
                )

                # DATABASE OBJECT
                txn = Transaction(

                    description=description,

                    amount=amount,

                    category=category,

                    status=status
                )

                # SAVE TO DB
                db.add(txn)

                # RESPONSE DATA
                transactions.append({

                    "description": description,

                    "amount": amount,

                    "category": category,

                    "status": status
                })

            except Exception as e:

                print("LINE ERROR:", e)

    # COMMIT DATABASE
    db.commit()

    print("\n===== FINAL TRANSACTIONS =====\n")
    print(transactions)

    return transactions