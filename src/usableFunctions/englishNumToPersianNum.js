export var
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
    englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g],
    persianNumbersUnfix = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
    fixNumbers = function (str) {
        if(typeof str === 'string') {
            for(let i=0; i<10; i++) {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
    },
    unfixNumber = function (str) {
        if(typeof str === 'string') {
            for(let i=0; i<10; i++) {
                str = str.replace(englishNumbers[i], persianNumbersUnfix[i]);
            }
        }
        return str;
    };


