import React from "react";
import './style/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

class MoreDetails extends React.Component {

    moreDetails = (foodInfo) => {

        return (
            <div id='mainMore'>
                <div id='mainSquare'>
                    <div id='moreDetailsImg' style={{
                        backgroundImage: 'url(' + foodInfo.thumbnail + ')',
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        borderRadius:'5px'
                    }}/>
                    <p id='foodName'>{foodInfo.name}</p>
                    <p id='foodDetailsPlaceHolder'>
                        محتویات غذا
                    </p>
                    <p id='detailsMoreDetails'>

                        {foodInfo.details!== undefined? JSON.parse(foodInfo.details).join(' / ') : null}
                    </p>
                    <div id='timesOrdered'>
                        <div id='timesOrderedLeft'>
                            <span>
                                {foodInfo.order_times + ' بار '}
                           </span>
                        </div>
                        <div id='timesOrderedRight'>
                            تعداد دفعات سفارش
                        </div>
                    </div>

                    <div id='deliveryTime'>
                        <div id='deliveryTimeLeft'>
                            <span>
                                {foodInfo.delivery_time + ' دقیقه '}
                           </span>
                        </div>
                        <div id='deliveryTimeRight'>
                            زمان تحویل سفارش
                        </div>
                    </div>
                    <div id='moreDetailPrice'>
                        <span id='priceText'>
                            قیمت
                        </span>
                        <span id='priceNumber'>
                            {foodInfo.price}
                        </span>
                    </div>

                </div>
            </div>
        )
    }

    render() {
        return (
            <div >
                {this.moreDetails(this.props.foodInfo)}
            </div>
        )

    }

}

export default MoreDetails;