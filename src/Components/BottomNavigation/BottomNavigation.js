import React from "react";
import './style/style.css'
import * as actions from "../../reduxStore/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Badge from '@material-ui/core/Badge';


class BottomNavigation extends React.Component {

    state = {
        four:false,
        badgeNumber:0
    }

    timeToMove = 700;

    moveTheMovable = (iHaveTobe) => {
        if (iHaveTobe === 'left3') {
            document.getElementsByClassName('movable')[0].style.left = '5%'
        } else if (iHaveTobe === 'left4') {
            document.getElementsByClassName('movable')[0].style.left = '1%'
        } else if (iHaveTobe === 'center') {
            document.getElementsByClassName('movable')[0].style.left = '38%'
        } else if (iHaveTobe === 'centerLeft') {
            document.getElementsByClassName('movable')[0].style.left = '25%'
        } else if (iHaveTobe === 'centerRight') {
            document.getElementsByClassName('movable')[0].style.left = '50%'
        } else if (iHaveTobe === 'right3') {
            document.getElementsByClassName('movable')[0].style.left = '70%'
        } else if (iHaveTobe === 'right4') {
            document.getElementsByClassName('movable')[0].style.left = '74%'
        }
    }

    componentDidMount() {
        let isThereOpenOrders = false
        if (Object.entries(this.props.openOrdersInfo).length){
           this.setState({
               four:true
           })
            isThereOpenOrders= true
        }else{
            document.getElementsByClassName('openOrders')[0].style.display = 'none'
        }
        if (window.location.pathname.toString() === "/main") {
            if (isThereOpenOrders){
                this.moveTheMovable('centerLeft')
            }else{
                this.moveTheMovable('center')
            }
            this.makeSelectedInvert('homeBN')
        } else if (window.location.pathname.toString() === "/bill") {
            if (isThereOpenOrders){
                this.moveTheMovable('left4')
            }else{
                this.moveTheMovable('left3')
            }
            this.makeSelectedInvert('billBN')

        } else if (window.location.pathname.toString() === "/profile" || window.location.pathname.toString() === "/login" || window.location.pathname.toString() === "/signup" || window.location.pathname.toString() === "/vcode") {
            if (isThereOpenOrders){
                this.moveTheMovable('centerRight')
            }else{
                this.moveTheMovable('right3')
            }
            this.makeSelectedInvert('profileBN')
        }else if(window.location.pathname.toString() === "/openorders"){
            if (isThereOpenOrders){
                this.moveTheMovable('right4')
            }else{
                this.moveTheMovable('right3')
            }
        }
        setInterval(()=>{
            this.setState({
                badgeNumber:this.props.orderList.length
            })
        },1000)
    }

    makeSelectedInvert = (element)=>{
        let lengthOfDivs = document.querySelectorAll('.bottomNavigationMain > div').length;
        for (let i = 0;i<lengthOfDivs;i++){
            if (document.querySelectorAll('.bottomNavigationMain > div')[i].className !== 'movable')
            document.querySelectorAll('.bottomNavigationMain > div')[i].style.filter = 'invert(0)'
        }

        document.getElementsByClassName(element)[0].style.filter = 'invert(1)'
    }

    billClicked = (button) => {
        (this.state.four) ? this.moveTheMovable('left4'):this.moveTheMovable('left3')
        setTimeout(()=>{
            this.props.history.push('/bill')
        },this.timeToMove)

        this.makeSelectedInvert('billBN')

    }
    profileClicked = (button) => {
        (this.state.four)? this.moveTheMovable('centerRight'):this.moveTheMovable('right3')

        setTimeout(() => {
            this.props.history.push('/login')
        }, this.timeToMove)
        this.makeSelectedInvert(button.target.className)
    }
    homeClicked = (button) => {
        (this.state.four)? this.moveTheMovable('centerLeft'):this.moveTheMovable('center')

        setTimeout(() => {
            this.props.history.push('/main')
        }, this.timeToMove)
        this.makeSelectedInvert(button.target.className)
    }
    openOrdersClicked = (button) => {
        (this.state.four)? this.moveTheMovable('right4'):this.moveTheMovable('right3')

        setTimeout(() => {
            this.props.history.push('/openorders')
        }, this.timeToMove)
        this.makeSelectedInvert(button.target.className)
    }

    render() {
            return(
                <React.Fragment>
                    <div className="bottomNavigationMainContainer">
                        <div className='bottomNavigationMain'>

                            <div className='billBN bottomNavButtons' onClick={this.billClicked}>
                                <div className='pr-4'>
                                    <Badge className='badgeContainer' badgeContent={this.state.badgeNumber} color="primary">
                                    </Badge>
                                </div>
                            </div>
                            <div className='homeBN bottomNavButtons' onClick={this.homeClicked}/>
                            <div className='profileBN bottomNavButtons' onClick={this.profileClicked}/>
                            <div className='openOrders bottomNavButtons' onClick={this.openOrdersClicked}/>
                            <div className='movable'>
                                <div/>
                            </div>

                        </div>
                    </div>
                </React.Fragment>
            )


    }

}


const mapStateToProps = (store) => {
    return {
        headerOrder: store.reducerFrontStates.headerOrder,
        sentVCode: store.reducerFrontStates.sentVCode,
        openOrdersInfo:store.reducerTempData.openOrdersInfo,
        orderList: store.reducerTempData.orderList,
    }
}

const mapDispatchToProps = () => {

    return {
        setHeaderOrder: actions.frontStatesHeaderOrder
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BottomNavigation));

