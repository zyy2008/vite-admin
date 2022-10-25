import {
  defineComponent,
  PropType,
  VNode,
  ExtractPropTypes,
  ref,
  reactive,
  computed,
  UnwrapNestedRefs,
  toRaw,
  toRefs,
  watch,
  isReactive,
} from "vue";
import {
  Card,
  Form as BaseForm,
  Space,
  Button,
  Table,
  Tooltip,
  message,
  Popconfirm,
} from "ant-design-vue";
import type {
  ButtonProps,
  CardProps,
  DrawerProps,
  TableProps,
  FormProps,
} from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import { usePagination } from "vue-request";
import type { PaginationMixinOptions } from "vue-request/dist/types/usePagination";
import Drawer from "../drawer";
import type { ProColumns } from "../interface";
import { ProForm, ProFormItem, FormInstance, ProFormProps } from "../proForm";

type SearchProps = {
  optionRender?: (() => VNode) | boolean;
  reloadButton?: ButtonProps;
  position?: "title" | "extra";
  formProps?: FormProps;
  addButton?: ButtonProps & { onAdd?: () => void; visible?: boolean };
  delButton?: ButtonProps & { visible?: boolean };
};

type Key = number | string;

type SelectedRow = {
  loading: boolean;
  selectRowKeys: Key[];
};

const proTableProps = {
  columns: {
    type: Array as PropType<ProColumns[]>,
    default: [],
  },
  search: {
    type: [Boolean, Object] as PropType<SearchProps>,
    default: true,
  },
  cardProps: {
    type: Object as PropType<Pick<CardProps, "title" | "extra">>,
    default: {
      title: null,
      extra: null,
    },
  },
  drawerFormProps: {
    type: Object as PropType<ProFormProps>,
  },
  drawerProps: {
    type: Object as PropType<
      DrawerProps & { onFinish?: (T: Key[]) => Promise<Result> }
    >,
  },
  tableProps: {
    type: Object as PropType<Omit<TableProps, "columns">>,
  },
  service: {
    type: Function as PropType<(T: any) => Promise<any>>,
    default: () => "",
  },
  options: {
    type: Object as PropType<PaginationMixinOptions<any, any, any>>,
  },
  params: {
    type: Object as PropType<UnwrapNestedRefs<object>>,
    default: {},
  },
  onDelete: {
    type: Function as PropType<(T: Key[]) => Promise<Result>>,
    default: null,
  },
  optionList: {
    type: Function as PropType<(T: SelectedRow, R: boolean) => VNode[] | VNode>,
    default: () => [],
  },
};

export type ProTableProps = Partial<ExtractPropTypes<typeof proTableProps>>;

export type ProTableInstance = {
  reload: () => void | undefined;
  drawer: {
    setVisible: (T: boolean) => void;
    setFieldsValue: (T: Record<string, unknown>) => void;
  };
};

