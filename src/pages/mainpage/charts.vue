<template>
		<div class = 'chartWrap'>
			<scroller class = 'chart-container' :show-scrollbar = 'false'>
				<chartHeader :count = 'headMoney' :num = 'headNum'></chartHeader>
				<div class = 'chart-content'>
					<div class = 'chart-date-top'>
						<div class = 'choose-month'>
							<text :class = "[
								'choose-btn-d',
								type === 'date' ? 'choose-active' : ''
							]" @click = 'type = "date"'>日</text>
							<text :class = "[
								'choose-btn-m',
								type === 'month' ? 'choose-active' : ''
							]" @click = 'type = "month"'>月</text>
						</div>
						<div class = 'choose-text-container'>
							<text class = 'choose-text' @click = 'type === "date" ? dateCount-- : monthCount--'>{{type === 'date' ? '前一天' : '上月'}}</text>
							<text class = 'choose-text' :style="{textAlign:'center'}">{{type === "date" ? date : month}}</text>
							<text class = 'choose-text' :style="{textAlign:'right'}" @click = 'type === "date" ? dateCount++ : monthCount++'>{{type === 'date' ? '后一天' : '下月'}}</text>
						</div>
					</div>

					<div class = 'chart-message'>
						<div class = 'mess-left'>
							<text class = 'left-text'>{{totalMoney ? totalMoney : 0}}</text>
							<text class = 'left-text-bot'>累计收入(元)</text>
						</div>
						<div class = 'mess-right'>
							<text class = 'left-text'>{{totalNumber ? totalNumber : 0}}</text>
							<text class = 'left-text-bot'>交易笔数</text>
						</div>
					</div>

					<div class = 'record-container'>
						<text class = 'record-title'>交易记录</text>
						<div class = 'record-content'>
							<div class = 'record-type' v-for = 'item, index in recordMessList' :key = 'index'>
								<image :src = 'getImgUrl("borderleft")' class = 'record-img'></image>
								<div class = 'record-mess'>
									<div class = 'record-mess-top'>
										<image :src = 'getImgUrl(item.img)' class = 'record-icon'></image>
										<text class = 'record-mess-title'>{{item.title}}</text>
									</div>
									<text class = 'mess-item'>{{`交易金额： ${item.totalMoney ? item.totalMoney : 0}`}}</text>
									<text class = 'mess-item'>{{`交易笔数： ${item.totalNumber ? item.totalNumber : 0}`}}</text>
								</div>
								<image :src = 'getImgUrl("borderright")' class = 'record-img'></image>
							</div>
						</div>
					</div>
				</div>
				<web class = 'chart-webview' :src = '`http://mt.qdxiao2.com/report/?spShopId=${spShopId}&token=${token}`'></web>
			</scroller>
			<zz-navbar :title="navtitle" :istitleClick="istitleClick" @titleClick="navClick()" @prevback="prevback"></zz-navbar>
		</div>

