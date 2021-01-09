import {store} from "../../../reduxStore/store";
import * as actions from "../../../reduxStore/actions"




function applyDiscount(totalPrice, discount) {
    if(discount < 100){
        return totalPrice * (100 - discount)
    }else if (totalPrice < discount) {
        return totalPrice - discount
    }else {
        return 0
    }
}