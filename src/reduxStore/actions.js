import * as actionTypes from './actionTypes'
import {store} from './store'


export const userDeleteAllData = () => (
    store.dispatch({
        type: actionTypes.DELETE_USER_ALL_DATA,
    })
)


export const userSetPhone = phone => (
    store.dispatch({
        type: actionTypes.SET_PHONE,
        payload:{
            phone
        }
    })
)

export const userSetToken = token => (
    store.dispatch({
        type: actionTypes.SET_TOKEN,
        payload:{
            token
        }
    })
)

export const frontStatesPageSize = pageSize => (
    store.dispatch({
        type: actionTypes.SET_PAGE_SIZE,
        payload:{
            pageSize
        }
    })
)



export const restaurantSetData = restaurantData => (
    store.dispatch({
        type: actionTypes.SET_RESTAURANT_DATA,
        payload:{
            restaurantData
        }
    })
)

export const userSetData = userData => (
    store.dispatch({
        type: actionTypes.SET_USER_DATA,
        payload:{
            userData
        }
    })
)




export const addFoodToOrders = food => (
    store.dispatch({
        type: actionTypes.ADD_FOOD_TO_ORDERS,
        payload:{
            food
        }
    })
)



export const deleteFoodFromOrders = foods_id => (
    store.dispatch({
        type: actionTypes.DELETE_FOOD_FROM_ORDERS,
        payload:{
            foods_id
        }
    })
)


export const increaseFoodNumber = foods_id => (
    store.dispatch({
        type: actionTypes.INCREASE_FOOD_NUMBER,
        payload:{
            foods_id
        }
    })
)


export const decreaseFoodNumber = foods_id => (
    store.dispatch({
        type: actionTypes.DECREASE_FOOD_NUMBER,
        payload:{
            foods_id
        }
    })
)


export const frontStatesHeaderOrder = (headerOrder) => (
    store.dispatch({
        type: actionTypes.SET_HEADER_ORDER,
        payload:{
            headerOrder
        }
    })
)


export const userSetCustomerInfo = (customerInfo) =>{
    store.dispatch({
        type: actionTypes.SET_CUSTOMER_DATA,
        payload:{
            customerInfo
        }
    })
}


export const userConvertTrackingIdToOrderObject = (orderObjects) =>{
    store.dispatch({
        type: actionTypes.CONVERT_TRACKING_ID_TO_ORDER_OBJECT,
        payload:{
            orderObjects
        }
    })
}


export const setAddress = (address) =>{
    store.dispatch({
        type: actionTypes.SET_ADDRESS,
        payload:{
            address
        }
    })
}



export const setTable = (table) =>{
    store.dispatch({
        type: actionTypes.SET_TABLE,
        payload:{
            table
        }
    })
}


export const setHowToDeliver = (howToDeliver) =>{
    store.dispatch({
        type: actionTypes.SET_HOW_TO_DELIVER,
        payload:{
            howToDeliver
        }
    })
}



export const setHowToPay = (howToPay) =>{
    store.dispatch({
        type: actionTypes.SET_HOW_TO_PAY,
        payload:{
            howToPay
        }
    })
}


export const setTrackingId = (trackingId) =>{
    store.dispatch({
        type: actionTypes.SET_TRACKING_ID,
        payload:{
            trackingId
        }
    })
}

export const setSentVCode = (sentVCode) =>{
    store.dispatch({
        type: actionTypes.SET_V_CODE,
        payload:{
            sentVCode
        }
    })
}



export const setOrderList = (orderList) =>{
    store.dispatch({
        type: actionTypes.SET_ORDER_LIST,
        payload:{
            orderList
        }
    })
}


export const setOpenOrdersTrackingId = (openOrdersList) =>{
    store.dispatch({
        type: actionTypes.SET_OPEN_ORDERS_TRACKING_ID,
        payload:{
            openOrdersList
        }
    })
}

export const setOpenOrdersListInfo = (openOrdersList) =>{
    store.dispatch({
        type: actionTypes.SET_OPEN_ORDERS_LIST_INFO,
        payload:{
            openOrdersList
        }
    })
}


export const setTour360Photo = (photo) =>{
    store.dispatch({
        type: actionTypes.SET_TOUR360_PHOTO,
        payload:{
            photo
        }
    })
}

