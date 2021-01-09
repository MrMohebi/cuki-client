import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from '@fortawesome/free-solid-svg-icons'
import './style/style.css'
import * as requests from './../../ApiRequests/requests'
import {connect} from "react-redux";
import * as fixnumbers from './../../usableFunctions/englishNumToPersianNum'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal)

class OrderReport extends React.Component {

    state = {
        orderInfo: {},
        orderList: [],
        selectedFoodToPay: [],
        paidFoods: [],
        orderListPaidNotIncluded: [],
        addressOrTable: '',
    }

    componentDidMount() {

        let orderInfo = this.props.openOrdersInfo[this.props.match.params.trackingId];
        if (orderInfo === undefined) {
            this.props.history.push('/openorders');
        } else {
            setInterval(() => {
                this.getPaidItemsInfo(this.props.match.params.trackingId)
            }, 3000)
            this.getPaidItemsInfo(this.props.match.params.trackingId);
            this.setState({
                orderInfo: orderInfo,
                orderListPaidNotIncluded: orderInfo.orderList,
                orderList: this.createFoodsToSelectToPay(orderInfo.orderList, this.state.selectedFoodToPay),
                addressOrTable: (orderInfo.address) ? orderInfo.address : fixnumbers.unfixNumber(orderInfo.orderTable.toString()),
            })

        }
    }


    createFoodsToSelectToPay = (orderList, selectedFoods) => {
        return orderList.map(eachFood => {
            let foodInSelectedItemToPay = selectedFoods.filter(eFood => eFood.id === eachFood.id)[0];
            return (
                <div key={eachFood.id} className='reportEachTable'>

                    <div className='name-and-your-pay'>

                        <div className='orderReportPriceTotal priceOrange'>

                            {(foodInSelectedItemToPay && foodInSelectedItemToPay.number > 0) ? foodInSelectedItemToPay.number * eachFood.price : 0} T
                        </div>
                        <div className='orderReportPriceTotal mt-2'>{eachFood.number * eachFood.price} T</div>

                    </div>


                    <div className='name-and-your-pay'>
                        <input className='dongNumberOfFoodsInput' disabled={eachFood.number>0 ? false:true} type="number" key={eachFood.price}
                               onChange={(element) => {
                                   this.eachFoodInputChanged(element, eachFood.number, eachFood.price, eachFood.id)
                               }}/>
                        {eachFood.number > 0 ? <div className="mt-2"> X{eachFood.number} </div> :
                            <div>پرداخت شده</div>}
                    </div>
                    <div className='name-and-your-pay'>
                        <span className='font-weight-bold'>پرداخت شما</span>
                        <div className='mt-2'>{eachFood.name}</div>
                    </div>
                </div>
            )
        })
    }

    eachFoodInputChanged = (input, foodNumber, price, id) => {
        if (input.target.value > foodNumber) {
            if (foodNumber < 0)
                input.target.value = 0
            else
                input.target.value = foodNumber
        }
        this.sumOfFoodPrices(parseInt(input.target.value), price, id);

        this.getPaidItemsInfo(this.props.match.params.trackingId)
    }

    sumOfFoodPrices = (number, price, id) => {
        let otherFoods = [...this.state.selectedFoodToPay.filter(eFood => eFood.id !== id)]
        let foodUpdated = {id: id, tPrice: number * price, number: number};
        let updatedAllFoods = [...otherFoods, foodUpdated]
        // update table list
        this.setState({
            selectedFoodToPay: updatedAllFoods,
            orderList: this.createFoodsToSelectToPay(this.state.orderListPaidNotIncluded, updatedAllFoods),
        })
    }

    handleSubmitClicked = () => {
        let sumOfFoods = 0;
        this.state.selectedFoodToPay.map(eFood => {
            if (eFood.number > 0)
                sumOfFoods += eFood.tPrice;
        })
        if (sumOfFoods < 100)
            sumOfFoods = 0;

        if (sumOfFoods > 100)
            requests.sendPaymentRequestFood(this.state.selectedFoodToPay, sumOfFoods, this.props.match.params.trackingId, this.callbackPaymentRequest);
        else {
            ReactSwal.fire({
                icon: 'warning',
                confirmButtonText: 'عه، اوکیه',
                text: "!هیچی انتخاب نکردی که",
            })
        }
    }

    callbackPaymentRequest = (res) => {
        if (res.statusCode === 200) {
            ReactSwal.fire({
                title: 'تمومه',
                icon: 'success',
                confirmButtonText: 'بریم درگاه پرداخت',
                showDenyButton: true,
                denyButtonText: "میخوام لینک پرداخت رو ارسال کنم واسه دوستم",
                denyButtonColor: "#47b8e5",
                text: "مبلغ : " + res.data.amount / 1000 + " تومن \n",
            }).then(resultSwalPay => {
                if (resultSwalPay.isConfirmed) {
                    window.open(res.data.url, '_blank').focus()
                } else if (resultSwalPay.isDenied) {
                    navigator.clipboard.writeText(
                        "لینک پرداخت دونگ کوکی" + "\n" +
                        "مبلغ : " + res.data.amount / 1000 + " هزار تومن \n" + "\n" +
                        " بزن روی لینک پایینی بری تو درگاه " + "\n"
                        + res.data.url).then(() => {
                        ReactSwal.fire("لینک توی کلیپ بورد ذخیره شد")
                    })

                }
            });
        } else {
            ReactSwal.fire({
                title: '!!! آخ',
                icon: 'error',
                confirmButtonText: 'اوکیه',
                text: "یه چیزی درست کار نکرد، میشه از اول امتحان کنی؟",
            });
        }
    }


