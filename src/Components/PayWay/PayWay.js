import React from "react";
import './style/style.css'
import * as actions from "../../reduxStore/actions";
import {connect} from "react-redux";
import SwitchSelector from "react-switch-selector";
import * as requests from "../../ApiRequests/requests";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal)


class payWay extends React.Component {

    createInitAllToSelectedToPay = (orderList) =>{
        return orderList.map(eFood=>{
            return {
                id:eFood.foods_id,
                tPrice: eFood.number * eFood.price,
                number: eFood.number,
            }
        })
    }

    state = {
        table: this.props.table,
        address:this.props.address,
        payWay: 'online',
        dong: true,
        orderList: [],
        inOut: 'inRes',
        totalPrice: 0,
        selectedFoodToPay: this.createInitAllToSelectedToPay(this.props.orderList),
        paidFoods: [],
        orderListPaidNotIncluded: this.props.orderList,
    }
    //switch option and inits
    payOptions = [
        {
            label: "آنلاین",
            value: 'online',
            selectedBackgroundColor: "#34B3C6",

        },
        {
            label: "نقدی",
            value: "cash",
            selectedBackgroundColor: "#34B3C6"
        }
    ];
    payInit = this.payOptions.findIndex(({value}) => value === "online");
    inOutOptions = [
        {
            label: "بیرون بر",
            value: "outRes",
            selectedBackgroundColor: "#34B3C6"
        },
        {
            label: "درون رستوران",
            value: "inRes",
            selectedBackgroundColor: "#34B3C6",

        }

    ];
    inOutInit = this.inOutOptions.findIndex(({value}) => value === 'inRes');

    dongOptions = [
        {
            label: "دونگی",
            value: true,
            selectedBackgroundColor: "#34B3C6",

        },
        {
            label: "کلی",
            value: false,
            selectedBackgroundColor: "#34B3C6"
        }


    ];
    dongInit = this.dongOptions.findIndex(({value}) => value === true);


    componentDidMount() {
        let totalPrice = 0;
        for (let i = 0; i <= this.props.orderList.length; i++) {
            if (this.props.orderList[i]) {
                totalPrice = totalPrice + this.props.orderList[i].price * this.props.orderList[i].number
            }
        }

        this.setState({
            orderList: this.createFoodsToSelectToPay(this.props.orderList, this.state.selectedFoodToPay),
            totalPrice: totalPrice
        })

        if (this.props.trackingId > 100) {
            this.getPaidItemsInfo(this.props.trackingId)
        }


        let inResFields = document.getElementsByClassName('inResFields')
        let outResFields = document.getElementsByClassName('outResFields')
        let addressInput = document.getElementsByClassName('addressInput')
        outResFields[0].style.height = 0
        outResFields[0].style.opacity = 0
        outResFields[0].style.pointerEvents = "none"
        inResFields[0].style.height = '60px'
        inResFields[0].style.opacity = 1
        inResFields[0].style.pointerEvents = "all"
        addressInput[0].value = ''
        this.dongSwitchOnChange(true)
        this.paySwitchOnChange('online')
    }


