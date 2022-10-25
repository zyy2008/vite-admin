import {
  defineComponent,
  PropType,
  ref,
  reactive,
  UnwrapNestedRefs,
  FunctionalComponent,
  ExtractPropTypes,
} from "vue";
import type {
  FormInstance as BaseFormInstance,
  FormProps,
  FormItemProps,
} from "ant-design-vue";
import { Form } from "ant-design-vue";
import fields from "./fields";
import type { ProFieldValueType } from "./index";
import type { PorFields, ProColumns } from "../interface";

export interface FormInstance extends BaseFormInstance {
  setFieldsValue: (T: Record<string, unknown>) => void;
}

const BaseFiled = ({
  valueType = "text",
  fieldProps,
  ...others
}: {
  valueType?: ProFieldValueType;
  fieldProps?: PorFields;
}) => {
  let placeholder: string | string[];
  const Filed = fields[valueType];

  switch (valueType) {
    case "select":
      placeholder = "请选择";
      break;
    case "rangePicker":
      placeholder = ["开始日期", "结束日期"];
      break;
    default:
      placeholder = "请输入";
      break;
  }

  return (
    <Filed placeholder={placeholder} {...fieldProps} {...others}>
      {fieldProps?.children}
    </Filed>
  );
};

export const ProFormItem: FunctionalComponent<{
  columns: ProColumns[];
  type: "search" | "form";
  model: UnwrapNestedRefs<object>;
}> = ({ columns, type, model }) => {
  return columns.map((item) => {
    const {
      valueType,
      fieldProps,
      title,
      dataIndex,
      hideTitle = { search: false, form: false },
      hideInSearch = false,
      hideInForm = false,
      formItemProps,
    } = item;
    const { search, form } = hideTitle;

    let label: any;
    let formItem: FormItemProps;
    let models: any;

    if (type === "search") {
      if (hideInSearch) return null;
      label = search ? null : title;
      formItem = { ...formItemProps, rules: [] };
    } else {
      if (hideInForm) return null;
      label = form ? null : title;
      formItem = { ...formItemProps };
    }

    switch (valueType) {
      case "switch":
        models = {
          checked: model[dataIndex as any],
          "onUpdate:checked": (val: any) => (model[dataIndex as any] = val),
        };
        break;
      case "upload":
        models = {
          fileList: model[dataIndex as any],
          "onUpdate:fileList": (val: any) => (model[dataIndex as any] = val),
        };
        break;
      default:
        models = {
          value: model[dataIndex as any],
          "onUpdate:value": (val: any) => (model[dataIndex as any] = val),
        };
        break;
    }

    return (
      <Form.Item {...formItem} label={label} name={dataIndex as string}>
        <BaseFiled
          valueType={valueType}
          fieldProps={{
            ...(fieldProps as PorFields),
            ...(fieldProps as PorFields)?.[type],
          }}
          {...models}
        />
      </Form.Item>
    );
  });
};

const proFromProps = {
  columns: {
    type: Array as PropType<ProColumns[]>,
    default: [],
  },
  model: {
    type: Object,
  },
  type: {
    type: String as PropType<"search" | "form">,
    default: null,
  },
  formProps: {
    type: Object as PropType<FormProps>,
  },
};

export type ProFormProps = Partial<ExtractPropTypes<typeof proFromProps>>;

export default defineComponent({
  props: proFromProps,
  setup({ model, type }, { expose }) {
    const formRef = ref<FormInstance>();
    const formModel = reactive<any>({ ...model });
    expose({
      validateFields: () => formRef.value?.validateFields(),
      setFieldsValue: (val) => {
        Object.keys(val).map((key) => {
          formModel[key] = val[key];
        });
      },
    } as FormInstance);
    return ({ columns, formProps }) => (
      <Form
        labelCol={{ span: 6 }}
        {...formProps}
        ref={formRef}
        model={formModel}
      >
        <ProFormItem columns={columns} type={type} model={formModel} />
      </Form>
    );
  },
});
