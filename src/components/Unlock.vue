<template>
  <div class="container">
    <!-- loading特效 -->
    <div v-show="loadingShow" class="loading">
      <van-loading type="spinner" size="36px" color="#1989fa">加载中...</van-loading>
    </div>
    <!-- 功能说明 -->
    <van-notice-bar
      wrapable
      :scrollable="false"
      text="当打卡出现提交次数太频繁的情况时，可通过此功能自行解除锁定限制。既可以自我解锁，也可以替他人解锁"
    />
    <van-cell-group>
      <!-- 
      <van-cell center border :value="uname" :uid="uid" value-class="vclass" icon="friends-o">
        <template #icon>
          <van-image
            round            
            width="35"
            height="35"
            src="http://wework.qpic.cn/bizmail/mVD0sSuK34ibO9RJ0LCvbvFgZp5MicMFQjEVxmE9wyMWbUHhNcRjlib2Q/0"
          />
        </template>
        <template #extra>
        <van-button type="primary" @click="lock">解锁</van-button>
      </template>
      </van-cell>
      -->

      <van-cell v-for="item in list" :key="item.uid" :value="item.uname" value-class="vclass" center border  icon="friends-o">
        <template #icon>
          <van-image
            round            
            width="55"
            height="55"
            :src="item.avatar"
          />
        </template>
        <template #extra>
          <van-button type="primary" @click="lock(item.uid)">解锁</van-button>
        </template>
      </van-cell> 
    </van-cell-group>
    <!-- 空数据 -->
    <van-empty description="目前没有待解锁数据" v-show="nodata" />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name : 'unlock',
  data () {
    return {
      msg: '解除锁定',
      loadingShow: true,
      nodata : false,      
      list:[
        {
          "uid":"lfei",
          "uname":"周晓月",
          "avatar":"http://wework.qpic.cn/bizmail/mVD0sSuK34ibO9RJ0LCvbvFgZp5MicMFQjEVxmE9wyMWbUHhNcRjlib2Q/0"
        },
        {
          "uid":"liurs",
          "uname":"柳如是",
          "avatar":"http://wework.qpic.cn/bizmail/mVD0sSuK34ibO9RJ0LCvbvFgZp5MicMFQjEVxmE9wyMWbUHhNcRjlib2Q/0"
        },
        {
          "uid":"lqq",
          "uname":"李清清",
          "avatar":"http://wework.qpic.cn/bizmail/mVD0sSuK34ibO9RJ0LCvbvFgZp5MicMFQjEVxmE9wyMWbUHhNcRjlib2Q/0"
        },
        {
          "uid":"wxw",
          "uname":"王小婉",
          "avatar":"http://wework.qpic.cn/bizmail/mVD0sSuK34ibO9RJ0LCvbvFgZp5MicMFQjEVxmE9wyMWbUHhNcRjlib2Q/0"
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
    // 加载锁定的数据
    let postData = {
      'time' : new Date()
    }
    axios.post('/api/dailyHealth/getRedisList',postData)
      .then(function (response) {
        // console.log(response);
        let resultData = response.data;//[{'data':[]}]
        console.log(resultData);
        // 遍历数组
        $.each(resultData,function(index,value){
          //console.log(value);
          if(value.data.length >0){// 数组对象不为空            
            that.list = value.data; 
            that.loadingShow = false;  // 关闭loading特效
          }else {
            that.list = [];
            that.nodata = true;
            that.loadingShow = false;  // 关闭loading特效
          } 
        })              
      })
      .catch(function (error) {
        // 隐藏loadding
        that.loadingShow = false;   
        // 覆盖默认的演示数据
        that.list = [];     
        //that.$toast.fail('Request failed with status code 404');
        that.$dialog.alert({
          message: 'Request failed with status code 404',
          theme: 'round-button',
        }).then(() => {
          // on close
          that.nodata = true;
        });
      })
  },
  methods: {
    lock: function(param) {      
      // console.log(param);      
      let that = this;
      //this.$toast.success(param);  
      //异步请求数据   
      let postData = {
        'uid':param
      }
      axios.post('/api/dailyHealth/unlockSubmit',postData)
      .then(function (response) {
        console.log(response);
        let msg = response.data.msg;
        that.$toast.success(msg);       
      })
      .catch(function (error) {
        //console.log(error);
        that.$dialog.alert({
          message: 'Request failed with status code 404',
          theme: 'round-button',
        }).then(() => {
          // on close
          // that.nodata = true;
        });
      })
    }
  }
}
</script>
<style scoped>
.vclass {
    color:#646566; 
}
.van-cell__value--alone {    
    padding-left: 10px;
}
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
</style>