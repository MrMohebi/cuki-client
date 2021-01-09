import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from "moment-jalaali";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import availableReservationTimes from "./js/availableReserviationTimes";
import './css/style.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import * as requests from "../../ApiRequests/requests"
import * as actions from "../../reduxStore/actions";

function findTableBaseOnTime(timeUnit, tablesHList){
    let tablesName = Object.keys(tablesHList);
    let finalO = {}
    tablesName.map(eachTableName=>{
        if(tablesHList[eachTableName].indexOf(timeUnit) !== -1){
            finalO[eachTableName] = tablesHList[eachTableName];
        }
    });
    return finalO;
}

function selectedInMiddle(item, array, resultArrLength= 7){
    if(array.length < resultArrLength)
        resultArrLength = array.length;
    let arr = [...array];
    if(item === undefined || item.length <= 0)
        return arr;
    let itemStr = item.toString()
    let itemIndex = arr.indexOf(item) < 0? arr.indexOf(itemStr) : arr.indexOf(item);
    if(itemIndex < 0)
        return arr;
    if(arr.length%2 !== 0){
        while (itemStr !== arr[(arr.length-1)/2].toString())
            arr.push(arr.shift())
    }else{
        while (itemStr !== arr[(arr.length-2)/2].toString())
            arr.push(arr.shift())
    }
    while (arr.length !== resultArrLength){
        if(arr.length !== resultArrLength)
            arr.pop()
        if(arr.length !== resultArrLength)
            arr.shift();
    }
    return arr;
}


function removeTimeFromAvailable(date, time, table, mainAvailableObject){
    let newAO = JSON.parse(JSON.stringify(mainAvailableObject));
    newAO[date].tableFreeHHours[table] =  newAO[date].tableFreeHHours[table].filter(i=> i.toString() !== time.toString())
    newAO[date].AllFreeHHours =  [].concat.apply([], Object.values(newAO[date].tableFreeHHours)).filter((v, i, a) => a.indexOf(v) === i)
    if(newAO[date].tableFreeHHours[table].length <= 0){
        delete newAO[date].tableFreeHHours[table];
    }
    return newAO
}




function prepareRowDataForSendRequestReserveTable(finalReserveList){
    let newFRT = JSON.parse(JSON.stringify(finalReserveList))
    let dateTable = {} // {date_table: [,hours,]}
    let finalObject = [] // [date:"", hours:[], table:""]
    //let sortedBaseDate = newFRT.sort((a,b) => {return b.date - a.date})
    newFRT.map(eachReserve=>{
        if(dateTable[eachReserve.date+"_"+eachReserve.table]){
            dateTable[eachReserve.date+"_"+eachReserve.table].push(eachReserve.time);
        }else{
            dateTable[eachReserve.date+"_"+eachReserve.table] =  []
            dateTable[eachReserve.date+"_"+eachReserve.table].push(eachReserve.time);
        }
    })
    Object.keys(dateTable).map(eachDT=>{
        finalObject.push(
            {
                date: eachDT.split("_")[0],
                table:eachDT.split("_")[1],
                hours:dateTable[eachDT],
            }
        )
    })
    return finalObject;
}

function sendRequestReservesList(reserveList){
    reserveList.map(eachReserve=>{
        let tableName = eachReserve.table
        let hours = eachReserve.hours
        let date = moment(eachReserve.date, 'jYYYY/jM/jD').unix();
        requests.sendReserveTable(tableName, date, hours, callbackReserveTable)
    })
}

function callbackReserveTable(res){
    if(res.statusCode === 200){
        console.log(res.data.reserveId)
    }else{
        console.log(res)
    }

}



class ReserveTable extends Component {
    findAvailableReserveTime = () =>{
        return availableReservationTimes(this.props.openTimes, this.props.reservedTableList, this.props.allTableList)
    }

    state = {
        mainAvailableObject:this.findAvailableReserveTime(),

        selectedDay:"",
        selectedTime:"",
        selectedTable:"",

        availableDates:[],
        availableTimes:[],
        availableTables:[],

        finalReserveList:[], //[{date: "", time: "", table: ""}, ...]
    }

