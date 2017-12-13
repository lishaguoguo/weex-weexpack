<template>
    <div class="text-wrapper">
        <div class="text-item">
            <text class="text-title">1.什么是赞赞红包？</text>
            <text class="text-cont">赞赞红包是为赞赞发行和认可的购物券，可在赞赞APP下单时使用，可抵扣相应的金额。</text>
        </div>
        <div class="text-item">
            <text class="text-title">２.赞赞红包可以找零兑换吗？</text>
            <text class="text-cont">赞赞红包不找零、不兑换。</text>
        </div>
        <div class="text-item">
            <text class="text-title">３.赞赞红包可以在其他平台使用吗？</text>
            <text class="text-cont">赞赞红包仅限在赞赞客户端内使用，不可在微信钱包、手机QQ等其他平台使用。</text>
        </div>
        <div class="text-item">
            <text class="text-title">4.赞赞红包的使用条件？</text>
            <text class="text-cont">赞赞红包需同时满足以下条件才可用：</text>
            <text class="text-cont">(1)仅在线支付使用。</text>
            <text class="text-cont">(2)仅限在发该商家红包的店铺使用。</text>
            <text class="text-cont">(3)满足红包上的使用条件。</text>
        </div>
        <div class="text-item" :style="{borderBottomWidth: 0+'px'}">
            <text class="text-title">注意事项：</text>
            <text class="text-cont">红包/优惠券一切费用由商家承担，与赞赞平台无关。</text>
        </div>
    </div>
</template>

<script>
    export default {}
</script>

<style scoped>
    .text-wrapper{
        background-color:#fff;
        padding-top:10px;
        margin-top:20px;
    }
    .text-item{
        padding-left:36px;
        padding-right:36px;
        border-bottom-width:1px;
        border-bottom-color:#ebeaea;
        border-bottom-style:solid;
    }
    .text-title{
        margin-top:20px;
        margin-bottom:24px;
        font-size:30px;
        color:#3b3b3b;
    }
    .text-cont{
        margin-bottom:20px;
        font-size:26px;
        color:#979797;
        text-indent:1em;
    }
</style>