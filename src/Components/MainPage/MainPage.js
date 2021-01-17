import React from "react";
import {connect} from "react-redux";
import $ from 'jquery';
import rowDataToObject from "./js/rowDataToObject";
import moreOrderedFoods from './js/moreOrderedFoods'
import * as actions from "../../reduxStore/actions";
import './style/style.css'
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import {Swipeable} from "react-swipeable";
import MoreDetails from "../MoreFoodDetails/MoreDetails";
import * as randomColor from "./js/randomColor";


class MainPage extends React.Component {
    state = {
        groups: [],
        cats: [],
        foods: [],
        foodList: [],
        lastCat: null,
        moreDetailsFood: [],
        textCats: [],
        scrollCats: [],
        isTouching: false,
        canIScroll: true,
        mainNavLinks: <div/>,
        smallPageTrigger:false

    }
    restaurantCategories = []
    restaurantFoodsList = []
    coffeeshopCategories = []
    coffeeshopFoodsList = []
    cats = []


    foodMoreDetail = (foodInfo) => {
        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };


        this.show = true
        this.setState({moreDetailsFood: foodInfo})

        setTimeout(() => {
                if (this.show) {
                    $('#moreContainer').show()
                    $('#header,#main').css({filter: 'blur(3px)'})
                }
            }, 600
        )
    }

    handleTouchEnd = () => {
        this.show = false
        $('#moreContainer').hide()
        $('#header,#main').css({filter: 'blur(0px)'})

    }

    orderScripts = (foods_id, foodsList = this.props.foods) => {
        if (this.props.trackingId < 1000) {
            for (let i = 0; i < foodsList.length; i++) {
                if (foodsList[i].foods_id === foods_id) {
                    // check if food was already in order list, increase its number
                    if (this.props.orderList.filter(food => food.foods_id === foods_id).length) {
                        this.props.increaseFoodNumber(foods_id);
                        return "increased number"
                    } else {
                        //  else add it to order list
                        let food = {...foodsList[i]};
                        food["number"] = 1;
                        food.price = parseInt(food.price)
                        food["totalPrice"] = food.price
                        this.props.addFoodToOrders(food)
                        $('#notificationNumber').html(this.props.orderList.length + 1)
                        $('#notificationNumber').css({visibility: 'visible'})
                        return "food was added"
                    }
                }
            }
        }
    }


    foodSectionScrollHandler = () => {
        console.log(document.getElementById('foodSection').scrollTop)
        if (document.getElementById('foodSection').scrollTop === 0){
            this.setState({
                smallPageTrigger:true
            })
        }else {
            this.setState({
                smallPageTrigger:false
            })
        }


        Object.values(this.state.mainNavLinks).map(a => {
            if (document.getElementById(a.hash.replace("#", "")) && document.getElementById(a.hash.replace("#", "")).getBoundingClientRect().top < 280 && document.getElementById(a.hash.replace("#", "")).getBoundingClientRect().top > -10) {
                $('.inCat').css({backgroundColor: 'transparent'})
                $('.inCat').addClass()
                $('.inCat').css({filter: 'invert(0)'})
                document.getElementById('cat' + a.hash.replace("#Food", "")).getElementsByClassName('inCat')[0].style.backgroundColor = "#be9473"
                document.getElementById('cat' + a.hash.replace("#Food", "")).getElementsByClassName('inCat')[0].style.filter = "invert(1)"

            }
        })
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.pageSize == "big"){
            let categories = document.querySelectorAll("nav a");
            this.state.mainNavLinks = categories;
        }
    }

    componentDidMount() {
        window.oncontextmenu = function (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        };




        if (this.props.orderList.length === 0) {
            $('#notificationNumber').css({visibility: 'hidden'})
        } else {
            $('#notificationNumber').html(this.props.orderList.length)
            $('#notificationNumber').css({visibility: 'visible'})
        }


        if (this.props.foods.length === 0) {
            this.props.history.push("/")
        } else {

        }
        let foods_arr = this.props.foods ? [...this.props.foods].reverse() : [];
        let foodsObject = rowDataToObject(foods_arr)


        let restaurantCategories = this.restaurantCategories = this.foodObjectToCategoryJsx(foodsObject, 'restaurant')

        let restaurantFoodsList = this.restaurantFoodsList = this.foodObjectToFoodsListJsx(foodsObject, 'restaurant')

        let coffeeshopCategories = this.coffeeshopCategories = this.foodObjectToCategoryJsx(foodsObject, 'coffeeshop')

        let coffeeshopFoodsList = this.coffeeshopFoodsList = this.foodObjectToFoodsListJsx(foodsObject, 'coffeeshop')


        this.setState({foodList: restaurantFoodsList})
        this.setState({cats: restaurantCategories})

    }


    outOfStockAction = (id) => {
        document.getElementById('food'+id).classList.add('animate__shakeX')
        setTimeout(()=>{
            document.getElementById('food'+id).classList.remove('animate__shakeX')

        },1000)

    }

    scaleAnimation = (element) => {

        // $(`#${element}`).animate({opacity: '.5'}, 200, () => {
        //     $('#' + element).animate({opacity: '1'}, 200)
        // })
        document.getElementById(element).classList.add('animate__bounceOutDown')
        
        setTimeout(()=>{
            document.getElementById(element).classList.remove('animate__bounceOutDown')
            document.getElementById(element).classList.add('animate__fadeInLeft')
            setTimeout(()=>{
                if (document.getElementById(element))
                document.getElementById(element).classList.remove('animate__fadeInLeft')

            },1000)

        },1000)

    }

    //-------------------
    handleCategoryClick = (element) => {
        this.props.frontStatesPageSize("big")
        $("#category > a >div").prop('id', 'cat')
        $('.inCat').css({backgroundColor: 'transparent'})
        $('.inCat').css({filter: 'invert(0)'})
    }
    handleCoffeeShopClick = () => {
        this.setState({foodList: this.coffeeshopFoodsList})
        this.setState({cats: this.coffeeshopCategories})
        this.props.frontStatesPageSize("big")
    }
    handleRestaurantClick = () => {
        this.setState({foodList: this.restaurantFoodsList})
        this.setState({cats: this.restaurantCategories})
        this.props.frontStatesPageSize("big")
    }


    render() {


        if (this.props.pageSize === 'small') {
            return this.smallPage()
        } else {
            return this.bigPage()
        }
    }

    foodObjectToFoodsListJsx = (foodsObject, foodType) => {
        return Object.keys(foodsObject[foodType]).map(foodEnglishName => {
            let fistFoodOfCategory_Flag = true
            let headerCategory = <p id={'Food' + foodEnglishName.toLowerCase()} style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '15px',
                fontFamily: "sans-serif",
                borderBottom: 'solid 1px',
                marginTop: '10px'
            }}>{foodsObject[foodType][foodEnglishName].persianName}</p>
            return foodsObject[foodType][foodEnglishName].foodList.map(eachFood => {
                let initNumber;
                 initNumber = this.props.orderList.filter(food=>{
                    return food.foods_id == eachFood.foods_id;
                })[0]?this.props.orderList.filter(food=>{
                     return food.foods_id == eachFood.foods_id;
                 })[0].number.toString():""

                let useHeaderCategory = null;
                if (fistFoodOfCategory_Flag) {
                    useHeaderCategory = headerCategory;
                    fistFoodOfCategory_Flag = false
                }

                return (
                    !(eachFood.status === 'out of stock' || eachFood.status === 'in stock') ? null :
                        <div  key={eachFood.foods_id} style={{width: '100%'}}>
                            {useHeaderCategory}
                            <div  key={eachFood.foods_id} onTouchStart={() => {
                                this.foodMoreDetail(eachFood)
                            }} onTouchEnd={() => {
                                this.handleTouchEnd()
                            }

                            } onDragExit={this.handleTouchEnd} id={'food' + eachFood.foods_id}
                                 className={"eachFoodMainContainerStyle animate__animated "}
                                 onClick={(thisElement) => {
                                     if (this.props.orderList.filter(food=>{
                                         return food.foods_id === eachFood.foods_id
                                     }).length > 0){
                                         let numberOfFood = this.props.orderList.filter(food=>{
                                             return food.foods_id === eachFood.foods_id
                                         })[0].number;
                                         document.getElementById("nameFood"+eachFood.foods_id).innerText = numberOfFood + 1 + " x " + eachFood.name
                                     }else if (eachFood.status === 'in stock'){
                                         let numberOfFood = 0;
                                         document.getElementById("nameFood"+eachFood.foods_id).innerText = numberOfFood + 1 + " x " + eachFood.name
                                     }
                                     if (eachFood.status === 'in stock') {
                                         this.orderScripts(eachFood.foods_id);
                                         this.scaleAnimation('food' + eachFood.foods_id)
                                     } else {
                                         this.outOfStockAction(eachFood.foods_id)
                                     }
                                 }}>
                                <div className="eachFoodContainer"
                                     style={{backgroundColor: randomColor.default(eachFood.foods_id[eachFood.foods_id.length - 1])}}>
                                    <h5 id={"nameFood"+eachFood.foods_id} className='foodNameMain'
                                        style={{fontSize: '15px', paddingTop: '5px'}}>
                                        {(initNumber? initNumber+ " x ":"")  + eachFood.name}
                                    </h5>
                                    <div className='eachFoodDetails'>
                                        {JSON.parse(eachFood.details).length ? JSON.parse(eachFood.details).join(" / ") : null}
                                    </div>
                                    <br/>
                                    <p id={'foodPrice_' + eachFood.foods_id} className='eachFoodPrice'
                                       style={(eachFood.status === 'in stock') ? {} : {color: 'red'}}>
                                        {(eachFood.status === 'in stock') ? (eachFood.price / 1000 + 'T') : 'نا موجود'}
                                    </p>

                                </div>
                                <div className='eachFoodImageContainer' style={{
                                    background: 'url(' + eachFood.thumbnail + ')',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}/>
                            </div>
                        </div>
                )
            })
        })
    }

    foodObjectToCategoryJsx = (foodsObject, foodType) => {


        return Object.keys(foodsObject[foodType]).map(category => {
            this.state.scrollCats.push(category)
            return (
                <a key={Math.floor(Math.random() * 1000)} onClick={() => {
                    this.setState({
                        isTouching: false
                    })
                }} id={'cat' + category.toLowerCase()}
                   href={'#Food' + category.toString().toLowerCase()}
                   onClickCapture={this.handleCategoryClick}>
                    <div className='inCat' key={category.toString()} style={{
                        width: '39px',
                        height: '30px',
                        background: 'url(./img/foods/' + category.toString() + '.png)',
                        backgroundSize: '75%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right',
                        paddingLeft: '20px',
                        borderRadius: '15px 0 0 15px',
                        transition: 'all 0.2s ease 0s'
                    }}/>
                </a>
            )
        })
    }

    // ----------------------------------------------------- SmallPage -------------------------------------

    smallPage = () => {
        return (
            <div className="app" style={{height: "100%", textAlign: "center"}}>
                <BottomNavigation/>

                <Swipeable onSwipedUp={() => {
                    this.props.frontStatesPageSize("big")
                    let categories = document.querySelectorAll("nav a");
                    this.state.mainNavLinks = categories;
                    let a = $('a[id^="category"]')
                    this.cats = a
                    if (this.props.orderList.length) {
                        $('#notificationNumber').css({visibility: 'visible'})
                    }
                    $('#notificationNumber').html(this.props.orderList.length)

                }} preventDefaultTouchmoveEvent={true}>
                    <div className="contain " style={{width: "100%", position: "absolute", bottom: "0",}}>
                        <div className="" style={smallMainContainerStyle}>
                            <div className='mainHeader'>
                                <div onClick={() => {
                                    this.props.history.push('/more')
                                }} className='moreOptions'/>
                                <div className='headerLOGO'/>
                                <div className='resAndCof'>
                                    <div onClick={this.handleRestaurantClick} className='restaurantButton'/>
                                    <div onClick={this.handleCoffeeShopClick} className='cafeButton'/>
                                </div>
                            </div>
                            <div id='category' style={{
                                float: 'right',
                                display: "flex",
                                flexFlow: "column",
                                justifyContent: 'space-between',
                                width: '40px',
                                height: 'calc(100% - 90px)',
                                alignItems: 'flex-end',
                                paddingRight: '5px'
                            }}>
                                <span/>
                                <span/>
                                <span/>
                                <div id='star'/>
                                {/*--------------------------------categories----------------------------*/}

                                {this.state.cats.slice(0, 3)}
                            </div>
                            <div id='horizontalScroller' style={{
                                direction: 'rtl',
                                overflowX: 'scroll',
                                display: 'flex',
                                width: 'calc(100% - 45px)',
                                height: '150px',
                                marginTop: '40px',
                                paddingTop: '10px'
                            }}>
                                {moreOrderedFoods(this.props.historyOrderListRestaurant, this.props.foods).map(foodId => {
                                    return (
                                        <div
                                            key={"moreOrderedFoods" + this.props.foods.filter(eachFood => eachFood.foods_id === foodId)[0].foods_id}
                                            id={'topFood' + foodId} style={{
                                            overflow: 'hidden',
                                            margin: '0 5px',
                                            flex: '0 0 auto',
                                            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 2px 5px',
                                            width: '100px',
                                            height: '90%',
                                            borderRadius: '20px',
                                            backgroundColor: 'white'
                                        }} onClick={() => {
                                            if (this.props.foods.filter(eachFood => eachFood.foods_id === foodId)[0].status === 'in stock') {
                                                this.orderScripts(foodId)
                                                this.scaleAnimation('topFood' + foodId)
                                            } else {
                                                this.outOfStockAction(foodId)
                                            }
                                        }}>
                                            <div id='topFoodImage' style={{
                                                borderTopRightRadius: '10px',
                                                borderTopLeftRadius: '10px',
                                                overflow: 'hidden',
                                                background: "url(" + this.props.foods.filter(eachFood => eachFood.foods_id === foodId)[0].thumbnail + ")",
                                                backgroundRepeat: 'no-repeat',
                                                height: '50%',
                                                backgroundSize: '100%',
                                                backgroundPosition: 'top',
                                            }}/>
                                            <p className='topFiveText' style={{
                                                display: 'inline-block',
                                                fontSize: 'small',
                                                fontFamily: 'inherit',
                                                marginTop: '5px'
                                            }}>{this.props.foods.filter(eachFood => eachFood.foods_id === foodId)[0].name}</p>

                                            <p style={{
                                                color: '#FAA21B',
                                                fontWeight: 'bold',
                                                marginTop: '-10px'
                                            }}> {(this.props.foods.filter(eachFood => eachFood.foods_id === foodId)[0].status === 'in stock') ? (parseInt(this.props.foods.filter(eachFood => eachFood.foods_id === foodId)[0].price) / 1000 + 'T') : 'نا موجود'}</p>
                                        </div>)
                                })}
                            </div>
                        </div>
                    </div>
                </Swipeable>
            </div>
        )
    }
    // --------------------------------------------------- BigPage -------------------------------------

    bigPage = () => {
        return (
            <React.Fragment>
                <BottomNavigation/>
                <div style={{
                    background: 'white',
                    height: '100%',
                    marginTop: '30px',
                    bottom: '0',
                    width: 'calc(100%)',
                    position: 'absolute',
                    maxWidth: '500px',
                }}>
                    <Swipeable onSwipedDown={() => {
                        this.props.frontStatesPageSize("small")

                    }} preventDefaultTouchmoveEvent={true}>
                        <div className='mainHeader'>
                            <div onClick={() => {
                                this.props.history.push('/more')
                            }} className='moreOptions'/>
                            <div className='headerLOGO'/>
                            <div className='resAndCof'>
                                <div onClick={this.handleRestaurantClick} className='restaurantButton'/>
                                <div onClick={this.handleCoffeeShopClick} className='cafeButton'/>
                            </div>
                        </div>
                    </Swipeable>
                    <div id='moreContainer'>
                        <MoreDetails foodInfo={this.state.moreDetailsFood}/>
                    </div>

                    {/*-----------------------------------------categories Container -------------------------*/}
                    <div onScroll={this.handleTouchEnd} id="main" style={{
                        display: 'flex',
                        height: 'calc(100% - 80px)',
                        flexFlow: 'row-reverse',
                        overflow: 'hidden',
                        borderRadius: '0 0 15px 15px',
                        background: 'white'
                    }}>
                        <div id='category' style={{
                            float: 'right',
                            height: "100%",

                        }}>
                            <nav style={{
                                float: 'right',
                                display: "flex",
                                flexFlow: "column",
                                justifyContent: 'space-between',
                                height: "100%",
                                width: '50px',
                                paddingBottom: '70px',
                                paddingTop: '60px',
                                paddingRight: '10px',
                                alignItems: 'flex-end'
                            }}>
                                {this.state.cats}
                            </nav>
                            {/*--------------------------------categories----------------------------*/}
                        </div>

                            <Swipeable onSwipedDown={()=>{
                                if (this.state.smallPageTrigger){
                                    this.props.frontStatesPageSize('small')
                                }
                            }}>
                                <div
                                    onTouchStart={() => {
                                        this.state.isTouching = true

                                    }}
                                    onScrollCapture={this.foodSectionScrollHandler}


                                    id='foodSection' style={{
                                    height: '100%',
                                    with: '100%',

                                    paddingRight: '20px',
                                    paddingLeft: '10px',
                                    overflow: 'scroll',
                                    paddingBottom: '10px'
                                }}>
                                    {/*---------------------------------FoodsList-----------------------------*/}
                                    {this.state.foodList}
                                </div>
                            </Swipeable>


                    </div>
                </div>
            </React.Fragment>


        )
    }


}

const mapStateToProps = (store) => {
    return {
        pageSize: store.reducerFrontStates.pageSize,
        foods: store.reducerRestaurant.foods,
        orderList: store.reducerTempData.orderList,
        historyOrderListRestaurant: store.reducerUser.orderListRestaurant,
        trackingId: store.reducerTempData.trackingId,
    }
}

const mapDispatchToProps = () => {
    return {
        frontStatesPageSize: actions.frontStatesPageSize,
        increaseFoodNumber: actions.increaseFoodNumber,
        addFoodToOrders: actions.addFoodToOrders,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);

const smallMainContainerStyle = {
    background: "#FFF7F7",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    bottom: "0",
    marginLeft: "8px",
    marginRight: "8px",
    height: "320px",
    boxShadow: "0 .5rem 1rem rgba(0, 0, 0, .25)",
    userSelect: "none"
}