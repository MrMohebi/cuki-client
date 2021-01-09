import React from "react";
// import '../../reduxStore0.011004/bootstrap.min.css'
import 'animate.css/animate.css'
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import {jalaliToGregorian} from "../../usableFunctions/jalaliToGregorian";
import {gregorianToTimestamp} from "../../usableFunctions/gregorianToTimestamp";
import * as request from '../../ApiRequests/requests'
import * as fixNums from '../../usableFunctions/englishNumToPersianNum'
import * as fixNumber from '../../usableFunctions/englishNumToPersianNum'
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import './style/style.css'


class SignUp extends React.Component {

    userBirthDayJalaliArray = fixNumber.fixNumbers(new Date((this.props.birthday > 1000) ? (this.props.birthday * 1000) : 974379661000).toLocaleDateString('fa-IR')).split("/")
    userBirthDayJalaliObject = {
        year: parseInt(this.userBirthDayJalaliArray[0]),
        month: parseInt(this.userBirthDayJalaliArray[1]),
        day: parseInt(this.userBirthDayJalaliArray[2])
    }

    state = {
        selectedDay: {
            year: 1378,
            month: 1,
            day: 1
        },
        setSelectedDay: null
    }

    componentDidMount() {
        let datePikcerInput = document.getElementsByClassName('DatePicker');
        datePikcerInput[0].style.display = "content";
        datePikcerInput[0].style.width = "100%";
    }

    checkSignUp = (data) => {
        if (data.statusCode === 200) {
            request.getUserInfo()
            this.props.history.push('/main')
        } else {
            console.log('someThing went wrong')
        }
    }
    handleSubmit = (element) => {
        element.preventDefault()
        let name = document.getElementsByClassName('inputName')[0].value;
        let job = document.getElementsByClassName('inputJob')[0].value;
        let birthday = this.state.selectedDay;
        let gregorianBirthday = jalaliToGregorian(birthday.year, birthday.month, birthday.day);
        let timestamp = gregorianToTimestamp(gregorianBirthday);
        request.signUpRequest(name, timestamp, job, this.checkSignUp)

    }

    selectedDay = (element) => {
        this.state.selectedDay = element
        document.getElementsByClassName('customDatepickerInput').value = fixNums.unfixNumber(this.state.selectedDay.year.toString()) + '/' + fixNums.unfixNumber(this.state.selectedDay.month.toString()) + '/' + fixNums.unfixNumber(this.state.selectedDay.day.toString())
    }


    renderCustomInput = ({ref}) => (
        <input
            id="birthdayInput"
            readOnly
            ref={ref}
            placeholder={this.userBirthDayJalaliArray.join("/")}
            className="form-control inputBirthday"
        />
    )


    render() {
        return (
            <div style={{
                direction: "rtl",
                background: 'white',
                zIndex: '2',
                height: '100%'
            }}>
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

                <div className='signupContainer'>
                    <div id='headerProfile' className="container">
                        <div id='profileHeader' dir="ltr">
                            <div>
                                <div className='backButton' onClick={() => {
                                    this.props.history.push('/main')
                                }}/>
                            </div>
                            <div>
                                <div
                                    className='centerOfHeader d-flex flex-column justify-content-center align-items-center'>
                                    <div className='userIcon'></div>
                                    <span className="ProfileHeaderText pt-1">ثبت مشخصات</span></div>
                            </div>
                            <div id='logOut'>
                                <span id='logOutText'></span>
                            </div>
                        </div>
                    </div>
                    <div className=" ">
                        <br/>
                        <div className="row d-flex justify-content-center">
                            <div className="col-9">
                                <div className="">
                                    <input id="nameInput" placeholder="اسم و فامیل" aria-describedby="basic-addon1"
                                           aria-label
                                           className="form-control inputName" style={{}} defaultValue={this.props.name}
                                           type="text"/>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                            <div className="col-9">
                                <div className="">
                                    <input id="nameInput" placeholder="شغل" aria-describedby="basic-addon1" aria-label
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
                            <button id="button" onClick={this.handleSubmit} type="submit" value='edit' className="btn"
                                    style={smallButtonStyle}>
                                تایید
                            </button>
                        </div>

                    </div>


                    <div className='profileHeader'></div>

                    <div className='svec'></div>
                </div>

            </div>

        )
    }

}

export default SignUp;

//------------------------------------------ Styles --------------------------------------

const MainContainerStyle = {
    background: "white",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    bottom: "0",
    marginLeft: "8px",
    marginRight: "8px",
    boxShadow: "0 .5rem 1rem rgba(0, 0, 0, .25)",
    userSelect: "none",
}
const inputNameStyle = {
    borderRadius: "10px",
    border: "none",
    height: "50px",
    width: "290px",
    textAlign: "right",
    fontSize: "15px",
    outline: "none",
    background: "url(/img/name.png) no-repeat  7px 7px",
    backgroundSize: "40px",
    backgroundPosition: "98% 40%",
    backgroundColor: "white",
    paddingRight: "70px",
    marginTop: "20px"
}
const inputjobStyle = {
    borderRadius: "10px",
    border: "none",
    height: "50px",
    width: "290px",
    textAlign: "right",
    fontSize: "15px",
    outline: "none",
    background: "url(/img/bag.png) no-repeat  7px 7px",
    backgroundSize: "40px",
    backgroundPosition: "98%",
    backgroundColor: "white",
    paddingRight: "70px",
    marginTop: "20px",
    transition: "all 0.5s"
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
const inputBirthdayStyle = {
    borderRadius: "10px",
    border: "none",
    height: "50px",
    width: "290px",
    textAlign: "right",
    fontSize: "15px",
    outline: "none",
    background: "url(/img/birth.png) no-repeat  7px 7px",
    backgroundSize: "40px",
    backgroundPosition: "98%",
    backgroundColor: "white",
    paddingRight: "70px",
    marginTop: "20px",
    transition: "all 0.5s",
    boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)'
}
const buttonStyle = {
    backgroundColor: "#FAA21B",
    borderRadius: "15px",
    width: "150px",
    height: "50px",
    marginTop: "50px",
    fontFamily: "IRANSansMobile_Light",
    paddingTop: "10px",
    marginBottom: "60px"
}
const topOfMainStyle = {
    width: "100%",
    boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.15)",
    paddingBottom: "5px"
}
const avatarStyle = {
    width: "60px",
    height: "60px",
    marginTop: "-28px",
    userSelect: "none",
    background: "url(img/avatar.png) center no-repeat ",
    backgroundSize: "100%"
}
const menuIconStyle = {
    width: "25px",
    height: "25px",
    userSelect: "none",
    background: "url(img/menuIcon.png) center no-repeat ",
    backgroundSize: "100%",
    margin: "10px 10px 0 0"
}
const logoStyle = {
    width: "30px",
    height: "30px",
    userSelect: "none",
    background: "url(img/logo.png) center no-repeat ",
    backgroundSize: "100%",
    margin: "10px 0 0 10px"
}

