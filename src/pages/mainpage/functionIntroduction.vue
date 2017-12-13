<template>
    <div class="cell-wrapper">
        <div class="cell" v-for="item,index in vertionList" :key="index" v-if='!nulldata' @click="changePageTo(item.id)">
            <div class="cell-cont">
                <text class="cell-title">赞赞{{item.number}}主要更新</text>
                <text class="cell-sub">{{item.releaseTime}}</text>
            </div>
            <div class="next-wrapper">
                <text class="next">{{icon}}</text>
            </div>
        </div>
        <div class="nulldata" v-if='nulldata'>
            <dataBlock></dataBlock>
        </div>
    </div>
</template>

<script>
    import he from 'he'
    import {changePage,mobileFlag,versionList,showMessage,changeStorage,storageName,showMge} from '../../func/index'
    import dataBlock from '../../components/dataBlock.vue'
    export default {
        data(){
            return {
                icon: he.decode('&#xe680;'),
                vertionList:[],
                nulldata:false
            }
        },
        components: {
            dataBlock
        },
        methods:{
            changePageTo(id){
                changeStorage('set',storageName.versionId,id)
                    .then(_=>changePage('versionInfor.js')('新功能介绍'))
            }
        },
        mounted(){
            versionList({type:mobileFlag})
                .then(res=>res.code==='200'?this.vertionList=res.data:res.code==='60012'?this.nulldata=true:showMessage(res.code))
        }
    }
</script>

<style lang="less" scoped>
    .cell-wrapper{
        padding-left: 36px;
        background-color:#fff;
        padding-top:20px;
    }
    .cell{
        flex-direction: row;
        align-items: center;
        padding-right:36px;
        padding-top:30px;
        padding-bottom:30px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #dedede;
    }
    .cell-cont{
        flex:8;
    }
    .cell-title{
        font-size:32px;
    }
    .cell-sub{
        margin-top:20px;
        font-size:26px;
        color: #aaa;
    }
    .next-wrapper{
        flex:1;
    }
    .next {
        font-family: iconfont;
        color: #a3a3a3;
        font-size: 26px;
        text-align: right;
    }
    .nulldata{
        flex:1;
        justify-content: center;
        align-items: center;
    }
</style>