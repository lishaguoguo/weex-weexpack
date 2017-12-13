<template>
	<div>
		<div class = 'encash-container'>
			<div class = 'encash-content'>
				<div class = 'encash-bankcard' @click = 'overTime ? "" : navigatorTo("cashcard.js", "选择银行卡")'>
					<text class = 'encash-title'>到账银行卡</text>
					<text class = 'encash-card'>{{bank === '' ? '' : `${bank.bcBankCardTypeN}(${bank.bankNo.substring(bank.bankNo.length - 4, bank.bankNo.length)})`}}</text>
					<text 
					:style="{
					    fontFamily:'iconfont',
					    color: '#9e9e9e',
					    fontSize:'30px'
					}"
					>{{icon}}</text>
				</div>
				<div class = 'encash-bankcard'>
					<text class = 'encash-title' :style="{color:'#fff'}">提现手续费</text>
					<text class="tip-money">提现手续费率{{tip}}‰</text>
				</div>
				<div class = 'encash-input-container'>
					<text class = 'cash-sym'>¥</text>
					<div class = 'input-content' @click = 'overTime ? "" : changeState(true)'>
						<text class = 'input-block'>{{this.data}}</text>
						<text class = 'input-cursor'>{{cursor}}</text>
					</div>
				</div>
				<div class = 'encash-choosecard'>
					<text class = 'encash-title'>{{data>0?`额外扣除￥${finalTip}元手续费`:`当前余额 ${shopBalance === '' ? 0 : shopBalance} 元,`}}</text>
					<text class = 'encash-all' v-if="data>0?false:true" @click = 'overTime ? "" : cashAll()'>全部提现</text>
				</div>
			</div>
			<text class = 'encash-tip'>{{overTime ? '提现时间为17:00 ~ 24:00' :'24小时内到账'}}</text>
			<div class = 'btn-wrap'>
				<text class = 'encash-btn' @click = 'overTime ? "" : navigatorTo("cashdetail.js", "提现详情")' :style = "{color: overTime ? '#78eba3' : '#fff'}">提现</text>
			</div>
		</div>
		<keyBoard v-if = 'dis' class = 'kbb' @getValue = 'getValue' :value = 'data' :regexp="regexp" @close = 'changeState' ref = 'KB'></keyBoard>
	</div>
</template>

<script>
	import keyBoard from '../../components/keyBoard.vue'
	import { decode, changeStorage, storageName,cashTipMoney, saveValue,startLoading,endLoading,
        getValue,showMge,showMessage,changePage, cashQualification, backPage, fetchCashBanlance, cashment, fetchBankList } from '../../func'
	export default {
		data(){
			return {
				dis: false,
				data: '',
				tip:0, //提现手续费
				cursor: null,
				icon: decode('&#xe680;'),
				spShopId: '',
				bank: '',
				overTime: false,
				shopBalance: '',
                regexp:/^.{0,15}$/,
				loading:false,
                finalTip:0,    //最终的手续费
				totalTip:false   //点击全部提现时，totalTip为true
			}
		},
		components: {
			keyBoard
		},
		methods: {
            finalTipMoney(tipdata){
                this.finalTip=parseInt(tipdata*this.tip/10)/100>0?parseInt(tipdata*this.tip/10)/100:0
			},
			changeState(state){
				this.dis = state
			},
			getValue(val){
				this.data = val
				this.totalTip&&(this.shopBalance*100-parseFloat(this.data)*100-this.finalTip*100===0)?this.finalTipMoney(this.shopBalance):this.finalTipMoney(this.data)
			},
			createCursor(){
				this.dis = true
				let cursor = true
				setInterval(_ => {
					this.cursor = cursor ? '|' : ' '
					cursor = !cursor
				}, 500)
			},
            navigatorTo(path, title){
                startLoading()
                    new Promise((reslove, reject) => {
                        path === 'cashcard.js' ? changeStorage('set', storageName.selectedCard, this.bank.bankNo).then(_ => reslove()) : this.data ? (
                            parseFloat(this.data)<=0?this.data=0.01:'',
                                cashment({
                                    spShopId: this.spShopId,
                                    cashWithdrawal: this.data,
                                    bcBankCardTypeN: this.bank.bcBankCardTypeN,
                                    bcBankCardTypeId: this.bank.bcBankCardTypeId,
                                    bankNo: this.bank.bankNo,
                                    commission:this.finalTip,
                                    commissionRate:this.tip
                                }).then(data => {
                                    data.code==='200'?reslove():(showMessage(data.code),endLoading(),reject())
                                })) : (showMessage('50021'),endLoading())//请输入提现金额
                    })
                        .then(_ =>{endLoading();changePage(path)(title)})
			},
			cashAll(){
				this.dis = true
				this.totalTip=true
				this.$nextTick(_ => {
                    this.finalTipMoney(this.shopBalance)
					let finalData=(this.shopBalance*100-this.finalTip*100)/100
					this.$refs.KB.data = finalData.toString()
					this.$refs.KB.emit(this.$refs.KB.data)
				})
			}
		},
		mounted(){
            getValue('myShopId')
			.then(e => this.spShopId = e.value)
			.then(_ => changeStorage('get', storageName.beforeCashState)
			.then(e => e.data === '200' ? (_ => {
				this.createCursor()
				return changeStorage('get', storageName.cashCardState)
				.then(e => e.data === 'save' ? changeStorage('get', storageName.cashCardInfo).then(e => {
					changeStorage('set', storageName.cashCardState, '')
					return e.data
				}) : fetchBankList().then(data => data.data[0]))
				.then(data => this.bank = data)
				.then(_ => fetchCashBanlance({
					id: this.spShopId
				})).then(data => this.shopBalance = data.data)
			})() : this.overTime = true))
            cashTipMoney()
				.then(res=>res.code==='200'?this.tip=res.data:this.tip=0)
		}
	}
</script>

<style lang = 'less'>
	.borderPub{
		border-color: #dedede;
		border-style: solid;
		border-top-width: 1px;
		border-bottom-width: 1px;
	}
	.fontPub(@size, @color){
		font-size: @size;
		color: @color;
	}

	.encash-container{
		flex: 1;
		padding-top: 20px;
		background-color: #eee;
	}
	.encash-content{
		background-color: #fff;
		padding-left: 36px;
	}
	.encash-choosecard,.encash-bankcard{
		flex-direction: row;
		align-items: center;
		height: 88px;
		padding-right: 36px;
	}
	.encash-bankcard{
		height: 80px;
	}
	.encash-title{
		.fontPub(26px, #666);
		padding-right: 23px;
	}
	.encash-input-container{
		.borderPub;
		height: 95px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-right: 36px;
	}
	.encash-tip{
		.fontPub(26px, #666);
		padding-top: 30px;
		text-align: center;
		padding-bottom: 100px;
	}
	.btn-wrap{
		align-items: center;
	}
	.encash-btn{
		.fontPub(32px, #fff);
		width: 654px;
		height: 91px;
		text-align: center;
		line-height: 91px;
		border-radius: 8px;
		background-color: #3eba6c;
	}
	.input-content{
		flex-direction: row;
		align-items: center;
		width: 630px;
	}
	.cash-sym{
		.fontPub(38px, #333);
		font-weight: bolder;
	}
	.input-block{
		.fontPub(40px, #333);
		font-weight: bolder;
	}
	.input-cursor{
		.fontPub(60px, #333);
	}
	.encash-all{
		.fontPub(26px, #656887);
	}
	.encash-card{
		.fontPub(28px, #656887);
		flex: 1;
	}
	.tip-money{
		font-size:28px;
		color:#999;
		margin-bottom:28px;
	}
</style>