export default function moreOrderedFoods(userHistoryOrders, allFoodsArray) {
    let allOrderedFoodTimes = {}
    let draftUserHistoryOrders = [...userHistoryOrders]
    let draftAllFoodsArray = [...allFoodsArray]
    draftUserHistoryOrders.map(eachOrder=>{
        JSON.parse(eachOrder['order_list']).map(eachFood=>{
            if(allOrderedFoodTimes[eachFood.id]){
                allOrderedFoodTimes[eachFood.id] += eachFood.number
            }else {
                allOrderedFoodTimes[eachFood.id] = eachFood.number
            }
        })
    })

    let sevenMoreOrdered = Object.keys(allOrderedFoodTimes).sort(function (a, b) {return allOrderedFoodTimes[a] - allOrderedFoodTimes[b]}).reverse()
        .map(eachFoodId=>{
            if(draftAllFoodsArray.filter(eachAllFoodId=> eachFoodId === eachAllFoodId.foods_id)[0])
                return draftAllFoodsArray.filter(eachAllFoodId=> eachFoodId === eachAllFoodId.foods_id)[0]['foods_id']
            else
                return undefined
    }).filter(eachFoodId=> eachFoodId > 0).slice(0,7);



    if(sevenMoreOrdered.length >=7){
        return sevenMoreOrdered;
    }else {
        return sevenMoreOrdered.concat(moreOrderedFoodRestaurant(draftAllFoodsArray)).slice(0,7)
    }
}


function moreOrderedFoodRestaurant(allFoodsArray) {
    return allFoodsArray.sort((a,b) => {return b.order_times - a.order_times}).filter(eachFood=> eachFood.group !== "drink" ).slice(0,10).map((eachFood=>{return eachFood.foods_id}))
}