<template>
    <div class="backTop" @click="backtop"></div>
</template>

<script>
import { ref } from "vue";
export default {
    name: "BackTop",

    setup(props, { emit }) {
        return {
            backtop: () => {
                emit("bTop");
            },
        };
    },
};
</script>

<style lang='scss'>
.backTop {
    width: 40px;
    height: 40px;
    position: fixed;
    bottom: 170px;
    right: 5px;
    z-index: 20px;
    background: url("~assets/images/gotop.png") no-repeat center center;
}
</style>