<template>
    <list class="store-wrapper">
        <cell class="store-item" v-for="store,index in stores" :key="index" @click="permission(index,store.mtUserId,store.id)" append="tree">
            <div class="store-logo">
                <image class="store-logoimg" :src="store.headPortrait"></image>
            </div>
            <div class="store-main">
                <text class="store-name">{{isAccount?cutString(store.account):cutString(store.shopName)}}</text>
                <text class="store-ads">{{isAds?cutString(store.jcTerritoryName):'负责人：'+cutString(store.contacts)}}</text>
            </div>
            <div class="store-right">
                <text class="next" v-if="isNext">{{icon}}</text>
                <div class="edit" v-else>
                    <image class="edit-icon"
                           :src="getImg('editgreen')">
                    </image>
                    <text class="edit-text">编辑</text>
                </div>
            </div>
        </cell>
    </list>
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
    .store-item{
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height:168px;
        padding-left:36px;
        padding-right:36px;
        background-color:#fff;
        margin-bottom:20px;
        .border(0,0,1px,0);
    }
    .store-logo{
        width:120px;
        height:120px;
    }
    .store-logoimg {
        .logoimg(120px,0);
    }
    .store-main{
        flex:4;
        padding-left:32px;
    }
    .store-name{
        font-size:34px;
        color:#000;
    }
    .store-ads{
        margin-top:20px;
        font-size:28px;
        color:#3a3a3a;
    }
    .store-right{
        flex:1;
        align-items: flex-end;
    }
    .edit{
        flex-direction:row;
        flex-wrap: nowrap;
        align-items: flex-end;
        height:90px;
        /*margin-right:8px;*/
    }
    .edit-icon{
        width:32px;
        height:32px;
    }
    .edit-text{
        margin-left:6px;
        font-size:26px;
        color:#3eba6c;
    }
    .next {
        font-family: iconfont;
        color: #a3a3a3;
        font-size: 26px;
        text-align: right;
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
            stores:Array,
            isNext:{default:true},  //目前类型分为next，edit两种
            fontColor:{default:'#a3a3a3'},
            isAds:{default:true},
            isAccount:{default:false}
        },
        methods:{
            cutString(str){
                return str.length > 11 ? str.substring(0, 11)+'...' : str
            },
            permission(index,userId,id){
                this.$emit('_click',index,userId,id)
            },
            getImg(path){
             return getImgUrl(path)
            }
        }
    }
</script>
