<template>
    <div class="navbar" :style="{'background-color':backgroundColor,'border-bottom-width':titleClick?'0px':'1px'}">
        <div class="nav-back" @click="jumpBack">
            <!--<text class="font-icon"-->
                    <!--:style="{-->
		        <!--fontFamily:'iconfont',-->
		    <!--}">{{previcon?previcon:icon}}</text>-->
            <text class="font-siz" v-if="previcon">{{previcon}}</text>
            <text class="font-siz" v-else>返回</text>
            <!--<image class="icon-img" :style="{'width':22+'px','height':39+'px'}" :src="getImg('nav_return')" v-else></image>-->
        </div>
        <div class="nav-title" @click="titleClick()">
            <text class="nav-tip font-title">{{title}}</text>
            <image class="icon-img" :src="getImg('onload')" v-if="istitleClick"></image>
        </div>
        <div class="navbar-right" @click="navHandle(iconType)">
            <div v-if="iconType!==0">
                <!--<image class="icon-img" :src="getImg(description)" v-if="iconType===1"></image>-->
                <text class="font-icon">{{iconCont}}</text>
            </div>
        </div>
    </div>
</template>
<script>
    const navigator = weex.requireModule('navigator');
    const modal=weex.requireModule('modal');
    import {getImgUrl}from '../func/index'
    import he from 'he'
    export default{
        name: 'mt-navbars',
        data(){
            return{
                icon:he.decode('&#xe611'),
                icons:he.decode('&#xe608'),
                ab:true
            }
        },
        props: {
            title: {
                type: String,
                required: true
            },
            istitleClick:{default:false},
            backgroundColor: {default: '#3dba6c'},
            description:'',
            iconCont:'',
            previcon:{},
            iconType:'',
            fontColor:'#fff',
        },
        methods: {
            jumpBack(){
                    this.$emit('prevback')
            },
            navHandle(id){
                this.$emit('navHandle',id)
            },
            getImg(path){
                return getImgUrl(path)
            },
            titleClick(){
               this.istitleClick?this.$emit('titleClick'):''
            }
        },
    };
</script>
<style lang="less" scoped>
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        height: 88px;
        background-color: #3dba6c;
        /*border-bottom-width: 1px;*/
        border-bottom-style: solid;
        border-bottom-color: #dedede;
    }
    .font-icon{
        font-family:iconfont1;
        color: #fff;
        font-size:34px;
    }
    .nav-back, .nav-title {
        justify-content: center;
        align-items: center;
    }

    .nav-back {
        flex: 1;
        align-items: flex-start;
        padding-left: 35px;
    }

    .nav-title {
        flex: 3;
        flex-direction: row;
        align-items: center;
    }
.font-siz{
    font-size: 34px;
    color: #fff;
}
.font-title{
    margin-right:13px;
    font-size:40px;
    color:#fff;
}
    .nav-tip {
        text-align:center;
    }

    .navbar-right {
        flex: 1;
        align-items: flex-end;
        padding-right: 35px;
    }
    .icon-img{
        margin-top:14px;
        width:30px;
        height:17px;
    }
</style>
