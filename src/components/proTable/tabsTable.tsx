import {
  defineComponent,
  ref,
  PropType,
  ExtractPropTypes,
  watch,
  VNode,
  toRefs,
  Ref,
} from "vue";
import { Card } from "ant-design-vue";
import { ProTable, ProTableProps, ProTableInstance } from "./index";

type TabList = {
  ref?: Ref;
  key: string;
  tab: any;
  /** @deprecated Please use `customTab` instead. */
  slots?: {
    tab: string;
  };
  disabled?: boolean;
  proTableProps?: ProTableProps;
  customRender?: VNode | (() => VNode);
};

const tabsTableProps = {
  tabList: {
    type: Array as PropType<TabList[]>,
    default: [],
  },
  onTabChange: {
    type: Function as PropType<(T: string) => void>,
  },
};

export type TabsTableProps = Partial<ExtractPropTypes<typeof tabsTableProps>>;

const TableItem = defineComponent({
  props: {
    activeTabKey: {
      type: String,
    },
    customRender: {
      type: [Function, Object] as PropType<VNode | (() => VNode)>,
    },
    proTableProps: {
      type: Object as PropType<ProTableProps>,
    },
  },
  setup(props, { expose }) {
    const { activeTabKey } = toRefs(props);
    const tableRef = ref<ProTableInstance>();
    watch(activeTabKey, () => {
      setTimeout(() => {
        tableRef.value?.reload();
      }, 0);
    });
    expose({
      reload: () => tableRef.value?.reload(),
    });
    return ({ customRender, proTableProps }) => (
      <>{customRender?.() || <ProTable ref={tableRef} {...proTableProps} />}</>
    );
  },
});

export default defineComponent({
  props: tabsTableProps,
  setup({ tabList, onTabChange }) {
    const [first] = tabList;
    const activeTabKey = ref<string>(first?.key);
    watch(activeTabKey, () => onTabChange?.(activeTabKey.value));
    return ({ tabList }) => {
      const [{ customRender, proTableProps, ref }] = tabList.filter(
        ({ key }) => activeTabKey.value === key
      );
      return (
        <Card
          tabList={tabList}
          activeTabKey={activeTabKey.value}
          onTabChange={(value) => (activeTabKey.value = value)}
        >
          <TableItem
            ref={ref}
            activeTabKey={activeTabKey.value}
            customRender={customRender}
            proTableProps={proTableProps}
          />
        </Card>
      );
    };
  },
});
