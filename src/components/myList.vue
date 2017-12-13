<template>
	<div calss = 'list-wrapper' append="tree">
		<div class = 'my-cell' v-for = 'item, index in list' :key = 'index' @click = 'navigatorTo(item.path, item.title)'>
			<div class = 'cell-wrapper' :style = "{ borderBottomWidth: (index === list.length - 1 ? 0 : 1) + 'px' }">
				<image class = 'mylist-icon' :src = "getImgUrl(item.icon)"></image>
				<text class = 'my-title'>{{item.title}}</text>
				<image :style="{
						width:'14px',
						height:'26px'
				}" :src="getImgUrl('iconenter')"></image>
			</div>
		</div>
		<div class = 'list-sep'></div>
	</div>
</template>

<script>
	import { decode, getImgUrl, changePage,showMge,changeStorage,storageName,getDateNow} from '../func'
	export default {
		data(){
			return {
				icon: decode('&#xe680;')
			}
		},
		props: {
			list: Array,
            shopId:'',
            shopType:''
		},
		methods: {
			getImgUrl(path){
				return getImgUrl(path)
			},
			navigatorTo(path, title){
			    switch (title) {
					case '账号切换':
					case '退出登录':
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
						break;
				}
                return  title==='申请充值'?showMge('此模块正在开发中...'):this.shopType==='1'? this.shopId?changePage(path)(title):this.noShop(path,title):changePage(path)(title)
			},
            noShop(path,title){
                switch (title){
                    case '提现记录':
                    case '卡包':
                        return showMge('请先添加店铺');
                    default:
                        return  changePage(path)(title)
                }
            },
		}
	}
</script>

<style lang = 'less' scoped>
	.paddL(@left){
		padding-left: @left;
	}
	.list-sep{
		height: 20px;
	}
	.my-cell{
		background-color: #fff;
		.paddL(36px);
	}
	.my-cell:active{
		background-color: #eee;
	}
	.cell-wrapper{
		border-bottom-style: solid;
		border-bottom-color: #dedede;
		height: 96px;
		align-items: center;
		flex-direction: row;
		padding-right: 36px;
	}
	.my-title{
		font-size: 34px;
		color: #333;
		flex: 1;
		.paddL(28px);
	}
	.mylist-icon{
		width: 44px;
		height: 44px;
	}
</style>