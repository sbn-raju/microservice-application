from fastapi import APIRouter, Query, Request, HTTPException
from controllers.placeOrdersControllers import place_orders, get_orders
from models.PlacedOrders import PlacedOrder


router = APIRouter(prefix="/items", tags=['Items'])


@router.post("/post")
async def post_order(request: Request, body: PlacedOrder, productId: str = Query(...)):
    user = getattr(request.state, "user", None)

    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    userId = user.get("id")
    return await place_orders(body, userId, productId)

@router.get("/fetch")
async def fetch_order(request: Request):
    user = getattr(request.state, "user", None)
    print(user)

    userId = user.get("id")
    return await get_orders(userId)