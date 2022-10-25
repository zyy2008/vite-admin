import type { CSSProperties, VNode } from "vue";
import type { FormItemProps } from "ant-design-vue";
import type { ColumnType } from "ant-design-vue/es/table/interface";
import type { ProFieldValueType, PorField } from "./proForm";

export type PorFields = PorField[ProFieldValueType] & {
  style?: CSSProperties;
  children?: VNode;
};

type FieldProps = PorFields & {
  form?: PorFields;
  search?: PorFields;
};

type HideTitle = {
  search?: boolean;
  form?: boolean;
};

export type ProColumns = ColumnType & {
  valueType?: ProFieldValueType;
  fieldProps?: FieldProps;
  formItemProps?: FormItemProps & {
    style?: CSSProperties;
  };
  hideInSearch?: boolean;
  hideTitle?: HideTitle;
  hideInForm?: boolean;
  hideInTable?: boolean;
  initialValue?: any;
};
