import React from "react";
import {connect} from 'react-redux';
import {faEdit, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import $ from "jquery"
import DatePicker from 'react-modern-calendar-datepicker';
import * as actions from "../../reduxStore/actions";
import * as requests from "../../ApiRequests/requests"
import * as fixNumber from '../../usableFunctions/englishNumToPersianNum'
import {jalaliToGregorian} from "../../usableFunctions/jalaliToGregorian";
import {gregorianToTimestamp} from "../../usableFunctions/gregorianToTimestamp";
import './style/style.css'
import {removeCacheToken} from "../../reduxStore/cachedData/cachedData";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import * as randomColor from "../MainPage/js/randomColor";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



class Profile extends React.Component {
    userBirthDayJalaliArray = fixNumber.fixNumbers(new Date((this.props.birthday > 1000) ? (this.props.birthday * 1000) : 974379661000).toLocaleDateString('fa-IR')).split("/")
    userBirthDayJalaliObject = {
        year: parseInt(this.userBirthDayJalaliArray[0]),
        month: parseInt(this.userBirthDayJalaliArray[1]),
        day: parseInt(this.userBirthDayJalaliArray[2])
    }

    state = {
        icon1: faEdit,
        icon2: faEdit,
        icon3: faEdit,
        selectedDay: this.userBirthDayJalaliObject,
        moreOrderDetailRows: [],
        moreOrderDetailDate: ''
    }

    isTouching = false;
    listOfOrders = (this.props.orderListRestaurant.map(eachOrder => {
        let eachOrderFoodList = JSON.parse(eachOrder.order_list)
        let listOfOrderFoods;
        for (let i = 0; i < eachOrderFoodList.length; i++) {

            listOfOrderFoods += eachOrderFoodList[i].name
        }

        return (

            <div className='ordersProfile shadow-sm' style={{backgroundColor: randomColor.default(1)}}>
                <div className='orderFoodList'>{listOfOrderFoods}</div>
                <div className='orderProfileBottom'>
                    <span className='orange'>{eachOrder.total_price}</span>
                    <span className='orange'>8/09</span>
                </div>
            </div>
        )
    })) ? (this.props.orderListRestaurant.map(eachOrder => {
        let eachOrderFoodList = JSON.parse(eachOrder.order_list)
        let listOfOrderFoods = '';
        for (let i = 0; i < eachOrderFoodList.length; i++) {

            listOfOrderFoods += eachOrderFoodList[i].name + ' / '
        }
        return (
            <div className='ordersProfile shadow-sm' style={{backgroundColor: randomColor.default()}}>
                <div className='orderFoodList'>{listOfOrderFoods}</div>
                <div className='orderProfileBottom'>
                    <span className='green'>{eachOrder.total_price / 1000 + 'T'}</span>
                    <span className='green'>8/09</span>
                </div>
            </div>
        )
    })) : 'testString'

    handleEachOrderHold = (orderList) => {
        let ordersMapped = JSON.parse(orderList).map(eachoorder => {
            return (
                <div id='orderMoreDetailsFoodRows'>
                    <div id='orderMoreDetailsFirstRow1'>
                        <span>{eachoorder.name}</span>
                    </div>
                    <div id='orderMoreDetailsFirstRow2'>
                        <span>{eachoorder.number + 'X'}</span>
                    </div>
                    <div id='orderMoreDetailsFirstRow3'>
                        <span>{eachoorder.priceAfterDiscount}</span>
                    </div>
                    <div id='orderMoreDetailsFirstRow4'>
                        <span>{eachoorder.price}</span>
                    </div>
                </div>
            )
        })
        this.setState({moreOrderDetailRows: ordersMapped})
        setTimeout(() => {

            if (this.isTouching) {
                $('#orderMoreDetails').show()
                $('#orderMoreDetails').animate({opacity: '1'}, 300, "swing")
            }
        }, 1000)

    }

    handleEachOrderLeave = () => {
        this.isTouching = false;
        $('#orderMoreDetails').animate({opacity: '0'}, 300, "swing", () => {
            $('#orderMoreDetails').hide()
        })
    }

    clearCache = () => {
        removeCacheToken();
        this.props.userDeleteAllData()
        this.props.history.push('/main')
    }

    callbackFunction = (data) => {
        requests.getCustomerInfo()
    }
    editButtonClick = (button) => {
        let inputName = document.getElementsByClassName('inputName')
        let inputJob = document.getElementsByClassName('inputJob')
        let inputBirthday = document.getElementsByClassName('inputBirthday')

        if (button.target.value.toString() === 'edit') {
            inputName[0].disabled = false
            inputJob[0].disabled = false
            inputBirthday[0].disabled = false
            button.target.value = 'submit'
            button.target.innerText = 'تایید'
        } else {
            inputName[0].disabled = true
            inputJob[0].disabled = true
            inputBirthday[0].disabled = true
            button.target.value = 'edit'
            button.target.innerText = 'ویرایش'

            if (inputName.value) {
                requests.profileEditRequest("editName", $("#nameInput").val(), this.callbackFunction)
            }
            if (inputJob[0].value) {
                requests.profileEditRequest("editJob", $("#jobInput").val(), this.callbackFunction)
            }
            let birthday = this.state.selectedDay;
            let gregorianBirthday = jalaliToGregorian(birthday.year, birthday.month, birthday.day);
            let timestamp = gregorianToTimestamp(gregorianBirthday);
            requests.profileEditRequest("editBirthday", timestamp, this.callbackFunction)
        }
    }

    componentDidMount() {
        requests.getCustomerInfo()
        $('.DatePicker__input').prop("disabled", true)
        $('.DatePicker__input').css({
            opacity: "0",
            position: "absolute",
            left: "20%",
            marginTop: "-5px",
            width: "100%",
            overflow: "hidden"
        })
        let birthInput = document.getElementsByClassName('DatePicker');
        birthInput[0].style.display = "content";
        birthInput[0].style.width = "100%";

    }


    selectedDay = (element) => {
        this.setState({
            selectedDay: element
        })
        let inputBirthday = document.getElementsByClassName('inputBirthday')
        inputBirthday.value = fixNumber.unfixNumber(element.year.toString()) + '/' + fixNumber.unfixNumber(element.month.toString()) + '/' + fixNumber.unfixNumber(element.day.toString())
    }

    renderCustomInput = ({ref}) => (
        <input
            disabled
            id="birthdayInput"
            readOnly
            ref={ref}
            placeholder={this.userBirthDayJalaliArray.join("/")}
            className="form-control inputBirthday"
        />
    )

    render() {
        return (
            <div style={{direction: "rtl", position: "relative", background: 'white', zIndex: '2', height: '100%'}}>
                <BottomNavigation/>
                <div id='orderMoreDetails'>
                    <div id='orderMoreDetailsHeader'>
                        <span>{this.state.moreOrderDetailDate}</span>
                    </div>
                    <div id='orderMoreDetailsFirstRow'>
                        <div id='orderMoreDetailsFirstRow1'>
                            <span> اسم غذا</span>
                        </div>
                        <div id='orderMoreDetailsFirstRow2'>
                            <span> تعداد</span>
                        </div>
                        <div id='orderMoreDetailsFirstRow3'>
                            <span> قیمت پرداختی</span>
                        </div>
                        <div id='orderMoreDetailsFirstRow4'>
                            <span> قیمت غذا</span>
                        </div>
                    </div>
                    {/*Rows Of Foods*/}

                    {this.state.moreOrderDetailRows}
                </div>

                <div id='mainProfileToBlur'>
                    <div id='headerProfile' className="container">
                        <div id='profileHeader' dir="ltr">
                            <div>
                                <div className='backButton' onClick={() => {
                                    this.props.history.push('/main')
                                }}/>
                            </div>
                            <div onClick={this.clearCache} id='logOut'>
                                <span id='logOutText' className='pr-1' >  خروج</span>
                                <FontAwesomeIcon icon={faSignOutAlt} size='lg'/>

                            </div>
                        </div>
                    </div>
                    <div className="container containerFixer">
                        <br/>
                        <div className="row d-flex justify-content-center">
                            <div className="col-9">
                                <div className="">
                                    <input id="nameInput" placeholder="اسم و فامیل" disabled
                                           aria-describedby="basic-addon1" aria-label
                                           className="form-control inputName" style={{}} defaultValue={this.props.name}
                                           type="text"/>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-9">
                                <div className="">
                                    <input id="nameInput" placeholder="شغل" disabled aria-describedby="basic-addon1"
                                           aria-label
                                           className="form-control inputJob" style={{}} defaultValue={this.props.job}
                                           type="text"/>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-9">
                                <div className="input-group mb-3">
                                    <DatePicker
                                        value={this.state.selectedDay}
                                        onChange={this.selectedDay}
                                        inputPlaceholder="تاریخ تولد"
                                        shouldHighlightWeekends locale="fa"
                                        renderInput={this.renderCustomInput}
                                        calendarClassName="responsive-calendar"
                                    />

                                </div>
                            </div>
                        </div>
                        <div className='btnContainer'>
                            <button id="button" onClick={this.editButtonClick} type="submit" value='edit'
                                    className="btn" style={smallButtonStyle}>
                                ویرایش
                            </button>
                        </div>
                        <div className='totals'>
                            <div className='totalbuy font-weight-bold'>
                                <span>مجموع خرید</span>
                                <span>{this.props.totalBoughtRestaurant + 'T'}</span>
                            </div>

                            <div className='totalbuy'>
                                <span>امتیاز شما</span>
                                <span>{this.props.scoreRestaurant}</span>
                            </div>
                        </div>

                        {/*-----------------------------------------------------------------------------------------------------------------*/}
                        <div className='ProfileOrders'>
                            {this.listOfOrders}
                        </div>
                    </div>
                    <div className='profileHeader'/>
                   </div>
            </div>

        )
    }
}

const mapStateToProps = (store) => {
    return {
        name: store.reducerUser.name,
        job: store.reducerUser.job,
        birthday: parseInt(store.reducerUser.birthday),
        headerOrder: store.reducerFrontStates.headerOrder,
        scoreRestaurant: store.reducerUser.scoreRestaurant,
        totalBoughtRestaurant: store.reducerUser.totalBoughtRestaurant,
        orderListRestaurant: store.reducerUser.orderListRestaurant

    }
}

const mapDispatchToProps = () => {
    return {
        setHeaderOrder: actions.frontStatesHeaderOrder,
        userDeleteAllData: actions.userDeleteAllData
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const inputBirthdayStyle = {
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,

}
const smallButtonStyle = {
    backgroundColor: "#FAA21B",
    borderRadius: "25px",
    width: "90px",
    height: "30px",
    marginTop: "30px",
    fontFamily: "IRANSansMobile_Light",
    paddingTop: "5px",
    color: 'white',
    fontWeight: 'bold'
}