    componentDidMount() {
        let availableTimes = this.state.mainAvailableObject;
        let datesList = Object.keys(availableTimes);
        this.setState({
            selectedDay: datesList[0],
            selectedTime:availableTimes[datesList[0]].AllFreeHHours[0],
            selectedTable: Object.keys(findTableBaseOnTime(availableTimes[datesList[0]].AllFreeHHours[0], availableTimes[datesList[0]].tableFreeHHours))[0],

            availableDates:datesList,
            availableTimes:availableTimes[datesList[0]].AllFreeHHours,
            availableTables:findTableBaseOnTime(availableTimes[datesList[0]].AllFreeHHours[0], availableTimes[datesList[0]].tableFreeHHours),
        })
    }

    changeDate = (newDate) =>{
        let availableTimes = this.state.mainAvailableObject;
        this.setState({
            selectedDay: newDate,
            selectedTime:availableTimes[newDate].AllFreeHHours[0],
            selectedTable: Object.keys(findTableBaseOnTime(availableTimes[newDate].AllFreeHHours[0], availableTimes[newDate].tableFreeHHours))[0],

            availableTimes:availableTimes[newDate].AllFreeHHours,
            availableTables:findTableBaseOnTime(availableTimes[newDate].AllFreeHHours[0], availableTimes[newDate].tableFreeHHours),
        })
    }

    changeHour = (newHHour) =>{
        let availableTimes = this.state.mainAvailableObject;
        let availableTables = findTableBaseOnTime(newHHour, availableTimes[this.state.selectedDay].tableFreeHHours)
        this.setState({
            selectedTime:newHHour,
            availableTables: availableTables,
        })
        if(!Object.keys(this.state.availableTables).includes(this.state.selectedTable)){
            this.setState({
                selectedTable: Object.keys(availableTables)[0],
            })
        }
    }

    changeTable = (newTable) =>{
        this.setState({
            selectedTable:newTable,
        })
    }

    handleBackPage = ()=>{
        this.props.setHeaderOrder(["profile",'logo','menu'])
        this.props.history.goBack()
    }

    handleDayUp = () =>{
        let datesList = selectedInMiddle(this.state.selectedDay ,this.state.availableDates );
        this.changeDate(datesList.length%2 !== 0 ? datesList[(datesList.length+1)/2] : datesList[datesList.length/2]);
    }


    handleDayDown = () =>{
        let datesList = selectedInMiddle(this.state.selectedDay ,this.state.availableDates );
        this.changeDate(datesList.length%2 !== 0 ? datesList[(datesList.length+1)/2-2] : datesList[datesList.length/2-2]);
    }

    handleTimeUp = () =>{
        let hoursList = selectedInMiddle(this.state.selectedTime ,this.state.availableTimes );
        this.changeHour(hoursList.length%2 !== 0 ? hoursList[(hoursList.length+1)/2] : hoursList[hoursList.length/2]);
    }

    handleTimeDown = () =>{
        let hoursList = selectedInMiddle(this.state.selectedTime ,this.state.availableTimes );
        this.changeHour(hoursList.length%2 !== 0 ? hoursList[(hoursList.length+1)/2-2] : hoursList[hoursList.length/2-2]);
    }

    handleTableUp = () =>{
        let tableList = selectedInMiddle(this.state.selectedTable ,Object.keys(this.state.availableTables) );
        this.changeTable(tableList.length%2 !== 0 ? tableList[(tableList.length+1)/2] : tableList[tableList.length/2]);
    }

    handleTableDown = () =>{
        let tableList = selectedInMiddle(this.state.selectedTable ,Object.keys(this.state.availableTables) );
        this.changeTable(tableList.length%2 !== 0 ? tableList[(tableList.length+1)/2-2] : tableList[tableList.length/2-2]);
    }

    handleAddReserveTime = () =>{
        if(this.state.selectedTable === undefined || this.state.selectedTime === undefined || this.state.mainAvailableObject[this.state.selectedDay].tableFreeHHours[this.state.selectedTable] === undefined || this.state.mainAvailableObject[this.state.selectedDay].tableFreeHHours[this.state.selectedTable].length <= 0)
            return false

        let hoursList = selectedInMiddle(this.state.selectedTime ,this.state.availableTimes );

        let reserveO = {
            date: this.state.selectedDay,
            time: this.state.selectedTime,
            table: this.state.selectedTable,
        }
        let reserves = [...this.state.finalReserveList, reserveO];

        let newMA = removeTimeFromAvailable(reserveO.date, reserveO.time, reserveO.table, this.state.mainAvailableObject)
        this.handleTimeUp()

        let nextAvailableH = hoursList.length%2 !== 0 ? hoursList[(hoursList.length+1)/2] : hoursList[hoursList.length/2];
        let availableTables = findTableBaseOnTime(nextAvailableH, newMA[reserveO.date].tableFreeHHours)

        this.setState({
            finalReserveList: reserves,
            mainAvailableObject: newMA,

            availableTimes:newMA[reserveO.date].AllFreeHHours,
            availableTables:availableTables,
        })
    }


