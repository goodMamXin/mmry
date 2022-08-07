<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!--
    <div class="nav_router">
      <router-link :to="{path:'/msginfo',query:{id:this.id,uid:this.uid}}">打卡详情阅览</router-link>
      <router-link :to="{path:'/updepinfo',query:{id:this.id,uid:this.uid}}">更新用户信息</router-link>      
    </div>  
    -->
    <div class="viewcontent">        
        <router-view></router-view>   
    </div>  
    <div class="viewbottom">
        <van-tabbar route>
          <van-tabbar-item replace :to="{path:'/msginfo',query:{id:this.id,uid:this.uid}}" icon="orders-o">打卡详情</van-tabbar-item>
          <van-tabbar-item replace :to="{path:'/updepinfo',query:{id:this.id,uid:this.uid}}" icon="records" v-show="isAdmin">打卡调科</van-tabbar-item>
          <van-tabbar-item replace :to="{path:'/unlock',query:{id:this.id,uid:this.uid}}" icon="user-circle-o">解除锁定</van-tabbar-item>
          <van-tabbar-item replace :to="{path:'/noCheckedIn',query:{id:this.id,uid:this.uid}}" icon="volume-o">未打卡人员</van-tabbar-item>
        </van-tabbar>
    </div>
  </div>
</template>

<script>

//import axios from 'axios'


export default {
  name: 'App',
  //components: { Msginfo,Updepinfo },
  data () {
		return {
      id: "",
      uid: "",
      isAdmin: false
    }
  },
  // 计算属性
  computed: {
    
  },
  //在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  created() {   
    
  },
  //在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
  mounted() {
    //根据参数值控制dom显示或隐藏
    //if(param_type.indexOf("updepinfo") >= 0 ) { //判断字符串中是否包含特定字符
      //console.log('参数type中包含updepinfo字符串'); 
      //$('.nav_router').hide();//反之.show()
      //$(body).css('background-color','#fff');
    //}
    //获取methods里面的方法需使用let
    let that = this;    
    that.id = that.getUrlKey("id");
    that.uid = that.getUrlKey("uid");
    //console.log("that.id = " + that.id);
    //console.log("that.uid = " + that.uid);    
    //console.log("that.uid = " + that.GetQueryString("uid"));
    //定义可以显示底部导航菜单的用户组
    const showNameArray = ["lfei","LF2588","FuLiu","2057","ChaoTong"];    
    if(!that.isBlank(that.uid)){
      //判断数组里面是否包含某个元素,如果不包含在数组中,则返回 -1;
      const indexThis = $.inArray(that.uid, showNameArray);      
      if(indexThis >= 0) {     
        //显示底部导航菜单
        //$('.nav_router').show();      
        //$('.viewbottom').show();
        that.isAdmin = true;
      }else{
        //隐藏底部导航菜单
        //$('.nav_router').hide();
        //$('.viewbottom').hide();
        that.isAdmin = false;
        $(document.body).css('padding','0px');
      }
    }else{
      //alert('uid不能为空')
    }
  },
  methods: {
    //获取地址栏参数，name:参数名称。地址形式：...?name=xxx&id=xxxx;    
    getUrlKey: function (name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
    },
    GetQueryString:function(name) {    
      var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
      //window.location.href　//设置或获取整个 URL 为字符串
      //window.location.hash　//设置或获取 href 属性中在井号“#”后面的分段
      //window.location.port　//设置或获取与 URL 关联的端口号码
      //window.location.protocol　//设置或获取 URL 的协议部分
      //window.location.host　//设置或获取 location 或 URL 的 hostname 和 port 号码
      //window.location.hostname　//设置或获取 location 或 URL 的 hostname 和 port 号码
      //window.location.search　//设置或获取 href 属性中跟在问号后面的部分
      //window.location　//属性 描述 hash 设置或获取 href 属性中在井号“#”后面的分段
      var result = window.location.hash.split('?')[1].match(reg);
      return result?decodeURIComponent(result[2]):null;
		},
    //是否为空字符串，全空格也是空字符串 @param str 
    isBlank(str){  
      if(str == null || typeof str == "undefined" ||   
              str == "" || this.trim(str) == ""){  
          return true;  
      }  
      return false;  
  	},    
    //去掉字符串头尾空格 @param str 传入的字符串值
    trim(str) {
      if(str == null || typeof str == "undefined"){  
        return "";  
      }  
      return str.toString().replace(/(^\s*)|(\s*$)/g, "");    
    },
    //是否为Null @param object  
    isNull(object){  
      if(object == null || typeof object == "undefined"){  
          return true;  
      }  
      return false;  
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {			
  margin:0;
  padding-bottom:50px;/*body要空出底部固定条的高度，不然最后的元素会被遮挡*/
}
.nav_router {  
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 10px rgb(0 0 0 / 5%);
  z-index: 100;  
  width:100%;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;

}
.nav_router a {
  text-decoration: none;    
  padding:0px 15px;
}
.router-link-active {  
  color:#ed5736;
}
.viewcontent {
  width:100%;
  /*
  top: 48px;
  position: relative;*/
}
.van-tabbar-item--active {
    color: #ed5736;
}
.van-tabbar-item {
  font-size: 14px;
}
</style>
