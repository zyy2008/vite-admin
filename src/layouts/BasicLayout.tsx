import { defineComponent, watchEffect, reactive } from "vue";
import ProLayout, {
  getMenuData,
  clearMenuItem,
} from "@ant-design-vue/pro-layout";
import type { MenuState } from "@ant-design-vue/pro-layout";
import { RouterView, useRouter } from "vue-router";

const BasicLayout = defineComponent({
  setup() {
    const router = useRouter();
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
    const baseState = reactive<MenuState>({
      selectedKeys: [],
      openKeys: [],
    });
    watchEffect(() => {
      if (router.currentRoute) {
        const matched = router.currentRoute.value.matched.concat();
        baseState.selectedKeys = matched
          .filter((r) => r.name !== "index")
          .map((r) => r.path);
        baseState.openKeys = matched
          .filter((r) => r.path !== router.currentRoute.value.path)
          .map((r) => r.path);
      }
    });
    return () => (
      <ProLayout menuData={menuData} selectedKeys={baseState.selectedKeys}>
        <RouterView />
      </ProLayout>
    );
  },
});

export default BasicLayout;
