<template>
    <div>
        <NavBar>
            <template v-slot:default>用户注册</template>
        </NavBar>
        <div style="margin-top:50px">
            <div style="text-align:center; ">
                <van-image
                    width="10rem"
                    height="10rem"
                    fit="contain"
                    src="https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                />
            </div>
        </div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field
                    v-model="name"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
                />
                <van-field
                    v-model="password_confirmation"
                    type="password"
                    name="密码"
                    label="确认密码"
                    placeholder="请填写一致密码"
                    :rules="[{ required: true, message: '确认密码' }]"
                />
                <van-field
                    v-model="email"
                    name="电子邮箱"
                    label="电子邮箱"
                    placeholder="请输入正确的邮箱格式"
                    :rules="[{ required: true, message: '请填写邮箱' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <div class="link-login" @click="$router.push({path:'/login'})">已有账号,立即登录</div>
                <van-button round block type="primary" color="#aa290c" native-type="submit">注册</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { ref, reactive, toRefs } from "vue";
import { register } from "network/user.js";
import { Notify, Toast } from "vant";
import { useRouter } from "vue-router";
export default {
    name: "Register",
    components: { NavBar },
    setup() {
        const router = useRouter();
        const userinfo = reactive({
            name: "",
            password: "",
            password_confirmation: "",
            email: "",
        });

        const onSubmit = () => {
            //先验证
            if (userinfo.password != userinfo.password_confirmation) {
                Notify("两次输入的密码不一致");
            } else {
                //提交给服务器
                register(userinfo).then((res) => {
                    if (res.status == "201") {
                        Toast.success("注册成功");
                        setTimeout(() => {
                            router.push({ path: "/login" });
                        }, 1000);
                        userinfo.password = "";
                        userinfo.password_confirmation = "";
                    }
                });
            }
        };

        return { ...toRefs(userinfo), onSubmit };
    },
};
</script>

<style scoped>
.link-login {
    font-size: 14px;
    margin-bottom: 20px;
    color: #aa290c;
}
</style>