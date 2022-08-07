<template>
  <div class="updepinfo">
    <van-form @submit="onSubmit">
      <!-- 用户信息-->      
      <van-cell value="把用户：" :style="{'background-color':'#F2F2F2'}" />
      <van-field v-model="reporter" name="reporter"   
        label-align="left" label="姓名" placeholder="企业微信用户姓名" 
        :rules="[{ required: true, message: '不能为空' }]">
        <template #button>
          <van-button size="small" type="primary" native-type="button" @click="openSearchUserPopup">选取</van-button>
          <search-user @userInfo="fromSearchUser" ref="searchForm" :showSearchUserPopup="isShowSearchUserPopup"></search-user> 
        </template>
      </van-field>
      <van-field v-model="uid" name="uid" label-align="left" readonly center clearable label="用户ID" placeholder="企业微信用户id" :rules="[{ required: true, message: '不能为空' }]"></van-field>
      <!-- 部门信息-->
      <van-cell value="调整到：" :style="{'background-color':'#F2F2F2'}" />
      <van-field v-model="depName" name="depName" readonly 
        label-align="left" label="科室" placeholder="企业微信部门名称" 
        :rules="[{ required: true, message: '不能为空' }]">
        <template #button>
          <van-button size="small" type="primary" native-type="button" @click="openPopupDepart">选取</van-button>
          <search-depart @departInfo="fromSearchDepart" ref="searchDepartForm" :showSearchDepartPopup="isShowSearchDepartPopup"></search-depart> 
        </template>
      </van-field>      
      <van-field v-model="depId" name="depId" readonly label-align="left" label="科室ID" placeholder="企业微信部门id" :rules="[{ required: true, message: '不能为空' }]" />
      <div style="margin: 16px;">
        <van-button round block  type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>   
  </div>
</template>

<script>
// 引入组件
import SearchUser from '../components/searchUser'
import SearchDepart from '../components/searchDepart'
import axios from 'axios'

export default {
  name: 'updepinfo',
  components: { SearchUser,SearchDepart },
  data () {
    return {
      showDepart: false,
      showUser: false,        
      sms:'',  
      loadingShow: true,
      ulist: [],
      uid: '',
      reporter: '',
      depId: '',
      depName: '',
      username:'',
      password:'',
      msgFormSon:'',
      messageToHelloWorld:'父组件向下传递的信息',
      isShowSearchUserPopup: false,
      isShowSearchDepartPopup: false,
      testnum:0
    }
  },
  created() {//在模板渲染成html前调用
    //设置背景色为白色
    $(document.body).css('background-color','#f7f8fa');
  },
  mounted() {//在模板渲染成html后调用
    //获取路由信息里面的参数值
    //let param_uid = this.$route.query.uid;
    //let param_id = this.$route.query.id;

    //console.log('param_uid = ' + param_uid);
    //console.log('param_id = ' + param_id);    
    //console.log(this.$refs.searchForm.$el.offsetHeight)
    //console.log(this.$refs["searchForm"])
  },
  methods: { 
    // 提交保存
    onSubmit: async function(values) {  
      let that = this;   
      //values为表单中van-field的值
      //console.log(values);
      let postData = {
          'uid' : values.uid,
          'reporter' : values.reporter,
          'depId' : values.depId,
          'depName' : values.depName
      };
      //console.log(postData); 
      // 开启 Toast loading 提示
      that.$toast.loading({
        message: '正在保存...',
        forbidClick: true,//设置为背景不可点击
        loadingType: 'spinner',
        duration:0,//展示时长(ms)，值为 0 时，toast 不会消失
      }); 
      await axios.post('/api/dailyHealth/updepinfo',postData)
      .then(function (response) {
          console.log(response);
          var errcode = response.data.errcode;          
          if(errcode == '0'){
            //that.$toast.success(response.data.msg);
            that.$dialog.alert({ message: response.data.msg});              
          }else { 
            //that.$toast.fail(response.data.msg);
            that.$dialog.alert({ message: response.data.msg });
          }        
      })
      .catch(function (error) {                          
          that.$dialog.alert({ message: error });
      }) 
      // 关闭 Toast loading 提示
      that.$toast.clear();
    },     
    openSearchUserPopup() {           
      this.isShowSearchUserPopup = true;      
    },
    openPopupDepart() {
      this.isShowSearchDepartPopup = true;
    },    
    fromSearchUser(data) {// data就是从子组件传递过来的数据
       //console.log(data);
       this.uid = data.uid;   
       this.reporter = data.uname;
       this.isShowSearchUserPopup = data.isShowSearchUserPopup;
       //获取子组件表单属性的值(搜索框的值)
       //console.log(this.$refs.searchForm.searchValue);
    },
    fromSearchDepart(data) {// data就是从子组件传递过来的数据
      //console.log(data);
      this.depId = data.depId;
      this.depName = data.depName;
      this.isShowSearchDepartPopup = data.isShowSearchDepartPopup;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {  
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;    
  /*background-color: rgba(0, 0, 0, 0.7);*/
  background-color:#fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-cell--required::before {
    position: absolute;
    left: 45%;
    color: #ee0a24;
    font-size: 14px;
    content: '*';
}
.updepinfo {
  color:#666;
  background-color: #fff;  
  /* padding:15px 0px;   */
}
.updepinfo table {			
  width:100%;
  border-collapse: collapse;
  border-spacing: 0;		
}
.updepinfo table tr td {  
  min-height:40px;
  height:40px;	
  border:1px solid #bbb;
  border:none;
}
.updepinfo table tr td:first-child {
  text-align:right;
  padding-right:5px;
}
.updepinfo table tr td:nth-child(2) {
  text-align:left;			
  padding-left:5px;
}
.van-popup--center.van-popup--round {
    border-radius: 0.2rem;    
}
</style>