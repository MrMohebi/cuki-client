export default function rewDataToObject(rowData) {
    let persianGroupsRestaurant = {appetizer:'پیش غذا', burger: 'برگر', pizza: 'پیتزا' , panini:'پنینی' , main:'غذای اصلی',
        irani: 'ایرانی' , dessert:'دسر' , pasta: 'پاستا', drink:"نوشیدنی"};

    let persianGroupsCoffeeshop = {mohito:"موهیتو",hotDrink:"نوشیدنی های گرم", cake:"کیک", brewed:"دم کرده",shake:'شیک'}

    let sampleFinalObject = {
        restaurant:{
            appetizer: {persianName:"", foodList:[{name:"", price:""}, {name:"", price:""}, ]},
            burger: {persianName:"", foodList:[{name:"", price:""}, ]},
        },
        coffeeshop:{
            hotDrink:{persianName:"", foodList:[{name:"", price:""}, ]},
            cake:{persianName:"", foodList:[{name:"", price:""}, ]},
        }
    }


    let resultObject = {
        restaurant:{},
        coffeeshop:{},
        notDefined:{},
    }

    for(let i = 0; i < rowData.length ; i++){
        if(persianGroupsRestaurant[rowData[i].group]){
            if(!resultObject.restaurant[rowData[i].group]){
                resultObject.restaurant[rowData[i].group] = {persianName:persianGroupsRestaurant[rowData[i].group], foodList:[]}
            }
            resultObject.restaurant[rowData[i].group].foodList.push(rowData[i]);
        }else if(persianGroupsCoffeeshop[rowData[i].group]){
            if(!resultObject.coffeeshop[rowData[i].group]){
                resultObject.coffeeshop[rowData[i].group] = {persianName:persianGroupsCoffeeshop[rowData[i].group], foodList:[]}
            }
            resultObject.coffeeshop[rowData[i].group].foodList.push(rowData[i]);
        }else {
            if(!resultObject.notDefined[rowData[i].group]){
                resultObject.notDefined[rowData[i].group] = {persianName:"نامشخص", foodList:[]}
            }
            resultObject.notDefined[rowData[i].group].foodList.push(rowData[i]);
        }
    }
    return resultObject;
}