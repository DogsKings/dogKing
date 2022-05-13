<template>
    <div class="nav-bar">
        <div class="left" @click="goback">
            <slot name="left">
                <img src="~assets/images/caret-left.png" alt />
            </slot>
        </div>
        <div class="center">
            <slot>EWShop</slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
    name: "NavBar",
    setup() {
        const router = useRouter();
        const goback = () => {
            router.go(-1);
        };

        return {
            goback,
        };
    },
};
</script>

<style>
.nav-bar {
    display: flex;

    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    height: 45px;
    line-height: 45px;
    text-align: center;
    box-shadow: 0 2px 3px rgba(100, 100, 100, 0.3);
}
.left,
.right {
    width: 60px;
}
.center {
    flex: 1;
}
.left img {
    width: 45px;
    padding: 8px;
}
</style>