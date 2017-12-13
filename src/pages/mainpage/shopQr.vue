<template>
    <div class="wrapper" v-if="completeTree">
        <div class="qrbox">
            <image :style = "{
							width: '360px',
							height: '360px'
						}" :src="createQrImg">
            </image>
        </div>
        <div :style="{width:424+'px'}">
        <zz-button
                class="btn-save"
                radius="7px"
                type="primary"
                @_click="nextStep"
                value="保存到相册">
        </zz-button>
        </div>
    </div>
</template>

<script>
    import {getImgUrl,changeStorage,storageName,showMge,fetchOnlyKey,saveQr,fetchQrcode,showMessage,startLoading,endLoading} from '../../func/index'
    import zzButton from '../../components/zz-button.vue'
    export default {
        components:{
            zzButton
        },
        data(){
            return {
                createQrImg:'',
                paySecret:'',
                codeNo:'',
                completeTree:false
            }
        },
        methods:{
            nextStep(){
                saveQr({paySecret:this.paySecret,codeNo:this.codeNo})
            },
            getImgUrl(path){
                return getImgUrl(path)
            }
        },
        created(){
            startLoading();
//            changeStorage('get',storageName.erweima)
//                .then(res=>{res.data!==''?(this.createQrImg=res.data.qr,this.codeNo=res.data.codeNo,this.paySecret=res.data.paySecret):(
//                changeStorage('get',storageName.editShopId)
//                .then(e=>e.data?fetchOnlyKey({shopId:e.data}):'')
//                .then(e=>{e.code==='200'?(this.paySecret=e.data.paySecret,this.codeNo=e.data.codeNo,this.createQrImg=fetchQrcode({paySecret:e.data.paySecret,codeNo:e.data.codeNo})):showMessage(e.code)})
//                )})
            changeStorage('get',storageName.editShopId)
                .then(e=> e.data?fetchOnlyKey({shopId:e.data}):'')
                .then(e=>{e.code==='200'?(this.paySecret=e.data.paySecret,this.codeNo=e.data.codeNo,this.createQrImg=fetchQrcode({paySecret:e.data.paySecret,codeNo:e.data.codeNo})):showMessage(e.code)})
                .then(_=>{endLoading();this.completeTree=true})

        }
    }
</script>

<style lang="less" scoped>
    .wrapper{
        align-items: center;
        background-color: #f6f6f6;
    }
    .qrbox{
        width:360px;
        height:360px;
        margin-top:80px;
        margin-bottom:80px;
        background-color:#fff;
    }
</style>