    getPaidItemsInfo = (trackingId) => {
        requests.getPaymentInfoByTrackingId(trackingId, this.setPaidItemsToState)
    }

    setPaidItemsToState = (res) => {
        if (res.statusCode === 200) {
            let newSavedPaidItems = [];
            res.data.map(ePaid => {
                if (ePaid.isPaid && ePaid.itemType === "food") {
                    let items = JSON.parse(ePaid.item);
                    items.map(ePaidFood => {
                        let flagUpdate = false
                        newSavedPaidItems.map((eSavedPaidFood, index) => {
                            if (ePaidFood.id === eSavedPaidFood.id) {
                                flagUpdate = true;
                                let newFoodNumber = ePaidFood.number + eSavedPaidFood.number;
                                newSavedPaidItems[index] = {
                                    id: eSavedPaidFood.id,
                                    tPrice: newFoodNumber * ePaidFood.priceAfterDiscount,
                                    number: newFoodNumber
                                }
                            }
                        })
                        if (!flagUpdate) {
                            newSavedPaidItems.push({
                                id: ePaidFood.id,
                                tPrice: ePaidFood.number * ePaidFood.priceAfterDiscount,
                                number: ePaidFood.number
                            })
                        }
                    })
                }
                let newOrderList = this.state.orderInfo.orderList.map(eOFood => {
                    let newEOFood = JSON.parse(JSON.stringify(eOFood));
                    let foodNumber = newEOFood.number;
                    newSavedPaidItems.map(eSavedPaidFood => {
                        if (newEOFood.id === eSavedPaidFood.id)
                            foodNumber = parseInt(newEOFood.number) - parseInt(eSavedPaidFood.number);
                    });
                    newEOFood.number = foodNumber;
                    return newEOFood;
                })
                this.setState({
                    paidFoods: newSavedPaidItems,
                    orderList: this.createFoodsToSelectToPay(newOrderList, this.state.selectedFoodToPay),
                    orderListPaidNotIncluded: newOrderList,
                })
            })
        } else {
            console.log("Some thing went wrong during fetching Paid Items")
        }
    }


    render() {
        return <React.Fragment>
            <div id='reportHeader'/>
            <div className='iransans' id='reportMain'>
                <div id='wayHolderLine'>
                    <div id='wayHolder'>
                        <FontAwesomeIcon id='wayHolderElements' icon={faAngleDown}/>
                        <span className='iransans' id='wayHolderElements'>
                        گزارش سفارش
                        </span>
                        <span id='wayHolderElements'/>
                    </div>
                </div>
                <div className='iransans' id='reportOrders'>
                    {this.state.orderList}
                </div>
                <div className='iransans' id='ordersEndLine'/>
                <div className='iransans' id="reportDetails">

                    {/*Number of order*/}
                    <div id='trackingIdLabel'>
                        <div className='orderNumberImg'></div>
                        <span className='iransans' id='reportDetailsText'>
                            شماره سفارش
                        </span>
                        <br/>
                    </div>

                    <p className='iransans'
                       id='detailContent'>{fixnumbers.unfixNumber(this.props.match.params.trackingId.toString())}</p>
                    <div className='iransans' id='trackingIdLabel'>
                        <div className='orderAddressImg'/>
                        <span className='iransans' id='reportDetailsText'>
                            آدرس / شماره میز
                        </span>
                        <br/>
                    </div>

                    <p className='iransans' id='detailContent'>
                        {this.state.addressOrTable}
                    </p>

                    <div id='trackingIdLabel'>
                        <div className='orderTimeImg'/>
                        <span className='iransans' id='reportDetailsText'>
                            زمان تقریبی آماده شدن سفارش
                        </span>
                        <br/>
                    </div>
                    <p className='iransans' id='detailContent'>تعیین نشده</p>


                    <div className='reportholdersAndPrices'>
                        <div className='reportHolders'>
                        <span className='iransans' id='reportDetailsText'>
                            کل
                        </span>
                            <span className='iransans' id='reportDetailsText'>
                            پرداخت شده
                        </span>
                        </div>
                        <div className='reportHolders'>
                        <span className='iransans' id='reportDetailsText'>
                            {this.state.orderInfo.totalPrice} T
                        </span>
                            <span className='iransans' id='reportDetailsText'>
                                {this.state.orderInfo.paidAmount} T
                        </span>
                        </div>
                    </div>
                </div>

                <div className='submitButtonContainer' onClick={this.handleSubmit}>
                    <div onClick={this.handleSubmitClicked} className='submitButton shadow'>
                        تایید
                    </div>
                </div>
                <div>
                    <div className='backButton' onClick={() => {
                        this.props.history.push('/openorders')
                    }}/>
                </div>
            </div>

        </React.Fragment>


    }
}

const mapStateToProps = (store) => {
    return {
        openOrdersInfo: store.reducerTempData.openOrdersInfo,
    }
}

export default connect(mapStateToProps)(OrderReport);