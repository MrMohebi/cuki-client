import {__init__TempData} from "./__init__Reducers";
import * as actionTypes from '../actionTypes'
import {produce} from "immer"

export default function reducerTempData (state = __init__TempData, action) {
    switch (action.type) {
        case actionTypes.SET_ORDER_LIST:
            return produce(state, draftState=>{
                draftState.orderList = action.payload.orderList
            });
        case actionTypes.ADD_FOOD_TO_ORDERS:
            return produce(state, draftState=>{
                draftState.orderList = [...draftState.orderList, action.payload.food]
            });

        case actionTypes.DELETE_FOOD_FROM_ORDERS:
            return produce(state, draftState=>{
                draftState.orderList = draftState.orderList.filter(food=> food.foods_id !== action.payload.foods_id)
            });

        case actionTypes.INCREASE_FOOD_NUMBER:
            return produce(state, draftState=>{
                draftState.orderList = draftState.orderList.map(food=> {
                    if(food.foods_id === action.payload.foods_id){
                        food.number += 1;
                        food.totalPrice +=  food.price
                        return food;
                    }else {
                        return food;
                    }
                })
            });

        case actionTypes.DECREASE_FOOD_NUMBER:
            return produce(state, draftState=>{
                draftState.orderList = draftState.orderList.map(food=> {
                    if(food.foods_id === action.payload.foods_id){
                        food.number -= 1;
                        food.totalPrice -= food.price
                        return food;
                    }else {
                        return food;
                    }
                })
            });

        case actionTypes.SET_ADDRESS:
            return produce(state, draftState=>{
                draftState.address = action.payload.address
            });

        case actionTypes.SET_TABLE:
            return produce(state, draftState=>{
                draftState.table = action.payload.table
            });

        case actionTypes.SET_HOW_TO_DELIVER:
            return produce(state, draftState=>{
                draftState.howToDeliver = action.payload.howToDeliver
            });

        case actionTypes.SET_HOW_TO_PAY:
            return produce(state, draftState=>{
                draftState.howToPay = action.payload.howToPay
            });

        case actionTypes.SET_TRACKING_ID:
            return produce(state, draftState=>{
                draftState.trackingId = action.payload.trackingId
            });

        case actionTypes.SET_OPEN_ORDERS_TRACKING_ID:

            return produce(state, draftState=>{
                draftState.openOrdersTrackingId = action.payload.openOrdersList.map(eOrder=>{
                    return eOrder['tracking_id'];
                });
            });

        case actionTypes.SET_OPEN_ORDERS_LIST_INFO:
            let ordersListInfoListObject = {};
            action.payload.openOrdersList.map(eOrder=>{
                ordersListInfoListObject[eOrder['tracking_id']] = {
                    "orderList":JSON.parse(eOrder['order_list']),
                    "deliveryPrice":eOrder['delivery_price'],
                    "orderStatus":eOrder['order_status'],
                    "address":eOrder['address'],
                    "details":eOrder['details'],
                    "paymentId":eOrder['payment_id'],
                    "totalPrice":eOrder['total_price'],
                    "orderedDate":eOrder['ordered_date'],
                    "deliveryDate":eOrder['delivery_date'],
                    "offcode":eOrder['offcode'],
                    "paymentStatus":eOrder['payment_status'],
                    "paidFoods":eOrder['paid_foods'],
                    "howToServe":eOrder['how_to_serve'],
                    "paidAmount":eOrder['paid_amount'],
                    "orderTable":eOrder['order_table'],
                }
            })
            return produce(state, draftState=>{
                draftState.openOrdersInfo = ordersListInfoListObject;
            });
        case actionTypes.DELETE_USER_ALL_DATA:
            return produce(state, draftState=>{
                draftState.openOrdersInfo = {};
                draftState.openOrdersTrackingId = [];
            });
        default:
            return state
    }
}


// case actionTypes.DECREASE_FOOD_NUMBER:
// return produce(state, draftState=>{
//     draftState.SMT = action.payload.SMT
// });