export default defineComponent({
  props: proTableProps,
  setup(props, { expose }) {
    const { service, options, params, columns } = toRefs(props);
    const visible = ref<boolean>(false);
    const formRef = ref<FormInstance>();
    const searchRef = ref<FormInstance>();
    const model = Object.fromEntries(
      columns.value.map(({ dataIndex, initialValue }) => [
        dataIndex,
        initialValue ?? null,
      ])
    );
    const searchModel = reactive<any>({ ...model });

    const selectedRow = reactive<SelectedRow>({
      selectRowKeys: [],
      loading: false,
    });

    const submit = reactive<{ loading: boolean }>({
      loading: false,
    });

    const storePagination = computed(() => {
      return usePagination(
        (val) => {
          const pag = options.value?.pagination as any;
          const value =
            (pag &&
              Object.fromEntries(
                Object.keys(pag).map((key) => {
                  let value: any;
                  switch (key) {
                    case "currentKey":
                      value = val.pageNumber | val[pag?.[key]];
                      break;
                    case "pageSizeKey":
                      value = val.pageSize | val[pag?.[key]];
                      break;
                    default:
                      break;
                  }
                  return [pag[key], value];
                })
              )) ??
            val;
          return service.value({ ...params.value, ...value });
        },
        {
          defaultParams: {
            pageSize: 100,
            pageNumber: 1,
          },
          pagination: {
            currentKey: "pageNumber",
            pageSizeKey: "pageSize",
            totalKey: "total",
          },
          ...options.value,
          formatResult: (res) => {
            const format = (options.value as any)?.formatResult;
            return format ? format?.(res) : res?.data;
          },
        }
      );
    });

    const {
      data,
      run,
      current,
      pageSize,
      total,
      loading,
      reload: reloaded,
    } = storePagination.value;

    const tablePagination = computed(() => {
      return {
        total: total.value,
        current: current.value,
        pageSize: pageSize.value,
      };
    });

    const dataSource = computed(() => {
      return data.value?.records ? data.value?.records : data.value ?? [];
    });

    const hasSelected = computed(() => selectedRow.selectRowKeys.length > 0);

    const reload = () => {
      reloaded();
      selectedRow.selectRowKeys = [];
    };

    if (isReactive(params.value)) {
      watch(params.value, () => {
        run({
          ...params?.value,
          pageSize: pageSize.value,
          pageNumber: current.value,
        });
      });
    }

    expose({
      reload,
      drawer: {
        setVisible: (val: boolean) => {
          visible.value = val;
        },
        setFieldsValue: (val: any) => {
          setTimeout(() => {
            formRef.value?.setFieldsValue(val);
          }, 0);
        },
      },
    });

    return ({
      cardProps,
      columns: tableColumns,
      drawerProps,
      tableProps,
      search,
      onDelete,
      optionList,
      drawerFormProps,
    }) => {
      const { title, extra } = cardProps;
      const columns = tableColumns.filter(
        (item: ProColumns) => !item?.hideInTable ?? true
      );
      const {
        optionRender,
        reloadButton = {},
        position = "title",
        addButton,
        delButton,
      } = search;
      const searchRender: {
        title?: VNode;
        extra?: VNode;
      } = {
        [position]: (
          <Space>
            {(addButton?.visible ?? true) && (
              <Button
                type="primary"
                {...{
                  onClick: () => {
                    visible.value = true;
                    addButton?.onAdd?.();
                  },
                  ...addButton,
                }}
              >
                新增
              </Button>
            )}
            {(delButton?.visible ?? true) && (
              <Popconfirm
                title="确定删除？"
                disabled={!hasSelected.value}
                onConfirm={async () => {
                  selectedRow.loading = true;
                  try {
                    const { code, msg } = await onDelete?.(
                      toRaw(selectedRow.selectRowKeys)
                    );
                    if (code === "S-00001") {
                      message.success(msg);
                      reload();
                    } else {
                      message.error(msg);
                    }
                  } catch (error) {
                    selectedRow.loading = false;
                  }
                  selectedRow.loading = false;
                }}
              >
                <Button
                  loading={selectedRow.loading}
                  disabled={!hasSelected.value}
                >
                  删除
                </Button>
              </Popconfirm>
            )}
            {optionList(selectedRow, hasSelected.value)}
            {search && (
              <BaseForm
                {...{
                  onFinish: (val: any) => {
                    run({
                      ...val,
                      pageSize: pageSize.value,
                      pageNumber: current.value,
                    });
                  },
                  ...search.formProps,
                }}
                model={searchModel}
                layout="inline"
                ref={searchRef}
                style={{
                  marginLeft: "10px",
                }}
              >
                <ProFormItem
                  columns={tableColumns}
                  type="search"
                  model={searchModel}
                />
                {typeof optionRender === "boolean"
                  ? optionRender
                  : optionRender?.() || (
                      <>
                        <Button onClick={() => searchRef.value?.resetFields()}>
                          重置
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{
                            margin: "0 10px",
                          }}
                        >
                          查询
                        </Button>
                      </>
                    )}
                {reloadButton && (
                  <Tooltip title="刷新" placement="top">
                    <Button
                      icon={<ReloadOutlined />}
                      {...reloadButton}
                      onClick={() => reload()}
                    />
                  </Tooltip>
                )}
              </BaseForm>
            )}
          </Space>
        ),
      };
      return (
        <>
          <Card
            {...cardProps}
            title={
              <Space>
                {title}
                {searchRender?.title}
              </Space>
            }
            extra={
              <Space>
                {extra}
                {searchRender?.extra}
              </Space>
            }
          >
            <Table
              rowSelection={{
                selectedRowKeys: selectedRow.selectRowKeys,
                onChange: (val: Key[]) => {
                  selectedRow.selectRowKeys = val;
                },
              }}
              {...tableProps}
              loading={loading.value}
              columns={columns}
              dataSource={dataSource.value}
              onChange={({ current, ...others }) =>
                run({ ...others, pageNumber: current, current })
              }
              pagination={tablePagination}
            />
          </Card>
          <Drawer
            title="新增"
            {...drawerProps}
            v-model:visible={visible.value}
            submit={{
              loading: submit.loading,
              onClick: () => {
                formRef.value
                  ?.validateFields()
                  .then(async (val) => {
                    submit.loading = true;
                    try {
                      const { code, msg } = await drawerProps.onFinish(val);
                      if (code === "S-00001") {
                        message.success(msg);
                        visible.value = false;
                        reload();
                      } else {
                        message.error(msg);
                      }
                    } catch (error) {
                      submit.loading = false;
                    }
                    submit.loading = false;
                  })
                  .catch(() => {
                    return;
                  });
              },
            }}
          >
            <ProForm
              {...drawerFormProps}
              ref={formRef}
              columns={tableColumns}
              model={model}
              type="form"
            />
          </Drawer>
        </>
      );
    };
  },
});
