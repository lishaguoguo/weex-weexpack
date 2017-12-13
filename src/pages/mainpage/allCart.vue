<template>
    <div class="allcart">
        <div class="cart-type">
            <div class="online" @click="onlineCart">
                <image class="line-img" :src="getImg('getup')"></image>
                <text class="line-text">已上线</text>
            </div>
            <div class="offline" @click="offlineCart">
                <image class="line-img" :src="getImg('getunder')"></image>
                <text class="line-text">未上线</text>
            </div>
        </div>
    </div>
</template>

<script>
    import {changePage,changeStorage,storageName,getImgUrl} from '../../func/index'
    export default {
        methods:{
            onlineCart(){
                let obj={
                    couponType:'',
                    couponStatus:'2,3'
                };
                changeStorage('set',storageName.navigatorCartType,obj);
                changePage('cartRecord.js')('已上线卡券')
            },
            offlineCart(){
                let obj={
                    couponType:'',
                    couponStatus:'1,6'
                };
                changeStorage('set',storageName.navigatorCartType,obj);
                changePage('cartRecord.js')('未上线卡券')
            },
            getImg(path){
                return getImgUrl(path)
            }
        }
    }
</script>

<style lang="less" scoped>
    .allcart {
        background-color: #eee;
    }

    .cart-type {
        flex-direction: row;
        height:170px;
        margin-top:18px;
        background-color: #fff;
    }
    .online,.offline{
        flex:1;
        justify-content: center;
        align-items: center;
    }
    .line-img{
        width:76px;
        height:76px;
        margin-bottom:17px;
    }
    .line-text{
        font-size:30px;
        color:#888;
    }
</style>