import $ from 'jquery';
import React from "react";
import * as actions from '../reduxStore/actions'
import {store} from '../reduxStore/store'
import * as cache from '../reduxStore/cachedData/cachedData'

export const BASE_URL = "https://api.cuki.ir/";
export const PAY_BASE_URL = "https://pay.cuki.ir/";

export const getUserInfo = (callbackFunction) => {
    let token = store.getState().reducerUser.token;
    $.post(BASE_URL+'getUserInfo.fetch.php',{token:token}).then(res =>{
        if(res.statusCode === 200){
            actions.userSetData(res.data)
        }
        callbackFunction(res)
        return res;
    })
}

export const sendVerificationCode = (phone,checkPhone)=>{
    $.post(BASE_URL+'sendVerificationCode.add.modify.php',{phone:phone}).then(res =>{
        if(res.statusCode === 200){
            actions.userSetPhone(phone)
        }
        checkPhone(res)
        return res;
    })
}



export const checkVerificationCode = (verificationCode,checkFunction) => {
    let phone = store.getState().reducerUser.phone
    $.post(BASE_URL+'login.modify.php',{phone:phone, verification_code:verificationCode}).then(res =>{
        if(res.statusCode === 200){
            cache.setCacheToken(res.token)
            actions.userSetToken(res.token)
        }
        checkFunction(res)
        return res;
    })
}

export const signUpRequest = (name,birthday,job,checkSignup)=>{
    let token = store.getState().reducerUser.token;
    $.post(BASE_URL+"signup.modify.php",{token:token,name:name,birthday:birthday,job:job}).then(res=>{
        checkSignup(res)
        return res;
    })

}
export const profileEditRequest = (action, value, callbackFunction)=>{
    let token = store.getState().reducerUser.token;
    switch (action) {
        case "editName":
            $.post(BASE_URL+ "changeUserInfo.modify.php" ,{token:token,"name":value,"nameChange":1}).then(res=>{
                callbackFunction(res)
                return res;
            })
            break;
        case "editJob":
            $.post(BASE_URL+ "changeUserInfo.modify.php" ,{token:token,"job":value,"jobChange":1}).then(res=>{
                callbackFunction(res)
                return res;
            })
            break;
        case "editBirthday":
            $.post(BASE_URL+ "changeUserInfo.modify.php" ,{token:token,"birthday":value,"birthdayChange":1}).then(res=>{
                callbackFunction(res)
                return res;
            })
            break;
        default:
            return "Error"
    }

}

export const getRestaurantInfo = (callbackFunction)=>{
    let englishName = store.getState().reducerRestaurant.englishName
    $.post(BASE_URL+ "getAllRestaurantData.fetch.php" ,{english_name:englishName}).then(res=>{
        if(res.statusCode === 200){
            actions.restaurantSetData(res.data)
        }
        callbackFunction(res);
        return res;
    })
}



export const getCustomerInfo = (callbackFunction)=>{
    let token = store.getState().reducerUser.token;
    let englishName = store.getState().reducerRestaurant.englishName
    $.post(BASE_URL+ "getCustomerInfoRestaurant.fetch.php" ,{englishName, token}).then(res=>{
        if(res.statusCode === 200){
            actions.userSetCustomerInfo(res.data)
            getOrderByTrackingId(JSON.parse(res.data.orderList).map(trackingId =>{return parseInt(trackingId);}), actions.userConvertTrackingIdToOrderObject, callbackFunction)
        }else{
            callbackFunction(res);
        }
    })
}

export const getOrderByTrackingId = (trackingId,callbackFunctionByData, callbackFunction=()=>{})=>{
    let token = store.getState().reducerUser.token;
    let englishName = store.getState().reducerRestaurant.englishName
    $.post(BASE_URL+ "getOrderByTrackingId.fetch.php" ,{englishName, token, trackingId:JSON.stringify(trackingId)}).then(res=>{
        callbackFunctionByData(res.data);
        callbackFunction(res)
    })
}


export const sendOrder = (table,address,paymentStatus,callbackFunction)=>{
    let token = store.getState().reducerUser.token;
    let englishName = store.getState().reducerRestaurant.englishName
    let orders = store.getState().reducerTempData.orderList.map(eachFood =>{return {id:eachFood.foods_id, number:eachFood.number}})
    let details =  {general: '', eachFood: []}
    $.post(BASE_URL+ "sendOrder.add.php" ,{englishName, token, orders:JSON.stringify(orders),details:JSON.stringify(details),deliveryPrice:'0',orderTable:table,address}).then(res=>{
        if(res.statusCode === 200){
            actions.setTrackingId(res.trackingId)
        }
        callbackFunction(res);
        return res;
    })
}


export const sendReserveTable = (tableName, reserveDate, reserveHours,callbackFunction)=>{
    let token = store.getState().reducerUser.token;
    let englishName = store.getState().reducerRestaurant.englishName
    $.post(BASE_URL+ "sendReserveTable.add.php" ,{englishName, token, tableName, reserveDate, reserveHours:JSON.stringify(reserveHours)}).then(res=>{
        callbackFunction(res);
    })
}


export const sendPaymentRequestFood = (items, amount, trackingId,callbackFunction)=>{
    let token = store.getState().reducerUser.token;
    let englishName = store.getState().reducerRestaurant.englishName
    let newItems = items.filter(eFood=>eFood.number > 0);
    $.post(PAY_BASE_URL+ "createpayment.php" ,{englishName, token, itemType:"food", items:JSON.stringify(newItems), amount, trackingId}).then(res=>{
        callbackFunction(res);
    })
}


export const getPaymentInfoByTrackingId = (trackingId,callbackFunction)=>{
    let token = store.getState().reducerUser.token;
    $.post(BASE_URL+ "getPaymentInfo.fetch.php" ,{token, trackingId}).then(res=>{
        callbackFunction(res);
    })
}






export const getOpenOrders = (callbackFunction)=>{
    let token = store.getState().reducerUser.token;
    let englishName = store.getState().reducerRestaurant.englishName
    $.post(BASE_URL+ "getOpenOrders.fetch.php" ,{englishName, token}).then(res=>{
        actions.setOpenOrdersListInfo(res.data)
        actions.setOpenOrdersTrackingId(res.data)
        callbackFunction(res);
    })
}





