import React from "react";
import {connect} from "react-redux";
import * as actions from "../../reduxStore/actions";
import * as cache from "../../reduxStore/cachedData/cachedData"
import './style/style.css'
import $ from 'jquery'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {SwipeableList, SwipeableListItem} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import '../PayWay/style/style.css'
import * as randomColor from "../MainPage/js/randomColor";


class Bill extends React.Component {

    componentDidMount() {
        cache.setCacheOrderList(this.props.orderList);
        $('.swipeable-list-item__content').css({backgroundColor: 'transparent'})
        $('.swipeable-list-item').css({overflow: 'visible'})
    }

    sumTotalOrderPrice = () => {
        let sum = 0;
        this.props.orderList.map(eachFood => {
            sum += eachFood.totalPrice
        })
        return sum;
    }

    checkFoodNumber = (foodId, number) => {
        if (number <= 0) {
            this.props.deleteFoodFromOrders(foodId)
            return true
        } else {
            return number
        }
    }
    handleSubmit = () => {
        if (this.props.token.length > 20){
            if(this.props.orderList.length > 0)
                this.props.history.push('/pay');
        } else {
            this.props.history.push('/login')
        }
    }

    handleIncreaseFoodNumber =(foodId) =>{
        if(this.props.trackingId < 1000)
            this.props.increaseFoodNumber(foodId)
    }
    handleDecreaseFoodNumber = (foodId) =>{
        if(this.props.trackingId < 1000)
            this.props.decreaseFoodNumber(foodId)
    }

    createOrderList = () => {
        return this.props.orderList.map(eachFood => {

            return (
                <SwipeableListItem
                    swipeLeft={{
                        content: <div/>,
                        action: () => {this.handleDecreaseFoodNumber(eachFood.foods_id)}
                    }}
                    swipeRight={{
                        content: <div/>,
                        action: () => {this.handleIncreaseFoodNumber(eachFood.foods_id)}
                    }}
                >
                    <div key={eachFood.foods_id} className='eachFoodContainerBill' style={{backgroundColor:randomColor.default()}}>
                        <div className='eachFoodImageBill'
                             style={{
                                 background:`url(${eachFood.thumbnail})`
                             }}
                        />
                        <div className="foodNameAndPrice">
                            <span className='billEachFoodName'>{eachFood.name}</span>
                            <span className="billEachFoodPrice">{eachFood.price / 1000 + "T"}</span>
                        </div>
                        <div className='priceMinPlus'>
                            <FontAwesomeIcon icon={faPlus} style={{width:'10px'}}  onClick={(args)=>{this.handleIncreaseFoodNumber(eachFood.foods_id)}}/>
                            <div className='foodNumber'>X{this.checkFoodNumber(eachFood.foods_id, eachFood.number)}</div>
                            <FontAwesomeIcon icon={faMinus} style={{width:'10px'}} onClick={(args)=>{this.handleDecreaseFoodNumber(eachFood.foods_id)}}/>
                        </div>
                    </div>
                </SwipeableListItem>
            )
        })
    }


    render() {
        return (
            <React.Fragment>
                <div id='main'>
                    <div className='backButton' onClick={()=>{
                        this.props.history.push('/main')
                    }}/>
                    <div className='billHeader'>
                        <div><span className='billHeaderText orange'>فاکتور</span> <span
                            className='billHeaderText '> خرید</span></div>
                    </div>
                    <div id='content'>
                        <div id='foods'>
                            <SwipeableList>
                                {this.createOrderList()}
                            </SwipeableList>
                        </div>
                        <div className="blur-border"/>
                        <div className='totalPriceHolder'>
                            <span className='billTotalPrice submitRed'>جمع نهایی فاکتور</span>
                            <span className="billTotalPrice">{this.sumTotalOrderPrice()} T</span>
                        </div>
                    </div>
                </div>
                <div className='submitButtonContainer' onClick={this.handleSubmit}>
                    <div onClick={this.handleSubmitClicked} className='submitButton shadow'>
                        تایید
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        orderList: store.reducerTempData.orderList,
        trackingId: store.reducerTempData.trackingId,
        token: store.reducerUser.token,
    }
}

const mapDispatchToProps = () => {
    return {
        increaseFoodNumber: actions.increaseFoodNumber,
        decreaseFoodNumber: actions.decreaseFoodNumber,
        deleteFoodFromOrders: actions.deleteFoodFromOrders,
        setHeaderOrder: actions.frontStatesHeaderOrder
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bill);