<template>
    <div class="cart">
        <zz-set class="cart-list" :lists="lists" @itemClick="itemClick"></zz-set>
        <div class="add-acount" @click="addsClick" v-if="isAdds">
            <div class="set-img">
                <image class="set-image" :src="getImg('addicon')"></image>
            </div>
            <text class="add-title">添加卡券</text>
            <text class="next">{{nexticon}}</text>
        </div>
    </div>
</template>

<script>
    import {changePage,changeStorage,storageName,getImgUrl,getVal,fetchPermission} from '../../func/index'
    import zzSet from '../../components/zz-setlist.vue'
    export default {
        components:{
            zzSet
        },
        data(){
            return{
                lists: [
                    {
                        tex: '历史卡券',
                        dec: '',
                        icon: '',
                    },
                    {
                        tex: '已使用的卡券',
                        dec: '',
                        icon: ""
                    },
                    {
                        tex: '所有卡券',
                        dec: '',
                        icon: '',
                    }
                ],
                isAdds:true
            }

        },
        methods:{
            getImg(path){
              return getImgUrl(path)
            },
            itemClick(i){
                changeStorage('set',storageName.isDeleteCart,this.isAdds)
                switch(i){
                    case 0:
                        let obj={
                            couponType:'',
                            couponStatus:5
                        };
                        changeStorage('set',storageName.navigatorCartType,obj)
                            .then(()=>{
                                changePage('cartRecord.js')('历史卡券')
                            });
                        break;
                    case 1:
                        let param={
                            couponType:'',
                            couponStatus:4
                        };
                        changeStorage('set',storageName.navigatorCartType,param)
                            .then(()=>{
                                changePage('cartRecord.js')('已使用卡券')
                            });
                        break;
                    case 2:
                        changePage('allCart.js')('所有卡券')
                        break;
                }
            },
            addsClick(){
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
                    .then(_=>changePage('addCart.js')('添加卡券'))
            }
        },
        created(){
//            changeStorage('get',storageName.loginUserInfo,'')
//                .then(res=> ({data: {accountType: res.data.accountType}}))
            getVal()
                .then(e => ({data: {accountType: e.accountType}}))
                .then(param=>{param.data.accountType==='2'?(
//                    changeStorage('get', storageName.savePermission)
                    fetchPermission()
                                .then(res=>res.data)
                                .then(param=>{
                                    param.forEach(item=>{
                                        item.permissionId==='2'?item.isSelect===0?this.isAdds=true:this.isAdds=false:''
                                    })
                                })
                ):param.data.accountType==='3'?this.isAdds=false:this.isAdds=true;
                })
            changeStorage('set',storageName.validDate,
                {
                    startTimeStr:'',
                    endTimeStr:''
                })
        },
    }
</script>

<style lang="less" scoped>
    .cart{
        background-color:#eee;
    }
    .add-acount{
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height:90px;
        padding-left:30px;
        padding-right:30px;
        background-color:#fff;
    }
    .set-img {
        margin-right:28px;
    }

    .set-image {
        width: 34px;
        height: 34px;
    }
    .add-title{
        flex:7;
        font-size:30px;
        color:#333;
    }
    .next{
        flex:1;
        font-family: iconfont;
        font-size:26px;
        text-align: right;
        color:#a3a3a3;
    }
</style>