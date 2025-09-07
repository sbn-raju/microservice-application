from fastapi.responses import JSONResponse
from fastapi import status, Query
from database.db_connection import orders
from datetime import datetime
from models.PlacedOrders import PlacedOrder
from bson import ObjectId



async def place_orders(
    body: PlacedOrder,
    userId: str = Query(...),
    productId: str = Query(...),
):
    # Validation check
    if not userId or not productId:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Both userId and productId are required."
            }
        )

    try:
        # Saving the placed order details in the database
        result = await orders.insert_one({
            "userId": userId,
            "productId": productId,
            "address": body.address.model_dump(),
            "tranxId": body.tranxId,   
            "orderName": body.orderName,
            "payment_status": body.payment_status,
            "payment_method": body.payment_method,
            "email": body.email,
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        })

        if not result.inserted_id:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "success": False,
                    "message": "Error in saving order details"
                }
            )

        # Success response
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "success": True,
                "message": "Order placed successfully",
                "data": {
                    "userId": userId,
                    "productId": productId,
                    "orderId": str(result.inserted_id)
                }
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"Error in saving order details: {str(e)}"
            }
        )


#Getting the order details using the place controllers.
async def get_orders(
    userId: str = Query(...)
):
    # Validation check.
    if not userId:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success" : False,
                "message" : "User Id not found"
            }
        )
    try: 
        cursor = orders.find({"userId": userId})
        result = await cursor.to_list(length=100)

        # Convert ObjectId to string
        result = fix_mongo_ids(result)

        # Success response
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Orders fetched successfully",
                "data": result
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"Error in fetching order details: {str(e)}"
            }
        )

def fix_mongo_ids(doc):
    from bson import ObjectId
    if isinstance(doc, list):
        return [fix_mongo_ids(d) for d in doc]
    if isinstance(doc, dict):
        return {k: (str(v) if isinstance(v, ObjectId) else fix_mongo_ids(v)) for k, v in doc.items()}
    return doc