</template>
<script>
	import chartHeader from '../../components/chartHeader.vue'
	import chartSelect from '../../components/chartSelect.vue'
    import zzNavbar from '../../components/zz-navbar.vue'
	import { decode,changePage, getImgUrl,showMge, getDateNow, getMonth, fetchChartCount, fetchChartTotal, fetchShopList, changeStorage, storageName, getVal,startLoading,endLoading ,saveValue,
        getValue,} from '../../func'
	export default {
		data(){
			return {
				recordMessList: [
					{
						img: 'wxact',
						title: '微信',
						totalMoney: '',
						totalNumber: ''
					},
					{
						img: 'zfbact',
						title: '支付宝',
						totalMoney: '',
						totalNumber: ''
					}
				],
				totalMoney: '',
				totalNumber: '',
				type: 'date',
				dateCount: 0,
				date: '',
				monthCount: 0,
				month: '',
				headMoney: '',
				headNum: '',
				spShopId: '',
				loading: false,
				shopList: [],
				shopName: '',
				icon: decode('&#xe612;'),
				isVisible: false,
				shopType: '',
				token:'',
				webSrc:'',
				isinitial:true   //不是初始化为true
			}
		},
		components: {
			chartHeader,
			chartSelect,
            zzNavbar
		},
		computed:{
			navtitle(){
				return this.shopType==='1'?this.cutString(this.shopName):'报表'
					},
            istitleClick(){
			    return this.shopType==='1'?true:false
			}
		},
		methods: {
            cutString(str){
                return str.length > 7 ? str.substring(0, 7)+'...' : str
            },
            prevback(){
                changePage('back.js')('首页')
			},
            navClick(){
                changePage('chartsSwitchShop.js')('切换店铺')
			},
			getImgUrl(path){
				return getImgUrl(path)
			},
			fetchChartCount(){
				let param = this.type === 'date' ? {
					spShopId: this.spShopId,
					dayTime: this.date
				} : {
					spShopId:  this.spShopId,
					monthTime: this.month
				}
				return fetchChartCount(param)
					.then(data => {
                        data.code==='200'?(
                        	this.totalMoney = data.data.totalMoney,
                        	this.totalNumber = data.data.totalNumber,
                        	this.recordMessList[0].totalMoney = data.data.wxtotalMoney,
                        	this.recordMessList[0].totalNumber = `${data.data.wxtotalNumber}笔`,
                        	this.recordMessList[1].totalMoney = data.data.aliytotalMoney,
                        	this.recordMessList[1].totalNumber = `${data.data.aliytotalNumber}笔`
						):''
					})
			},
			check(item){
				this.shopList.map(val => item === val.shopName ? (this.spShopId = val.id, this.shopName = val.shopName) : '')
				this.getData()
				.then(_ => this.isVisible = false)
			},
			getData(){
                return  getValue('chartsShopId')
                    .then(res => this.spShopId = res.value)
                    .then(_ => this.spShopId ? {spShopId: this.spShopId} : {})
					.then(data=>fetchChartTotal(data))
				.then(data => {
				    data.code==='200'?(
                        this.headMoney = data.data.totalMoney,
                        this.headNum = data.data.totalNumber
					):''
				})
				.then(_ => {
					this.date = getDateNow(this.dateCount)
					this.month = getMonth(this.monthCount)
					return this.fetchChartCount()
				})
			},
            enterView(){
                this.isinitial?(
                    startLoading(),
                        getVal()
                            .then(e => ({data: {accountType: e.accountType,token:e.token}}))
                            .then(e=>{
                                this.shopType = e.data.accountType;
                                this.token=e.data.token;
                                return e.data.accountType==='1'?fetchShopList({lineState: 0}):''
                            })
                            .then(res=> res && res.code==='200'? this.shopList = res.data :'')
							.then(_=>getValue('chartsShopId'))
                            .then(res=>this.shopList.forEach((item,index)=>{
                                item.id===res.value?(this.spShopId=item.id,this.shopName=this.shopList[index].shopName):''
                            }))
                            .then(_ => this.getData())
                            .then(_=>endLoading())):this.isinitial=true
			}
		},
		mounted(){
            this.isinitial=false;
            startLoading(),
                getVal()
                    .then(e => ({data: {accountType: e.accountType,token:e.token}}))
                    .then(e=>{
                        this.shopType = e.data.accountType;
                        this.token=e.data.token;
                        return e.data.accountType==='1'?fetchShopList({lineState: 0}):''
                    })
					.then(_=>this.shopType==='1'?
						fetchShopList({lineState: 0})
                            .then(res=> res && res.code==='200'? this.shopList = res.data :'')
                            .then(_=>getValue('chartsShopId'))
                            .then(res=>res.value?
                                this.shopList.forEach((item,index)=>{
                                    item.id===res.value?(this.spShopId=item.id,this.shopName=this.shopList[index].shopName):''
                                }):
                                (
                                    this.spShopId = this.shopList[0].id,
                                        this.shopName = this.shopList[0].shopName,
                            saveValue('chartsShopId')(this.shopList[0].id)
                                )
                            )
						:'')
                    .then(_ => this.getData())
                    .then(_=>endLoading())
		},
		watch: {
			'dateCount': function(val){
				console.log(val)
				this.date = getDateNow(val)
				this.fetchChartCount()
			},
			'monthCount': function(val){
				this.month = getMonth(val)
				this.fetchChartCount()
			},
			'type': function(val){
				this.fetchChartCount()
			}
		}
	}
