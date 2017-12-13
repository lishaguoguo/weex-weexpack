<template>
	<div>
		<list class = 'shop-list' v-if='!nulldata'>
			<cell v-for = 'item, index in list' :key = 'index' @click = 'navigatorTo(item)' class = 'shop-cell'>
				<div class = 'shop-image'>
					<image :style = "{
							width: '100px',
							height: '100px'
						}" :src="item.headPortrait"></image>
				</div>
				<div class = 'shop-main'>
					<text class = 'shop-name'>{{cutString(item.shopName)}}</text>
					<text class = 'shop-mess'>{{`负责人：${cutString(item.contacts)}`}}</text>
				</div>
				<image class="next-arrow" :src="getImg('iconenter')"></image>
			</cell>
		</list>
		<div class="nulldata" v-if='nulldata'>
			<dataBlock></dataBlock>
		</div>
	</div>
</template>

<script>
    import dataBlock from '../../components/dataBlock.vue'
	import { decode, changePage, changeStorage, storageName,getImgUrl, getDateNow,controlStrLength, fetchShopList ,fetchRemoteImg,showMessage,startLoading,endLoading} from '../../func'
	export default {
		components: {
            dataBlock
		},
		data(){
			return {
				list: [],
				icon: decode('&#xe680;'),
                nulldata:false,
			}
		},
		methods: {
            cutString(str){
                return str.length > 11 ? str.substring(0, 11)+'...' : str
            },
		    getImg(path){
		      return getImgUrl(path)
			},
			navigatorTo(item){
				changeStorage('set', storageName.billShopName, item.shopName)
					.then(_ => changeStorage('set', storageName.billShopId, item.id))
					.then(_ => changeStorage('set', storageName.filterParam, ''))
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
					.then(_ => changePage('shopBill.js')(controlStrLength(item.shopName)))
			},
            getRemoteImg(path,i){
                fetchRemoteImg({key:path})
                    .then(res=>this.list[i].headPortrait=res.data)
            },
		},
        created(){
            startLoading();
        },
		mounted(){
			fetchShopList({lineState: 0})
                .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                .then(param => param.code === '200' ? this.list = param.data :param.code==="60012"?this.nulldata=true:showMessage(param.code))
                .then(_ => {for(let i in this.list){this.getRemoteImg(this.list[i].headPortrait,i)}})
        }
	}
</script>

<style lang = 'less' scoped>
	.textPub(@size, @color: #000){
		font-size: @size;
		color: @color;
	}
	.shop-list{
		flex: 1;
		background-color: #fff;
	}
	.shop-cell{
		border-bottom-width: 1px;
		border-bottom-color: #dedede;
		border-bottom-style: solid;
		height: 148px;
		flex-direction: row;
		align-items: center;
		padding-right: 36px;
		padding-left: 36px;
	}
	.shop-image{
		height: 100px;
		width: 100px;
	}
	.shop-main{
		flex: 1;
		padding-left: 32px;
	}
	.shop-name{
		.textPub(34px);
	}
	.shop-mess{
		.textPub(30px, #3a3a3a);
		padding-top: 25px;
	}
	.nulldata{
		flex:1;
		justify-content: center;
		align-items: center;
	}
	.next-arrow{
		width:12px;
		height:22px
	}
</style>