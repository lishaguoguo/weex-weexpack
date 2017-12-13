<template>
	<div>
		<div class = 'shop-detail-container' v-if="completeTree">
			<div class = 'detail-content'>
				<div v-for = 'item, index in shopData.dataList' :key = 'index' class = 'detail-cell'>
					<text class = 'detail-title'>{{item.title}}</text>
					<text class = 'detail-text'>{{item.text}}</text>
				</div>
			</div>
			<div class = 'detail-btn' @click="navigatorTo('shopQr.js','二维码')">
				<text class = 'btn-block'>查看店铺二维码</text>
			</div>
		</div>
	</div>
</template>

<script>
	import { changePage, changeStorage, storageName,showMessage, fetchShopDetail, getVal,fetchOnlyKey,fetchQrcode,startLoading,endLoading} from '../../func'
	export default {
		data(){
			return {
				shopData: {
					dataList: [
                        {
                            title: '店铺名称',
                        },{
                            title: '店铺号',
                        },{
							title: '店铺状态',
						},{
							title: '店铺区域',
						},{
							title: '店铺地址',
						},{
							title: '行业分类',
						},{
							title: '店铺电话',
						}
					]
				},
				shopId:'',
				name: '',
				completeTree:false
			}
		},
		mounted(){
//			 changeStorage('get', storageName.loginUserInfo)
//        	.then(res=>({data: {accountType: res.data.accountType}}))
            startLoading()
			getVal()
			.then(e => ({data: {accountType: e.accountType}}))
			.then(e => e.data.accountType === '2' || e.data.accountType === '3' ? ({}) : changeStorage('get', storageName.editShopId)
				.then(e => this.shopId=e.data))
			.then(_ =>fetchShopDetail({id:this.shopId}))
			.then(data => data.code==='200'?(
                this.shopId=data.data.id,
                changeStorage('set', storageName.editShopId,data.data.id),
			    this.shopData = {
				shopName: data.data.shopName,
				dataList: [
                    {
                        title: '店铺名称',
                        text: data.data.shopName
                    },
                    {
                        title: '店铺号',
                        text: data.data.shopCode
                    },
					{
						title: '店铺状态',
						text: data.data.lineState === '0' ? '上线' : '下线'
					},{
						title: '店铺区域',
						text: data.data.jcTerritoryName
					},{
						title: '店铺地址',
						text: data.data.territoryDetail
					},{
						title: '行业分类',
						text: data.data.spIndustryName
					},{
						title: '店铺电话',
						text: data.data.phone
					}
				]
			}):showMessage(data.code))
				.then(_=>{endLoading();this.completeTree=true})
//				.then(_=>changeStorage('set',storageName.erweima,''))
//                .then(_=>fetchOnlyKey({shopId:this.shopId}))
//                .then(e=>{e.code==='200'?(changeStorage('set',storageName.erweima,{qr:fetchQrcode({paySecret:e.data.paySecret,codeNo:e.data.codeNo}),paySecret:e.data.paySecret,codeNo:e.data.codeNo})):''})
		},
		methods:{
            navigatorTo(path,title){
                changePage(path)(title)
			}
		}
	}
</script>

<style lang = 'less' scoped>
	.fontPub(@color, @size: 26px){
		font-size: @size;
		color: @color;
	}

	.shop-detail-container{
		flex: 1;
		background-color: #f6f6f6;
	}
	.detail-content{
		background-color: #fff;
		border-color: #dedede;
		border-style: solid;
		border-bottom-width: 1px;
		padding-left: 36px;
		padding-right: 36px;
		padding-top: 30px;
	}
	.detail-cell{
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30px;
	}
	.detail-title{
		.fontPub(#3a3a3a);
	}
	.detail-text{
		.fontPub(#010101);
	}
	.detail-btn{
		padding-top: 80px;
		align-items: center;
	}
	.btn-block{
		.fontPub(#fff, 32px);
		width: 560px;
		height: 92px;
		background-color: #3eba6c;
		border-radius: 6px;
		text-align: center;
		line-height: 92px;
	}
</style>