    createFoodsToSelectToPay = (orderList, selectedFoods) => {
        return orderList.map(eachFood => {
            let foodInSelectedItemToPay = selectedFoods.filter(eFood => eFood.id === eachFood.foods_id)[0];

            return (
                <div key={eachFood.foods_id} className='dongTableEachRow'>
                    {eachFood.number > 0 ?
                        <div>{eachFood.number} <br/> {eachFood.number * eachFood.price}</div>
                        :
                        <div>پرداخت شده</div>}
                    <div>
                        {(foodInSelectedItemToPay && foodInSelectedItemToPay.number >= 0) ? foodInSelectedItemToPay.number * eachFood.price : eachFood.number * eachFood.price}
                    </div>
                    <div>{eachFood.name}</div>
                    <div>
                        <input defaultValue={eachFood.number} disabled={eachFood.number > 0 ?false:true} className='dongNumberOfFoodsInput' type="number" key={eachFood.price}
                               onChange={(element) => {
                                   this.eachFoodInputChanged(element, eachFood.number, eachFood.price, eachFood.foods_id)
                               }}/>
                    </div>
                </div>
            )
        })
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


    eachFoodInputChanged = (input, foodNumber, price, id) => {
        if (input.target.value > foodNumber )
            input.target.value = foodNumber
        else if(input.target.value === ""){
            this.sumOfFoodPrices(0, price, id);
            return false;
        }
        this.sumOfFoodPrices(parseInt(input.target.value), price, id);
        if (this.props.trackingId > 100) {
            this.getPaidItemsInfo(this.props.trackingId)
        }
    }

    backClicked = () => {
        this.props.history.push('/bill')
    }



    paySwitchOnChange = (state) => {
        this.setState({
            payWay: state.toString(),
        })
        this.props.setHowToPay(state.toString())

        let dongSwitch = document.getElementsByClassName('switchWrapperDong');
        let table = document.getElementsByClassName('dongTable')

        if (state === 'cash') {
            dongSwitch[0].style.opacity = 0
            dongSwitch[0].style.pointerEvents = "none";

            table[0].style.height = "0px"
            table[0].style.padding = "0"
            this.props.setHowToPay('cash')

        } else {
            dongSwitch[0].style.opacity = 1
            dongSwitch[0].style.pointerEvents = "all";
            table[0].style.pointerEvents = "all";
            this.props.setHowToPay('online')

            if (this.state.dong) {
                table[0].style.height = "300px"
                table[0].style.padding = "10px 5px"
            }
        }
    }

    dongSwitchOnChange = (state) => {
        this.setState({
            dong: state
        })
        let table = document.getElementsByClassName('dongTable')

        if (state) {
            table[0].style.height = "300px"
            table[0].style.padding = "10px 5px"
        } else {
            table[0].style.height = "0px"
            table[0].style.padding = "0"
        }
    }

    inOutSwitchOnChange = (state) => {
        this.setState({
            inOut: state
        })
        let inResFields = document.getElementsByClassName('inResFields')
        let outResFields = document.getElementsByClassName('outResFields')
        let tableInput = document.getElementsByClassName('tableNumberInput')
        let addressInput = document.getElementsByClassName('addressInput')

        if (state === 'outRes') {
            this.props.setHowToDeliver('outRestaurant')
            inResFields[0].style.height = 0
            inResFields[0].style.opacity = 0
            inResFields[0].style.pointerEvents = "none"
            outResFields[0].style.height = '60px'
            outResFields[0].style.opacity = 1
            outResFields[0].style.pointerEvents = "all"
            tableInput[0].value = ''


        } else {
            this.props.setHowToDeliver('inRestaurant')

            outResFields[0].style.height = 0
            outResFields[0].style.opacity = 0
            outResFields[0].style.pointerEvents = "none"
            inResFields[0].style.height = '60px'
            inResFields[0].style.opacity = 1
            inResFields[0].style.pointerEvents = "all"
            addressInput[0].value = ''
        }

    }


    handleChangeAddress = (elem) =>{
        this.setState({
            address: elem.target.value,
        })
    }

    tableNumberChange = (input) => {
        if (input.target.value.toString().length >= 3) {
            input.target.value = input.target.value.toString().slice(0, 3)
            this.setState({
                table: input.target.value,
            })
        }
    }

    handleSubmitClicked = () => {
        let sumOfFoods = 0;
        this.state.selectedFoodToPay.map(eFood => {
            if (eFood.number > 0)
                sumOfFoods += eFood.tPrice;
        })
        if (sumOfFoods < 100){
            ReactSwal.fire({
                title: 'حداقل یه چیز رو واسه پرداخت انتخاب کن',
                icon: 'info',
                confirmButtonText: "عه حواسم نبود، اوکیه",
            })
            return false;
        }



        let paymentStatus = this.state.payWay === 'online' ? 8 : 85;
        let [table, address] = this.state.inOut === 'inRes' ? [this.state.table, ""] : ["", this.state.address];

        let canHePay = (this.state.inOut === 'outRes' && address.length > 5) || (this.state.inOut === 'inRes' && table > 0)


        if (canHePay === true && sumOfFoods > 100){
            if (this.props.trackingId > 1000){
                ReactSwal.fire({
                    title: 'یه سفارش باز داری',
                    icon: 'info',
                    confirmButtonText: "میخوام دونگ همون قبلی رو بپردازم",
                    showDenyButton: true,
                    denyButtonText: 'میدونم؛ یه سفارش  جدید دارم',
                    text: ((this.state.dong && paymentStatus === 8) ?
                        'قیمت این یکی دونگ: ' + sumOfFoods / 1000 + " تومن \n" : "") +
                        'قیمت کل  فاکتور: ' + this.state.totalPrice / 1000 + " تومن \n",
                }).then(result => {
                    if (result.isConfirmed) {
                        requests.sendPaymentRequestFood(this.state.selectedFoodToPay, sumOfFoods, this.props.trackingId, this.callbackPaymentRequest);
                    }else {
                        this.createNewOpenOrder(table, address, paymentStatus, sumOfFoods);
                    }
                })
            }else {
                ReactSwal.fire({
                    title: 'خب در مجموع',
                    icon: 'info',
                    confirmButtonText: 'اره سفارشمو ثبت کن',
                    showDenyButton: true,
                    denyButtonText: "نه وایسا یه چیزو عوض کنم",
                    text: ((this.state.dong && paymentStatus === 8) ?
                        'قیمت این یکی دونگ: ' + sumOfFoods / 1000 + " تومن \n" : "") +
                        'قیمت کل  فاکتور: ' + this.state.totalPrice / 1000 + " تومن \n",
                }).then(result => {
                    if (result.isConfirmed) {
                        if (this.props.trackingId < 1000) {
                            this.createNewOpenOrder(table, address, paymentStatus, sumOfFoods);
                        } else {
                            requests.sendPaymentRequestFood(this.state.selectedFoodToPay, sumOfFoods, this.props.trackingId, this.callbackPaymentRequest);
                        }
                    }
                })
            }
        }else {
            ReactSwal.fire({
                title: 'نه صبر کن',
                icon: 'info',
                confirmButtonText: "اها اوکیه وایسا",
                text: "!یه چیز رو کامل وارد نکردی"
            })
        }
    }

    createNewOpenOrder = (table, address, paymentStatus, sumOfFoods) =>{
        this.props.setTable(table)
        this.props.setAddress(address)
        this.sendOrderRequestAsync(table, address, paymentStatus).then(OResult => {
            if (OResult.statusCode === 200) {
                this.props.setTrackingId(OResult.trackingId);
                if (paymentStatus === 8) {
                    requests.sendPaymentRequestFood(this.state.selectedFoodToPay, sumOfFoods, OResult.trackingId, this.callbackPaymentRequest);
                } else {
                    ReactSwal.fire({
                        title: 'تمومه',
                        icon: 'success',
                        confirmButtonText: 'اوکیه',
                        text: "خب سفارشت رو ثبت کردیم، یکم دیگه آمادس :)" + "\n" +
                            " : شماره سفارش" + OResult.trackingId
                        ,
                    })
                }
            } else {
                ReactSwal.fire({
                    title: '!!! آخ',
                    icon: 'error',
                    confirmButtonText: 'اوکیه',
                    text: "یه چیزی درست کار نکرد، میشه از اول امتحان کنی؟",
                })
            }
        })
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


    sendOrderRequestAsync = (table, address, paymentStatus) => {
        return new Promise(function (resolve, reject) {
            requests.sendOrder(table, address, paymentStatus, resolve)
        });
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
                let newOrderList = this.props.orderList.map(eOFood => {
                    let newEOFood = JSON.parse(JSON.stringify(eOFood));
                    let foodNumber = newEOFood.number;
                    newSavedPaidItems.map(eSavedPaidFood => {
                        if (newEOFood.foods_id === eSavedPaidFood.id)
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
        return (
            <React.Fragment>
                <div className='mainContainer-payWay'>
                    <div className='payMain'>
                        <div className='backButton' onClick={this.backClicked}/>
                        <span className='payWayTextHolder'>نحوه پرداخت به په صورت باشد؟
                    </span>
                        <div className='switchContainer'>
                            <div className='switchWrapperPay'>
                                <SwitchSelector
                                    onChange={this.paySwitchOnChange}
                                    options={this.payOptions}
                                    initialSelectedIndex={this.payInit}
                                    backgroundColor={"rgba(53,59,72,0)"}
                                    fontColor={"#000"}
                                />
                            </div>
                            <div className='switchWrapperDong'>
                                <SwitchSelector
                                    onChange={this.dongSwitchOnChange}
                                    options={this.dongOptions}
                                    initialSelectedIndex={this.dongInit}
                                    backgroundColor={"rgba(53,59,72,0)"}
                                    fontColor={"#000"}
                                />
                            </div>
                        </div>
                        <div className='dongTable shadow'>
                            <div className='dongTableFirsRow'>
                                <div>تعداد کل</div>
                                <div>قیمت انتخابی</div>
                                <div>اسم غذا</div>
                                <div></div>
                            </div>
                            {this.state.orderList}

                        </div>
                        <span className="payWayTextHolder">
                        لطفا نحوه دریافت سفارش خود را انتخاب کنید
                    </span>
                        <div className='switchContainerInOut'>

                            <div className='switchWrapperInOut'>
                                <SwitchSelector
                                    onChange={this.inOutSwitchOnChange}
                                    options={this.inOutOptions}
                                    initialSelectedIndex={this.inOutInit}
                                    backgroundColor={"rgba(53,59,72,0)"}
                                    fontColor={"#000"}
                                />
                            </div>

                        </div>

                        <div className='tableNumberOrAddressContainer'>

                            <div className='inResFields'>
                                <span className='payWayTextHolder'>شماره میز</span>
                                <br/>
                                <input onChange={this.tableNumberChange} className='tableNumberInput shadow-sm'
                                       type="number" placeholder='000' defaultValue={this.props.table}/>
                            </div>
                        </div>

                        <div className='tableNumberOrAddressContainer'>
                            <div className='outResFields'>
                                <span className='payWayTextHolder'> آدرس</span>
                                <br/>
                                <input onChange={this.handleChangeAddress} className='addressInput shadow-sm' type="text" defaultValue={this.props.address}/>
                            </div>
                        </div>


                    </div>
                    <div className='submitButtonContainer'>
                        <div onClick={this.handleSubmitClicked} className='submitButton shadow'>
                            تایید
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        howToPay: store.reducerTempData.howToPay,
        address: store.reducerTempData.address,
        howToDeliver: store.reducerTempData.howToDeliver,
        table: store.reducerTempData.table,
        trackingId: store.reducerTempData.trackingId,
        orderListRestaurant: store.reducerUser.orderListRestaurant,
        orderList: store.reducerTempData.orderList
    }
}

const mapDispatchToProps = () => {
    return {
        setHowToPay: actions.setHowToPay,
        setHowToDeliver: actions.setHowToDeliver,
        setAddress: actions.setAddress,
        setTable: actions.setTable,
        setTrackingId: actions.setTrackingId,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(payWay);