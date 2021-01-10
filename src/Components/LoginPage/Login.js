// import in this order :
//      1- React, Redux (functional libraries)
//      2- bootstrap, animation (non functional libraries)
//      3- our functions
//      4- components

import React from "react";
import {Swipeable} from 'react-swipeable'
import {connect} from 'react-redux';
import 'animate.css/animate.css'
import * as requests from '../../ApiRequests/requests'
import * as actions from '../../reduxStore/actions'
import $ from 'jquery'
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import './style/style.css'
import * as cache from "../../reduxStore/cachedData/cachedData";


class Login extends React.Component {
    state = {
        inputclass: "shadow-sm"
    }

    componentDidMount() {
        if (this.props.token.length > 20) {
            if (this.props.name.length > 2) {
                this.props.history.push('/profile')
            } else {
                this.props.history.push('/signup')
            }

        } else if (this.props.sentVCode) {
            this.props.history.push('/vcode')
        } else if(cache.getCacheToken() !== undefined && cache.getCacheToken().length > 20){
            actions.userSetToken(cache.getCacheToken());
            requests.getUserInfo(()=>{
                this.props.history.push('/profile')
            });
        }
    }

    checkPhone = (data) => {
        if (data.statusCode === 200) {
            this.props.setSendVCode(true)
            this.props.history.push('/vcode')
        } else {
            return false
        }
    }
    handleSubmit = (elem) => {
        let getElement = elem
        elem.preventDefault()
        let phone = elem.target.numin.value;
        if (phone.length === 11) {
            if (phone[0] === "0" && phone[1] === "9") {
                requests.sendVerificationCode(elem.target.numin.value, this.checkPhone)
            } else {
                $("#numin").attr('class', 'shadow animate__animated animate__shakeX ');
                setTimeout(() => {
                    $("#numin").attr('class', 'shadow ');
                }, 1000)
            }


        } else {
            $("#numin").attr('class', 'shadow animate__animated animate__shakeX ');
            setTimeout(() => {
                $("#numin").attr('class', 'shadow ');
            }, 1000)
        }
    }


    handleInputChange = (element) => {

        if (element.target.value.length > 11) {
            element.target.value = element.target.value.slice(0, 11)
        }

    }

    // bigPage =
    //     <div className="app" style={{height: "100%", textAlign: "center"}}>
    //         <Swipeable onSwipedDown={() => {
    //             this.props.frontStatesPageSize("small")
    //         }} preventDefaultTouchmoveEvent={true}>
    //             <div className="contain " style={{width: "100%", position: "absolute", bottom: "0", height: "100%"}}>
    //                 <div className="inside" style={bigMainContainerStyle}>
    //                     {/*<Header />*/}
    //                     <div className='headerOfLogin'>
    //                         <div className='userIcon'></div>
    //                         <p style={{
    //                             paddingTop: "5px",
    //                             fontFamily: "IRANSansMobile_Light",
    //                             userSelect: "none"
    //                         }}>ورود/ثبت
    //                             نام</p>
    //                     </div>
    //                     <div className='loginVector'></div>
    //
    //                     <p style={{
    //                         paddingTop: "20px",
    //                         fontSize: "15px",
    //                         fontFamily: "IRANSansMobile_Light",
    //                         userSelect: "none"
    //                     }}>
    //                         لطفا شماره ی خود را وارد کنید
    //
    //                     </p>
    //                     <form onSubmit={this.handleSubmit}>
    //                         <input className={this.state.inputclass} id="numin" type="number" style={inputStyle}
    //                                onChange={this.handleInputChange}
    //                                placeholder="09---------"/>
    //                         <br/>
    //                         <button id="button" type="submit" className="btn" style={bigButtonStyle}> ارسال کد</button>
    //                     </form>
    //
    //                 </div>
    //             </div>
    //         </Swipeable>
    //         <BottomNavigation/>
    //     </div>
    // smallPage =
    //     <div className="app" style={{height: "100%", textAlign: "center"}}>
    //         <Swipeable onSwipedUp={() => {
    //             this.props.frontStatesPageSize("big")
    //         }} preventDefaultTouchmoveEvent={true}>
    //             <div className="contain " style={{width: "100%", position: "absolute", bottom: "0",}}>
    //                 <div className="aa" style={smallMainContainerStyle}>
    //                     {/*<Header />*/}
    //
    //                     {/*<div className="d-flex justify-content-between" style={topOfMainStyle}>*/}
    //                     {/*    <div style={logoStyle} />*/}
    //                     {/*    <div style={avatarStyle} />*/}
    //                     {/*    <div style={menuIconStyle} />*/}
    //                     {/*</div>*/}
    //                     <div className='headerOfLogin'>
    //                         <div className='userIcon'></div>
    //                         <p style={{
    //                             paddingTop: "5px",
    //                             fontFamily: "IRANSansMobile_Light",
    //                             userSelect: "none"
    //                         }}>ورود/ثبت
    //                             نام</p>
    //                     </div>
    //
    //                     <p style={{
    //                         paddingTop: "5px",
    //                         fontSize: "15px",
    //                         fontFamily: "IRANSansMobile_Light",
    //                         userSelect: "none"
    //                     }}>
    //                         لطفا شماره ی خود را وارد کنید
    //                     </p>
    //                     <form onSubmit={this.handleSubmit}>
    //                         <input className={this.state.inputclass} id="numin" type="number" style={inputStyle}
    //                                onChange={this.handleInputChange}
    //                                placeholder="09---------"/>
    //                         <br/>
    //                         <button id="button" type="submit" className="btn" style={smallButtonStyle}> ارسال کد
    //                         </button>
    //                     </form>
    //                 </div>
    //             </div>
    //         </Swipeable>
    //         <BottomNavigation/>
    //     </div>

