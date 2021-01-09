// import in this order :
//      1- React, Redux (functional libraries)
//      2- bootstrap, animation (non functional libraries)
//      3- our functions
//      4- components

import React from "react";
import { Swipeable } from 'react-swipeable'
import { connect } from 'react-redux';
import 'animate.css/animate.css'
import * as requests from '../../ApiRequests/requests'
import * as actions from '../../reduxStore/actions'
import VerificationCodeInput from '../VerificationCodeInput/vCodeInput'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal)


class VerificationCode extends React.Component {
    state = {
        inputclass:"shadow"
    }

    checkCodeWasCorrect = (response) =>{
        if(response.statusCode === 200){
            if(response['missingUserInfo'] === true){
                this.props.setSendVCode(false);
                this.props.history.push('/signup')
            }else{
                requests.getUserInfo(()=>{
                    requests.getCustomerInfo(()=>{
                        this.props.setSendVCode(false);
                        this.props.history.push('/profile')
                    })
                });

            }
        }else {
            ReactSwal.fire({
                title: '!!! آخ',
                icon: 'error',
                text: "کد رو اشتباه زدی که",
                timerProgressBar:true,
                timer:2000,
                confirmButtonText:"آها راس میگی، حله"
            });
        }
    }

    sendCode = (code)=>{
        requests.checkVerificationCode(code,this.checkCodeWasCorrect)
    }

    handleSubmit = (elem) => {
        elem.preventDefault()
    }

     backToNumber = ()=>{
         this.props.setSendVCode(false)
         this.props.history.push('/login')
     }

    render() {
        if(this.props.pageSize === "small"){
            return (this.smallPage)
        }else {
            return (this.bigPage)
        }
    }


    bigPage =
        <div className="app" style={{height: "100%", textAlign: "center",transition:'0.2s ease'}}>

            <Swipeable onSwipedDown={()=>{this.props.frontStatesPageSize("small")}} preventDefaultTouchmoveEvent={true}>
            <div style={{height:"20px"}}/>
                <div className="contain " style={{width: "100%", position: "absolute", bottom: "0",height:'100%'}}>
                    <div className="" style={bigMainContainerStyle}>
                        {/*<Header/>*/}
                        <div className='headerOfLogin'>
                            <div className='userIcon'/>
                            <p style={{paddingTop: "5px", fontFamily: "IRANSansMobile_Light", userSelect: "none"}}>ورود/ثبت
                                نام</p>
                        </div>
                        <div className="loginVectorVCode">
                        </div>
                        <p style={{paddingTop: "5px", fontSize: "20px", fontFamily: "IRANSansMobile_Light", userSelect:"none"}}>کد را وارد کنید</p>
                        <p onClick={this.backToNumber} style={{color:'#1C2A75'}}> تغیر شماره</p>

                        <VerificationCodeInput sendCode={this.sendCode}/>

                    </div>
                </div>
            </Swipeable>
        </div>;


    smallPage =
        <div style={{height: "100%",textAlign:"center"}}>
            <Swipeable onSwipedUp={()=>{this.props.frontStatesPageSize("big")}} preventDefaultTouchmoveEvent={true}>
                <div className="contain " style={{width: "100%", position: "absolute", bottom: "0",}}>
                    <div className="logi" style={smallMainContainerStyle} >
                        {/*<Header/>*/}
                        <p style={{paddingTop: "5px", fontFamily: "IRANSansMobile_Light", userSelect:"none"}}>ورود/ثبت نام</p>
                        <p style={{paddingTop: "5px", fontSize: "20px", fontFamily: "IRANSansMobile_Light", userSelect:"none"}}>کد را وارد کنید</p>
                        <p onClick={this.backToNumber} style={{color:'#1C2A75'}}> تغیر شماره</p>
                        <VerificationCodeInput sendCode={this.sendCode}/>
                    </div>
                </div>
            </Swipeable>
        </div>
}

const mapStateToProps = (store) => {
    return {
        pageSize: store.reducerFrontStates.pageSize
    }
}

const mapDispatchToProps = () =>{
    return{
        frontStatesPageSize: actions.frontStatesPageSize,
        setHeaderOrder: actions.frontStatesHeaderOrder,
        setSendVCode:actions.setSentVCode

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(VerificationCode);

//------------------------------------------ Styles --------------------------------------
const smallMainContainerStyle = {
    background: "white",
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
    // background: "linear-gradient(to bottom, #f1d2d2, #e2ecec  90%)",
    // borderTopLeftRadius: "18px",
    // borderTopRightRadius: "18px",
    // marginLeft: "8px",
    // marginRight: "8px",
    // boxShadow: "0 .5rem 1rem rgba(0, 0, 0, .25)",
    // userSelect:"none",
    // bottom:'0',
    // zIndex:'999'

    // background: "linear-gradient(to bottom, #f1d2d2, #e2ecec  90%)",
    // borderTopLeftRadius: "18px",
    // borderTopRightRadius: "18px",
    // bottom: "0",
    // marginLeft: "8px",
    // marginRight: "8px",
    // boxShadow: "0 .5rem 1rem rgba(0, 0, 0, .25)",
    // userSelect:"none",

    background: 'white',
    // borderTopLeftRadius: '18px',
    // borderTopRightRadius: '18px',
    bottom: '0px',
    // marginLeft: '8px',
    // marginRight: '8px',
    width: '100%',
    height: 'calc(100%',
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0.5rem 1rem',
    userSelect: 'none',
    position: 'absolute',
    overflow:'scroll'
}

const topOfMainStyle = {
    width: "100%",
    boxShadow:"0 4px 2px -2px rgba(0, 0, 0, 0.15)",
    paddingBottom: "5px"
}

const avatarStyle = {
    width: "60px",
    height: "60px",
    marginTop: "-28px",
    userSelect: "none",
    background:"url(../img/avatar.png) center no-repeat ",
    backgroundSize:"100%"
}

const menuIconStyle = {
    width: "25px",
    height: "25px",
    userSelect: "none",
    background:"url(../img/menuIcon.png) center no-repeat ",
    backgroundSize:"100%",
    margin: "10px 10px 0 0"
}

const logoStyle = {
    width: "30px",
    height: "30px",
    userSelect: "none",
    background:"url(../img/logo.png) center no-repeat ",
    backgroundSize:"100%",
    margin: "10px 0 0 10px"
}

const vectorStyle = {
    width: "200px",
    height:"200px",
    userSelect: "none",
    background:"url(img/bvv.png) center no-repeat ",
    backgroundSize:"100%",
    marginTop: "20px",
    marginBottom: "50px"
}