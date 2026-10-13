from models import Transaction
from ml_model import auto_category,detect_anomaly

def create_transaction(db, data):
    category = auto_category(data.description)
    status = detect_anomaly(data.amount)

    txn = Transaction(
        amount = data.amount,
        category = category,
        description = data.description,
        status = status
    )

    try:
        db.add(txn)
        db.commit()
        db.refresh(txn)
    except Exception as e:
        db.rollback()
        print("Database Error:", e)
        raise

    return txn, status

def get_all(db):
    return db.query(Transaction).all()

def delete_transaction(db, id):
    txn = db.query(Transaction).filter(
        Transaction.id == id
    ).first()

    if txn:
        db.delete(txn)
        db.commit()
        return True
    return False

def update_transaction(db, id, data):
    txn = db.query(Transaction).filter(
        Transaction.id == id
    ).first()

    if txn:
        txn.amount = data.amount
        txn.description = data.description
        txn.category = auto_category(data.description)
        txn.status = detect_anomaly(data.amount)

        db.commit()
        db.refresh(txn)

    return txn