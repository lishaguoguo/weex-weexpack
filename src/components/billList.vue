<template>
	<div class="wrapper">
		<div class = 'list-title'>
			<text class = 'tt-date'>{{data.date}}</text>
			<text class = 'tt-money'>{{`共${data.totalNumber}笔`}}</text>
			<text class = 'tt-num'>{{`¥${data.totalMoney}`}}</text>
		</div>
		<div class="scroller-wrapper" :style="{minHeight:minHeights}">
		<div class="cell-wrapper"  v-for = 'item, index in data.transactionList' :key = 'index'>
			<div class = 'list-cell' @click="navigatorTo(item.id)">
				<image class = 'cell-img' :src = 'chooseImg(item)'></image>
				<div class = 'main-mess'>
					<div class = 'cell-status'>
						<text class = 'top-mess lef' :style = "{ color: changeFailColor(item, '#000')}">{{statusJudge(item.paymentStatus)}}</text>
						<text class = 'top-mess' :style = "{ color: changeFailColor(item, '#000')}">{{`¥${String(item.transactionPrice).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,')}`}}</text>
					</div>
					<div class = 'cell-status'>
						<text class = 'bot-mess lef' :style = "{ color: changeFailColor(item, '#888')}">{{cutStrOff(item.date)}}</text>
						<text class = 'bot-mess' :style = "{ color: (item.paymentStatus === '4' ? '#f00' : changeFailColor(item, '#888'))}">{{item.paymentStatus === '4' ? `-${item.transactionPrice}` : item.serialNumber}}</text>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import { imgBase, changePage, changeStorage, statusJudge, storageName, getImgUrl,showMge } from '../func'
    export default {
        data(){
            return {
                isClick:false
            }
        },
        props: {
            data: {
                required: true,
                type: Object
            },
            wrapperLength:{
                required:true,
				type:Number
			},
            totalNum:'',
            billindex:Number,
            minNum:Number
        },
        computed:{
            minHeights(){
                return this.wrapperLength>1?this.billindex+1===this.wrapperLength?(10-this.minNum)*100+'px':0+'px':1000+'px'
            }
		},
        methods: {
            statusJudge(param){
                return statusJudge(param)
            },
            changeFailColor(item, colorStr){
                return item.paymentStatus === '3' ? '#ddd' : colorStr
            },
            cutStrOff(str){
                return str.substring(10, str.length)
            },
            cutSerialStr(str){
                return str.substring(30, str.length)
            },
            chooseImg(item){
                return getImgUrl((_ => item.paymentType === 'WX' ? (item.paymentStatus === '3' ? 'wx' : 'wxact') : (item.paymentStatus === '3' ? 'zfb' : 'zfbact'))())
            },
            navigatorTo(id){
                changeStorage('set', storageName.billId, id)
                    .then(_ => changePage('billDetails.js')('账单详情'))
            }
        },
    }
</script>

<style lang="less" scoped>
	.borderBottom{
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #dedede;
	}
	.cellPub(@height, @left: 36px){
		flex-direction: row;
		align-items: center;
		padding-left: @left;
		padding-right: 36px;
		height: @height;
	}
	.fontPub(@size: 24px, @color: #888){
		font-size: @size;
		color: @color;
	}
	/*.scroller-wrapper{*/
		/*min-height: 600px;*/
	/*}*/
	.list-title{
		.cellPub(52px);
		.borderBottom;
	}
	.tt-date{
		.fontPub;
		flex: 1;
	}
	.tt-num{
		.fontPub;
		padding-left: 45px;
	}
	.tt-money{
		.fontPub;
	}
	.cell-wrapper {
		position: relative;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		padding-left:36px;
		height:100px;
		background-color:#fff;
		.borderBottom;
	}
	.list-cell{
		flex:1;
		.cellPub(88px, 0);
	}
	.cell-img{
		height: 60px;
		width: 60px;
	}
	.main-mess{
		padding-left: 34px;
		flex: 1;
	}
	.cell-status{
		flex-direction: row;
		align-items: center;
	}
	.top-mess{
		.fontPub(28px, #000);
		/*padding-top: 20px;*/
	}
	.bot-mess{
		.fontPub(24px);
		padding-top: 10px;
	}
	.lef{
		flex: 1;
	}
	.item-select{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
</style>