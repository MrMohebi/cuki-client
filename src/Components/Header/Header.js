import React from "react";
import {withRouter} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAlignCenter,
    faAlignRight,
    faCheck,
    faChevronCircleLeft,
    faEdit,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import $ from 'jquery'
import * as actions from "../../reduxStore/actions";
import {connect} from "react-redux";


class Header extends React.Component {


    handleProfile = () => {
        this.props.setHeaderOrder(["menu",'profile','logo'])
        $('#profile').css({right: '50%', transform: 'translateX(50%)', width: '40px', height: '40px'})
        $('#menu').css({right: '88%', transform: 'translateX(0%)', width: '25px', height: '25px'})
        $('#logo').css({right: '5%', transform: 'translateX(0%)', width: '25px', height: '25px',})
        if (this.props.history.location.pathname === '/main'||this.props.history.location.pathname === '/bill'){
            // setTimeout(()=>{
            //     this.props.history.push("/login")
            // },1000)
        }



    }

    handleLogo = () => {

            this.props.setHeaderOrder(["profile",'logo','menu'])
            $('#logo').css({right: '50%', transform: 'translateX(50%)', width: '40px', height: '40px',})
            $('#profile').css({right: '88%', transform: 'translateX(0%)', width: '25px', height: '25px'})
            $('#menu').css({right: '5%', transform: 'translateX(0%)', width: '25px', height: '25px'})
            // setTimeout(()=>{
            //     this.props.history.push("/main")
            // },1000)

    }


    handleMenu = () => {
        setTimeout(()=>{
            this.props.setHeaderOrder(["profile",'menu','logo'])
            $('#menu').css({right: '50%', transform: 'translateX(50%)', width: '40px', height: '40px',backgroundPosition:'center'})
            $('#profile').css({right: '88%', transform: 'translateX(0%)', width: '25px', height: '25px',backgroundPosition:'center'})
            $('#logo').css({right: '5%', transform: 'translateX(0%)', width: '25px', height: '25px',backgroundPosition:'center',marginBottom:'-10px'})
            // setTimeout(()=>{
            //     this.props.history.push("/reservetable")
            // },1000)
        })

    }

    componentDidMount() {

        switch (this.props.headerOrder[1]) {
                    case "logo":
                        this.handleLogo()
                        break;
                    case "menu":
                        this.handleMenu()
                        break;
                    case "profile":
                        this.handleProfile()
                        break;
                }
    }


    render() {
        return (

            <div id='header' style={{
                backgroundColor: "rgb(236 216 216)",
                height: '50px',
                width: '100%',
                display: 'flex',
                flexFlow: 'row reverse',
                justifyContent: 'space-between',
                borderRadius:'15px 15px 0 0',
                borderBottom:'solid 1px #bfbfbf',
                padding:'0 10px',
                transition: '0.2s '

            }}>
                <div id='profile' style={{
                    textAlign: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    right: '90%',
                    transform: 'translateX(0%)',
                    transition: '1s ease'
                }} onClick={this.handleProfile}/>
                <div id='logo' style={{
                    textAlign: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    background: 'url(/img/logo.png) 0% 0% / 100% no-repeat',
                    width: '50px',
                    height: '50px',
                    position: 'absolute',
                    right: '50%',
                    transform: 'translateX(50%)',
                    transition: '1s ease'
                }} onClick={this.handleLogo}/>
                <div id='menu' style={{
                    textAlign: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    background: 'url(/img/Header/menu.png) 0% 0% / 100% no-repeat',
                    width: '20px',

                    height: '20px',
                    position: 'absolute',
                    right: '1%',
                    transform: 'translateX(0%)',
                    transition: '0.5s ease'
                }} onClick={this.handleMenu}/>
            </div>

        )
    }

}


const mapStateToProps = (store) => {
    return {
        headerOrder: store.reducerFrontStates.headerOrder,
        sentVCode:store.reducerFrontStates.sentVCode

    }
}

const mapDispatchToProps = () => {
    return {
        setHeaderOrder: actions.frontStatesHeaderOrder
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));


