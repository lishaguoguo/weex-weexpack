<template>
	<div>
		<div class = 'cashcard-container'>
			<text class = 'cashcard-title'>到账银行卡</text>
			<div class = 'cashcard-choose'>
				<div class = 'cash-cell' v-for = 'item, index in cardList' :key = 'index' @click = 'checkedCard(item, index)'>
					<text class = 'cashname'>{{`${item.bcBankCardTypeN}(${item.bankNo.substring(item.bankNo.length - 4, item.bankNo.length)})`}}</text>
					<image
							:style="{
				    		width:32+'px',
				    		height:32+'px'
							}"
						   :src="item.checked?getImg('checked'):getImg('nocheck')"></image>
				</div>
				<div class = 'cash-cell' style = 'border-bottom-width: 0px' @click = 'navigatorTo("添加银行卡")'>
					<text class = 'cashname'>使用新卡提现</text>
					<image
							:style="{
				    		width:32+'px',
				    		height:32+'px'
							}"
							:src="getImg('nocheck')"></image>
               </div>
			</div>
		</div>
	</div>
</template>

<script>
	import { decode, backPage, fetchBankList, changePage,getImgUrl, changeStorage, storageName } from '../../func'
	export default {
		data() {
			return {
				icon: decode('&#xe613;'),
				cardList: [],
				selectedCard: '',
                selecticon:decode('&#xe8e4'),
                noSelecticon:decode('&#xe8b5'),
			}
		},
		methods: {
		    getImg(path){
		      return getImgUrl(path)
			},
			checkedCard(item, index){
				this.addCheckIcon(item.bankNo)
				return changeStorage('set', storageName.cashCardState, 'save')
					.then(_ => changeStorage('set', storageName.cashCardInfo, item))
					.then(_ => changePage('encashment.js')('提现'))
			},
			addCheckIcon(bankNo){
				this.cardList = this.cardList.map((val, key) => Object.assign({}, val, {
					checked: val.bankNo === bankNo ? true : false
				}))
			},
			navigatorTo(title){
				return changePage('')(title)
			}
		},
		mounted(){
			fetchBankList()
			.then(data => this.cardList = data.data)
			.then(_ => changeStorage('get', storageName.selectedCard))
			.then(e => this.addCheckIcon(e.data))
		}
	}
</script>

<style lang = 'less'>
	.fontPub(@size, @color){
		font-size: @size;
		color: @color;
	}

	.cashcard-container{
		background-color: #eee;
		flex: 1;
		padding-top: 40px;
	}
	.cashcard-title{
		.fontPub(28px, #666);
		padding-left: 36px;
		padding-bottom: 26px;
	}
	.cashcard-choose{
		background-color: #fff;
		padding-left: 36px;
	}
	.cash-cell{
		height: 90px;
		flex-direction: row;
		align-items: center;
		border-style: solid;
		border-color: #dedede;
		border-bottom-width: 1px;
		padding-right: 36px;
	}
	.cashname{
		.fontPub(32px, #333);
		flex: 1;
	}
	.selecticon{
		font-family: iconfont1;
		font-size:40px;
	}
</style>