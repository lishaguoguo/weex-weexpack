<template>
    <div>
        <zz-store :stores="stores" v-if='!nulldata' @_click="permission" :isAds="isAds"></zz-store>
        <div class="nulldata" v-if='nulldata'>
            <dataBlock></dataBlock>
        </div>
    </div>
</template>
<script>
    import {changePage,fetchShopList,changeStorage,storageName,showMessage,fetchRemoteImg,startLoading,endLoading} from '../../func/index.js';
    import zzStore from '../../components/zz-store.vue'
    import dataBlock from '../../components/dataBlock.vue'
    export default{
        components: {
            zzStore,
            dataBlock
        },
        data(){
            return {
                stores:[],
                isAds:true,
                nulldata:false,
                elemLoading:false
            }
        },
        methods:{
            permission(index,userId,id){
                changeStorage('set',storageName.permissId,userId);
                changePage('setPermiss.js')('权限管理')
            },
            getRemoteImg(path,i){
                fetchRemoteImg({key:path})
                    .then(res=>this.stores[i].headPortrait=res.data)
            },
        },
        created(){
            startLoading()
            let obj = {
                lineState: 0
            };
            fetchShopList(obj)
                .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                .then(param => param.code === '200' ? this.stores = param.data :param.code==="60012"?this.nulldata=true:showMessage(param.code))
                .then(_ => {for(let i in this.stores){this.getRemoteImg(this.stores[i].headPortrait,i)}})
        }
    }
</script>
<style lang="less" scoped>
    .nulldata{
        flex:1;
        justify-content: center;
        align-items: center;
    }
</style>