    handleFinalSubmit = () =>{
        let reserveList = prepareRowDataForSendRequestReserveTable(this.state.finalReserveList);
        sendRequestReservesList(reserveList);
    }

    handleDeleteReserve = (reserveObject)=>{
        let newFinalReserve = this.state.finalReserveList.filter(eachReserve=> ((eachReserve.date !== reserveObject.date) || (eachReserve.time !== reserveObject.time) || (eachReserve.table !== reserveObject.table)))
        this.setState({
            finalReserveList: newFinalReserve,
        })
    }



    render() {
        return (
            <div style={{width:"100%", height:"100%"}}>
                <button onClick={this.handleBackPage}>برگشت</button>

                <div className='tableReserveMain shadow'>
                    <div id="selectDateId">
                        {/*<button onClick={this.handleDayUp}>date up</button>*/}
                        <div onClick={this.handleDayDown} className='upDownContainers'>
                            <FontAwesomeIcon icon={faAngleUp}/>
                        </div>

                        {selectedInMiddle(this.state.selectedDay ,this.state.availableDates ).map((eachDate, index) =>{
                            // highlight selected item
                            if(eachDate === this.state.selectedDay)
                                return <div key={"date_"+index} style={{fontWeight: "bold"}}>{eachDate}</div>

                            // else show them normal
                            return <div key={"date_"+index}>{eachDate}</div>

                        })}

                        {/*<button onClick={this.handleDayDown}>date down</button>*/}

                        <div onClick={this.handleDayUp} className='upDownContainers'>
                            <FontAwesomeIcon icon={faAngleDown}/>
                        </div>
                    </div>

                    <br/>

                    <div id="selectTimeId">
                        {/*<button onClick={this.handleTimeUp}>time up</button>*/}
                        <div onClick={this.handleTimeDown} className='upDownContainers'>
                            <FontAwesomeIcon icon={faAngleUp}/>
                        </div>

                        {selectedInMiddle(this.state.selectedTime,this.state.availableTimes ).map((eachTime, index) =>{
                            // highlight selected item
                            if(eachTime === this.state.selectedTime)
                                return (
                                    <div key={"time_"+index} style={{fontWeight: "bold"}}>
                                        <span>{eachTime%2===0? ( eachTime/2+":00" ) : ( (eachTime-1)/2+":30" )}</span> <span> - </span> <span>{eachTime%2===0? ( eachTime/2+":30 " ) : ( (eachTime+1)/2+":00 " )}</span>
                                    </div>)

                            // else show them normal
                            return (
                                <div key={"time_"+index}>
                                    <span>{eachTime%2===0? ( eachTime/2+":00" ) : ( (eachTime-1)/2+":30" )}</span> <span> - </span> <span>{eachTime%2===0? ( eachTime/2+":30 " ) : ( (eachTime+1)/2+":00 " )}</span>
                                </div>)
                        })}

                        {/*<button onClick={this.handleTimeDown}>time down</button>*/}
                        <div onClick={this.handleTimeUp} className='upDownContainers'>
                            <FontAwesomeIcon icon={faAngleDown}/>
                        </div>
                    </div>


                    <br/>

                    <div id="selectTableId">
                        {/*<button onClick={this.handleTableUp}>table up</button>*/}
                        <div onClick={this.handleTableDown} className='upDownContainers'>
                            <FontAwesomeIcon icon={faAngleUp}/>
                        </div>
                        {selectedInMiddle(this.state.selectedTable ,Object.keys(this.state.availableTables)).map((eachTable, index) =>{
                            // highlight selected item
                            if(eachTable === this.state.selectedTable)
                                return <div key={"table_"+index} style={{fontWeight: "bold"}}>{eachTable}</div>

                            // else show them normal
                            return <div key={"table_"+index}>{eachTable}</div>
                        })}

                        {/*<button onClick={this.handleTableDown}>table down</button>*/}
                        <div onClick={this.handleTableUp} className='upDownContainers'>
                            <FontAwesomeIcon icon={faAngleDown}/>
                        </div>
                    </div>





                </div>
                <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                    <button className='btn btn-warning btnAdd' onClick={this.handleAddReserveTime}>افزودن</button>
                </div>


                    <div id="reserveList">

                        {this.state.finalReserveList.map(eachReserve=>{
                            return(
                                // eachReserve.date + " ==>  " + eachReserve.time + " ==> " + eachReserve.table +"   ****   "
                                <div key={eachReserve.date + eachReserve.time + eachReserve.table} style={{width:'100%',display:'flex',justifyContent:'center'}}>
                                    <span className="eachTableReserved">{ eachReserve.date + eachReserve.time + eachReserve.table } </span>
                                    <button onClick={()=>{this.handleDeleteReserve(eachReserve)}}>حذف</button>
                                </div>
                            )

                        })
                        }

                    </div>
                <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                    <button onClick={this.handleFinalSubmit} className="btn btn-outline-success" id="submitFinal">ثبت نهایی</button>
                </div>



            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        openTimes: state.reducerRestaurant.restaurantInfo.open_time ? JSON.parse(state.reducerRestaurant.restaurantInfo.open_time) : {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[]} ,
        reservedTableList : state.reducerRestaurant.reservedTableList ? state.reducerRestaurant.reservedTableList : [] ,
        allTableList: state.reducerRestaurant.allTableList ? state.reducerRestaurant.allTableList : [],
    };
}
const mapDispatchToProps = () => {
    return {
        setHeaderOrder: actions.frontStatesHeaderOrder
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReserveTable);


// <button onClick={this.handleReset}>از اول</button>
// <span>{this.state.night? "شب" : "روز" }</span>
// <div id="containerSelectAmpm">
//     <Switch
//         checked={this.state.night}
//         onChange={this.handleSelectNight}
//         handleDiameter={28}
//         offColor="#faa21b"
//         onColor="#292e2e"
//         offHandleColor="#fff"
//         onHandleColor="#fff"
//         height={40}
//         width={120}
//         uncheckedIcon={
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: "100%",
//                     fontSize: 15,
//                     color: "black",
//                     paddingRight: 2
//                 }}
//             >
//                 روز
//             </div>}
//         checkedIcon={
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     height: "100%",
//                     fontSize: 15,
//                     color: "#fff",
//                     paddingRight: 2
//                 }}
//             >
//                 شب
//             </div>}
//     />
// </div>
// <div id='containerSelectDate' style={{display:this.state.step===1? "block" : "none"}}>
//
//     <DatePicker
//         value={this.state.date}
//         onChange={this.handleSelectDate}
//         inputPlaceholder="تاریخ"
//         shouldHighlightWeekends
//         locale="fa"
//         calendarClassName="responsive-calendar"
//     />
//
// </div>
//
// <div id='containerSelectHour'>
//
// </div>
//
// <div id='containerSelectTable'>
//
// </div>






// <div>
//     <MuiPickersUtilsProvider utils={MomentUtils}>
//         <KeyboardTimePicker
//             autoOk
//             showTodayButton
//             ampm={false}
//             mask="__:__"
//             invalidDateMessage="ساعت نامعتبر"
//             label="از..."
//             value={this.state.startH}
//             onChange={this.handleChangeStartH}
//         />
//
//         <KeyboardTimePicker
//             autoOk
//             showTodayButton
//             ampm={false}
//             mask="__:__"
//             invalidDateMessage="ساعت نامعتبر"
//             label="تا..."
//             value={this.state.endH}
//             onChange={this.handleChangeEndH}
//             KeyboardButtonProps={{
//                 'aria-label': 'change time',
//             }}
//         />
//
//         <DatePicker
//             value={this.state.date}
//             onChange={this.handleSelectDate}
//             inputPlaceholder="تاریخ"
//             shouldHighlightWeekends
//             locale="fa"
//             calendarClassName="responsive-calendar"
//         />
//     </MuiPickersUtilsProvider>
// </div>