export function gregorianToTimestamp(date){
    let timestamp = Date.parse(`${date[0].toString()} ` + `${date[1].toString()} ` + `${date[2].toString()} `);
    timestamp = timestamp/1000|0;
    timestamp= timestamp +24*60*60;
    return timestamp
}
