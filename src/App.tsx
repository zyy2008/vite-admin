import { FunctionalComponent } from "vue";
import { ConfigProvider } from "ant-design-vue";
import { RouterView } from "vue-router";
import "./global.less";

const App: FunctionalComponent = () => (
  <ConfigProvider
    style={{
      height: "100%",
    }}
  >
    <RouterView />
  </ConfigProvider>
);

export default App;
