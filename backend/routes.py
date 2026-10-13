from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from PIL import Image
import numpy as np
import os
import shutil
from database import SessionLocal
from schemas import TransactionCreate
from transaction_service import (
    get_all,
    create_transaction,
    delete_transaction,
    update_transaction
)
from ocr_service import extract_transactions


router = APIRouter()


# DATABASE SESSION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE TRANSACTION
@router.post("/")
def create(
    data: TransactionCreate,
    db: Session = Depends(get_db)
):

    txn, status = create_transaction(db, data)

    return {

        "id": txn.id,

        "amount": txn.amount,

        "category": txn.category,

        "description": txn.description,

        "status": status
    }


# GET ALL TRANSACTIONS
@router.get("/")
def read( 
    db: Session = Depends(get_db)
):

    return get_all(db)


# DELETE TRANSACTION
@router.delete("/{id}")
def delete(
    id: int,
    db: Session = Depends(get_db)
):

    success = delete_transaction(db, id)

    return {
        "success": success
    }


# UPDATE TRANSACTION
@router.put("/{id}")
def update(
    id: int,
    data: TransactionCreate,
    db: Session = Depends(get_db)
):

    txn = update_transaction(db, id, data)

    return txn



@router.post("/scan-bill")
async def scan_bill(

    file: UploadFile = File(...),

    db: Session = Depends(get_db)

):

    try:

        os.makedirs("uploads", exist_ok=True)

        file_path = f"uploads/{file.filename}"

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        transactions = extract_transactions(
            file_path,
            db
        )

        return {

            "success": len(transactions) > 0,

            "transactions": transactions
        }

    except Exception as e:

        print("\nERROR:\n", e)

        return {

            "success": False,

            "message": str(e)
        }