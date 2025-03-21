import {__init__User} from "./__init__Reducers";
import * as actionTypes from '../actionTypes'
import {produce} from "immer"

export default function reducerUser (state = __init__User, action) {
    if(action.type === actionTypes.SET_TOKEN){
        return produce(state,  stateUser_Draft =>{
            stateUser_Draft.token = action.payload.token
        });
    }else if(action.type === actionTypes.SET_PHONE){
        return produce(state, stateUser_Draft =>{
            stateUser_Draft.phone = action.payload.phone
        });
    }else if(action.type === actionTypes.SET_USER_DATA){
        return produce(state, stateUser_Draft =>{
            stateUser_Draft.name = action.payload.userData.name;
            stateUser_Draft.phone = action.payload.userData.phone;
            stateUser_Draft.birthday = action.payload.userData.birthday;
            stateUser_Draft.job = action.payload.userData.job
            stateUser_Draft.totalBoughtAll = action.payload.userData.totalBought
            stateUser_Draft.lastLogin = action.payload.userData.lastLogin
            stateUser_Draft.availableOffCodes = action.payload.userData.availableOffCodes
            stateUser_Draft.userOffCodeHistory = action.payload.userData.userOffCodeHistory
            stateUser_Draft.favoritePlaces = action.payload.userData.favoritePlaces
        });
    }else if(action.type === actionTypes.SET_CUSTOMER_DATA){
        return produce(state, stateUser_Draft =>{
            stateUser_Draft.totalBoughtRestaurant = action.payload.customerInfo.totalBought;
            stateUser_Draft.orderTimesRestaurant = action.payload.customerInfo.orderTimes;
            stateUser_Draft.scoreRestaurant = action.payload.customerInfo.score;
            stateUser_Draft.rankRestaurant = action.payload.customerInfo.rank;
            stateUser_Draft.lastOrderRestaurant = action.payload.customerInfo.lastOrderDate;
            stateUser_Draft.orderListRestaurant = action.payload.customerInfo.orderList;
        });
    }else if(action.type === actionTypes.CONVERT_TRACKING_ID_TO_ORDER_OBJECT) {
        return produce(state, stateUser_Draft => {
            stateUser_Draft.orderListRestaurant = action.payload.orderObjects;
        });
    }else if(action.type === actionTypes.DELETE_USER_ALL_DATA){
        return __init__User
    } else {
        return state;
    }
}