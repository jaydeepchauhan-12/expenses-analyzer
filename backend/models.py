from sqlalchemy import Column,Integer,Float,String
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    amount = Column(Float)
    category = Column(String(50))
    description = Column(String(100))
    status = Column(String(50))
