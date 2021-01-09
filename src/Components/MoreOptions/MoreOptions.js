import React from "react";
import * as actions from "../../reduxStore/actions";
import {connect} from "react-redux";
import '../MoreOptions/style/style.css'




class MoreOptions extends React.Component{

    render() {
        return(
            <React.Fragment>
                <div className='moreOptionsContainer'>
                    <div className='backButton' onClick={()=>{
                        this.props.history.push('/main')
                    }}/>
                    <div className='Options'>
                        <div className='eachOption' onClick={()=>{
                            this.props.history.push('/about')
                        }}>
                            <div className='aboutDiv'/>
                            <span className='aboutText'> معرفی رستوران</span>
                        </div>
                        <div className='eachOption'>
                            <div className='reserveDiv'/>
                            <span className='aboutText'>رزرو میز</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center w-100 position-absolute bottom-0">
                        <div className='moreVector'/>
                    </div>
                </div>
            </React.Fragment>

        )
    }

}
const mapStateToProps = (store) => {
    return {

    }
}

const mapDispatchToProps = () => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoreOptions);