<template>
    <div class="template">
        <!-- 弹层 -->
        <van-popup v-model="departPopup"
            @open="openPopup"            
            :overlay="false"
            :close-on-click-overlay="false" :style="{ width: '100%' ,height: '100%'}">            
            <!--搜索框-->
            <div class="popupTop" ref="popupTop">
                <form action="/">            
                    <van-search v-model="searchValue" 
                        clearable 
                        shape=round
                        background="#1989fa"
                        placeholder="输入科室，Enter搜索"                 
                        @search="onSearch"> 
                    </van-search>
                </form>
            </div>
            <!--搜索结果-->                            
            <div class="popupBody" :style="{height:popupBodyHeight}">
                <!-- 导航条 -->                
                <ol class="breadcrumb" ref="breadcrumb">
                    <li v-for="(item,index) in breadcrumbItems" :key="index" :data-id="item.id" :class="{'active':index===breadcrumbItems.length - 1}" @click="getItem(item)">{{item.name}}</li>
                </ol>                
                <!-- Loading组件 -->  
                <van-loading size="24px" color="#1989fa" vertical v-show="loadingShow">加载中...</van-loading>
                <vue-scroll :ops="ops"> 
                    <div class="child" v-for="(item,index) in list" :key="index">
                        <div class="div1" :title="item.name" :data-id="item.id" :data-type="0"  @click="actionSheetClick">{{item.name}}</div>
                        <div class="div2" v-if="item.children.length !=0"><van-icon name="arrow" :title="item.name" :data-id="item.id" :data-type="1" @click="actionSheetClick" /></div>                        
                    </div>
                </vue-scroll>
            </div>	
            <div class="popupFooter" ref="popupFooter" >
                <div class="cancel" @click="closePopup_cancel">取消</div>
                <div class="confirm" @click="closePopup_ok">确认</div>
            </div>			
        </van-popup> 
    </div>
</template>
<script>
import { getQywxDepInfo,getQywxUserInfo,removeWithoutCopy,searchInArr,tansJsonParams,isBlank } from '@/assets/utils.js'
import axios from 'axios'

