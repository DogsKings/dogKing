<template>
    <div class="address-deit-box">
        <NavBar>
            <template v-slot:default>{{title}}</template>
        </NavBar>
        <div class="van-address-edit">
            <van-address-edit
                :area-list="areaList"
                :show-postal="false"
                :show-delete=" type == 'edit' "
                :address-info="addressInfo"
                show-set-default
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
                @change-detail="onChangeDetail"
            />
        </div>
    </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import {
    addAddress,
    editAddress,
    deleteAddress,
    getAddressDetail,
} from "network/address";
import { ref, onMounted, reactive, computed, toRefs } from "vue";
import { Toast } from "vant";
import { areaList } from "@vant/area-data";
import { useRoute, useRouter } from "vue-router";

export default {
    components: {
        NavBar,
    },
    setup() {
        const searchResult = ref([]);
        const route = useRoute();
        const router = useRouter();
        const state = reactive({
            addressInfo: {},
            type: "add",
            addressId: "",
            title: "",
        });

        onMounted(() => {
            //接收到两个参数
            const { type, addressId } = route.query;
            state.type = type;
            state.addressId = addressId;

            if (type == "edit") {
                getAddressDetail(addressId).then((res) => {
                    const addressdetail = res;
                    let _areaCode = "";
                    let arrData = [];
                    let provinceData = [];
                    //倒推地址码算法
                    //便利全国县区
                    Object.entries(areaList.county_list).forEach(
                        ([id, text]) => {
                            //提取出全国名称与所选值相同的县区的地区key，并存储在arrData数组
                            if (addressdetail.county == text) {
                                arrData.push(id);
                            }
                        }
                    );
                    //遍历全国省
                    Object.entries(areaList.province_list).forEach(
                        ([provinceId, provinceText]) => {
                            //提取全国省与所选省名称相同的省的key
                            if (provinceText == addressdetail.province) {
                                arrData.forEach((value, key) => {
                                    //将其key与之前存储的两个区县key前两位进行比对，并提取数值一致的key
                                    if (
                                        value.substr(0, 2) ==
                                        provinceId.substr(0, 2)
                                    ) {
                                        provinceData.push(value);
                                    }
                                });
                            }
                        }
                    );
                    Object.entries(areaList.city_list).forEach(
                        ([cityId, cityText]) => {
                            //提取全国城市与所选城市名称相同的城市的key
                            if (cityText == addressdetail.city) {
                                provinceData.forEach((value, key) => {
                                    //将其key与之前存储的province的key前四位进行比对
                                    //并将比对过后校验准确的value赋给_areaCode
                                    if (
                                        value.substr(0, 4) ==
                                        cityId.substr(0, 4)
                                    ) {
                                        _areaCode = value;
                                    }
                                });
                            }
                        }
                    );
                    //-------------------------------------------------------------------------------
                    // if (text == addressdetail.county) {
                    //     //找到区对应的几个省份
                    //     const provinceIndex = province.findIndex(
                    //         (item) =>
                    //             item.id.substr(0, 2) == id.substr(0, 2)
                    //     );
                    //     //找到区对应的几个市区
                    //     //eslint-disable-next-line no-unused-vars
                    //     const cityItem = Object.entries(
                    //         areaList.city_list
                    //     ).filter(
                    //         ([cityId, city]) =>
                    //             cityId.substr(0, 4) == id.substr(0, 4)
                    //     );
                    //     //对比找到的省份和接口返回的省份是否相等，因为会有重名
                    //     if (
                    //         province[provinceIndex].text ==
                    //             addressdetail.province &&
                    //         cityItem[1] == addressdetail.city
                    //     ) {
                    //         _areaCode = id;
                    //     }
                    // }
                    //-------------------------------------------------------------------------------

                    //获取地址详情
                    state.addressInfo = {
                        name: addressdetail.name,
                        tel: addressdetail.phone,
                        province: addressdetail.province,
                        city: addressdetail.city,
                        county: addressdetail.county,
                        areaCode: _areaCode,
                        addressDetail: addressdetail.address,
                        isDefault: !!addressdetail.is_default,
                    };
                });
            }
        });

        const onSave = (content) => {
            const params = {
                name: content.name,
                phone: content.tel,
                province: content.province,
                city: content.city,
                county: content.county,
                address: content.addressDetail,
                is_default: content.isDefault ? 1 : 0,
            };

            if (state.type == "edit") {
                //调用编辑数据接口
                editAddress(state.addressId, params);
            } else if (state.type == "add") {
                //调用接口添加数据
                addAddress(params);
            }

            Toast("保存成功");
            setTimeout(() => {
                router.back();
            }, 1000);
        };
        const onDelete = () => {
            //调用删除地址接口
            deleteAddress(state.addressId).then((res) => {
                Toast("删除成功");
                setTimeout(() => {
                    router.back();
                }, 1000);
            });
        };
        const onChangeDetail = (val) => {
            if (val) {
                searchResult.value = [
                    {
                        name: "黄龙万科中心",
                        address: "杭州市西湖区",
                    },
                ];
            } else {
                searchResult.value = [];
            }
        };

        const title = computed(() => {
            return state.type == "add" ? "添加地址" : "编辑地址";
        });

        return {
            ...toRefs(state),
            onSave,
            onDelete,
            areaList,
            searchResult,
            onChangeDetail,
            title,
        };
    },
};
</script>

<style lang='scss'>
.van-address-edit {
    margin-top: 20px;
}
</style>