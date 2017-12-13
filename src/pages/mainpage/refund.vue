<template>
    <div class="wrapper">
        <div>
            <div class="order-form">
                <text class="text-title">订单单号：</text>
                <text class="text-cont">{{data.serialNumber}}</text>
            </div>
            <div class="order-form money-form">
                <text class="text-title">交易金额：</text>
                <text class="text-cont" style="color:#3eba6c">￥{{data.transactionPrice}}</text>
            </div>
            <div class="orderReason">
                <text class="text-title">退款原因：</text>
                <textarea class="text-area" placeholder="退款说明（不能超过16个字符）" :value="textArea" rows="5" @input="inputTextArea"></textarea>
            </div>
        </div>
        <zz-button
                class="btn-register"
                type="primary"
                @_click="nextStep"
                :disabled="isDisabled"
                :btnDisable="btnDisable"
                value="确定退款">
        </zz-button>
    </div>
</template>

<script>
    import zzButton from '../../components/zz-button.vue'
    import {changePage,changeStorage, storageName,fetchBillRefund,showMessage,showMge,startLoading,endLoading} from '../../func'
    export default {
        components: {
            zzButton
        },
        data(){
            return {
                orderNum: 'wx020170621004556479187197',
                orderMoney: 200.00,
                textArea: '',
                isDisabled: false,
                data:{},
                id:'',
                merchantId:''
            }
        },
        created(){
            changeStorage('get',storageName.billShopId)
                .then(res=>this.merchantId=res.data)
                .then(_=>changeStorage('get', storageName.billId))
                .then(res=>this.id=res.data)
                .then(_=>changeStorage('get',storageName.billDetails))
                .then(res=>this.data=res.data)
        },
        methods: {
            inputTextArea(e){
                e.value.length>16?(showMessage('50016'),this.isDisabled=true):(this.textArea = e.value,this.isDisabled=false);
            //`退款说明不能多于16位字符`
                },
            nextStep(){
                if(!this.isDisabled){
                    this.isDisabled = true;
                    let obj={
                        id:this.id,
                        commonRemark:this.textArea
                    };
                    startLoading()
                       fetchBillRefund(obj)
                        .then(res=>{
                            endLoading();
                            res.code==='200'?(
                                showMge('退款申请已提交'),
                                    changePage('billDetails.js')('账单详情'),
                                    this.isDisabled = false)
                                :(showMessage(res.code),this.isDisabled = false)
                        })
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @fontSize:30px;
    .wrapper {
        background-color:#eee;
    }

    .order-form {
        height: 108px;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        background-color:#fff;
        padding-left: 36px;
        padding-right: 36px;
        /*margin-bottom:20px;*/
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: rgb(222,222,222);
    }

    .money-form{
        height:88px;
    }

    .text-title {
        flex: 2;
        font-size:32px;
    }

    .text-cont {
        flex: 5;
        text-align: right;
        font-size:@fontSize;
    }
    .orderReason{
        background-color:#fff;
        flex-direction: row;
        margin-top:20px;
        padding-top:40px;
        padding-bottom:20px;
        padding-left: 36px;
        padding-right: 36px;
    }
.text-area{
    flex: 5;
    font-size:@fontSize;
    placeholder-color:rgb(192,192,192)
}
    .btn-register {
        position: fixed;
        bottom:0;
        left:-12px;
        right:-12px;
    }
</style>