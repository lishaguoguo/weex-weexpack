<template>
	<div>
		<div class = 'cash-container'>
			<div class = 'encash-load-container'>
				<image :src = 'getImgUrl("encashload")' class = 'load-img'></image>
				<text class = 'load-text'>{{state === '2' ? '提现审核中' : '提现已完成'}}</text>
			</div>
			<div class = 'cash-mess'>
				<div class = 'cash-cell' v-for = 'item, index in messList' :key = 'index'>
					<text class = 'cell-text'>{{item.text}}</text>
					<text class = 'cell-mess'>{{item.mess}}</text>
				</div>
			</div>
			<div class = 'btn-wrap'>
				<text class = 'encash-btn' @click = 'backPage'>完成</text>
			</div>
		</div>
	</div>
</template>

<script>
	import { getImgUrl, backPage, changeStorage, storageName, showMge,changePage, getCashDetail,saveValue,
        getValue } from '../../func'
	export default {
		data(){
			return {
				messList: [
					{
						text: '预计到账时间',
						mess: ''
					},{
						text: '储蓄卡',
						mess: ''
					},{
						text: '提现金额',
						mess: ''
					}
				],
				state: ''
			}
		},
		methods: {
			getImgUrl(path){
				return getImgUrl(path)
			},
			backPage(){
				return changePage('my.js')()
			}
		},
		mounted(){
            getValue('myShopId')
			.then(e => getCashDetail({
				spShopId: e.value
			}))
			.then(e => {
				this.state = e.data.cashWithdrawalStatus
				this.messList[0].mess = e.data.expectedTimeAccount
				this.messList[1].mess = `${e.data.bcBankCardTypeN}(${e.data.bankNo.substring(e.data.bankNo.length - 4, e.data.bankNo.length)})`
				this.messList[2].mess = `¥${e.data.cashWithdrawal / 100}`
			})
		}
	}
</script>

<style lang = 'less'>
	.fontPub(@size, @color){
		font-size: @size;
		color: @color;
	}

	.cash-container{
		background-color: #eee;
		flex: 1;
	}
	.encash-load-container{
		align-items: center;
		padding-top: 130px;
		padding-bottom: 60px;
	}
	.load-img{
		width: 190px;
		height: 190px;
	}
	.load-text{
		.fontPub(36px, #333);
		padding-top: 60px;
	}
	.cash-mess{
		background-color: #fff;
		padding-top: 30px;
		padding-left: 36px;
		padding-right: 36px;
	}
	.cash-cell{
		padding-bottom: 30px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.cell-text{
		.fontPub(28px, #333);
	}
	.cell-mess{
		.fontPub(28px, #666);
	}
	.btn-wrap{
		padding-top: 98px;
		align-items: center;
	}
	.encash-btn{
		.fontPub(32px, #fff);
		width: 654px;
		height: 91px;
		background-color: #3eba6c;
		text-align: center;
		line-height: 91px;
		border-radius: 8px;
	}
</style>