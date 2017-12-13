<template>
    <div class="cart-wrapper">
        <div class="cart-item" v-for="item,index in lists" :key="index">
            <zz-checkbox class="cart-select" :deleteinfo="isDelete" :check="item.selectDelete"></zz-checkbox>
            <div class="cart-itemcont">
                <div class="cart-cont">
                    <div class="cart-discount">
                        <div class="discount-money">
                            <text class="discount-icon" :style="{'color':item.moneycolor}">￥</text>
                            <text class="discount-num" :style="{'color':item.moneycolor}">{{item.discountAmount}}</text>
                        </div>
                        <text class="discount-type" :style="{'color':item.moneycolor}">{{item.couponType === '1' ? '优惠券' : '红包'}}</text>
                    </div>
                    <div class="cart-dec">
                        <text class="dec-name" :style="{'color':item.deccolor}">店铺{{item.discountAmount}}元{{item.couponType === '1' ? '优惠券' : '红包'}}</text>
                        <text class="dec-detail" :style="{'color':item.deccolor?item.deccolor:'#666'}">进店消费，满{{item.fullAmount}}元可用</text>
                    </div>
                    <div v-if="isShare" class="sharebox" @click="cardShares(item)">
                        <image :src="getImg('share')" :style="{width:40+'px',height:40+'px'}"></image>
                    </div>
                </div>
                <div class="cart-status" :style="{'background-color':item.cartbackcolor}">
                    <text class="validity" :style="{'color':item.timecolor}">有效期：{{item.startDate}}至{{item.deadline}}</text>
                    <div class="status-wrapper">
                        <text class="status" :style="{'color':item.statuscolor,'border-width':clickApply?'1px':0}" @click="applyOnline(item.itemdisabled,item)">{{item.couponStatus}}</text>
                    </div>
                    </div>
                <div class="usedtime" v-if="isUsed">
                    <image class="usedbackimg" :src="getImg('usedcarttwo')"></image>
                    <text class="used-date">使用日期：{{item.serviceTime}}</text>
                </div>
            </div>
            <div class="item-select" v-if="isDelete" @click="select(item)"></div>
        </div>
    </div>
</template>
<script>
    import he from 'he';
    import zzCheckbox from '../components/zz-checkbox.vue'
    const modal=weex.requireModule('modal')
    import {formatDate, stringDate, getImgUrl,cardShare,showMge,fetchCardShare,showMessage,startLoading,endLoading} from '../func/index'
    export default {
        components: {
            zzCheckbox
        },
        data(){
            return {
                icon: he.decode('&#xe8b5'),
                icons: he.decode('&#xe8e4'),
                ad:true //申请上线连续点击
            }
        },
        props: {
            lists: {
                type: Array,
                required: true
            },
            isDelete: Boolean,
            isAllselect: Boolean,
            isUsed: Boolean,
            isShare:Boolean,
            clickApply:Boolean
        },
        methods: {
            select(v) {
                this.$emit('inverseSelect', v);
            },
            getImg(path){
                return getImgUrl(path)
            },
            applyOnline(type,item){
                if (!type) {
                    startLoading()
//                    this.ad?(this.$emit('applyOnline',item),this.ad=false):''
                    this.$emit('applyOnline',item)
                }
            },
            cardShares(item){
                fetchCardShare({id:item.id})
                    .then(res=>res.code==='200'?cardShare(`http://mt.qdxiao2.com/api-mt/cp/share/v1/goAuthorization?cpBatchId=${item.id}`):showMessage(res.code))
            }
        },
    }
</script>

<style lang="less" scoped>
    .cart-wrapper{
        min-height: 1120px;
    }
    .cart-item {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        padding-top: 18px;
        margin-left: 30px;
        margin-right: 30px;
    }

    .cart-select {
        margin-right: 18px;
    }

    .item-select {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .cart-itemcont {
        flex: 1;
        border-radius: 10px;
        background-color: #fff;
    }

    .cart-cont {
        flex-direction: row;
        align-items: center;
    }

    .cart-discount {
        flex: 2;
        align-items: center;
        height: 146px;
        justify-content: center;
        border-right-width: 3px;
        border-left-width: 0;
        border-top-width: 0;
        border-bottom-width: 0;
        border-style: dashed;
        border-color: #eaeaea;
    }

    .discount-money {
        flex-direction: row;
        margin-bottom: 7px;
    }

    .discount-icon {
        margin-top: 24px;
        font-size: 30px;
    }

    .discount-num {
        font-size: 58px;
    }

    .discount-type {
        font-size: 28px;
    }

    .dec-name {
        margin-bottom: 18px;
    }

    .cart-dec {
        flex: 5;
        padding-left: 35px;
    }

    .dec-name {
        font-size: 30px;
    }

    .dec-detail {
        font-size: 26px;
    }
.status-wrapper{
    position: relative;
}
.cardbtn{
    position: absolute;
    left:0;
    right:0;
    bottom:0;
    top:0;
}
    .cart-status {
        height: 56px;
        flex-direction: row;
        padding-left: 38px;
        padding-right: 38px;
        align-items: center;
    }

    .validity, .status {
        font-size: 24px;
    }
    .status{
        border-color:#3eba6c;
        border-style:solid;
        border-radius:20px;
        padding-top:5px;
        padding-bottom:5px;
        padding-left:10px;
        padding-right:10px;
    }

    .validity {
        flex: 1;
    }

    .usedtime {
        width: 220px;
        height: 75px;
        position: absolute;
        right: 10px;
        bottom: 40px;
        align-items: center;
        justify-content: center;
        transform: rotate(-20deg);
    }

    .usedbackimg {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .used-date {
        font-size: 18px;
        color: #ccc;
    }
    .sharebox{
        justify-content: center;
        align-items: center;
        margin-right:26px;
    }
</style>