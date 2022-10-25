import { defineComponent } from "vue";
import {
  Input,
  Select,
  Textarea,
  InputSearch,
  Switch,
  InputPassword,
  RadioGroup,
  CheckboxGroup,
  Checkbox,
  Upload,
  RangePicker,
} from "ant-design-vue";
import type {
  CheckboxGroupProps,
  CheckboxProps,
  InputProps,
  SelectProps,
  TextAreaProps,
  SwitchProps,
  RadioGroupProps,
  UploadProps,
  TimeRangePickerProps,
} from "ant-design-vue";

export type PorField = {
  text?: InputProps;
  select?: SelectProps;
  textarea?: TextAreaProps;
  search?: InputProps;
  switch?: SwitchProps;
  password?: InputProps;
  radioGroup?: RadioGroupProps;
  checkboxGroup?: CheckboxGroupProps;
  checkbox?: CheckboxProps;
  upload?: UploadProps;
  rangePicker?: TimeRangePickerProps;
};

const fields: Record<string, ReturnType<typeof defineComponent>> = {
  text: <Input />,
  select: <Select />,
  textarea: <Textarea />,
  search: <InputSearch />,
  switch: <Switch />,
  password: <InputPassword />,
  radioGroup: <RadioGroup />,
  checkboxGroup: <CheckboxGroup />,
  checkbox: <Checkbox />,
  upload: <Upload />,
  rangePicker: <RangePicker />,
};

export type ProFieldValueType = Extract<keyof PorField, any>;

export default fields;
