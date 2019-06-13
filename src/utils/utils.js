let util = {

};

/**
 * @ 获取cookie方法；
 * @params key需要获取的键值；
*/
util.getCookie = function (key) {
    var cookieArr = document.cookie.split(';');
    for(var i = 0; i < cookieArr.length; i++) {
        var arr = cookieArr[i].split('=');
        if(arr[0].trim() === key) {
            return arr[1];
        }
    }
    return false;
}

util.setCookie = function(key, value, iDay) {
    if (iDay > 0) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + iDay);
        // Cookie 的expires 属性指定浏览器可发送Cookie 的有效期。当省略expires 属性时，Cookie仅在浏览器关闭之前有效。
        document.cookie = key + '=' + value + ';expires=' + oDate + ';path=/';
    } else {
        document.cookie = key + '=' + value + ';path=/';
    }
}
util.deleteCookie =function(name) {
    util.setCookie(name, "", -1);
}

//判断是否是数字
util.isNumber = function(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}
util.changeDateFormat = function(date,sign,type,status){
    if(!date || date == "null" || date == "") return ""
    sign ? "" : sign = "-"
    date = typeof date != 'object' ? new Date(date) : date
    let year = date.getFullYear(),
        month = parseInt(date.getMonth() + 1) > 9 ? date.getMonth() + 1 : "0" + "" + (date.getMonth() + 1),
        day = parseInt(date.getDate()) > 9 ? date.getDate() : "0" + "" + date.getDate(),
        hours = parseInt(date.getHours()) > 9 ? date.getHours() : "0" + "" + date.getHours(),
        minutes = parseInt(date.getMinutes()) > 9 ? date.getMinutes() : "0" + "" + date.getMinutes();
    if(status == 'minutes'){
        return `${year}${sign}${month}${sign}${day} ${hours}:${minutes}`
    }
    if(type == 'number'){
        return parseInt(`${year}${month}${day}`)
    } else {
        return `${year}${sign}${month}${sign}${day}`
    }
}
util.changeDate = function(date) {
    if(!date) return 0
    let _date = typeof date != "object" ? new Date(date) : date
  return parseInt(new Date(_date.getFullYear(), _date.getMonth(), _date.getDate(), 0, 0, 0, 0 ).getTime());
},
util.getScrollBarSize = function () {
    let cached = 0
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        document.body.removeChild(outer);

        cached = widthContained - widthScroll;
    return navigator.userAgent.indexOf("Mac OS X") >= 0 ? 0 : cached;
}
util.IEVersion = function() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 7) {
                return 7;
            } else if(fIEVersion == 8) {
                return 8;
            } else if(fIEVersion == 9) {
                return 9;
            } else if(fIEVersion == 10) {
                return 10;
            } else {
                return 6;//IE版本<=7
            }   
        } else if(isEdge) {
            return 'edge';//edge
        } else if(isIE11) {
            return 11; //IE11  
        }else{
            return -1;//不是ie浏览器
        }
    }
export function Debounce(fn, delay) {
    this.timeout = 0;
    this.fn = fn;
    this.delay = delay;

    this.stop = function() {
        clearTimeout(this.timeout);
    }

    this.run = function(excutor, delay) {
        this.stop();
        var fn = excutor || this.fn;
        var delayTime = delay || this.delay;
        this.timeout = setTimeout(function() {
            fn();
        },
        delayTime);
    }
}

export default util;
