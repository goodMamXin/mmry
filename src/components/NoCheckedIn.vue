<template>
  <div class="container">
    <!-- loading特效 -->
    <div v-show="loadingShow" class="loading">
      <van-loading type="spinner" size="36px" color="#1989fa">加载中...</van-loading>
    </div>    
    <van-cell-group>
      <!-- 功能说明 -->
      <van-notice-bar left-icon="volume-o" >
        <template #default>
          <span>当天没打卡人员</span>
          <span :value="department_id"></span>
        </template>
        <template #right-icon>
          <div class="search" @click="checkFunc">
          <van-icon name="search" />查询
          </div>
        </template>
      </van-notice-bar>
      <!-- 选择打卡日期" -->
      <van-cell title="选择打卡日期" :value="calendarDate" @click="calendarShow = true" is-link/>
      <van-calendar v-model="calendarShow" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>
      <!-- 选择打卡科室 -->
      <van-cell is-link title="选择打卡科室" :value="actionName" @click="actionSheetShow = true" />
      <van-action-sheet v-model="actionSheetShow"  :actions="actions" @select="onSelect" 
        @cancel="onCancel" @opened="openedSheet" cancel-text="关闭">
        <!-- 自定义描述文案-->
        <template #description>
          <span @click="getNodeTree">返回</span>
        </template>
        <!-- 自定义描述文案-->
        <template #default>
          <div class="options" :class="item.depid == clickId ? 'selected' : 'selectedNot' " v-for="item in actionslist" :key="item.depid" @click="optionClick(item.depid , item.depname)">
            <span>{{item.depname}}</span>
            <van-icon name="success" v-show="item.depid == clickId" />
          </div>          
        </template>
      </van-action-sheet>      
      <!-- 未打卡数据 -->
      <van-cell v-for="item in list" :key="item.uid"  :value="item.depname" value-class="vclass" center border>
        <template #title>
          <span class="custom-title">{{item.name}}</span>
          <van-tag type="danger">未打卡</van-tag>
        </template>
      </van-cell> 
    </van-cell-group>
    <!-- 空数据 -->
    <van-empty description="无数据" v-show="nodata" />
  </div>
</template>