</script>

<style lang = 'less' scoped>
	.borderPub(@color, @top: 0, @bottom: 0, @left: 0, @right: 0){
		border-color: @color;
		border-style: solid;
		border-top-width: @top;
		border-bottom-width: @bottom;
		border-left-width: @left;
		border-right-width: @right;
	}
	.fontPub(@color, @size: 28px){
		color: @color;
		font-size: @size;
	}
	.choosePub(@left, @right, @tl, @tr, @br, @bl){
		.borderPub(#3eba6c, 1px, 1px, @left, @right);
		.fontPub(#3eba6c);
		background-color: #fff;
		border-bottom-left-radius: @bl;
		border-bottom-right-radius: @br;
		border-top-left-radius: @tl;
		border-top-right-radius: @tr;
		width: 327px;
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
	.flexPub(@justify){
		flex-direction: row;
		align-items: center;
		justify-content: @justify;
	}
	.messFontPub(@size){
		.fontPub(#fff, @size);
		text-align: center;
	}


	.chart-container{
		flex: 1;
		width: 750px;
		margin-top:88px;
		background-color: #eee;
	}
	.chart-webview{
		.borderPub(#dedede, 1px);
		height: 850px;
		width: 750px;
		background-color: #eee;
	}
	.chart-content{
		height: 562px;
		padding-top: 20px;
	}
	.chart-date-top{
		.borderPub(#dedede, 1px, 1px);
		background-color: #fff;
		padding-top: 11px;
		padding-bottom: 19px;
	}
	.choose-month{
		.flexPub(center);
	}
	.choose-btn-d{
		.choosePub(1px, 0, 4px, 0, 0, 4px);
	}
	.choose-btn-m{
		.choosePub(0, 1px, 0, 4px, 4px, 0);
	}
	.choose-active{
		.fontPub(#fff);
		background-color: #3eba6c;
	}
	.choose-text-container{
		.flexPub(space-between);
	}
	.choose-text{
		flex:1;
		.fontPub(#000, 24px);
		padding-top: 16px;
		padding-left: 48px;
		padding-right: 48px;
	}
	.choose-text:active{
		.fontPub(#3eba6c, 22px);
	}
	.chart-message{
		height: 188px;
		background-color: #3eba6c;
		flex-direction: row;
	}

	.mess-left{
		.borderPub(#fff, 0, 0, 0, 1px);
		justify-content: center;
		flex: 1;
	}
	.left-text{
		.messFontPub(36px);
		font-weight: bold;
	}
	.left-text-bot{
		.messFontPub(28px);
		padding-top: 30px;
	}
	.mess-right{
		flex: 1;
		justify-content: center;
	}

	.record-container{
		padding-top: 23px;
	}
	.record-title{
		.fontPub(#888, 28px);
		padding-left: 36px;
		padding-bottom: 17px;
	}

	.record-content{
		flex-direction: row;
	}
	.record-type{
		padding-left: 36px;
		padding-right: 36px;
		height: 148px;
		flex-direction: row;
		flex: 1;
	}
	.record-img{
		width: 8px;
		height: 148px;
	}
	.record-mess{
		.borderPub(#dedede, 1px, 1px);
		flex: 1;
		background-color: #fff;
		padding-left: 50px;
		padding-top: 19px;
	}
	.record-icon{
		width: 40px;
		height: 40px;
	}
	.record-mess-top{
		flex-direction: row;
		align-items: center;
		padding-bottom: 5px;
	}
	.record-mess-title{
		.fontPub(#000, 25px);
		padding-left: 25px;
	}
	.mess-item{
		.fontPub(#888, 20px);
		padding-top: 11px;
	}


	.shopSelect{
		height: 84px;
		background-color: #fff;
		padding-left: 36px;
	}
	.selectTitle{
		.fontPub(#000);
		padding-right: 5px;
	}
	.shopItem{
		flex-direction: row;
		height: 84px;
		align-items: center;
	}

	.chartWrap{
		flex: 1;
		width: 750px;
	}
</style>