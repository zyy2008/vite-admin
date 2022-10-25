import { defineComponent, PropType, ExtractPropTypes } from "vue";
import { Table, Button } from "ant-design-vue";
import type { ProColumns } from "../interface";

const formTableProps = {
  columns: {
    type: Array as PropType<ProColumns[]>,
    default: [],
  },
};

export type FormTableProps = Partial<ExtractPropTypes<typeof formTableProps>>;

export default defineComponent({
  props: formTableProps,
  setup({ columns }) {
    return () => (
      <>
        <Table
          columns={[
            ...columns.map((item) => ({
              ...item,
              customRender: () => <div>123</div>,
            })),
            {
              title: "操作",
              customRender: () => <a>删除</a>,
            },
          ]}
        />
        <Button>添加条目</Button>
      </>
    );
  },
});
