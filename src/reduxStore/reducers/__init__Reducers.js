export const __init__Restaurant = {
    englishName:"shilan coffeeshop restaurant",
    foods: [],
    assets: [],
    comments: [],
    allTableList: [],
    reservedTableList: [],
    restaurantInfo: []
}

export const __init__User = {
    token: "",
    phone: "",
    name: "",
    birthday: "",
    job: "",
    totalBoughtAll: 0,
    lastLogin: "",
    availableOffCodes: [],
    userOffCodeHistory: {},
    favoritePlaces: [],
    rankRestaurant: "",
    scoreRestaurant: 0,
    orderTimesRestaurant: 0,
    totalBoughtRestaurant: 0,
    orderListRestaurant: [],
    lastOrderRestaurant :"",
    moreOrderedFoods:[]
}

export const __init__FrontStates = {
    pageSize:"small",
    headerOrder:["profile","logo","menu"],
    sentVCode: false,
}


export const __init__TempData = {
    orderList: [],
    address: "",
    howToPay: "online",  // online / offline
    howToDeliver: "inRestaurant", // inRestaurant / outOfRestaurant
    table: "",
    trackingId: 0,
    openOrdersTrackingId : [],
    openOrdersInfo:{},  // {"trackingId1": {"orderList": [], "orderTime": 0, ""}, "trackingId2":{} , ...}
}
















