
## Application
> ### ```api\sendVerificationCode.add.modify.php``` ``GET``
>
> #### Required fields:
>   - **phone**
> 
>   #### Return Values ``JSON``:
>   ```json
>   {"statusCode": "[code]"}
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs)  


> ### ```api\login.modify.php``` ``POST``
>
> #### Required fields:
>   - **phone**
>   - **verification_code**
> 
>   #### Return Values ``JSON``:
>   ```json
>   {
> "statusCode": "[code]",
> "missingUserInfo": "[bool]",
> "token": "[token]"
> }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 300 (verification code was incorrect!)
>   >   - 400 (bad inputs)  
>   >   - 401 (could not fetch token)  
>   >   - 500 (server side error)
>
>   > #####[bool] :
>   >   - flase (name of user has been saved)
>   >   - true (user has no name he should enter it at first)  
>
>   > #####[token] :
>   >   - *string (token which would be used for fetching data)


> ### ```api\signup.modify.php``` ``POST``
>
> #### Required fields:
>   - **token**
>   - **name**
>   - birthday [_Timestamp_] (not required)
>   - job (not required)
> 
>   #### Return Values ``JSON``:
>   ```json
>   {"statusCode": "[code]"}
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs)  
>   >   - 500 (server side error)


> ### ```api\getUserInfo.fetch.php``` ``POST``
>
> #### Required fields:
>   - **token**
> 
>   #### Return Values ``JSON``:
>   ```json
>   {
>        "statusCode": "[code]",
>        "data": {
>            "name": "محمد مهدی محبی",
>            "phone": "09221231415",
>            "birthday": "0",
>            "job": "بیکار",
>            "totalBought": "0",
>            "lastLogin": "1601214087",
>            "availableOffCodes": [
>                 {
>                     "all_off_codes_id": "1",
>                     "phone": "09221321311",
>                     "place": "shilan coffeeshop restaurant",
>                     "times": "3",
>                     "max_price": null,
>                     "min_price": "6000",
>                     "discount_percentage": "10",
>                     "discount_price": null,
>                     "name": "first off code",
>                     "body": "OFFF-G",
>                     "from_date": "1595938335",
>                     "to_date": "1603887135",
>                     "status": "active",
>                     "modified_date": "1601295774"
>                }
>             ],
>            "userOffCodeHistory": {
>                "OFFF-G": 1
>            },
>            "favoritePlaces": ["shilan coffeeshop restaurant"]
>        }
>    }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs)  
>   >   - 500 (server side error)


> ### ```api\getAllRestaurantData.fetch.php``` ``POST``
>
> #### Required fields:
>   - **english_name**
> 
>   #### Return Values ``JSON``:
>   ```json
>   {
>        "statusCode": "[code]",
>        "data": {
>            "allTableList": [],
>            "reservedTableList": [],
>            "assets": [],
>            "comments": [],
>            "foods": [],
>            "restaurantInfo": []
>        }
>    }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs)  
>   >   - 500 (server side error)


> ### ```api\getAllRestaurantNames.fetch.php``` ``POST``
>
> #### Required fields:
>   No required field
> 
>   #### Return Values ``JSON``:
>   ```json
>   {
>        "statusCode": "[code]",
>        "data": {
>            "restaurantId": "",
>            "englishName": "",
 >           "persianName": ""
>        }
>    }
>   ```
>   > #####[code] :
>   >   - 200 (successes)


> ### ```api\sendOrder.add.php``` ``POST``
>
> #### Required fields:
>   - **englishName** 
>   - **token**
>   - **orders**  [{id: 6, number: 2}, {id: 42, number: 6}, ....]
>   - **paymentStatus** 
>   - **details** {general: something1, eachFood: [...] } 
>   - **deliveryPrice**
>   - orderTable  
>   - offcode (not required)
>   - deliveryDate  (not required)
>   - address (not required)
> 
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]",
>  "trackingId": 12345678,
>  "offcodeUsed": "[true/false]",
>  "totalPrice": 532000
>  }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs) 
>   >   - 401 (token is not valid) 
>   >   - 500 (server side error)


> ### ```api\sendComment.add.php``` ``POST``
>
> #### Required fields:
>   - **englishName** 
>   - **token**
>   - **trackingId** 
>   - **commentText** 
>   - **orderType** [_inRestaurant / outRestaurant_] 
>   - **prosCons** like: {"pros": ["sth1", "sth2", "sth3"], "cons": ["sth4", "sth5", "sth6"]}
>   - **rate**  between 1 / 10
> 
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]"
>  }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs) 
>   >   - 401 (token is not valid) 
>   >   - 500 (server side error)


> ### ```api\changeUserInfo.modify.php``` ``POST``
>
> #### Required fields:
>   - **token**
>
> #### Each request input effect:
> **name** & **nameChange**  => change name 
>
> **job** & **jobChange**  => change job
>
> **birthday** & **birthdayChange**  => change birthday
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]"
>  }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs) 
>   >   - 401 (token is not valid) 
>   >   - 500 (server side error)


> ### ```api\getOrderByTrackingId.fetch.php``` ``POST``
>
> #### Required fields:
>   - **token**
>   - **englishName**
>   - **trackingId** __[should be list of  tracking ids]__
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]",
>  "data": "{orderDataObject}"
>  }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs) 
>   >   - 401 (token is not valid) 
>   >   - 402 (wrong input values)


> ### ```api\getOpenOrders.fetch.php``` ``POST``
>
> #### Required fields:
>   - **token**
>   - **englishName**
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]",
>  "data": "[]"
>  }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs) 
>   >   - 401 (token is not valid) 
>   >   - 402 (wrong input values)


> ### ```api\getCustomerInfoRestaurant.fetch.php``` ``POST``
>
> #### Required fields:
>   - **token**
>   - **englishName**
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]",
>  "data": "{customerDataObject}"
>  }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs) 
>   >   - 401 (token is not valid) 
>   >   - 500 (server error)


> ### ```api\sendReserveTable.add.php``` ``POST``
>
> #### Required fields:
>   - **token**
>   - **englishName**
>   - **tableName**
>   - **reserveDate**  timestamp
>   - **reserveHours** like: [37,38]  (array of half hour selected)
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]",
>  "data": {
>         "reserveId": "",
>         "reserveDate": "",
>         "tableName": "",
>         "reserveHours": ""
>       }
>  }
>   ```
>   > #####[code] :
>   >   - 200 (successes)
>   >   - 400 (bad inputs) 
>   >   - 401 (token is not valid) 
>   >   - 402 (reserve is duplicate) 
>   >   - 500 (server error)


> ### ```api\getPaymentInfo.fetch.php``` ``POST``
>
> #### Required fields:
>   - **token**
>   - **trackingId**
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]",
>  "data": {  }
>  }
>   ```


> ### ```api\getPaymentInfoByPaymentId.fetch.php``` ``POST``
>
> #### Required fields:
>   - **token**
>   - **paymentId**  a string or can be list of paymentsIds
>   #### Return Values ``JSON``:
>   ```json
>   {
>  "statusCode": "[code]",
>  "data": {  }
>  }
>   ```
