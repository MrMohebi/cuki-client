import {__init__FrontStates} from "./__init__Reducers";
import * as actionTypes from '../actionTypes'
import produce from "immer"

export default function reducerFrontStates (state = __init__FrontStates, action) {
    if(actionTypes.SET_PAGE_SIZE === action.type){
        return produce(state, stateFrontStates_draft =>{
            stateFrontStates_draft.pageSize = action.payload.pageSize
        });
    }else if(actionTypes.SET_HEADER_ORDER === action.type){
        return produce(state, draftState =>{
            draftState.headerOrder = action.payload.headerOrder
        })
    }else if(actionTypes.SET_V_CODE === action.type){
        return produce(state, draftState =>{
            draftState.sentVCode = action.payload.sentVCode
        })
    }else if(actionTypes.SET_TOUR360_PHOTO === action.type){
        return produce(state, draftState =>{
            draftState.tour360Photo = action.payload.photo
        })
    } else {
        return state;
    }
}