<template>
	<div class = 'bill-wrapper' @viewdisappear="distoryedStorage" @viewappear="enterView">
		<topCount :data = 'topCountList'></topCount>
			<zz-scroller v-if='!nulldata' class="scroller-list" ref="list" @refresh="onRefresh" @loading="onLoading"
						 :isOnepage="isOnepage">
					<billList v-for = 'item, index in completeList' :key = 'index' :billindex='index' :totalNum="totalNum" :minNum="minNum" :wrapperLength=completeList.length :data = 'item'></billList>
			</zz-scroller>
			<div class="nulldata" v-if='nulldata'>
				<dataBlock></dataBlock>
			</div>
	</div>
</template>

<script>
	import topCount from '../../components/bill&chart_top.vue'
	import billList from '../../components/billList.vue'
	import dataBlock from '../../components/dataBlock.vue'
	import zzScroller from '../../components/zz-scroller.vue'
	import { changePage, changeStorage, storageName, getDateNow,controlStrLength, fetchTodayTotal, fetchBillList,showMge,showMessage, getVal,startLoading,endLoading } from '../../func'
	export default {
		data(){
			return {
				name: '',
				id: '',
                isOnepage: false,
				topCountList: [
					{
						count: '0.00',
						title: '今日交易金额（元）'
					},
					{
						count: '0 笔',
						title: '今日交易笔数（笔）'
					}
				],
				billList: [],
				showloading: 'hide',
				page: 1,
				rows: 10,
                totalNum:'',
				pages:'',
				completeList: [],
				loadingText: '----- loading -----',
				pageCount: 0,
				nulldata: false,
                isinitial:true,
				params:''
			}
		},
		components: {
			topCount,
			billList,
			dataBlock,
            zzScroller
		},
        computed:{
		    minNum(){
		        return this.pages<=1?this.completeList.length>1?this.totalNum-this.completeList[this.completeList.length-1].transactionList.length:this.totalNum:10
			}
		},
        mounted(){
            this.isinitial=false;
            startLoading()
			getVal()
			.then(e => ({data: {accountType: e.accountType}}))
//            changeStorage('get', storageName.loginUserInfo)
//				.then(e=>({data: {accountType: e.data.accountType}}))
			.then(e => e.data.accountType === '2' || e.data.accountType === '3' ? this.id='shopAN' :
				changeStorage('get', storageName.billShopId)
					.then(e=>this.id = e.data)
			)
				.then(_=>this.onRefresh())
		},
		methods: {
			navigatorTo(){
                changePage('filter.js')('筛选')
			},
            onLoading(){
                this.page++;
				    this.loadData()
                    .then(data => {
                        data.code==='60012'?this.$refs.list.$emit('reomveloading', true) : data.data.transactionLists.map(val => this.billList.push(val))
                    })
                    .then(_ => this.handleList(this.billList))
                    .then(_ => {
                        this.$refs.list.$emit('loadingDone');
                    })
			},
            onRefresh(){
                this.page=1;
                this.nulldata = false
				this.loadData()
                    .then(data => {
                        data.code === '200' ? (
                            this.billList = data.data.transactionLists,
                            this.pages=data.data.pages,
                        	this.totalNum=data.data.totalNum
						) : data.code === '60012' ? this.nulldata = true : showMessage(data.code)
                        setTimeout(_=>{
                            endLoading()
                        },500)
                    })
//                    .then(_=>endLoading())
					.then(_=>this.topCount())
                    .then(_ => this.handleList(this.billList))
                    .then(() => {
                        this.$refs.list.$emit('refreshDone');
                        this.$refs.list.$emit('reomveloading', false)
                    })
			},
			loadData(){
				let pageParam = {
					page: this.page,
					rows: this.rows
				}
                let param = this.id === 'shopAN' ? {} : {
                    spShopId: this.id
                }
                return changeStorage('get', storageName.filterParam)
                    .then(e => e.data !== '' ?
                        fetchBillList(Object.assign({}, e.data, pageParam))
                     : fetchBillList(Object.assign(param, pageParam)))
			},
			dateHandler(dateStr){
			    let getDate=dateStr.substring(0, dateStr.indexOf(' '));
				return getDateNow()===getDate?'今天':getDateNow(-1)===getDate?'昨天':getDate
			},
			handleList(List){
				let date = ''
				this.completeList = []
				List.map(val => {
				    val.serialNumber=val.serialNumber.substring(0, 32),
					date === '' ? (
						date = this.dateHandler(val.date),
						this.completeList.push({
							date: this.dateHandler(val.date),
							totalMoney: String(val.totalMoney).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,'),
							totalNumber: String(val.totalNumber).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,'),
							transactionList: [
								val
							]
						})
					) : date === this.dateHandler(val.date) ? (
						date = this.dateHandler(val.date),
						this.completeList[this.completeList.length - 1].transactionList.push(val)
					) : (
						date = this.dateHandler(val.date),
						this.completeList.push({
							date: this.dateHandler(val.date),
							totalMoney: String(val.totalMoney).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,'),
							totalNumber: String(val.totalNumber).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,'),
							transactionList: [
								val
							]
						})
					)
				})
			},
            topCount(){
                let param = this.id === 'shopAN' ? {} : {
                    spShopId: this.id
                }
                return fetchTodayTotal(param)
                    .then(data => {
                        this.topCountList[0].count = String((data.data.todayTotalMoney*100/100).toFixed(2)).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,')
                        this.topCountList[1].count = `${data.data.succeedTotalNumber} 笔`
                    })
			},
            enterView(){
                this.isinitial?this.onRefresh():''
			},
            distoryedStorage(){
                this.isinitial=true;
                changeStorage('set', storageName.filterParam, '')
                    .then(_=>changeStorage('set', storageName.saveFilter,{
                        baseData: {
                            paymentType: '',
                            startDate: '2017-05-01',
                            startTime: '00:00',
                            endDate: getDateNow(),
                            endTime: '23:59',
                            paymentStatus: ''
                        },
                        dataState: {
                            typeList: [false, false],
                            stateList: [false, false, false, false, false]
                        }
                    }))
			}//页面关闭时触发，还应该再测试一下
		}
    }
</script>

<style lang = 'less' scoped>
	.scroller-list{
		flex:1;
		flex-direction: column;
		background-color:#f6f6f6;
	}
	.bill-main{
		flex: 1;
		position: relative;
		background-color: #eee;
	}
	.loadingText{
		font-size: 24px;
		color: #bbb;
		text-align: center;
		padding-top: 20px;
		padding-bottom: 20px;
		width: 750px;
	}
	.nulldata{
		flex:1;
		justify-content: center;
		align-items: center;
	}
</style>