import moment from "moment-jalaali";
import produce from "immer"

const __init__openTimes = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[]};  // 0 is sunday
const __init__ReservedTablesList = [];

export default function availableReservationTimes(openTimes, reservedTablesList, allTableList){

    if (!(typeof openTimes === 'object' && openTimes !== null && typeof reservedTablesList === 'object' && reservedTablesList !== null)){
        return false;
    }

    let ot = produce(openTimes, draft=>{});
    let rtl = JSON.parse(JSON.stringify(reservedTablesList));
    let atl = JSON.parse(JSON.stringify(allTableList));

    let finalObject = {
        "1399/8/28": {
            dayInfo:{
                weekStrFa:"چهارشنبه",
                monthStrFa:"آبان"
            },
            AllFreeHHours:[2,3,4,15,32,33,36,37],
            tableFreeHHours:{
                tableName1: [2,3,4,15, 32, 33],
                tableName2: [32,33,36,37],
                "and so on...":""
            }
        },
        "1399/8/29": {
            dayInfo:{
                weekStrFa: "پنجشنبه",
                monthStrFa: "آبان"
            },
            AllFreeHHours:[],
            tableFreeHHours:{
                tableName1: [],
                tableName2: [],
                "and so on...":""
            }
        },
        "and so on for 14 days":"",
    }

    let result = {}
    let nowDate = new Date()
    for(let i = 0; i < 14; i++){
        let newDateJ =  moment(nowDate).add(i, 'd').format("jYYYY/jM/jD");
        let tablesFreeHHours = tableFreeHHours(newDateJ, rtl, ot, atl);
        result[newDateJ] = {
            dayInfo: dayInfo(newDateJ),
            AllFreeHHours: [].concat.apply([], Object.values(tablesFreeHHours)).filter((v, i, a) => a.indexOf(v) === i),
            tableFreeHHours:tablesFreeHHours
        }
    }

    console.log(result);
    return result;

}


function dayInfo(date){
    moment.loadPersian({dialect: 'persian-modern'})
    let dateMoment = moment(date,'jYYYY/jM/jD')
    if(!dateMoment.isValid()){
        return false;
    }
    return {
        weekStrFa: dateMoment.format("dddd"),
        monthStrFa: dateMoment.format("jMMMM"),
    }
}

function tableFreeHHours(date, rtl, ot, atl){
    let dateMomentObject = moment(date,'jYYYY/jM/jD')
    let dayOT = ot[dateMomentObject.format("e")]
    let datOTHHourFormat =
        [].concat.apply([],
            dayOT.map(eachHour=>{
                return [eachHour*2, eachHour*2+1]
            })
        );
    let finalTableFreeHHour = {}

    atl.map(eachTable=>{
        let dayRTL = rtl.filter(eachReserve =>
            moment(new Date(parseInt(eachReserve.reserved_date) *1000)).format('jYYYY/jM/jD') ===  dateMomentObject.format('jYYYY/jM/jD')
            &&
            eachReserve.table_name === eachTable.table_name
        )

        let reservedHHourArr = dayRTL.map(eachReserve =>{return JSON.parse(eachReserve.reserved_hours) ? JSON.parse(eachReserve.reserved_hours) : eachReserve.reserved_hours})
        let reservedHHour = [].concat.apply([], reservedHHourArr);

        let hHoursList = datOTHHourFormat
            .filter(x => !reservedHHour.includes(x))
            .concat(reservedHHour.filter(x => !datOTHHourFormat.includes(x))).filter((v, i, a) => a.indexOf(v) === i);

        if(hHoursList.length > 0){
            finalTableFreeHHour[eachTable.table_name] = hHoursList;
        }


    })

    return finalTableFreeHHour;
}
























