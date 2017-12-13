<template>
	<div class="wapper">
		<div class = 'shop-classification'>
			<div class = 'shop-block-container' :style="{borderColor:item.state===state?'#3eba6c':'#dedede'}" v-for = 'item, index in stateList' :key = 'index' @click = 'changeShopType(item,item.state)'>
					<text class = 'block-text' :style="{color:item.state===state?'#3eba6c':'#666'}">{{item.text}}</text>
			</div>
		</div>
		<list class = 'shop-list-container' v-if='!nulldata'>
			<cell class = 'shop-cell' v-for = 'item, index in dataList' :key = 'index'>
				<div class = 'shop-content' @click = 'navigatorTo(item.id,item.mtUserId)'>
					<div class = 'mockImage'>
						<image :style = "{
							width: '120px',
							height: '120px',
							backgroungColor:'#eee'
						}" :src="item.headPortrait"></image>
					</div>
					<div class = 'shop-text'>
						<text class = 'shop-name'>{{cutString(item.shopName)}}</text>
						<text class = 'shop-address'>{{cutString(item.jcTerritoryName)}}</text>
					</div>
					<div class = 'mockImage'>
						<image :style = "{
							width: '74px',
							height: '74px',
							backgroungColor:'#eee'
						}" :src="getImgUrl('erweimaicon2')"></image>
					</div>
				</div>
				<div class = 'shop-btn'>
					<div class = 'btn-container' @click = 'toEditShop(item.id,item.mtUserId)'>
						<image
								:style = "{
							width: '28px',
							height: '28px'
						}"
								:src = 'getImgUrl("editicon")'></image>
						<text class = 'btn-text'>编辑</text>
					</div>
					<div class = 'btn-container' @click = 'changeState(item.id)'>
						<image
								:style = "{
							width: '28px',
							height: '31px'
						}"
								:src = 'getImgUrl("deleteicon")'></image>
						<text class = 'btn-text'>删除</text>
					</div>
				</div>
				<div class = 'block'></div>
			</cell>
		</list>
		<div class="nulldata" v-if='nulldata'>
			<dataBlock></dataBlock>
		</div>
		<zzActionsheet :items = '["确定"]' title = '确定要删除店铺吗？' :show = 'isVisible' @itemClick = 'deleteShop(deleteId)' @btnClick = 'isVisible = false' @close = 'isVisible = false'></zzActionsheet>
		<zz-navbar title="店铺管理" iconCont="添加" :iconType="2" @navHandle="navHandle" @prevback="prevback"></zz-navbar>
	</div>
</template>

