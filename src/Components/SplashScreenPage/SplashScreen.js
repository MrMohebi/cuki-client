import React from 'react';
import * as requests from "../../ApiRequests/requests";
import * as actions from '../../reduxStore/actions'
import './style/style.css'
import * as cache from '../../reduxStore/cachedData/cachedData'


export default function SplashScreen(props) {
    const goMainPage = (response) =>{
        if(response.statusCode === 200){
            props.history.push("/main");
        }
    }

    const getData = () =>{
        requests.getRestaurantInfo(goMainPage);
    }

    const setCacheData = () =>{
        if(cache.getCacheToken() !== undefined && cache.getCacheToken().length > 20){
            actions.userSetToken(cache.getCacheToken());
            requests.getUserInfo();
        }
        if(cache.getCacheOrderList() !== undefined && cache.getCacheOrderList().length > 1){
            actions.setOrderList(cache.getCacheOrderList())
        }
    }
    return(
        <div id='splashMain'>
            <div id='splashImg'/>
            <div id='splashVector'/>
            {getData()}
            {setCacheData()}
        </div>
    )
}
