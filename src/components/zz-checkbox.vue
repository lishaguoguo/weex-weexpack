<template>
           <div v-if="deleteinfo" >
            <div v-if="check">
                <!--<text-->
                        <!--:style="{-->
		        <!--fontFamily:'iconfont1',-->
		        <!--'color':'#00cc66',-->
		        <!--fontSize:'40px'-->
		    <!--}">{{icon}}</text>-->
                <image class="check" :src="getImg('checked')"></image>
            </div>
            <div v-if="!check">
                <!--<text-->
                        <!--:style="{-->
		        <!--fontFamily:'iconfont1',-->
		        <!--'color':'#9ea7b4',-->
		        <!--fontSize:'40px'-->
		    <!--}">{{icons}}</text>-->
                <image class="check" :src="getImg('nocheck')"></image>
            </div>
           </div>
</template>


<script>
    import he from 'he'
    import {getImgUrl} from '../func/index'
    export default{
        props: {
            icon:{
                default:he.decode('&#xe8e4')
            },
            icons:{
                default:he.decode('&#xe8b5')
            },
            deleteinfo: {
                type:Boolean
            },
            check:{
                type:Boolean
            }
        },
        methods:{
            getImg(path){
                return getImgUrl(path)
            }
        }
    }
</script>

<style scoped>
.check{
    width:40px;
    height:40px;
}
</style>