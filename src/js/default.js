/**
 * https://www.cnblogs.com/qiu-Ann/p/7463484.html
 * https://blog.csdn.net/linggty/article/details/90037743
 */
//常量的定义
export const defaultConfig = {
    baseurl:'xxx'
}  
// 获取当前时间

export function getCurrentDateTime(type) {
    let yy = new Date().getFullYear();
    let mm = new Date().getMonth()+1 < 10? '0' + (new Date().getMonth() + 1): new Date().getMonth() + 1;
    let dd = new Date().getDate()< 10? '0' + new Date().getDate(): new Date().getDate();
    let hh = new Date().getHours()< 10? '0' + new Date().getHours(): new Date().getHours();
    let mf = new Date().getMinutes()<10? '0' + new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds()<10? '0' + new Date().getSeconds() : new Date().getSeconds();
    let time = '';
    if(type == 'yyyyMMdd'){
        time = yy+'-'+mm+'-'+dd;
    }else{
        time = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    }
    //let time = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    //console.log(time)
    return time
}