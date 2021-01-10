import React from 'react';
// noinspection ES6CheckImport
import {BrowserRouter, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./Components/LoginPage/Login";
import VerificationCode from "./Components/verificationCodePage/VreficationCode";
import SignUp from "./Components/SignUp/SignUp";
import Profile from "./Components/ProfilePage/Profile";
import MainPage from "./Components/MainPage/MainPage";
import SplashScreen from "./Components/SplashScreenPage/SplashScreen";
import Bill from "./Components/BillPage/Bill";
import PayWay from "./Components/PayWay/PayWay";
import Tour360 from "./Components/Tour360page/Tour360";
import ReserveTable from "./Components/ReserveTable/ReserveTable";
import OrderReport from "./Components/OrderReport/OrderReport";
import MoreOptions from "./Components/MoreOptions/MoreOptions";
import AboutRestaurant from "./Components/AboutRestaurant/AboutRestaurant";
import OpenOrders from "./Components/OpenOrders/OpenOrders";

function App() {

    return (
        <React.Fragment>
            <BrowserRouter>
                <Route path='/main' component={Tour360}/>

                <Route exact path='/' component={SplashScreen} />
                <Route path='/profile' component={Profile}/>
                <Route path='/signup' component={SignUp}/>
                <Route path='/pay' component={PayWay}/>
                <Route path='/reservetable' component={ReserveTable}/>
                <Route path='/openorders' component={OpenOrders} />
                <Route path='/orderReport/:trackingId' component={OrderReport} />
                <Route path='/more' component={MoreOptions}/>
                <Route path='/about' component={AboutRestaurant}/>
                <Route path='/vcode' component={VerificationCode}/>
                <Route path='/login' component={Login} />
                <Route path='/main' component={MainPage}/>
                <Route path='/bill' component={Bill}/>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;
