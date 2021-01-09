import React from "react";
import {connect} from "react-redux";
import '../MoreOptions/style/style.css'




class AboutRestaurant extends React.Component{

    componentDidMount() {
        console.log(this.props.resDetails)
    }

    render() {
        return(
            <div className='moreOptionsContainer'>
                <div className='backButton' onClick={()=>{
                    this.props.history.push('/more')
                }}/>
                <div className='Options'>
                    <div className='eachOption'>
                        <div className='phoneDiv'></div>
                        <span className='aboutText'>{JSON.parse(this.props.resDetails.phone)}</span>
                    </div>
                    <div className='eachOption'>
                        <div className='addressDiv'></div>
                        <span className='aboutText'>{this.props.resDetails.address}</span>
                    </div>
                    <div className='eachOption'>
                        <div className='rateDiv'></div>
                        <span className='aboutText'>{this.props.resDetails.rate}</span>
                    </div>

                    <div className='linksDivHolder'>
                        <span className='font-weight-bold'> لینک های ارتباطی</span>
                    </div>
                    <div className='eachOption'>
                        <div className='instagramDiv'></div>
                        <span className='aboutText'>
                            {/*should be changed to {this.props.resDetails.socialLinks} */}
                            shilan_cafe_restaurant
                        </span>
                    </div>
                    <div className='eachOption'>
                        <div className='websiteDiv'></div>
                        <span className='aboutText'>
                            {/*should be changed to {this.props.resDetails.socialLinks} */}
                            www.shilan.ir
                        </span>
                    </div>
                </div>
                    <div className='openTimeContainer'>
                        <div className='openTimeLabel mt-5 mr-4'></div>
                        <span className='text-center w-100 mt-3'>شروع کار کافه رستوران از 11 صبح تا 4 عصر</span>
                    </div>
            </div>
        )
    }

}
const mapStateToProps = (store) => {
    return {
        resDetails: store.reducerRestaurant.restaurantInfo

    }
}

const mapDispatchToProps = () => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutRestaurant);