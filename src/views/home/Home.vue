<template>
    <div id="home">
        <NavBar>
            <template v-slot:default>商城</template>
        </NavBar>
        <TabControlFlow
            :clickColor="clickColor"
            v-show="isTabFixed"
            @tabClick="tabClick"
            :titles="['畅销','新书','精选']"
        ></TabControlFlow>
        <div class="warpper">
            <div class="content">
                <div ref="banref">
                    <HomeSwiper :banners="banners"></HomeSwiper>
                    <RecommendView :recommends="recommends"></RecommendView>
                </div>
                <TabControl
                    :clickColor="clickColor"
                    @tabClick="tabClick"
                    :titles="['畅销','新书','精选']"
                ></TabControl>
                <GoodsList :goods="showGoods"></GoodsList>
            </div>
        </div>
        <BackTop v-show="isTabFixed" @bTop="bTop"></BackTop>
    </div>
</template>

<script>
import HomeSwiper from "./ChildComps/HomeSwiper.vue";
import NavBar from "components/common/navbar/NavBar";
import RecommendView from "./ChildComps/RecommendView";
import TabControl from "components/content/tabControl/TabControl";
import TabControlFlow from "components/content/tabControl/TabControlFlow";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/common/backtop/BackTop";
import { getHomeAllData, getHomeGoods } from "network/home.js";
import { onMounted, reactive, ref, computed, watchEffect, nextTick } from "vue";
import BScroll from "better-scroll";
export default {
    name: "Home",
    components: {
        NavBar,
        RecommendView,
        TabControl,
        GoodsList,
        BackTop,
        HomeSwiper,
        TabControlFlow,
    },
    setup() {
        let isTabFixed = ref(false);
        let clickColor = ref(0);
        let banref = ref(null);
        let banners = ref([]);
        let bscroll = reactive({});

        //临时变量
        const recommends = ref([]);
        //商品列表数据的模型
        const goods = reactive({
            sales: { page: 0, list: [] },
            new: { page: 0, list: [] },
            recommend: { page: 0, list: [] },
        });
        const showGoods = computed(() => {
            return goods[currentType.value].list;
        });

        onMounted(() => {
            getHomeAllData().then((res) => {
                recommends.value = res.goods.data;
                banners.value = res.slides;
            });
            getHomeGoods("sales").then((res) => {
                goods.sales.list = res.goods.data;
            });
            getHomeGoods("recommend").then((res) => {
                goods.recommend.list = res.goods.data;
            });
            getHomeGoods("new").then((res) => {
                goods.new.list = res.goods.data;
            });

            //创建Better scroll对象
            bscroll = new BScroll(document.querySelector(".warpper"), {
                probeType: 3,
                click: true, //是否允许点击
                pullUpLoad: true, //上拉加载更多
            });
            //触发滚动事件
            bscroll.on("scroll", (position) => {
                isTabFixed.value = -position.y > banref.value.offsetHeight;
            });
            //上拉加载数据,触发pullingup
            bscroll.on("pullingUp", () => {
                let page = goods[currentType.value].page + 1;
                getHomeGoods(currentType.value, page).then((res) => {
                    goods[currentType.value].list.push(...res.goods.data);
                    goods[currentType.value].page += 1;
                });
                //完成上拉，等数据请求完成，要将新加载数据展示出来
                bscroll.finishPullUp();

                //重新计算高度
                bscroll.refresh();
            });
        });
        let currentType = ref("sales");
        const tabClick = (index) => {
            let type = ["sales", "new", "recommend"];
            currentType.value = type[index];
            clickColor.value = index;
            nextTick(() => {
                //重新计算高度
                bscroll && bscroll.refresh();
            });
        };

        //监听 任何一个变量有变化就会触发

        watchEffect(() => {
            nextTick(() => {
                //重新计算高度
                bscroll && bscroll.refresh();
            });
        });
        const bTop = () => {
            bscroll.scrollTo(0, 0, 500);
        };

        return {
            recommends,
            tabClick,
            goods,
            showGoods,
            isTabFixed,
            banref,
            bTop,
            banners,
            clickColor,
        };
    },
    methods: {},
};
</script>

<style lang = 'scss'>
.banners img {
    width: 100%;
    height: auto;
}
#home {
    height: 100vh;
    position: relative;
    .warpper {
        position: absolute;
        top: 45px;
        bottom: 50px;
        left: 0px;
        right: 0px;
        overflow: hidden;
    }
}
</style>