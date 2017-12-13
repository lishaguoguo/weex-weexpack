<template>
        <div class="set-list" append="tree">
            <div class="set-list-item" v-for="item,index in lists" @click="itemClick(index)" :style = "{ borderBottomWidth: (index === lists.length - 1 ? 0 : 1) + 'px' }">
                <!--<div class="set-img" v-if="lists.isIconItem">-->
                <div class="set-img" v-if="item.icon">
                    <image class="set-image" :src="item.icon"></image>
                </div>
                <text class="set-title">{{item.tex}}</text>
                <text :style="{color:item.decColor}" class="set-dec">{{item.dec}}</text>
                <div class="next-wrapper">
                    <!--<text class="next">{{icon}}</text>-->
                    <image :style="{
						width:'12px',
						height:'22px'
				}" :src="getImgUrl('iconenter')"></image>
                </div>
            </div>
        </div>
</template>

<script>
    import he from 'he'
    import {getImgUrl} from '../func/index'
    export default {
        name: 'mt-set',
        data(){
            return {
                icon: he.decode('&#xe680;')
            }
        },
        props: {
            lists: {
                type: Array,
                required: true
            }
        },
        methods: {
            getImgUrl(path){
              return getImgUrl(path)
            },
            itemClick(i){
                this.$emit('itemClick',i)
            }
        }
    }
</script>

<style lang="less" scoped>
    .set-list {
        margin-bottom: 18px;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
    }

    .set-list-item {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height: 88px;
        /*border-bottom-width: 1px;*/
        border-bottom-style: solid;
        border-bottom-color: #dedede;
        background-color: #fff;
    }

    .set-title, .set-dec, .set-img, .next-wrapper {
        justify-content: center;
    }

    .set-img {
        flex: 2;
    }

    .set-image {
        width: 34px;
        height: 34px;
    }

    .set-title {
        flex: 8;
        font-size: 30px;
        color: #333;
    }

    .set-dec {
        flex: 8;
        text-align: right;
        font-size: 26px;
        color: #888;
    }

    .next-wrapper {
        flex: 1;
        flex-direction: row;
        justify-content: flex-end;
    }

    .next {
        font-family: iconfont;
        color: #a3a3a3;
        font-size: 26px;
        text-align: right;
    }
</style>
