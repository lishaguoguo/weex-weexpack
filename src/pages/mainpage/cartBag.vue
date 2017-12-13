<template>
    <div class="cartbag">
        <div class="set-list-item" @click="itemClick">
            <text class="set-title">卡券管理</text>
            <div class="next-wrapper">
                <image :style="{
						width:'12px',
						height:'22px'
				}" :src="getImg('iconenter')"></image>
            </div>
        </div>
        <div class="cart-type">
            <div class="online" @click="discount">
                <image class="line-imgl" :src="getImg('discount')"></image>
                <text class="line-text">店铺优惠券</text>
            </div>
            <div class="offline" @click="redPacket">
                <image class="line-imgr" :src="getImg('redbag')"></image>
                <text class="line-text">店铺红包</text>
            </div>
        </div>
    </div>
</template>

<script>
    import {changePage,changeStorage,storageName,getImgUrl} from '../../func/index'
    import he from 'he'
    export default {
        data(){
            return{
                icon: he.decode('&#xe680'),
            }
        },
        methods:{
            itemClick(){
                changePage('cartManage.js')('卡券管理')
            },
            discount(){
                let obj={
                    couponType:1,
                    couponStatus:'2,3'
                };
                changeStorage('set',storageName.navigatorCartType,obj);
                changePage('cartRecord.js')('店铺优惠券')
            },
            redPacket(){
                let obj={
                    couponType:2,
                    couponStatus:'2,3'
                };
                changeStorage('set',storageName.navigatorCartType,obj);
                changePage('cartRecord.js')('店铺红包')
            },
            onDialogCallback(){
                this.showDialog=false;
            },
            getImg(path){
                return getImgUrl(path)
            }
        },
    }
</script>

<style lang="less" scoped>
    .cartbag{
        background-color:#eee;
    }
    .cartcont{
        margin-top:18px;
        margin-bottom:0;
    }
    .set-list-item {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        padding-left:36px;
        padding-right:36px;
        height:108px;
        background-color: #fff;
    }
    .set-title,.next-wrapper {
        justify-content: center;
    }
    .set-title {
        flex: 8;
        font-size: 34px;
        color: #333;
    }
    .next-wrapper {
        flex: 1;
        flex-direction: row;
        justify-content: flex-end;
    }

    .next {
        font-family: iconfont;
        color: #a3a3a3;
        font-size: 26px;
        text-align: right;
    }
    .cart-type {
        flex-direction: row;
        height:170px;
        border-top-width:1px;
        border-top-style: solid;
        border-top-color:#dedede;
        background-color: #fff;
    }
    .online,.offline{
        flex:1;
        justify-content: center;
        align-items: center;
    }
    .line-imgl{
        width:72px;
        height:58px;
        margin-bottom:17px;
    }
    .line-imgr{
        width:64px;
        height:72px;
        margin-bottom:17px;
    }
    .dialog-text{
        margin-bottom:10px;
        font-size:26px;
        color:#666;
    }
    .line-text{
        font-size:30px;
        color:#888;
    }
</style>