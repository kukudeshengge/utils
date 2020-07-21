/**
 * 公用方法
 */
import React from 'react';
function isEmpty(value) {
    return (
        value === null || value === undefined || value.toString().trim() === ''
    );
}
//日期格式转化
function formatDate  (date) {
    if(isEmpty(date)){
        return;
    }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};
//日期格式转化--时分秒 第一次进来默认时分秒00000
function formatDatesfmSta  (date) {
    if(isEmpty(date)){
        return;
    }
    formatDate(date)
    let formatFMDDate=formatDate(date);
    return formatFMDDate+' '+'00' + ':' + '00' + ':' + '00';
};
function formatDatesfmEnd  (date) {
    if(isEmpty(date)){
        return;
    }
    formatDate(date)
    let formatFMDDate=formatDate(date);
    return formatFMDDate+' '+'23' + ':' + '59' + ':' + '59';
};
//日期格式转化
function formatHMSDate  (date) {
    if(isEmpty(date)){
        return;
    }
    formatDate(date)
    var y = date.getHours();
    var m = date.getMinutes() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getSeconds();
    d = d < 10 ? ('0' + d) : d;
    let formatFMDDate=formatDate(date);
    return formatFMDDate+' '+y + ':' + m + ':' + d;
};
//手机判断
function mobileValidate(mobile) {
    return /^1[3456789][0-9]{9}$/.test(mobile);
};

function isEmile(email){
    if(email != "") {
       let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        let isok= reg.test(email );
        return isok;
    };
}

//是否JSON格式 true:为json格式
function isJson(obj){
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}
function isPecial(obj) {
    var ispecial=obj.replace(/[\[|\]|\{|\}]/g,"");
    return ispecial;
}
function checkURL(URL){
    var str=URL;
//判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
//下面的代码中应用了转义字符"\"输出一个字符"/"
    var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp=new RegExp(Expression);
    if(objExp.test(str)==true){
        return true;
    }else{
        return false;
    }
}
function pageFun(total) {
    let page=1;
    if(parseInt(parseInt(total)/10)!=0){
        page=parseInt(parseInt(total)/10);
    }
    return page;
}
function cookieValue(strcookie,name) {
    let arrcookie = strcookie.split("; ");//分割
//遍历匹配
    for ( let i = 0; i < arrcookie.length; i++) {
        let arr = arrcookie[i].split("=");
        if (arr[0] == name){
            return arr[1];
        }
    }
    return "";
}
export default {
    isEmpty,
    formatDate,
    formatHMSDate,
    formatDatesfmSta,
    formatDatesfmEnd,
    mobileValidate,
    isJson,
    isPecial,
    checkURL,
    pageFun,
    cookieValue,
    isEmile
}
