<template>	
  <div class="hello">	
    <!-- <p class="test">{{msg}}</p>   -->
    <!-- <button v-on:click="goto">输出</button> -->
    <!-- <a v-bind:href="jumpPage">跳转</a>     -->
    <div v-show="loadingShow" class="loading">
      <van-loading type="spinner" size="36px" color="#1989fa">加载中...</van-loading>
    </div>
    <div v-show="dailyHealthShow" class="dailyHealth">
      <div class="msgbox">
        <table>
          <tr>
            <td style="width:50%;">报告人:</td>
            <td id="reporter"></td>
          </tr>
          <tr>
            <td>报告日期:</td>
            <td id="createDate"></td>
          </tr>
          <tr>
            <td>报告人科室:</td>
            <td id="depName"></td>
          </tr>
          <tr>
            <td>上班时体温℃:</td>
            <td id="temperatureAtWork"></td>
          </tr>
          <tr>
            <td>下班时体温℃:</td>
            <td id="temperatureAfterWork"></td>
          </tr>
          <tr>
            <td>是否出现新冠肺炎十大症状:</td>
            <td id="symptom"></td>
          </tr>
          <tr>
            <td>14天内到过中高风险地区:</td>
            <td id="toHighRiskAreas"></td>
          </tr>
          <tr>
            <td>新冠病毒疫苗接种情况:</td>
            <td id="vaccinationStatus"></td>
          </tr>				
          <tr>
            <td>最近一次核酸检测时间:</td>
            <td id="nucleicAcidTestDate"></td>
          </tr>
          <tr>
            <td>核酸检测结果:</td>
            <td id="negativePositive"></td>
          </tr>
          <tr>
            <td>损伤情况（有无面部或手部皮肤的损伤）:</td>
            <td id="damage"></td>
          </tr>
          <tr>
            <td>防护情况（有无出现无效防护或防护不当等情况，包括医用防护口罩漏气、防护服破损、手套破损等）:</td>
            <td id="protectionSituation"></td>
          </tr>
          <tr>
            <td>粤康码:</td>
            <td id="healthCode"></td>
          </tr>
          <tr>
            <td>行程卡:</td>
            <td id="itineraryCode"></td>
          </tr>	
          <tr>
            <td>所到地市:</td>
            <td id="itineraryCodeNote"></td>
          </tr>		
          <tr>
            <td>健康情况:</td>
            <td id="healthMark"></td>
          </tr>
          <!--
          <tr>
            <td>是否外地返（抵）茂人员:</td>
            <td id="rebate"></td>
          </tr>
          <tr>
            <td>返回抵达电白区时间:</td>
            <td id="returnDate"></td>
          </tr>
          <tr>
            <td>始发地:</td>
            <td id="departure"></td>
          </tr>
          <tr>
            <td>目的地:</td>
            <td id="destination"></td>
          </tr>
          <tr>
            <td>班次/航班信息（车次/航班号）:</td>
            <td id="trainNumber"></td>
          </tr>  
          -->        
        </table>		
		  </div>      
    </div>
  </div>  
</template>

<script>
import axios from 'axios'