    render() {
        return(
            <div className="app" style={{height: "100%", textAlign: "center"}}>
                <Swipeable onSwipedDown={() => {
                    this.props.frontStatesPageSize("small")
                }} preventDefaultTouchmoveEvent={true}>
                    <div className="contain " style={{width: "100%", position: "absolute", bottom: "0", height: "100%"}}>
                        <div className="inside" style={bigMainContainerStyle}>
                            <div className='headerOfLogin'>
                                <div className='userIcon'></div>
                                <p style={{
                                    paddingTop: "5px",
                                    fontFamily: "IRANSansMobile_Light",
                                    userSelect: "none"
                                }}>ورود/ثبت
                                    نام</p>
                            </div>
                            <div className='loginVector'></div>

                            <p style={{
                                paddingTop: "20px",
                                fontSize: "15px",
                                fontFamily: "IRANSansMobile_Light",
                                userSelect: "none"
                            }}>
                                لطفا شماره ی خود را وارد کنید

                            </p>
                            <form onSubmit={this.handleSubmit}>
                                <input className={this.state.inputclass} id="numin" type="number" style={inputStyle}
                                       onChange={this.handleInputChange}
                                       placeholder="09---------"/>
                                <br/>
                                <button id="button" type="submit" className="btn" style={bigButtonStyle}> ارسال کد</button>
                            </form>

                        </div>
                    </div>
                </Swipeable>
                <BottomNavigation/>
            </div>
        )

        // if (this.props.pageSize === 'small') {
        //     return (this.smallPage)
        // } else {
        //     return (this.bigPage)
        // }
    }

}

const mapStateToProps = (store) => {
    return {
        pageSize: store.reducerFrontStates.pageSize,
        token: store.reducerUser.token,
        sentVCode: store.reducerFrontStates.sentVCode,
        name: store.reducerUser.name,

    }
}

const mapDispatchToProps = () => {
    return {
        frontStatesPageSize: actions.frontStatesPageSize,
        setSendVCode: actions.setSentVCode
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

//------------------------------------------ Styles --------------------------------------
const smallMainContainerStyle = {
    background: "rgb(255,251,251)",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    bottom: "0",
    marginLeft: "8px",
    marginRight: "8px",
    height: "320px",
    boxShadow: "0 .5rem 1rem rgba(0, 0, 0, .25)",
    userSelect: "none"
}

const bigMainContainerStyle = {
    // background: "linear-gradient( to bottom, #ffffff, rgb(228, 231, 231) 50%, #ffffff)",
    // // borderTopLeftRadius: "18px",
    // // borderTopRightRadius: "18px",
    // bottom: "0",
    // marginLeft: "8px",
    // marginRight: "8px",
    // width: "96%",
    // height: 'calc(100% - 30px)',
    // boxShadow: "0 .5rem 1rem rgba(0, 0, 0, .25)",
    // userSelect: "none",
    // position: "absolute",
    // overflow:"scroll"


    background: "white",
    // borderTopLeftRadius: "18px",
    // borderTopRightRadius: "18px",
    bottom: "0",
    // marginLeft: "8px",
    // marginRight: "8px",
    // width: "100%",
    height: 'calc(100%)',
    // boxShadow: "0 .5rem 1rem rgba(0, 0, 0, .25)",
    userSelect: "none",
    position: "absolute",
    overflow: "scroll",
    width: '100%'

}

const inputStyle = {
    paddingTop: '5px',
    borderRadius: "50px",
    border: "none",
    height: "50px",
    width: "80%",
    textAlign: "center",
    fontSize: "20px",
    outline: "none",
    background: '#FFF2DD',
}

const smallButtonStyle = {
    backgroundColor: "#FAA21B",
    borderRadius: "25px",
    width: "90px",
    height: "34px",
    marginTop: "30px",
    fontFamily: "IRANSansMobile_Light",
    paddingTop: "6px",
    color: 'white',
    fontWeight: 'bold'
}

const bigButtonStyle = {
    backgroundColor: "#FAA21B",
    borderRadius: "25px",
    width: "90px",
    height: "34px",
    marginTop: "30px",
    fontFamily: "IRANSansMobile_Light",
    paddingTop: "6px",
    color: 'white',
    fontWeight: 'bold'
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

const vectorStyle = {
    width: "200px",
    height: "200px",
    userSelect: "none",
    background: "url(img/lbv.png) center no-repeat ",
    backgroundSize: "100%",
    marginTop: "20px"
}