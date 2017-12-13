<template>
    <div class="record-wrapper">
        <div class="record-item" v-for="item,i in records" :key="i">
            <div class="record-monthbox" v-if="item.showMonth">
                <text class="record-month">{{item.month}}月</text>
            </div>
            <div class="store-item" >
                <div class="store-logo">
                    <image class="store-logoimg" :src="getImg(item.bcBankCardTypeN)"></image>
                </div>
                <div class="store-main">
                    <text class="store-name">{{item.bcBankCardTypeN}}</text>
                    <text class="store-ads">{{item.createTime}}</text>
                </div>
                <div class="store-right">
                    <text class="store-name">￥{{item.cashWithdrawal}}</text>
                    <text class="store-ads" :style="{'color':item.cashWithdrawalStatus==='2'?'#3eba6c':'#999'}">{{status(item.cashWithdrawalStatus)}}</text>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .border(@top,@right,@bottom,@left){
        border-top-width:@top;
        border-right-width:@right;
        border-bottom-width:@bottom;
        border-left-width:@left;
        border-color:#dedede;
        border-style:solid;
    }
    .logoimg(@size,@radius){
        width: @size;
        height: @size;
        border-radius: @radius;
    }
    .record-wrapper{
        min-height: 1120px;
        background-color:#f6f6f6;
    }
    .store-item{
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height:116px;
        padding-left:36px;
        padding-right:36px;
        .border(0,0,1px,0);
        background-color:#fff;
    }
    .record-monthbox{
        justify-content: center;
        padding-top:30px;
        padding-bottom:18px;
        padding-left:36px;
        padding-right:36px;
    }
    .record-month{
        font-size:28px;
        color:#666;
    }
    .store-logo{
        flex:1;
        margin-right:20px;
    }
    .store-logoimg {
        .logoimg(70px,0);
    }
    .store-main{
        flex:4;
    }
    .store-name{
        font-size:30px;
        color:#333;
    }
    .store-ads{
        margin-top:10px;
        font-size:24px;
        color:#999;
    }
    .store-right{
        flex:4;
        align-items: flex-end;
    }
</style>
<script>
    import {getImgUrl} from '../func/index'
    import he from 'he'
    export default{
        name:'mt-store',
        data(){
            return {
                icon: he.decode('&#xe680;')
            }
        },
        props:{
            records:Array,
        },
        methods:{
            status(type){
                switch (type){
                    case '0':
                        return '提现失败';
                        break;
                    case '1':
                        return '提现成功';
                        break;
                    case '2':
                        return '审理中';
                        break;
                }
            },
            getImg(type){
                switch (type){
                    case '中国银行':
                        return getImgUrl('zhongguobank');
                    case '交通银行':
                        return getImgUrl('jiaotongbank');
                    case '农业银行':
                        return getImgUrl('nongyebank');
                    case '建设银行':
                        return getImgUrl('jianshebank');
                    case '工商银行':
                        return getImgUrl('gongshangbank');
                    case '民生银行':
                        return getImgUrl('minshengbank');
                    case '光大银行':
                    case '中国光大银行(63030000)':
                        return getImgUrl('guangdabank');
                    case '招商银行':
                        return getImgUrl('zhaoshangbank');
                    case '平安银行':
                    case '平安银行（借记卡）':
                    case '平安银行股份有限公司':
                        return getImgUrl('pinganbank');
                    case '上海银行':
                        return getImgUrl('shanghaibank');
                    case '兴业银行':
                        return getImgUrl('xingyebank');
                    case '广发银行':
                    case '广发银行股份有限公司':
                        return getImgUrl('guangfabank');
                    case '中信银行':
                        return getImgUrl('zhongxinbank');
                    case '邮政储蓄银行':
                        return getImgUrl('youzhengbank');
                    case '青岛银行':
                        return getImgUrl('qingdaobank');
                    case '青岛农商银行':
                        return getImgUrl('qingdaonongshangbank');
                    case '华夏银行':
                        return getImgUrl('huaxiabank');
                    case '浦东发展银行':
                        return getImgUrl('pufabank');
                    default:
                        return getImgUrl('banklogo2x');
                }
            },
        }
    }
</script>
