<template>
	<div class = 'detail-wrapper'>
		<div class = 'detail-main' v-if="completeTree">
			<div class = 'state-show'>
				<image :src = "getImgUrl(data.paymentStatus)" class = 'detail-img'></image>
				<text 
				:style = "{ 
					color: data.paymentStatus === '3' ? '#000' : '#3eba6c' 
				}" class = 'detail-state'>{{data.paymentType ? statusJudge(data.paymentStatus) : ''}}</text>
			</div>
			<div class = 'block'></div>
			<div class = 'bill-detail'>
				<div class = 'detail-cell'>
					<text class = 'detail-cell-name'>实收金额</text>
					<text class = 'detail-cell-data'>￥{{data.receivedPrice}}</text>
				</div>
				<div class = 'detail-cell'>
					<text class = 'detail-cell-name'>交易金额</text>
					<text 
					class = 'detail-cell-data' 
					:style = "{ 
						color: data.paymentStatus === '3' ? '#f00' : '#000', 
						textDecoration: data.paymentStatus === '3' ? 'line-through' : 'normal'
					}">￥{{data.paymentStatus === '4' ? `+${data.transactionPrice}` : data.transactionPrice }}</text>
				</div>
				<div class = 'detail-cell' v-if = "data.paymentStatus === '4'">
					<text class = 'detail-cell-name'>退款金额</text>
					<text class = 'detail-cell-data'>￥{{data.refundMoney ? `-${data.refundMoney}` : ''}}</text>
				</div>
				<div class = 'detail-cell cell-time'>
					<text class = 'detail-cell-name'>交易时间</text>
					<text class = 'detail-cell-data'>{{data.tradingTime}}</text>
				</div>
				<div class = 'detail-cell' v-if = "data.paymentStatus === '4'">
					<text class = 'detail-cell-name'>退款时间</text>
					<text class = 'detail-cell-data'>{{data.refundDate ? data.refundDate : ''}}</text>
				</div>
				<div class = 'detail-cell'>
					<text class = 'detail-cell-name'>付款方式</text>
					<text class = 'detail-cell-data'>{{data.paymentType === 'WX' ? '微信' : '支付宝'}}</text>
				</div>
				<div class = 'detail-cell'>
					<text class = 'detail-cell-name'>交易单号</text>
					<text class = 'detail-cell-data'>{{data.serialNumber}}</text>
				</div>
				<div class = 'detail-cell' v-if = "data.paymentStatus === '4'">
					<text class = 'detail-cell-name'>退款单号</text>
					<text class = 'detail-cell-data'>{{data.refundNumber}}</text>
				</div>
				<div class = 'detail-cell'>
					<text class = 'detail-cell-name'>交易门店</text>
					<text class = 'detail-cell-data'>{{data.merchantName}}</text>
				</div>
			</div>
		</div>
		<zz-navbar title="账单详情" :iconType="iconType" :iconCont="iconCont" @navHandle="navHandle" @prevback="prevback"></zz-navbar>
	</div>
</template>

<script>
    import zzNavbar from '../../components/zz-navbar.vue'
    const navigator=weex.requireModule('navigator');
	import { imgBase, changePage,formatTime,statusJudge,controlStrLength, changeStorage, storageName, fetchBillDetail, getImgUrl,startLoading,endLoading } from '../../func'
	export default {
		data(){
			return {
				data: {},
				id: '',
                iconType:0,
                iconCont:'退款',
                completeTree:false
			}
		},
		components: {
            zzNavbar
		},
		mounted(){
            startLoading()
			changeStorage('get', storageName.billId)
				.then(e => this.id = e.data)
				.then(id => fetchBillDetail({
					id: id
				}))
				.then(data => this.data = data.data)
				.then(_=>this.data.serialNumber=this.data.serialNumber.substring(0,32))
				.then(_=>this.data.paymentStatus==='2'?(this.iconType=2,changeStorage('set',storageName.billDetails,this.data)):this.iconType=0)
				.then(_=>{endLoading();this.completeTree=true})
		},
		methods: {
            navHandle(){
                changePage('refund.js')('退款')
			},
            prevback(){
                changeStorage('get', storageName.billShopName)
					.then(res=>changePage('back.js')(controlStrLength(res.data)))
			},
			statusJudge(param){
				return statusJudge(param)
			},
			getImgUrl(data){
				return getImgUrl(data === '3' ? 'fail' : 'success')
			}
		}
	}
</script>

<style lang = 'less' scoped>
	.backGround(@color: #fff){background-color: @color;}
	.borderBottom{
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #dedede;
	}
	.flexPub(@jusc){
		flex-direction: row;
		align-items: center;
		justify-content: @jusc;
	}
	.fontPub(@color){
		font-size: 24px;
		color: @color;
	}
	.paddingTBPub(@top, @bottom){
		padding-top: @top;
		padding-bottom: @bottom;
	}

	.detail-main{
		.backGround(#eee);
		flex: 1;
		margin-top:108px;
	}
	.state-show{
		.backGround;
		.borderBottom;
		.flexPub(center);
		height: 120px;
	}
	.block{
		.borderBottom;
		height: 26px;
	}
	.bill-detail{
		.borderBottom;
		background-color: #fff;
		.paddingTBPub(13px, 13px);
	}
	.detail-img{
		width: 60px;
		height: 60px;
	}
	.detail-state{
		padding-left: 26px;
		font-size: 32px;
	}
	.detail-cell{
		.flexPub(space-between);
		padding-left: 36px;
		padding-right: 36px;
		.paddingTBPub(16px, 16px);
	}
	.cell-time{
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #dedede;
		padding-top: 23px;
		margin-top: 10px;
	}
	.detail-cell-name{
		.fontPub(#888);
	}
	.detail-cell-data{
		.fontPub(#000);
	}
</style>