<template>
    <div class="edit-account">
        <div class="input-box">
            <zz-input
                    type="text"
                    label="账号："
                    placeholder="请输入账号"
                    maxlength="20"
                    :value="account"
                    flexgrow="3"
                    :inputDisabled="operaType===2?false:true"
                    :fontColor="operaType===2?'#000':'#aaa'"
                    :needDeletAll="operaType===2?true:false"
                    :id="0"
                    @allDelete="deleteAll"
                    @input="accountChange">
            </zz-input>
            <zz-input
                    type="text"
                    label="密码："
                    placeholder="请输入密码"
                    maxlength="20"
                    :value="password"
                    flexgrow="3"
                    :inputDisabled="operaType===0?true:false"
                    :fontColor="operaType===0?'#aaa':'#000'"
                    :needDeletAll="operaType===0?false:true"
                    :id="1"
                    @allDelete="deleteAll"
                    @input="passwordChange">
            </zz-input>
        </div>
        <div class="qrimgbox" v-if="operaType===0">
            <div class="qrimg">
                <image class="qrimg" :src="createQrImg"></image>
            </div>
        </div>
        <zz-button
                class="btn-save"
                radius="7px"
                type="primary"
                @_click="nextStep"
                :disabled="isDisabled"
                :btnDisable="btnDisable"
                :value="btnvalue">
        </zz-button>
        <div>
            <text class="btn-text" v-if="operaType===1">保存后二维码保持不变</text>
        </div>
    </div>
</template>

<script>
    import {changePage,changeStorage,storageName,getImgUrl,saveQr,fetchOnlyKey,fetchQrcode,fetchShopAccount,fetchAddCashierAc,fetchCashierAccount,fetchEditCashierAc,fetchUpdateSpAccount,showMessage,showMge} from '../../func';
    import zzInput from '../../components/zz-input.vue'
    import zzButton from '../../components/zz-button.vue'
    import he from 'he'
    export default {
        components:{
            zzInput,
            zzButton
        },
        data(){
            return{
                account:'',
                password:'',
                ShopId:'',
                btnDisable:false,
                operaType:0,
                qrImg:false,
                createQrImg:'',
                paySecret:'',
                codeNo:''
            }
        },
        computed: {
            isDisabled(){
                return !(this.account && this.password)
            },
            btnvalue(){
                return this.operaType===0?'保存到相册':this.operaType===2?'提交并生成二维码':'保存'
            },
        },
        methods:{
            deleteAll(id){
                id===0?this.account='':id===1?this.password='':''
            },
            getImgUrl(path){
                return getImgUrl(path)
            },
            accountChange(value){
                this.account=value;
            },
            passwordChange(value){
                this.password=value;
            },
            nextStep(){
                let patrn=/^(\w){6,12}$/;
                if(patrn.test(this.password)){
                    this.btnDisable=true;
                switch (this.operaType){
                    case 0:
                        let savImg={
                            paySecret:this.paySecret,
                            codeNo:this.codeNo
                        };
                        saveQr(savImg);
                        break;
                    case 1:
                        let obj1={
                            id:this.ShopId,
                            account:this.account,
                            password:this.password
                        };
                        fetchEditCashierAc(obj1)
                            .then(res=>this.saveOperate(res))
                        break;
                    case 2:
                        let obj2={
                            account:this.account,
                            password:this.password
                        };
                        fetchAddCashierAc(obj2)
                            .then(res=>this.saveOperate(res))
                        break;
                    case 3:
                        let obj3={
                            id:this.ShopId,
                            account:this.account,
                            password:this.password
                        };
                        fetchUpdateSpAccount(obj3)
                            .then(res=> this.saveOperate(res));
                        break;
                }
                }else {
//                    showMge('密码应为6～12位字母、数字、下划线')
                    showMessage('50001')//密码应为6～12位字母、数字、下划线
                }

            },
            saveOperate(res){
                this.btnDisable=false;
                if(res.code==='200'){
                    showMessage('50020')//保存成功
                    changePage('accountManage.js')('账号管理')
                }else {
                    showMessage(res.code)
                }
            }
        },
        created(){
            changeStorage('get',storageName.spAccountId)
                .then(res=>{
                    this.ShopId=res.data.id;
                    this.operaType=res.data.operaType
                    let obj={
                        id:this.ShopId
                    };
                    return obj;
                })
                .then((param)=>this.operaType===3?fetchShopAccount(param):this.operaType===2?'':fetchCashierAccount(param))
                .then(param=>{
                    if(param.code==='200'){
                        this.account=param.data.account.length>12?param.data.account.substring(0,12)+'...':param.data.account;
                        this.password=param.data.password;
                    }else {
                        showMessage(param.code)
                    }
                }).then(_ =>this.operaType===0?(
                changeStorage('get',storageName.userQrId)
                    .then(e=>e.data)
                    .then(e=>e?fetchOnlyKey({cashierId:e}):'')
                    .then(e=>{e.code==='200'?(this.qrimg=true,this.paySecret=e.data.paySecret,this.codeNo=e.data.codeNo,this.createQrImg=fetchQrcode({paySecret:e.data.paySecret,codeNo:e.data.codeNo})):''})):'' )
        }
    }
</script>

<style lang="less" scoped>
    .edit-account{
        padding-right:36px;
        padding-left:36px;
        text-align: center;
        background-color: #f6f6f6;
    }
    /*.input-box{*/
    /*margin-top:88px;*/
    /*}*/
    .btn-save{
        margin-top:36px;
    }
    .qrimgbox{
        align-items: center;
        justify-content: center;
        margin-top:36px;
        margin-bottom:44px;
    }
    .qrimg{
        height:360px;
        width:360px;
    }
    .btn-text{
        margin-top:20px;
        height:50px;
        text-align:center;
    }
</style>