<script>
import {getCurrentDateTime} from '../js/default'//记得带上{}花括号
import treeJson from '../js/organization.json';
import axios from 'axios'
export default {
  name : 'noCheckedIn',
  data () {
    return {
      msg: '今天未打卡',
      department_id:'',
      clickId:'',
      loadingShow: true,
      nodata : false,  
      calendarDate: '',// 日历日期
      calendarShow: false, // 日历是否显示  
      minDate:new Date(2021, 9, 1),//可选的最小日期
      maxDate:new Date(),//可选的最大日期
      //maxDate:this.operateDate(1,'-'),
      actions: [],
      actionSheetShow: false,
      actionName: '',
      actionslist:[{depname:"李清照",depid:"123"},{depname:"上官婉",depid:"125"},{depname:"慕容雪",depid:"126"}],//自定义actions数据
      dataTree:[],
      current_tree: [],
      list:[
        {
          "uid":"lrs",
          "name":"柳如是",
          "depname":"测试部"
        },
        {
          "uid":"mxl",
          "name":"马湘兰",
          "depname":"测试部"
        },
        {
          "uid":"cyy",
          "name":"陈圆圆",
          "depname":"测试部"
        },
        {
          "uid":"lxj",
          "name":"李香君",
          "depname":"测试部"
        },
        {
          "uid":"dxw",
          "name":"董小宛",
          "depname":"测试部"
        },
        {
          "uid":"byj",
          "name":"卞玉京",
          "depname":"测试部"
        },
      ]
    }
  },
  created() {//在模板渲染成html前调用
    //设置背景色为白色
    $(document.body).css('background-color','#f7f8fa');
  },
  mounted(){
    let that = this;
    that.list = [];
    let date = getCurrentDateTime('yyyyMMdd');
    that.calendarDate = date;
    //that.loadingData(date);
    that.loadingShow = false;  // 关闭loading特效 
    that.dataTree = treeJson.menu;
    //读取树结构
    //let dataTree = treeJson.menu;
    //console.log(dataTree);    
    //this.getNodeTree(dataTree);     
  },
  methods: {    
    loadingData: function(depid,date) {      
      // console.log(date);
      this.loadingShow = true;
      this.list = [];
      let that = this;
      // 查询参数
      let postData = {
        'depid': depid,// depid = 82 办公室
        'date': date
      }
      this.$axios.post('/api/dailyHealth/noCheckedInUsers',postData)
        .then(function (response) {
          //console.log(response);
          that.list = response.data; //[{'data':[]}]
          console.log(that.list);
          if(response.data.length == 0){
            that.nodata = true;
          }else{
            that.nodata = false;
          }
          that.loadingShow = false;  // 关闭loading特效              
        })
        .catch(function (error) {
          console.log(error)
          // 隐藏loadding
          that.loadingShow = false; 
          that.nodata = true;
          //that.$toast.fail('Request failed with status code 502');
          that.$dialog.alert({
            message: 'Request failed with status code 502',
            theme: 'round-button',
          }).then(() => {
            // on close
            that.nodata = true;
          });
        })    
    },
    formatDate(date) {      
      let yy = date.getFullYear();
      let mm = date.getMonth()+1 < 10? '0' + (date.getMonth() + 1): date.getMonth() + 1;
      let dd = date.getDate()< 10? '0' + date.getDate() : date.getDate();
      let time = yy+'-'+mm+'-'+dd ;
      console.log(time);
      return time;
      //return `${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      //console.log(date);
      this.calendarShow = false;
      this.calendarDate = this.formatDate(date);
      //this.loadingData('82',this.calendarDate);
    },
    // 加载组织架构（测试本地JSON）
    getOrganization(depid) {
      //console.log(depid);
      let param_post = {
        depId: '1'
      }
      this.$axios.get('../js/organization.json', {
        params: {
          depId: '1'
        }
      })
      .then(function (res) {
        console.log(res)
      }).catch(function (error) {
        console.log(error);
      });
    },
    openedSheet() {
      //this.getOrganization('1');
      this.actions = [];
      this.actionslist = [];
      //this.current_tree = this.dataTree;//[{}]
      //console.log(this.current_tree);
      this.getNodeTree();        
    },
    onSelect(item) {  //选项点击      
      //console.log(item);      
      this.actionName = item.name;
      this.$toast('已选 ' + item.name);
      let searchName = item.name;
      //筛选      
      let tree = this.dataTree;  
      this.searchJson(tree,searchName);
      /*
      //筛选 
      var an = tree.filter((item) => {
        console.log(item)
        return item.name == searchName;
      });     
      console.log(an)      
      var res = $.grep(tree,function(obj,index){
        console.log(obj);
      });*/
    },
    optionClick(depid,depname) {
      console.log(depid)
      this.clickId = depid;   
      this.department_id = depid;   
      //this.$toast(depid + depname);
      //筛选      
      let tree = this.dataTree;  
      let searchName = depname;
      this.actionName = depname;
      this.searchJson(tree,searchName);
    },
    getNodeTree(){
      let tree = this.dataTree;
      for(var i in tree){        
        if(typeof tree[i] == 'object'){
          //console.log(tree[i])
          //console.log(tree[i].children);          
          //this.actions = [];
          this.actionslist = [];
          let data = tree[i].children;//[{},{}]
          for(var k in data) { //得到单个{}            
            //this.actions.push({'name':data[k].name});
            this.actionslist.push({'depid':data[k].id,'depname':data[k].name});
          }
        }
      }
    },
    searchJson(data,searchName){//传入参数：需要遍历的json，需要匹配的searchName
      //console.log('传入 = '+ data) //传入的data
      //console.log(searchName)
      /*
      https://blog.csdn.net/weixin_49510145/article/details/120769924
      https://blog.csdn.net/weixin_42392277/article/details/97929428
      https://blog.csdn.net/weixin_44968614/article/details/108624503
      https://www.jb51.net/article/173841.htm
      https://blog.csdn.net/chaos_hf/article/details/80150911
      https://segmentfault.com/a/1190000020058194
      */
      
      //非递归
      var stark = [];
      stark = stark.concat(data);
      while(stark.length) {
        var temp = stark.shift();
        if(temp.children) {
          stark = temp.children.concat(stark);
        }
        if(searchName === temp.name) {
          //console.log(temp);
          if(temp.children && temp.children.length !== 0) {
            //this.actions = []; 
            this.actionslist = [];
            //遍历子节点
            let item = temp.children;
            for(var i in item) {
              //console.log(item[i].name)
              this.actionslist.push({'depid':item[i].id,'depname':item[i].name});
            }
          }
          return temp;
        } 
        //console.log(temp);
      }      
    },
    onCancel(item) {
      //console.log(item);
      //this.$toast('取消');
    },   
    checkFunc() {
      let depid = (this.department_id).toString();
      let date = this.calendarDate;
      if(depid == ''){
        this.$toast("请选择打卡科室");
        return;
      }else if(date == ''){
        this.$toast("请选择打卡日期");
        return;
      }  
      //this.$toast(depid + " --- " + date);
      this.loadingData(depid,date);    
    },
    operateDate(days,types) { //处理日期加减
      var date = new Date();
      // 日期加减
      if(types === '+') {
        date.setDate(date.getDate() + days );
      } else if(types === '-') {
        date.setDate(date.getDate() - days );
      } else {
        date = new Date();
      }  
      return date;
    },
  }
}
</script>
<style scoped>
.vclass {
  color:#646566; 
}
.van-cell__title {    
  text-align: left;
}
.van-action-sheet__description {
  cursor: pointer;
}
.van-action-sheet__header {    
  color: #797979;
  cursor: pointer;
}
/* .van-action-sheet__cancel {    
    color: #fff;
    background-color: #ee0a24;
    border: 0.026667rem solid #ee0a24;
} */
.loading {  
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;    
  /* background-color: rgba(0, 0, 0, 0.7); */
  background-color:#fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.options {
  padding:10px 0px;
  width:100%;
  display:inline-block;
  border-bottom:1px solid #f2f2f2;
  color: #323233;
  cursor: pointer;
  font-size: 16px;
}
.selected {
  color: #ff6700;
}
.selectedNo {
  color: #323233;
}
.search {
  color: #fff;
  background-color: #07c160;
  border: 0.026667rem solid #07c160;  
  padding:5px 15px;
  border-radius: 4px;
  cursor: pointer;
}
</style>