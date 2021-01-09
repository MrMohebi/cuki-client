import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as requests from "../../ApiRequests/requests"
import "./css/style.css"
import * as randomColor from "../MainPage/js/randomColor";
setInterval(()=>{requests.getOpenOrders(()=>{})}, 3000)

class OpenOrders extends Component {
    handleClickOnOrder = (tackingId) =>{
        this.props.history.push('/orderReport/'+tackingId);
    }

    componentDidMount() {
        if (Object.keys(this.props.openOrdersInfo).length > 0){

        }else{
            this.props.history.push('/main')
        }




    }


    render() {
        return (
            <div className="page-container">
                <div className="header">
                    <div className='backButton' onClick={()=>{
                        this.props.history.push('/main')
                    }}/>
                </div>
                <div className="orders-list">

                    {Object.keys(this.props.openOrdersInfo).map(eOOrderTrackingId=>{
                        let orderedDate = new Date(this.props.openOrdersInfo[eOOrderTrackingId].orderedDate*1000);

                        return (
                            <div className="each-open-order-container" style={{backgroundColor:randomColor.default(eOOrderTrackingId[eOOrderTrackingId.length - 1])}} key={eOOrderTrackingId} onClick={(args)=>{this.handleClickOnOrder(eOOrderTrackingId)}}>
                                <div className="name-and-total">
                                    <div className="order-food-names">{this.props.openOrdersInfo[eOOrderTrackingId].orderList.map(eFood=>{return eFood.name}).join(" / ")}</div>
                                    <div className="paid-price">{this.props.openOrdersInfo[eOOrderTrackingId].totalPrice / 1000} T</div>
                                </div>
                                <div className="name-and-total">
                                    <div className='date-time'>{orderedDate.getHours()+":"+orderedDate.getMinutes()}</div>
                                    <div className="total-price">{this.props.openOrdersInfo[eOOrderTrackingId].paidAmount / 1000} T</div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        openOrdersTrackingId : state.reducerTempData.openOrdersTrackingId,
        openOrdersInfo: state.reducerTempData.openOrdersInfo,
    };
}

export default connect(
    mapStateToProps,
)(OpenOrders);

