import {__init__Restaurant} from "./__init__Reducers";
import * as actionTypes from '../actionTypes'
import produce from "immer"

export default function reducerRestaurant (state= __init__Restaurant, action) {
    switch (action.type) {
        case actionTypes.SET_RESTAURANT_DATA:
            return produce(state, draftState =>{
                draftState.allTableList = action.payload.restaurantData.allTableList;
                draftState.assets = action.payload.restaurantData.assets;
                draftState.comments = action.payload.restaurantData.comments;
                draftState.foods = action.payload.restaurantData.foods;
                draftState.reservedTableList = action.payload.restaurantData.reservedTableList;
                draftState.restaurantInfo = action.payload.restaurantData.restaurantInfo;
            });
        default:
            return state;
    }
}