export default {
  name: 'msginfo',//组件名
  data () {
    return {
      msg: '演示数据',
      jumpPage:'https://www.baidu.com',
      loadingShow: true,
      dailyHealthShow: false
    }
  },
  created() {
	//设置背景色为紫色
    $(document.body).css('background-color','#815476');
  },
  mounted() {	
	// $router返回的是当前项目中的路由器对象。
  // $route返回的是当前路由信息。
	// 获取methods里面的方法需使用let
    let _this = this;
	
    //获取url里参数
    let param_uid = this.$route.query.uid;
    let param_id = this.$route.query.id;
	
    console.log("param_uid = " + param_uid);
    console.log("param_id = " + param_id);
	/*
	// 根据参数值控制dom显示或隐藏
    if(param_uid.indexOf("LF2588") !== -1 ) { //判断字符串中是否包含特定字符
    	console.log('参数type中包含updepinfo字符串'); 
      	$('.nav_router').show();
    }else{
		$('.nav_router').hide();
	}
	*/

    //测试
    //let param_uid = 'LF2588';
    //let param_id = '1';

    //console.log("param_uid = " + param_uid);
    //console.log("param_id = " + param_id);

    axios.get('/api/dailyHealth/findLastCurrDayByUserId', {
      params: {
        uid: param_uid,
        id: param_id
      }
    })
    .then(function (response) {
          //console.log(response);
          const res = response.data;
          console.log(res);
          $('#reporter').text(res.reporter);
					$('#depName').text(res.depName);					
					$('#createDate').text(res.createDate);
					$('#temperatureAtWork').text(res.temperatureAtWork);
					$('#temperatureAfterWork').text(res.temperatureAfterWork);
					if(res.symptom =='0'){
						$('#symptom').text('无');
					}else{
						//新冠肺炎十大症状（1,2,3,4,5,6,7...）
						//split() 方法用于把一个字符串分割成字符串数组
						var symptomNote='';
						var symptomNoteArray = [];
						symptomNoteArray = (res.symptomNote).split(',');
						$.each(symptomNoteArray,function(index,item){
							//console.log(item);
							switch(item) {
							case '1':	
								symptomNote +='发热'+',';
						    	break;
							case '2':
								symptomNote +='干咳'+',';
						    	break;
							case '3':
								symptomNote +='乏力'+',';
						    	break;
							case '4':
								symptomNote +='嗅（味）觉减退'+',';
						    	break;
							case '5':
								symptomNote +='鼻塞'+',';
						    	break;
							case '6':
								symptomNote +='流涕'+',';
						    	break;
							case '7':
								symptomNote +='咽痛'+',';
						    	break;
							case '8':
								symptomNote +='结膜炎'+',';
						    	break;
							case '9':
								symptomNote +='肌痛'+',';
						    	break;
							case '10':
								symptomNote +='腹泻症状'+',';
						    	break;							
						    default:
						    	//不处理
							}
						});
						if(symptomNote.length >0){
							//console.log(symptomNote);
							symptomNote = symptomNote.substring(0,symptomNote.lastIndexOf(',')) ;
						}
					
						$('#symptom').text('有:'+symptomNote);
					}
					//14天内到过中高风险地区
					var toHighRiskAreas = (res.toHighRiskAreas == '0'? '无':'有');
					$('#toHighRiskAreas').text(toHighRiskAreas);
					//新冠病毒疫苗接种情况
					var vaccinationStatus = "";
					switch(res.vaccinationStatus) {
					case '0':	
						vaccinationStatus = '未接种疫苗';
				    	break;
					case '1':
						vaccinationStatus = '腺病毒疫苗（1针型）';
				    	break;
					case '2':
						vaccinationStatus = '灭活疫苗（2针型）';
				    	break;
					case '3':
						vaccinationStatus = '安徽智飞重组蛋白疫苗（3针型）';
				    	break;							
				    default:
				    	//不处理
					}
					//灭活疫苗
					var inactivatedVaccine="";
					switch(res.inactivatedVaccine) {
					case '1':	
						inactivatedVaccine = '仅接种第1针';
				    	break;
					case '2':
						inactivatedVaccine = '接种了2针';
				    	break;
					case '3':
						inactivatedVaccine = '已接种第3针加强针';
				    	break;						
				    default:
				    	//不处理
					}
					
					//安徽智飞重组蛋白疫苗
					var proteinVaccine="";
					switch(res.proteinVaccine) {
					case '1':	
						proteinVaccine = '仅接种第1针';
				    	break;
					case '2':
						proteinVaccine = '接种了2针';
				    	break;
					case '3':
						proteinVaccine = '接种了3针';
				    	break;						
				    default:
				    	//不处理
					}
					
					if(res.vaccinationStatus=='2'){
						$('#vaccinationStatus').text(vaccinationStatus + ',' + inactivatedVaccine);
					}
					if(res.vaccinationStatus=='3'){
						$('#vaccinationStatus').text(vaccinationStatus + ',' + proteinVaccine);
					}
					
					
					$('#nucleicAcidTestDate').text(res.nucleicAcidTestDate);
					//核酸检测结果
					var negativePositive = (res.negativePositive=='1'? '阳性':'阴性');					
					$('#negativePositive').text(negativePositive);
					//损伤情况（有无面部或手部皮肤的损伤）
					var damage = (res.damage=='0'? '无':'有');
					if(_this.isBlank(res.damageNote)==false){//有值
						$('#damage').text(damage + ',' + res.damageNote);
					}else{
						$('#damage').text(damage);
					}
					
					//防护情况（有无出现无效防护或防护不当等情况，包括医用防护口罩漏气、防护服破损、手套破损等）
					var protectionSituation = (res.protectionSituation=='0'? '无':'有');					
					if(_this.isBlank(res.protectionSituationNote)==false){//有值
						$('#protectionSituation').text(protectionSituation + ',' + res.protectionSituationNote);
					}else{
						$('#protectionSituation').text(protectionSituation);
					}					
					// 健康标签
					$('#healthMark').text(res.healthMark);
          // 粤康码     
          var healthCode ="";     
          switch(res.healthCode) {
					case '0':	
						  healthCode = '绿色';
				      break;
					case '1':
						  healthCode = '黄色';
				      break;
					case '2':
						  healthCode = '红色';
				      break;						
				  default:
              healthCode = '绿色';
					}
          $('#healthCode').text(healthCode);
          // 行程卡
          var itineraryCode ="";     
          switch(res.itineraryCode) {
					case '0':	
						  itineraryCode = '无*';
				    	break;
					case '1':
						  itineraryCode = '带*';
				    	break;					
				    default:
              itineraryCode = '无*';
					}
          $('#itineraryCode').text(itineraryCode);
          // 行程卡带星说明（所到地市）
          if(_this.isBlank(res.itineraryCodeNote)==false){// 有值
            $('#itineraryCodeNote').text(res.itineraryCodeNote);
          }else{
            $('#itineraryCodeNote').text('无');
          }          
          
          /*
          //电白区人民医院特有属性：
          //是否外地返（抵）茂人员
					var rebate = (res.rebate=='0'? '否':'是');
					$('#rebate').text(rebate);
					$('#returnDate').text(res.returnDate);
					$('#departure').text(res.departure);
					$('#destination').text(res.destination);
					$('#trainNumber').text(res.trainNumber);
          */
          
          //显示dailyHealthShow
          _this.loadingShow = false;
          _this.dailyHealthShow = true;
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  methods:{
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.test {
  font-weight: normal;
  color:#333;
}
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
.dailyHealth {
  margin: 0 auto;
  text-align: center;
  color:#fff;
}
.dailyHealth #id {
  display:none;
}
.dailyHealth #uid {
  display:none;
}
.dailyHealth .msgbox {			
  background-color: #fff;			
}
.msgbox table {			
  width:100%;
  border-collapse: collapse;
  border-spacing: 0;		
}
.msgbox table tr td {		
  border:none;	
  border-bottom:1px solid rgba(255, 255, 255, 0.08);;
  min-height:56px;
  height:56px;	
  background-color: #815476;		
  font-size: 14px;
}
.msgbox table tr td:first-child {
  text-align:right;
  padding-right:5px;
}
.msgbox table tr td:nth-child(2) {
  text-align:left;			
  padding-left:5px;
}
</style>
