<template>
    <div>
        <NavBar>
            <template v-slot:default>详情</template>
        </NavBar>
        <van-image style="margin-top:45px" width="100%" lazy-load :src="detail.cover_url" />
        <van-card
            style="text-align:left"
            :num="detail.stock"
            :price="detail.price+'.00'"
            :desc="detail.description"
            :title="detail.title"
        >
            <template #tags>
                <van-tag plain type="danger">新手</van-tag>
                <van-tag plain type="danger">推荐</van-tag>
            </template>
            <template #footer>
                <van-button type="primary" @click="handleAddCart">加入购物车</van-button>
                <van-button type="danger" @click="goToCart">立即购买</van-button>
            </template>
        </van-card>
        <van-tabs v-model:active="active" style="margin-bottom: 50px;">
            <van-tab title="概述">
                <div class="content" v-html="detail.details"></div>
            </van-tab>
            <van-tab title="评论">
                <div v-for="item in detail.comments" :key="item.id">
                    <h2>{{item.reply}}</h2>
                </div>
            </van-tab>
            <van-tab title="相关图书">
                <GoodsList :goods="like_good"></GoodsList>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import GoodsList from "components/content/goods/GoodsList";
import NavBar from "components/common/navbar/NavBar";
import { getGoodsDetali } from "network/detail.js";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, reactive, toRefs } from "vue";
import { addCart } from "network/cart";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
    name: "Detail",
    components: { NavBar, GoodsList },
    setup() {
        let active = ref(0);
        const route = useRoute();
        const router = useRouter();
        const store = useStore();
        let id = ref(0);
        let book = reactive({
            detail: {},
            like_good: [],
        });

        onMounted(() => {
            Toast.loading("加载中");
            id.value = route.query.id;
            getGoodsDetali(id.value).then((res) => {
                book.detail = res.goods;
                book.like_good = res.like_goods;
                Toast.clear();
            });
        });
        console.log(book.detail);
        //添加购物车回调
        const handleAddCart = () => {
            addCart({
                goods_id: book.detail.id,
                num: "1",
            }).then((res) => {
                if (res.status == "204" || res.status == "201") {
                    Toast.success("添加成功");
                    //设置状态
                    store.dispatch("updateCart");
                }
            });
        };

        //立即购买回调
        const goToCart = () => {
            addCart({
                goods_id: book.detail.id,
                num: "1",
            }).then((res) => {
                if (res.status == "204" || res.status == "201") {
                    Toast.success("添加成功");
                    //设置状态
                    store.dispatch("updateCart");
                    router.push({ path: "/shopcart" });
                }
            });
        };
        return {
            id,
            ...toRefs(book),
            active,
            handleAddCart,
            goToCart,
        };
    },
};
</script>

<style scoped lang='scss'>
.content {
    padding: 10px;
}
</style>