<template>
	<div>
		<div class = 'add-shop-container' v-if="completeTree">
			<div class = 'edit-top'>
				<div class = 'edit-pic' @click="callCamera">
					<image
					:style = "{
						width: '120px',
						height: '120px'
					}"
					:src = 'headPortrait'></image>
					<image class="next-arrow" :src="getImg('iconenter')"></image>
				</div>
				<div class = 'edit-qrcode' @click="type === 'add' || type === 'save-add'?navigatorTo('editShopName.js', '店铺名称'):''">
					<text class = 'cell-title'>店铺名称</text>
					<text class = 'edit-mess'>{{shopName}}</text>
					<image v-if = "type === 'add' || type === 'save-add'" class="next-arrow" :src="getImg('iconenter')"></image>
				</div>
			</div>

			<div class = 'list-wrapper' v-for = 'item, index in editList' :key = 'index' v-if = 'item[0].sym === "invitationCode" ? sym : true'>
				<div class = 'edit-cell' v-for = 'i, key in item' :key = 'key' :style = "{ borderTopWidth: (key === 0 ? 0 : 1) + 'px' }" @click = 'navigatorTo(i.path, i.title)'>
					<text class = 'cell-title'>{{i.title}}</text>
					<text class = 'edit-mess'>{{i.text}}</text>
					<image class="next-arrow" :src="getImg('iconenter')"></image>
				</div>
			</div>
			<div class = 'btn-container'>
				<text class = 'edit-btn' @click = 'saveChanges'>保存</text>
			</div>
		</div>
	</div>
</template>

<script>
	import { decode, changeStorage, storageName,showMge,callPicture,getAddress,getImgUrl,callCamera,fetchRemoteImg,fetchOnlyKey,fetchQrcode, changePage, backPage, fetchShopDetail, editShop, getVal,showMessage,startLoading,endLoading} from '../../func'
	export default {
		data(){
			return {
				icon: decode('&#xe680;'),
                createQrImg:'',
                completeTree:false,
				editList: [
					[
                        {
                            title: '行业分类',
                            text: '',
                            path: 'chooseIndustry.js'
                        },
						{
							title: '店铺地址',
							text: '',
							path: 'editShopName.js'
						},{
							title: '店铺电话',
							text: '',
							path: 'editShopPhone.js'
						},{
							title: '店铺负责人',
							text: '',
							path: 'editShopName.js'
						}
					]
				],
                headPortrait:'',
				type: '',
                shopId:'',
				shopName:'',
				sym: false,
				ads:{}
			}
		},
		mounted(){
            startLoading()
				changeStorage('get', storageName.editType)
				.then(e => this.type = e.data)
				.then(type => type === 'edit' ? changeStorage('get', storageName.editShopId)
						.then(e => fetchShopDetail({
							id: e.data
						}))
						.then(data => changeStorage('set', storageName.editData, {
							spIndustryName: data.data.spIndustryName,
							shopName: data.data.shopName ,
							jcTerritoryName: data.data.jcTerritoryName,
							territoryDetail: data.data.territoryDetail,
                            jcTerritoryId: data.data.jcTerritoryId,
							phone: data.data.phone,
							spIndustryCode: data.data.spIndustryCode,
							contacts: data.data.contacts,
							headPortrait: data.data.headPortrait,
						}))
					: type === 'save-add' || type === 'save-edit' ? changeStorage('get', storageName.editData)
					: (changeStorage('set', storageName.editData, {headPortrait:'personHeadImg.jpg'})).then(_ => changeStorage('set', storageName.editShopId, '')))
                    .then(_ => getAddress())
                    .then(data =>data.address!==''?this.ads={
                        jcTerritoryName: data.address,
                        territoryDetail: data.detailedAddress,
                        jcTerritoryId:data.addressId
                    }: '')
                    .then(_=>changeStorage('get', storageName.editData))
                    .then(res=>Object.assign({},res.data,this.ads))
                    .then(res=>changeStorage('set', storageName.editData,res))
                    .then(_ => changeStorage('get', storageName.editData))
					.then(e => {
					    this.shopName=e.data.shopName
					this.editList[0][0].text = e.data.spIndustryName
					this.editList[0][1].text = `${e.data.jcTerritoryName === undefined ? '' : e.data.jcTerritoryName} ${e.data.territoryDetail === undefined ? '' : e.data.territoryDetail}`
					this.editList[0][2].text = e.data.phone
					this.editList[0][3].text = e.data.contacts
					changeStorage('get',storageName.shopHeaderImg)
						.then(res=>res.data===e.data.headPortrait?'':this.getRemoteImg(e.data.headPortrait))
				})
                    .then(_=>{endLoading();this.completeTree=true})
				.then(_=>callPicture())
                .then(res=>res.key!==''?this.getRemoteImg(res.key):'')
		},
		methods: {
            getImg(path){
              return getImgUrl(path)
			},
            callCamera(){
                callCamera()
					.then(res=>this.getRemoteImg(res.imagePath))
			},
            getRemoteImg(path){
                changeStorage('get', storageName.editData)
					.then(res=>Object.assign({},res.data,{headPortrait:path}))
					.then(data=>changeStorage('set',storageName.editData,data))
					.then(_=>fetchRemoteImg({key:path}))
                    .then(res=>this.headPortrait=res.data)
            },
			navigatorTo(path, title){
				return changeStorage('set', storageName.editListState, title)
				.then(_ => changeStorage('set', storageName.editType, this.type === 'add' ? 'save-add' : this.type === 'edit' ? 'save-edit' : this.type))
				.then(_ => changePage(path)(title))
			},
			saveChanges(){
                startLoading()
					changeStorage('get', storageName.editData)
					.then(data => changeStorage('get', storageName.editShopId)
						.then(e => Object.assign({}, data.data, e.data === '' ? {} : {
							id: e.data
						})))
					.then(params =>editShop(params))
					.then(data => {
                        endLoading()
					    data.code==="200"? changePage('shopManage.js')('店铺管理') :showMessage(data.code)})
			}
		}
	}
