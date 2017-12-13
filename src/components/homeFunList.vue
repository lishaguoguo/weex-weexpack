<template>
	<div class = 'funclist-wrapper'>
<!-- 		<div class = 'funclist-top'>
			<div v-for = 'item, index in list' :key = 'index' class = 'funclist-item' @click = 'navigatorTo(item.path)'>
				<image class = 'top-icon' :src = "getImgUrl(item.icon)"></image>
				<text class = 'top-item-text'>{{item.text}}</text>
			</div>
		</div> -->
		<div class = 'funclist-user'>
			<div v-for = 'i, key in userlist' :key = 'key' class = 'user-row'>
				<div class = 'funclist-item funclist-user-item' v-for = 'item, index in i' :key = 'index' @click = 'navigatorTo(item.path, item.text)'>
	                <image class = 'user-icon' :src = "getImgUrl(item.icon)"></image>
					<text class = 'user-item-text'>{{item.text}}</text>
				</div>
				<div class = 'block' :style = "{ flex: 4 - i.length }" v-if = 'i.length < 4'></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { changePage, getImgUrl, changeStorage, storageName, fetchPermission, getVal } from '../func/index'
	const modal=weex.requireModule('modal')
	export default {
		data(){
			return {
				list: [
			        {
			            text: '扫一扫',
			            icon: 'funclist01',
			            path: 'my.js'
			        },{
			            text: '账 单',
			            icon: 'funclist02',
			            path: 'shopList.js'
			        },{
			            text: '报 表',
			            icon: 'funclist03',
			            path: 'charts.js'
			        }
			    ],
				userlist: []
			}
		},
		methods: {
			navigatorTo(path, title){
			    switch (title){
					case '店铺权限':
					    changePage(path)('选择店铺');
					    break;
					default:
                        changePage(path)(title)
				}
			},
			getImgUrl(path){
				return getImgUrl(path)
			}
		},
		mounted(){
//			changeStorage('get', storageName.loginUserInfo)
//			.then(res=>({data: {accountType: res.data.accountType}}))
			getVal()
			.then(e => ({data: {accountType: e.accountType}}))
			.then(e => e.data.accountType === '2' ? (
				this.userlist = [
				    [
				        {
				            text: '绑定收款码',
				            icon: 'usericon01',
				            path: '',
				        },{
				            text: '店铺详情',
				            icon: 'usericon02',
				            path: 'shopDetails.js'
				        },{
				            text: '账号管理',
				            icon: 'usericon03',
				            path: 'accountManage.js'
				        }
				    ]
				]
//				fetchPermission().then(data => changeStorage('set', storageName.savePermission, data.data))
			) : (
				this.userlist = [
				    [
				        {
				            text: '绑定收款码',
				            icon: 'usericon01',
				            path: ''
				        },{
				            text: '店铺管理',
				            icon: 'usericon02',
				            path: 'shopManage.js'
				        },{
				            text: '账号管理',
				            icon: 'usericon03',
				            path: 'accountManage.js'
				        },{
				            text: '店铺权限',
				            icon: 'usericon04',
				            path: 'storePermiss.js'
				        }
				    ]
				]
			))
		}
	}
</script>

<style lang = 'less' scoped>
	@itemTextSize: 24px;
	.funcPub(@bgColor, @alignItem, @justify, @flexD: column){
		background-color: @bgColor;
		flex-direction: @flexD;
		align-items: @alignItem;
		justify-content: @justify;
	}
	.itemText(@color, @paddingTop, @fontSize: @itemTextSize){
		color: @color;
		font-size: @fontSize;
		padding-top: @paddingTop;
	}
	.border(@width: 1px, @color: #dedede, @bdstyle: solid){
		border-bottom-width: @width;
		border-bottom-color: @color;
		border-bottom-style: @bdstyle;
	}
	.funclist-item{
		.funcPub(transparent, center, center);
		flex: 1;
	}

	.funclist-top{
		.funcPub(#3eba6c, center, space-around, row);
		height: 200px;
		.border;
	}
	.top-item-text{
		.itemText(#fff, 30px, 28px);
	}

	.funclist-user{
		.funcPub(#fff, stretch, flex-start);
		overflow: hidden;
		.border;
	}	
	.user-row{
		.funcPub(transparent, center, space-around, row);
		flex-grow: 1;
	}
	.funclist-user-item{
		padding-top: 38px;
		padding-bottom: 38px;
	}
	.user-item-text{
		.itemText(#000, 18px, 26px);
	}
	.user-icon{
		width: 82px;
		height: 95px;
	}
	.top-icon{
		width: 77px;
		height: 80px;
	}
</style>