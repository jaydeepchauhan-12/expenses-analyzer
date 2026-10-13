from pydantic import BaseModel

class TransactionCreate(BaseModel):
    amount: float
    description: str


class TransactionResponse(BaseModel):
    id: int
    amount: float
    category: str
    description: str
    status: str

    class Config:
        from_attributes = True