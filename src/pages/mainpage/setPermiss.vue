<template>
    <div v-if="completeTree" class="wrapper">
        <scroller class="permiss-list" :style="{ height: 108 * items.length + 'px'}" :show-scrollbar = 'false'>
            <div class="permiss-item" v-for="item,index in items" :key="index" @click="selectPermiss(index)">
                <text class="permiss-name">{{item.permissionName}}</text>
                <div class="permiss-image">
                    <text  :style="{'color':item.isSelect?'#3eba6c':'#a3a3a3'}" class="selecticon">{{item.isSelect?selecticon:noSelecticon}}</text>
                </div>
            </div>
        </scroller>
        <zz-button
                class="btn-save"
                type="primary"
                @_click="saveChange"
                value="保存">
        </zz-button>
    </div>
</template>
<script>
    import {changePage,fetchPermission,fetchChangePermission,changeStorage,storageName,showMessage,showMge,startLoading,endLoading} from '../../func/index.js'
    import zzButton from '../../components/zz-button.vue'
    import he from 'he'
    export default{
        components: {
            zzButton
        },
        data() {
            return {
                selecticon:he.decode('&#xe8e4'),
                noSelecticon:he.decode('&#xe8b5'),
                shopId:'',
                items:[],
                permissId:'',
                completeTree:false
            }
        },
        methods: {
            selectPermiss(index){
                this.items[index].isSelect = !this.items[index].isSelect
            },
            saveChange(){
                this.permissId='';
                for(let i in this.items){
                    this.items[i].isSelect?this.permissId+=`${this.items[i].permissionId},`:''
                }
                this.permissId===''?this.permissId=null:'';
                let obj={
                    userId:this.shopId,
                    permissionId:this.permissId
                };
                startLoading()
                fetchChangePermission(obj)
                    .then(param=>{
                        if(param.code==='200'){
                            showMessage('50020');//保存成功
                                endLoading()
                                changePage('storePermiss.js')('店铺权限')
                        }else{
                            endLoading()
                            showMessage(param.code)
                        }
                    })
            }
        },
        mounted(){
            startLoading()
            changeStorage('get',storageName.permissId,'')
                .then(res=>res.data)
                .then(shopId=>{
                    this.shopId=shopId;
                    let obj={
                        userId:this.shopId
                    };
                    fetchPermission(obj)
                        .then(res=>{setTimeout(()=>{endLoading()},200);return res})
                        .then(param=>{
                            this.items=param.data;
                            for(let i in this.items){
                                this.items[i].isSelect===0?this.items[i].isSelect=true:this.items[i].isSelect=false
                            }
                            param.code!=='200'?showMessage(param.code):''
                        })
                        .then(_=>this.completeTree=true)
                })
        }
    }
</script>
<style lang="less" scoped>
    .border(@top,@right,@bottom,@left) {
        border-top-width: @top;
        border-right-width: @right;
        border-bottom-width: @bottom;
        border-left-width: @left;
        border-color: #dedede;
        border-style: solid;
    }

    .wrapper{
        flex-direction: column;
    }
.permiss-list{
    margin-bottom:120px;
}
    .permiss-item {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height: 108px;
        .border(0, 0, 1px, 0);
        padding-left: 36px;
        padding-right: 36px;
    }

    .permiss-name {
        flex: 5;
        font-size: 32px;
        color:#000;
    }

    .permiss-image {
        /*flex: 1;*/
        /*justify-content: flex-end;*/
    }
    .permiss-img {
        width: 32px;
        height: 32px;
    }
    .selecticon{
        font-family: iconfont1;
        font-size:40px;
    }
    .btn-save{
        position: fixed;
        left:-12px;
        right:-12px;
        bottom:0;
    }
</style>