<script>
    import zzNavbar from '../../components/zz-navbar.vue'
    import zzActionsheet from '../../components/zz-actionsheet.vue'
    import dataBlock from '../../components/dataBlock.vue'
    const navigator=weex.requireModule('navigator');
    import { decode, changePage,fetchRemoteImg, getImgUrl, changeStorage, storageName,deleteShop,showMge,showMessage,fetchShopList,startLoading,endLoading,saveValue,getValue } from '../../func'
    export default {
        data(){
            return {
                nulldata:false,
                dataList: [],
                deleteId: '',
                state:0,
                isVisible: false,
                isinitial:true,
                stateList: [
                    {
                        img: 'getup',
                        text: '已上线',
                        state: 0                 //已上线店铺状态为0，已下线店铺状态为1.
                    },
                    {
                        img: 'getunder',
                        text: '已下线',
                        state: 1,
                    }
                ]
            }
        },
        components: {
            zzNavbar,
            dataBlock,
            zzActionsheet
        },
        mounted(){
            startLoading();
            this.isinitial=false
            changeStorage('get', storageName.manageType)
                .then(res=>res.data?(this.getData(res.data),this.state=res.data):this.getData(this.state))
            changeStorage('set', storageName.editType, 'add')
		},
        methods: {
            cutString(str){
                return str.length > 11 ? str.substring(0, 11)+'...' : str
            },
            prevback(){
                changePage('back.js')('首页')
            },
            navHandle(){
                changeStorage('set', storageName.editType, 'add')
                    .then(_=>changePage('addShop.js')('添加店铺'))
					.then(_=>changeStorage('set', storageName.manageType,0))
            },
            getImgUrl(path){
                return getImgUrl(path)
            },
            getRemoteImg(path,item){
                return fetchRemoteImg({key:path})
                    .then(res=>item.headPortrait=res.data)
                    .then(_=>saveValue('shopList')(this.dataList))
            },
            changeShopType(item,state){
                item.active=true;
                this.nulldata=false;
                this.state=state;
                this.getData(state);
                changeStorage('set', storageName.manageType,state)
            },
            toEditShop(id,userId){
                changeStorage('set', storageName.userQrId, userId)
                    .then(_=>changeStorage('set', storageName.editShopId, id))
                    .then(_ => changeStorage('set', storageName.editType, 'edit'))
                    .then(_ => changeStorage('set', storageName.symInvitationCode, false))
                    .then(_ => changePage('addShop.js')('编辑店铺'))
            },
            navigatorTo(id,userId){
                changeStorage('set', storageName.userQrId, userId)
                    .then(_=>changeStorage('set', storageName.editShopId, id))
                    .then(_ => changePage('shopDetails.js')('店铺详情'))
            },
            changeState(id){
                this.deleteId = id
                this.isVisible = true
            },
            deleteShop(id){
                startLoading()
                 deleteShop({id: id})
					.then(_=>getValue('myShopId'))
					.then(res=>id===res.value?(saveValue('myShopId')('')):'')
                    .then(_=>getValue('chartsShopId'))
                    .then(res=>id===res.value?(saveValue('chartsShopId')('')):'')
                    .then(_ => this.getData(this.state))
                    .then(_ => setTimeout(()=>{this.isVisible = false},200))
            },
            getData(state){
                fetchShopList({lineState: state})
                    .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                    .then(data => {
                        data.code==='200'?this.dataList = data.data:data.code==='60012'?(saveValue('shopList')(''),this.dataList=[],this.nulldata=true):showMessage(data.code)
                    })
                    .then(_ => this.dataList.forEach(item=> {
                        Vue.set(item, 'selected', false)
                        this.getRemoteImg(item.headPortrait,item);
                    }))
            }
        }
    }
</script>

<style lang = 'less' scoped>
	.borderBot(@top,@color:#dedede){
		border-width:0;
		border-bottom-width: 1px;
		border-color: @color;
		border-style: solid;
		border-top-width: @top;
	}
	.blockPub(@height, @top: 0){
		.borderBot(@top);
		flex-direction: row;
		align-items: center;
		padding-left: 36px;
		padding-right: 36px;
		background-color: #fff;
		height: @height;
	}
	.fontPub(@size, @color){
		font-size: @size;
		color: @color;
	}
	.wapper{
		background-color: #f6f6f6;
	}

	.shop-list-container{
		flex: 1;
		margin-top:20px;
	}
	.block{
		height: 18px;
	}
	.shop-content{
		.blockPub(184px, 1px);
	}
	.shop-text{
		padding-left: 30px;
		flex: 1;
	}
	.shop-name{
		.fontPub(34px, #000);
	}
	.shop-address{
		.fontPub(28px, #3a3a3a);
		padding-top: 25px;
	}
	.shop-btn{
		.blockPub(72px);
		justify-content: flex-end;
	}
	.btn-container{
		padding-left: 50px;
		flex-direction: row;
		align-items: center;
	}
	.btn-text{
		.fontPub(28px, #000);
		padding-left: 10px;
	}

	.mockImage{
		justify-content: center;
		align-items: center;
	}
	.nulldata{
		flex:1;
		justify-content: center;
		align-items: center;
	}
	.shop-classification{
		.blockPub(100px, 0);
		margin-top:88px;
	}
	.shop-block-container{
		flex: 1;
		height:100px;
		align-items: center;
		justify-content: center;
		.borderBot(0px);
		border-bottom-width: 2px;
	}
	.block-text{
		.fontPub(35px, #888);
	}
	.state-img{
		width: 76px;
		height: 76px;
	}
</style>