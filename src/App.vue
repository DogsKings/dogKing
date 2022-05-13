<template>
    <router-view v-slot="{ Component }">
        <keep-alive :include="includeList">
            <component :is="Component" />
        </keep-alive>
    </router-view>

    <div id="nav">
        <router-link class="tab-bar-item" to="/">
            <div class="icon">
                <i class="iconfont icon-shouye"></i>
            </div>
            <div>首页</div>
        </router-link>

        <router-link class="tab-bar-item" to="/category">
            <div class="icon">
                <i class="iconfont icon-fenlei"></i>
            </div>
            <div>分类</div>
        </router-link>

        <router-link class="tab-bar-item" to="/shopcart">
            <div class="icon">
                <van-badge :content="0" max="9">
                    <div class="child" />
                    <i class="iconfont icon-gouwuche"></i>
                </van-badge>
            </div>
            <div>购物车</div>
        </router-link>

        <router-link class="tab-bar-item" to="/profile">
            <div class="icon">
                <i class="iconfont icon-yonghu-xianxing"></i>
            </div>
            <div>我的</div>
        </router-link>
    </div>
</template>
<script>
import { reactive, watch, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
export default {
    name: "App",
    setup() {
        const state = reactive({
            includeList: [],
        });
        const route = useRoute();
        // const router = useRouter()
        watch(
            () => route,
            (newVal, oldVal) => {
                if (
                    newVal.meta.keepAlive &&
                    state.includeList.indexOf(newVal.name) === -1
                ) {
                    state.includeList.push(newVal.name);
                    console.log(state.includeList);
                }
            },
            { deep: true }
        ); // 开启深度监听
        return {
            ...toRefs(state),
        };
    },
};
</script>
<style lang="scss">
@import "assets/css/base.css";
@import "assets/css/iconfont.css";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    background-color: #f6f6f6;
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 -3px 5px rgba(100, 100, 100, 0.1);
    z-index: 10;
    a {
        color: var(--color-text);
        font-weight: bold;

        &.router-link-exact-active {
            color: var(--color-hight-text);
        }
    }
    .tab-bar-item {
        flex: 1;
        text-align: center;
        height: 50px;
        font-size: var(--font-size);
        .icon {
            width: 24px;
            height: 24px;
            margin-top: 5px;
            vertical-align: middle;
            display: inline-block;
        }
    }
}
</style>