</script>

<style lang = 'less' scoped>
	.borderPub(@top: 1px, @bottom: 1px, @left: 36px, @margin: 40px){
		border-color: #dedede;
		border-style: solid;
		border-top-width: @top;
		border-bottom-width: @bottom;
		padding-left: @left;
		background-color: #fff;
		margin-bottom: @margin;
	}
	.flexPub{
		flex-direction: row;
		align-items: center;
	}
	.fontPub(@size, @color){
		font-size: @size;
		color: @color;
	}
	.blockPub(@height){
		height: @height;
		padding-right: 36px;
	}

	.add-shop-container{
		flex: 1;
		background-color: #eee;
	}
	.edit-top{
		.borderPub;
	}
	.edit-pic{
		.flexPub;
		.blockPub(148px);
		justify-content: space-between;
	}
	.edit-qrcode{
		.flexPub;
		.blockPub(88px);
		.borderPub(1px, 0, 0, 0);
	}
	.cell-title{
		.fontPub(32px, #000);
		flex: 2;
	}
	.list-wrapper{
		.borderPub(1px, 1px, 36px,20px);
	}
	.edit-cell{
		.flexPub;
		.blockPub(88px);
		.borderPub(1px, 0, 0, 0);
	}
	.edit-mess{
		.fontPub(30px, #444);
		flex:5;
		padding-right: 30px;
		text-align:right;
	}

	.btn-container{
		padding-top: 79px;
		align-items: center;
	}
	.edit-btn{
		.fontPub(36px, #fff);
		width: 654px;
		height: 92px;
		text-align: center;
		line-height: 92px;
		background-color: #3eba6c;
		border-radius: 6px;
	}
	.next-arrow{
		width:12px;
		height:22px
	}
</style>