export default {
    name: 'searchDepart',
    props: ['showSearchDepartPopup'],//子组件使用props来声明需要从父组件接收的数据。
    data () {
        return {
            ops: {
                sizeStrategy: "percent",                
                detectResize: true, //检测内容尺寸是否发生变化
                vuescroll: {
                    locking : true
                },
                scrollPanel: {
                    //maxHeight: '350', //这是滚动条最大高度,内容高度小于 maxHeight 时高度自适应，超出的话出现滚动条
                    scrollingX: false,  // 是否开启横向滚动
                    scrollingY: true,  //是否开启竖向滚动
                },
                rail: {},
                bar: {
                    hoverStyle: true,
                    onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
                    background: '#bbb', //滚动条颜色
                    opacity: 0.5, //滚动条透明度
                    size:'3px',//bar 的尺寸,默认值: 6px
                }
            },
            curIndex: -1, // 0为默认选择第一个，-1为不选择
            msg: "搜索科室",
            departPopup: this.showSearchDepartPopup,//在组件data内再声明一个局部变量，引用父组件的prop. 但这种局部的变量只接受prop的初值，当父组件prop发生变化时，子组件无法随着父组件的更新而改变
            searchValue:'', 
            list: [
                {
                    "name":"没有找到数据",
                    "id":"0",
                    "children":[],
                    "type":"0" // 0：组织，1：人员
                }
            ],
            breadcrumbItems: [
                {"name":"首页","id":"1","type":"1"},
            ],
            loadingShow: false,            
            select_name: '',
            select_id: '',
            popupBodyHeight:0,
            radio: '',
        }
    },
    /*
    //采用计算属性，父组件的值改变后，子组件的值会随之而改变。但是子组件的数据无法手动修改。
    computed: {
        userPopup: function()  {
            // showSearchUserPopup的值改变userPopup的值也会跟着改变
            return this.showSearchUserPopup
        }
    },
    */
    //使用watch来观察prop的值的变化。发生变化时更新变量的值。
    //子组件的数据即可随着父组件数据的变化而变化，又可以手动改写子组件的数据，且不影响父组件的状态
    watch: {
        // 监听数据showSearchUserPopup的变化
        showSearchDepartPopup: function(){
            //console.log(this.showSearchDepartPopup)
            this.departPopup = this.showSearchDepartPopup;
        }
    },    
    mounted() {
    },
    methods: {
        getItem: function(item) { // 路径导航单击           
            //console.log(item)
            let arr = this.breadcrumbItems;
            // 返回目标元素的索引
            /*
            let res = arr.findIndex((val,index,arr)=>{
                return val === item
            }) 
            console.log(res)*/            
            for(let i in arr) {
                //console.log(arr[i])
                if(arr[i] === item) {
                    //console.log(i)
                    //返回数组指定索引区间的元素（子数组）
                    //slice(startIndex,endIndex)仅能够截取数组中指定区段的元素，并返回这个子数组。该方法包含两个参数，分别指定截取子数组的起始和结束位置的下标。
                    //包含起始位置，不包含结束位置
                    let index = Number(i) + 1;   
                    //console.log(index)    
                    //console.log(arr.slice(0,index))
                    this.breadcrumbItems = arr.slice(0,index);
                    // actionSheet列表增加数据 
                    this.actionSheetAdd(item.id);
                }
            }
        },
        // 搜索功能
        onSearch(val) {            
            //console.log(val);
            let that = this;
            if(isBlank(val)) {
                that.$dialog({ message: "请输入科室后再搜索！" });  
                return;
            }            
            //重置路径导航
            this.breadcrumbItems = [{"name":"首页","id":"1","type":"1"}]; 
            let postData = {
                'name' : val
            };
            axios.post('/api/dailyHealth/qyapi/find/department',postData)
            .then(function (response) {
                //console.log(response);
                var arr = response.data.content;
                that.list = arr;                      
            })
            .catch(function (error) {
                console.log(error);
                //that.$toast.fail(error);
                that.$dialog({ message: error });  
            })
        },
        // 点击列表   
        actionSheetClick: function (e) {
            //console.log(e);
            //console.log(e.target.title); 
            // 获取名字
            let e_name = e.target.title;
            // 获取id （自定义data-id属性的值）
            let e_id = e.target.getAttribute('data-id');
            // 获取type （自定义data-id属性的值）
            let e_type = e.target.getAttribute('data-type');            
            console.log(e_name + '===' + e_id + '===' + e_type);                     
            let item = {
                "name":e_name,
                "id":e_id,
                "type":e_type
            }; 

            // 设置路径导航
            if(e_type ==='0') { //点击了名字，则不添加路径导航                
                if(e_id != -1) {
                    this.$toast('已选择：' + e_name) ;
                    this.select_id = e_id;
                    this.select_name = e_name;
                }                           
            } else if(e_type ==='1') { // 点击向下图标 ，则添加路径导航
                this.breadcrumbItems.push(item);                
                // actionSheet列表增加数据 
                this.actionSheetAdd(e_id);
            }          
        },
        actionSheetAdd(param_id) {        
            this.loadingShow = true;   
            this.list = [];
            // 用了async声明方法返回的就是promise对象，promise对象的值PromiseResult获取只能通过.then()方法获取
            let resultDepData = getQywxDepInfo(param_id);//[{},{}] //返回的是depid的子组织
            console.log(resultDepData)
            resultDepData.then((result) => {
                let tree = result;   
                if(tree.length !== 0) { // 判断是否有结果集                            
                    for(var i in tree) {
                        if(typeof tree[i] == 'object'){
                            let id = tree[i].depid;
                            let name = tree[i].depname;    
                            let children = tree[i].children;                    
                            this.list.push({'id':id,'name':name,'type':'0','children':children});
                        }
                    }
                } else {
                    this.list.push({'id':"-1",'name':"没找到数据",'type':'-1','children':[]});                     
                }
                this.loadingShow = false;                          
            })                         
        },               
        // 打开弹层时触发
        openPopup: function() {
            let that = this;
            this.$nextTick(() => {
                let docH = document.documentElement.clientHeight;  
                let topH = this.$refs.popupTop.getBoundingClientRect().height;
                let breadcrumbH = this.$refs.breadcrumb.getBoundingClientRect().height;
                let bottomH = this.$refs.popupFooter.getBoundingClientRect().height;                       
                that.popupBodyHeight = (docH - topH - breadcrumbH - bottomH) + 'px'
                //console.log(docH)
                //console.log(that.popupBodyHeight)
            });            
            // 加载企业微信部门/人员
            that.actionSheetAdd('1');                     
        },
        // 关闭弹层时触发        
        closePopup_cancel: function() {
            this.closePopup('0') 
        },
        closePopup_ok: function() {                
            this.closePopup('1') 
        },
        closePopup(param) {
            // 重置表单
            // this.$refs.searchForm.searchValue='';//这是父组件重置子组件表单的方法
            this.searchValue = '';            
            // 向父组件传值
            if(param ==='1') {// 确定
                let child_obj_ok = {                    
                    'depId': this.select_id,
                    'depName': this.select_name,
                    'isShowSearchDepartPopup':false
                }
                this.$emit('departInfo',child_obj_ok);
            }else { // 取消
                let child_obj_cancel = {                
                    'depId': '',
                    'depName': '',
                    'isShowSearchDepartPopup':false
                }
                this.$emit('departInfo',child_obj_cancel);
            }
                
            //重置路径导航
            this.breadcrumbItems = [{"name":"首页","id":"1","type":"1"}]; 
            //重置actionSheet  
            this.list = []; 
        }
    },
}
</script>
<style scoped>
.template {    
    width: 100%;
    height: 100%;   
}
.popupTop {
    background-color: #fff;
    height:53px;
    border-bottom:1px solid red;
}
.popupBody {
    background-color: #fff;
    border-top:1px solid #bbb;
}
.popupBody .child {        
    width: 100%;    
    border-bottom: 1px solid #f2f2f2;
    text-align: left;    
    padding: 8px 0px;
    color:#646566;
    cursor: pointer;
    background-color: #fff;   
    display: -webkit-flex; /* Safari */
    display: flex;   
    justify-content: space-between;
}
.popupBody .child .div1 {  
    padding-left:15px;
}
.popupBody .child .div2 {  
    padding-right:15px;
}
.popupFooter {
    text-align:center;    
    height: 45px;
    line-height: 45px;    
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute; 
    width: 100%;
    clear:both; 
    cursor: pointer;
    display: -webkit-flex; /* Safari */
    display: flex;
}
.popupFooter  .cancel {
    width:50%;
    background-color: #f2f2f2;
    color: #777;
}
.popupFooter .confirm {     
    width:50%;
    background-color: #1989fa;
    color: #fff;
}
.selectedResult {
    color: red;    
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
    text-align: center;    
    padding: 10px 0px;
}
.noselectedResult {
    color: #666;
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
    text-align: center;    
    padding: 10px 0px;
}
.breadcrumb {
    text-align: left;
    padding-left: 15px;
    list-style: none;
    background-color: #f5f5f5;
    border-radius: 4px;
    color: #1989fa;
    cursor: pointer;
    height: 25px;
    line-height: 25px;
}
.breadcrumb >.active {
    color: #777;
}
.breadcrumb > li {
    display: inline-block;
    padding-right:5px;
}
.breadcrumb > li+li:before {
    padding: 0 5px;
    color: #ccc;
    content: "/\00a0";
}



</style>