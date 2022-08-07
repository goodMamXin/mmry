// 引入axios
import axios from "axios";
//引用jquery库
//import $ from 'jquery'
//Toast 轻提示：在页面中间弹出黑色半透明提示，用于消息通知、加载提示、操作结果提示等场景。
//引入 Toast 组件后，会自动在 Vue 的 prototype 上挂载 $toast 方法，便于在组件内调用。例如：this.$toast('提示文案');
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { Icon } from 'vant';


/**
 * 作用：根据部门id返回其下属组织
 * 如果部门id不存在或找不到数据，则返回空数组对象
 * async /await方法实现同步调用
 * */ 
async function getQywxDepInfo(depId){
    let param_depId = "";    
    // 参数是否为空
    if(isBlank(depId)) {        
        param_depId = "1";
    } else {        
        param_depId = depId;
    }
    //console.log(param_depId)
    // 封装参数    
    let postData = {        
        'depId' : param_depId,
        'depName' : ''
    };    

    //console.log(tansJsonParams(postData));
    //JSON.stringify 方法将某个对象转换成 JSON 字符串形式
    //console.log(JSON.stringify(postData));   
    let dataTree = [];
    let actions = [];// 返回的结果集合
    await axios({
        method:'post',
        url:'/api/dailyHealth/getOrganization',
        data:tansJsonParams(postData)
    }).then((response) =>{
        //console.log(response)
        dataTree = response.data.menu; 
        //console.log(dataTree)               
        for(var i in dataTree) {  //遍历数组对象 
            //console.log(dataTree[i])  //单个map对象
            if(typeof dataTree[i] == 'object') { // 如果dataTree[i]是对象
                if(dataTree[i].children && dataTree[i].children.length !== 0) {
                    let children_data = dataTree[i].children;// 取map对象的children               
                    for(var k in children_data) { //遍历children 
                        actions.push({'depid':children_data[k].id,'depname':children_data[k].name,'parentid':children_data[k].parentid,'children':children_data[k].children});
                    }
                }                
            }
        } 
    }).catch((error) => {
        //console.log(error)       //请求失败返回的数据
        //Toast.success('数据加载完成');
        //Toast.fail('数据加载失败');
        Dialog({ message: error });  
    })    
    return actions
}

/**
 * 作用：根据部门id返回该部门的人员名单
 * 如果部门id不存在或找不到数据，则返回空数组对象
 * 
 * */ 
 async function getQywxUserInfo(depId){
    let param_depId = "";    
    // 参数是否为空
    if(isBlank(depId)) {        
        param_depId = "1";
    } else {        
        param_depId = depId;
    }
    
    // 封装参数    
    let postData = {        
        'depId' : param_depId,
        'depName' : ''
    };    

    //console.log(tansJsonParams(postData));
    //JSON.stringify 方法将某个对象转换成 JSON 字符串形式
    //console.log(JSON.stringify(postData));   
    let dataTree = [];
    let actions = [];// 返回的结果集合
    await axios({
        method:'post',
        url:'/api/dailyHealth/qyapi/cgi-bin/user/simplelist',
        data:postData
    }).then((response) =>{
        //console.log(response)       //请求成功返回的数据
        dataTree = response.data.content;                      
        for(var i in dataTree) {  //遍历数组对象 
            // console.log(dataTree[i])  //单个map对象
            if(typeof dataTree[i] == 'object') { // 如果dataTree[i]是对象
                let item = {
                    "id":dataTree[i].userid,
                    "name":dataTree[i].name
                } 
                actions.push(item)  
            }
        } 
    }).catch((error) => {
        // 请求失败返回的数据        
        Dialog({ message: error });        
    })    
    return actions
}

//是否为空字符串，全空格也是空字符串 @param str 
function isBlank(str){  
    if(str == null || typeof str == "undefined" || str == "" || trim(str) == ""){  
        return true;  
    }  
    return false;  
}   
//去掉字符串头尾空格 @param str 传入的字符串值
function trim(str) {
    if(str == null || typeof str == "undefined"){  
        return "";  
    }  
    return str.toString().replace(/(^\s*)|(\s*$)/g, "");    
}
//是否为Null @param object  
function isNull(object){  
    if(object == null || typeof object == "undefined"){  
        return true;  
    }  
    return false;  
}

/**
 * 作用：把json格式字符串转为&key1=value1&key2=value2
 * @param {*} params  参数json格式
 * @return &key1=value1&key2=value2
 */
function tansJsonParams(params) {
    let result = ''
    if(params===undefined) return result;
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        let part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        let subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}

/**
 * 循环遍历，判断如果等于item的话，就删除掉本身。同时i–,在for循环i++就会跑到之前的位置.，因为之前的数组整体都会往左移动一位.
 * @param {*} arr 
 * @param {*} item 
 * @returns 
 */
function removeWithoutCopy(arr, item) {
    for(var i=0;i<arr.length;i++) {           
        if(arr[i]==item) {                
            arr.splice(i,1);
            i--;
        }
    }
    return arr;
}

// 对比两个对象的值是否完全相等 返回值 true/false
function isObjectValueEqual (a, b) {   
    //取对象a和b的属性名
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    //判断属性名的length是否一致
    if (aProps.length != bProps.length) {
        return false;
    }
    //循环取出属性名，再判断属性值是否一致
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}

//某一元素在数组中的索引
function searchInArr(arr,dst){
    var i = arr.length;
    while(i-=1){
        if (arr[i] == dst){
           return i;
        }
    }
    return false;
}
//使用方法：
//var a=[1,2,3,4];
//searchInArr(a,3);//返回2

// 导出函数
export {getQywxDepInfo,getQywxUserInfo,isBlank,trim,isNull,tansJsonParams,removeWithoutCopy,isObjectValueEqual,searchInArr}