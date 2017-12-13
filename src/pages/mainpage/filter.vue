<template>
	<div class="wrapper">
		<div class = 'filter-wrapper'>
			<div class = 'filter-block'>
				<text class = 'filter-title'>收款方式</text>
				<div class = 'filter-btn'>
					<typeBtn v-for = 'item, index in typeList' :key = 'index' @changeToggle = 'changeToggle(item)' :src = 'getImgUrl(item, dataState.typeList[index])' :text = 'item === "WX" ? "微信" : "支付宝"' :checked = 'dataState.typeList[index]'></typeBtn>
				</div>
			</div>
			<div class = 'filter-block'>
				<text class = 'filter-title'>交易时间</text>
				<div>
					<div class = 'filter-btn'>
						<text class = 'time-title'>开始时间</text>
						<div class = 'filter-btn' style = 'padding-bottom: 18px;'>
							<text class = 'filter-date' @click = 'pickDate("start")'>{{baseData.startDate}}</text>
							<text class = 'filter-time' @click = 'pickTime("start")'>{{baseData.startTime}}</text>
						</div>
					</div>
					<div class = 'filter-btn'>
						<text class = 'time-title'>结束时间</text>
						<div class = 'filter-btn'>
							<text class = 'filter-date' @click = 'pickDate("end")'>{{baseData.endDate}}</text>
							<text class = 'filter-time' @click = 'pickTime("end")'>{{baseData.endTime}}</text>
						</div>
					</div>
				</div>
			</div>
			<div class = 'filter-block'>
				<text class = 'filter-title'>交易状态</text>
				<div class = 'filter-btn' v-for = 'i, key in stateList' :key = 'key'>
					<filterBtn v-for = 'item, index in i' @changeToggle = 'changeToggle((key === 1 ? index + 3 : index) + 1)' :key = '(key === 1 ? index + 3 : index)' :checked = 'dataState.stateList[(key === 1 ? index + 3 : index)]'>{{item}}</filterBtn>
				</div>
			</div>
			<div class = 'filter-bottom'>
				<text
						:class = "[
					'filter-reset'
				]"
						@click = 'resetData'>重置</text>
				<text class = 'filter-done' @click = 'doneFilter'>确定</text>
			</div>
		</div>
	</div>
</template>

