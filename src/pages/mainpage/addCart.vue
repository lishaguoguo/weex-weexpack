<template>
    <div class="addcart">
        <zz-setlist class="cartcont" :lists="lists" @itemClick="itemClick"></zz-setlist>
        <div class="apply-btn">
            <zz-button
                    class="btn-add"
                    radius="7px"
                    type="primary"
                    @_click="addcart"
                    :disabled="isDisabled"
                    value="添加">
            </zz-button>
        </div>
        <zz-actionsheet
                :items="actionsheetItems"
                :show="showBar"
                @close="closeActionsheet"
                @itemClick="actionsheetItemClick"
                @btnClick="actionsheetBtnClick"
                ref="actionsheet"
        ></zz-actionsheet>
        <zz-dialog @btnClick="onDialogCallback" :show="showDialog" tipcont="添加成功,可继续添加" buttons="我知道了">
        </zz-dialog>
    </div>
</template>

<script>
    import zzSetlist from '../../components/zz-setlist.vue'
    import zzButton from '../../components/zz-button.vue'
    import zzDialog from '../../components/zz-dialog.vue'
    import zzActionsheet from '../../components/zz-actionsheet.vue'
    import {changePage,fetchAddCart,changeStorage,storageName,getTime,getImgUrl,showMge,showMessage,saveValue,
        getValue,} from '../../func/index'
    import he from 'he'
    export default {
        components: {
            zzSetlist,
            zzButton,
            zzDialog,
            zzActionsheet
        },
        data(){
            return{
                lists: [
                    {
                        tex: '卡券种类',
                        dec: '',
                        icon: '',
                        id:0
                    },
                    {
                        tex: '卡券信息',
                        dec: '',
                        icon: "",
                        id:1
                    },
                    {
                        tex: '有效日期',
                        dec: '',
                        icon: '',
                        id:2
                    }
                ],
                showDialog: false,
                showBar: false,
                actionsheetItems: ['优惠券','红包'],
                cartMessage:{
                    spShopId:'',
                    couponType:3,
                    discountAmount:0,
                    couponQuantity:0,
                    fullAmount:0,
                    startDate:'',
                    deadline:'',
                    spShopName:''
                },
                btnDisable:false
            }
        },
        computed:{
            isDisabled(){
                return !(this.lists[0].dec&&this.lists[1].dec&&this.lists[2].dec)
            }
        },
        methods:{
            getImg(path){
                return getImgUrl(path)
            },
            addcart(){
                if(this.btnDisable===false){
                    this.btnDisable=true;
                    if(!this.disabled){
                        fetchAddCart(this.cartMessage)
                            .then(param=>{
                                if(param.code==='200'){
                                    this.showDialog=true;
                                }else {
                                    showMessage(param.code)
                                }
                            })
                    }
                }
            },
            onDialogCallback(){
                this.showDialog = false;
                this.lists[0].dec='';
                this.lists[1].dec='';
                this.lists[2].dec='';
                changeStorage('set',storageName.cartType,3)
                    .then(_=>changeStorage('set',storageName.cartInfo,{
                        couponQuantity:'',
                        discountAmount:'',
                        fullAmount:''
                    }))
                    .then(_=>changeStorage('set',storageName.validDate,{
                        startTimeStr:'',
                        endTimeStr:''
                    }))
            },
            itemClick(i){
                switch(i){
                    case 0:
                        this.showBar=!this.showBar;
                        break;
                    case 1:
                        this.lists[0].dec===''?showMessage('50022'):changePage('cartInfo.js')('卡券信息') //请先选择卡券类型
                        break;
                    case 2:
                        this.lists[0].dec===''?showMessage('50022'):
                            changePage('validDate.js')('有效日期')
                        break;
                }
            },
            actionsheetItemClick(item,index) {
                changeStorage('set',storageName.cartType,index+1);
                this.cartMessage.couponType=index+1;
                this.lists[0].dec=item;
                this.showBar = false;
                this.btnDisable=false;
            },
            actionsheetBtnClick() {
                this.showBar = false;
                this.btnDisable=false;
            },
            closeActionsheet() {
                this.showBar = false;
                this.btnDisable=false;
            },
            getValidate(data){
                this.lists[2].dec=data.startTimeStr===''||data.startTimeStr===undefined?'':`${data.startTimeStr}至${data.endTimeStr}`
                this.cartMessage.startDate=data.startTimeStr;
                this.cartMessage.deadline=data.endTimeStr;
            }
        },
        created(){
//            changeStorage('get',storageName.myShopId)
            getValue('myShopId')
                .then(res=>this.cartMessage.spShopId=res.value)
                .then(_=>changeStorage('get',storageName.cartType))
                .then(res=>{
                    this.cartMessage.couponType=res.data;
                    if(res.data===1){
                        this.lists[0].dec='优惠券'
                    }else if(res.data===2){
                        this.lists[0].dec='红包'
                    }else {
                        this.lists[0].dec=''
                    }
                })
                .then(_=>changeStorage('get',storageName.cartInfo))
                .then(res=>{
                    res.data.fullAmount===''||res.data.fullAmount===undefined?this.lists[1].dec='': this.cartMessage.couponType===1?this.lists[1].dec=`${res.data.couponQuantity}张满${res.data.fullAmount}元减${res.data.discountAmount}元券`:this.lists[1].dec=`${res.data.couponQuantity}张${res.data.fullAmount}元红包`
                    this.cartMessage.discountAmount=res.data.discountAmount;
                    this.cartMessage.couponQuantity=res.data.couponQuantity;
                    this.cartMessage.fullAmount=res.data.fullAmount;
                })
            changeStorage('get',storageName.validDate)
                .then(res=>res.data.startTimeStr===''?
                    getTime()
                        .then(data=>this.getValidate(data))
                        .then(_=>changeStorage('set',storageName.validDate,
                            {
                                startTimeStr:this.cartMessage.startDate,
                                endTimeStr:this.cartMessage.deadline
                            })
                        )
                    : getTime()
                        .then(data=>data.startTimeStr===''?this.getValidate(res.data):
                            (this.getValidate(data),
                                changeStorage('set',storageName.validDate,
                                    {
                                        startTimeStr:data.startTimeStr,
                                        endTimeStr:data.endTimeStr
                                    }))
                        )
                )
        },
    }
</script>

<style lang="less" scoped>
    .addcart{
        background-color:#eee;
    }
    .cartcont{
        margin-top:18px;
    }
    .apply-btn{
        margin-top:80px;
        padding-left:36px;
        padding-right:36px;
    }
    .dialog-cont{
        margin-top:50px;
        margin-bottom:50px;
    }
    .dialog-text{
        font-size:33px;
        text-align: center;
        color:#3eba6c;
    }
    .dialog-image{
        flex:1;
        justify-content: center;
        text-align: center;
    }
    .dialog-chenggong{
        width:136px;
        height:136px;
        margin-bottom: 35px;
    }
    .dialog-success{
        margin-bottom: 35px;
        font-family: iconfont1;
        font-size:120px;
        color:#3eba6c;
        text-align: center;
    }
</style>
