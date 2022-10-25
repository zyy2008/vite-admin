import { FunctionalComponent } from "vue";
import {
  Drawer as BaseDrawer,
  Button,
  DrawerProps,
  ButtonProps,
} from "ant-design-vue";

const Drawer: FunctionalComponent<DrawerProps & { submit?: ButtonProps }> = (
  { submit, ...others },
  { slots, emit }
) => {
  return (
    <BaseDrawer
      {...others}
      keyboard={false}
      maskClosable={false}
      destroyOnClose
      footerStyle={{
        textAlign: "right",
      }}
      footer={[
        <Button
          style={{ marginRight: "8px" }}
          onClick={() => emit("update:visible", false)}
        >
          取消
        </Button>,
        <Button type="primary" {...submit}>
          确定
        </Button>,
      ]}
    >
      {slots.default?.()}
    </BaseDrawer>
  );
};
export default Drawer;
