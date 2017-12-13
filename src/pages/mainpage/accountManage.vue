<template>
    <div class="account-wrapper">
        <zz-store class="shop-account" :stores="stores" :isNext="false" :isAccount="true" @_click="accountEdit" v-if="accountType==='1'&&!nulldata"></zz-store>
        <zz-account class="shop-account" :stores="stores" :shopName="shopName" @_click="cashierEdit" @edit="editOperate" @del="delOperate" v-if="accountType==='2'&&!nulldata"></zz-account>
        <zz-actionsheet
                :items="['确定']"
                :show="showBar"
                title="确定删除此账号？"
                @close="closeActionsheet"
                @itemClick="actionsheetItemClick"
                @btnClick="actionsheetBtnClick"
                ref="actionsheet"
        ></zz-actionsheet>
        <div class="nulldata" v-if='nulldata'>
            <dataBlock></dataBlock>
        </div>
        <zz-navbar :title="navTitle" iconCont="添加" :iconType="iconType" @navHandle="navHandle" @prevback="prevback"></zz-navbar>
    </div>
</template>
<script>
    import {changePage,getVal,fetchShopList,startLoading,endLoading,fetchRemoteImg,fetchUserPageInfo,fetchCashierList,fetchDelCashierAc,changeStorage,storageName,showMessage} from '../../func';
    import zzStore from '../../components/zz-store.vue'
    import zzNavbar from '../../components/zz-navbar.vue'
    import zzAccount from '../../components/zz-accountM.vue'
    import zzActionsheet from '../../components/zz-actionsheet.vue'
    import dataBlock from '../../components/dataBlock.vue'
    const navigator = weex.requireModule('navigator')
    import he from 'he'
    export default{
        components: {
            zzStore,
            zzNavbar,
            zzActionsheet,
            zzAccount,
            dataBlock
        },
        data(){
            return {
                stores:[],
                shopName:'',
                iconCont:'nav_add',
                showBar:false,
                accountType:'',
                selectUserId:'',
                nulldata:false
            }
        },
        computed:{
            iconType(){
                return this.accountType==='1'?0:this.accountType==='2'?2:0
            },
            navTitle(){
                return this.accountType==='1'?'选择店铺':'账号管理'
            }
        },
        methods:{
            prevback(){
                changePage('back.js')('首页')
            },
            accountEdit(index,userId,id){
                let data={
                    id:userId,
                    operaType:3
                }
                this.operateSave(data,'账户编辑')
            },
            navHandle(id){
                let data={
                    id:'',
                    operaType:2
                }
                this.operateSave(data,'添加收银员账号')
            },
            cashierEdit(index,userId){
                let data={
                    id:userId,
                    operaType:0
                }
                changeStorage('set',storageName.userQrId,userId)
                    .then(_ => this.operateSave(data,'收银员账号'))
            },
            editOperate(index,userId){
                let data={
                    id:userId,
                    operaType:1
                }
                this.operateSave(data,'编辑收银员账号')
            },
            delOperate(index,userId){
                this.selectUserId=userId;
                this.showBar=true;
            },
            closeActionsheet(){
                this.showBar=false;
            },
            actionsheetBtnClick(){
                this.showBar=false;
            },
            actionsheetItemClick(){
                let obj={
                    id:this.selectUserId
                };
                fetchDelCashierAc(obj)
                    .then(res=>{
                       if(res.code==='200'){
                           fetchCashierList()
                               .then(param=>param.code==='200'?this.stores=param.data:param.code==='60012'?this.nulldata=true:showMessage(param.code))
                       }else {
                           showMessage(res.code)
                       }
                    });
                this.showBar=false;
            },
            operateSave(data,title){
                changeStorage('set',storageName.spAccountId,data)
                    .then(_=>changePage('accountEdit.js')(title))
            },
            getRemoteImg(path,i){
                fetchRemoteImg({key:path})
                    .then(res=>this.stores[i].headPortrait=res.data)
            },
        },
        created(){
            startLoading()
        },
        mounted(){
            getVal()
                .then(e => ({data: {accountType: e.accountType}}))
//                changeStorage('get',storageName.loginUserInfo)
                .then(res=>this.accountType=res.data.accountType)
                .then(_=>this.accountType==='1'?fetchShopList({lineState:0}):fetchCashierList())
                .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                .then(param=>param.code==='200'?this.stores=param.data:param.code==='60012'?this.nulldata=true:showMessage(param.code))
                .then(_ => {for(let i in this.stores){this.getRemoteImg(this.stores[i].headPortrait,i)}})
                .then(_=>this.accountType==='2'?fetchUserPageInfo():{})
                .then(res=>this.shopName=res.data.shopName)
        }
    }
</script>
<style lang="less" scoped>
    .border(@top,@right,@bottom,@left){
        border-top-width:@top;
        border-right-width:@right;
        border-bottom-width:@bottom;
        border-left-width:@left;
        border-color:#dedede;
        border-style:solid;
    }
    .account-wrapper{
        background-color:#eee
    }
    .shop-account{
        margin-top:88px;
    }
    .store-item{
        flex-direction: row;
        flex-wrap: nowrap;
        height:148px;
        padding-left:36px;
        padding-right:36px;
        .border(0,0,1px,0);
    }
    .nulldata{
        flex:1;
        justify-content: center;
        align-items: center;
    }
</style>