<script>
    import filterBtn from '../../components/filterBtn.vue'
    import typeBtn from '../../components/filterTypeBtn.vue'
    import { getDateNow, changePage, changeStorage, storageName, showMge,controlStrLength, getImgUrl, getVal} from '../../func'
    const picker = weex.requireModule('picker')
    export default {
        data(){
            return {
                baseData: {
                    paymentType: '',
                    startDate: '2017-05-01',
                    startTime: '00:00',
                    endDate: getDateNow(),
                    endTime: '23:59',
                    paymentStatus: ''
                },
//				stateList: [['待支付', '收款成功', '已关闭'], ['已退款', '退款失败']],
                stateList: [['收款成功', '已退款', '退款失败']],
                typeList: ['WX', 'ALIY'],
                dataState: {
                    typeList: [false, false],
                    stateList: [false, false, false]
                },
                initialData: {}
            }
        },
        components: {
            filterBtn,
            typeBtn
        },
        methods:{
            judgeState(key, param){
                let has = false
                this.baseData[key] instanceof Array ? (this.baseData[key].map(val => has = val === param ? true : has),	has ? this.baseData[key].splice(this.baseData[key].indexOf(param), 1) : this.baseData[key].push(param)) : ''
            },
            changeToggle(param){
                this.dataState[param] = !this.dataState[param]
                switch(param){
                    case "WX":
                    case "ALIY":
                        let index = param === 'WX' ? 0 : 1
                        this.dataState.typeList = [false, false]
                        this.dataState.typeList.splice(index, 1, !this.dataState.typeList[index])
                        this.baseData.paymentType = param
                        break
                    case 1:
                    case 2:
                    case 3:
//					case 4:
//					case 5: 对的号可能不对，需要更改
                        this.dataState.stateList = [false, false, false]
                        this.dataState.stateList.splice(param - 1, 1, !this.dataState.stateList[param - 1])
                        this.baseData.paymentStatus = param===1?'2':param===2?'4':'5'
//						param.toString()
                        break
                    default:
                        break
                }
            },
            getImgUrl(type, judge){
                return getImgUrl(judge ? type === 'WX' ? 'btnwxact' : 'btnaliyact' : type === 'WX' ? 'btnwx' : 'btnaliy')
            },
            pickDate(param){
                picker.pickDate({
                    value: param === 'start' ? this.baseData.startDate : this.baseData.endDate
                }, e => {
                    e.result === 'success' ? param === 'start' ? this.baseData.startDate = e.data : this.baseData.endDate = e.data : ''
                })
            },
            pickTime(param){
                picker.pickTime({
                    value: param === 'start' ? this.baseData.startTime : this.baseData.endTime
                }, e => {
                    e.result === 'success' ? param === 'start' ? this.baseData.startTime = e.data : this.baseData.endTime = e.data : ''
                })
            },
            resetData(){
                this.dataState.typeList = this.dataState.typeList.map(val => false)
                this.dataState.stateList = this.dataState.stateList.map(val => false)
                this.baseData.startTime = '00:00'
                this.baseData.endTime = '23:59'
                this.baseData.startDate ='2017-05-01'
                this.baseData.endDate = getDateNow()
                this.baseData.paymentStatus = ''
                this.baseData.paymentType = ''
            },
            doneFilter(){
                // changeStorage('get', storageName.loginUserInfo)
                getVal()
                    .then(e => ({data: {accountType: e.accountType}}))
                    .then(e => e.data.accountType === '2' || e.data.accountType === '3' ? 'shopAN' : changeStorage('get', storageName.billShopId).then(e => e.data))
                    .then(e => Object.assign({}, {
                        startTime: `${this.baseData.startDate} ${this.baseData.startTime}`,
                        endTime: `${this.baseData.endDate} ${this.baseData.endTime}`,
                    }, this.baseData.paymentStatus === '' ? {} : {
                        paymentStatus: this.baseData.paymentStatus
                    }, this.baseData.paymentType === '' ? {} : {
                        paymentType: this.baseData.paymentType
                    }, e === 'shopAN' ? {} : {
                        spShopId: e
                    }))
                    .then(param => changeStorage('set', storageName.filterParam, param))
                    .then(_=>changeStorage('set',storageName.saveFilter,{
                        baseData: {
                            paymentType: this.baseData.paymentType,
                            startDate: this.baseData.startDate,
                            startTime: this.baseData.startTime,
                            endDate: this.baseData.endDate,
                            endTime: this.baseData.endTime,
                            paymentStatus: this.baseData.paymentStatus
                        },
                        dataState: {
                            typeList: this.dataState.typeList,
                            stateList: this.dataState.stateList
                        }
                    }))
                    .then(_=>changeStorage('get', storageName.billShopName))
                    .then(res=>changePage('shopBill.js')(controlStrLength(res.data)))
            }
        },
        created(){
            changeStorage('get', storageName.saveFilter)
                .then(res=>{res.data?(this.baseData=res.data.baseData,this.dataState=res.data.dataState):''})
        }
    }
</script>

<style lang = 'less'>
	.borderBot{
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #dedede;
	}
	.filterPub(@width){
		width: @width;
		height: 60px;
		background-color: #f0f0f0;
		border-radius: 4px;
		text-align: center;
		line-height: 60px;
		margin-left: 30px;
		font-size: 21px;
	}
	.botBtn(@bgColor, @color){
		width: 300px;
		height: 80px;
		box-sizing: border-box;
		text-align: center;
		line-height: 80px;
		background-color: @bgColor;
		color: @color;
		border-radius: 8px;
		font-size: 28px;
	}

	.filter-wrapper{
		flex: 1;
		background-color: #fff;
	}
	.filter-block{
		.borderBot;
		padding-top: 24px;
		padding-left: 36px;
		padding-right: 36px;
	}
	.filter-title{
		padding-bottom: 22px;
		font-size: 26px;
		color: #3a3a3a;
	}
	.filter-btn{
		flex-direction: row;
		align-items: center;
		padding-bottom: 21px;
	}
	.time-title{
		font-size: 24px;
		color: #888;
	}
	.filter-date{
		.filterPub(200px);
	}
	.filter-time{
		.filterPub(120px);
	}
	.filter-bottom{
		flex-direction: row;
		padding-top: 36px;
		padding-left: 36px;
		padding-right: 36px;
		justify-content: space-between;
	}
	.filter-reset{
		.botBtn(#fff, #3eba6c);
		border-width: 1px;
		border-style: solid;
		border-color: #3eba6c;
	}
	.filter-reset:active{
		background-color: #cdf0da;
	}
	.filter-done{
		.botBtn(#3eba6c, #fff);
	}
</style>