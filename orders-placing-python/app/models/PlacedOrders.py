from pydantic import BaseModel, EmailStr, Field


class Address(BaseModel):
    street: str
    city: str
    zipCode: str

class PlacedOrder(BaseModel):
    tranxId: str
    address: Address
    orderName: str
    phone_no: int
    payment_status: str
    payment_method: str
    email: EmailStr
