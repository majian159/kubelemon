import type { FormInstance } from 'antd';

export type ValidatesResult<T> = { values?: T; errors: FieldError[] };

export type FieldError = { name: string[]; errors?: string[] };

export type FormPartInstance<T> = {
  getValues: () => T | undefined;
  setValues: (values?: T) => void;
  validates: () => Promise<ValidatesResult<T>>;
};

export type FormPartProps<T> = {
  instance?: FormPartInstance<T>;
  values?: T;
  onChange?: (values: T) => void;
};

export function createFormPart<T>(): FormPartInstance<T> {
  const instance: FormPartInstance<T> = {
    getValues: () => {
      return undefined;
    },
    setValues: () => {},
    validates: async () => {
      return { errors: [] };
    },
  };
  return instance;
}

export function useFormPart<T>(): [FormPartInstance<T>] {
  return [createFormPart()];
}

export function formPartFromAntd<T>(
  form: FormInstance,
  option?: {
    normalize?: (value?: T) => any;
    transform?: (value?: any) => T;
  },
): [FormPartInstance<T> & { form: FormInstance }] {
  const transform = option?.transform ?? ((v) => v);
  const normalize = option?.normalize ?? ((v) => v);

  const instance: FormPartInstance<T> = {
    getValues: () => transform(form.getFieldsValue()),
    setValues: (v) => form.setFieldsValue(normalize(v)),
    validates: async () => {
      const result: ValidatesResult<T> = { errors: [] };
      try {
        result.values = transform(await form.validateFields());
      } catch (e) {
        const { values, errorFields } = e as {
          values: any;
          errorFields: { name: string[]; errors: string[] }[];
        };
        result.values = transform(values);
        result.errors = errorFields.map((ef) => {
          const fe: FieldError = { name: ef.name, errors: ef.errors };
          return fe;
        });
      }
      return result;
    },
  };
  return [{ ...instance, form }];
}

export function fillInstanceFromAntd<T>(
  instance: FormPartInstance<T>,
  form: FormInstance,
  option?: {
    normalize?: (value?: T) => any;
    transform?: (value?: any) => T;
  },
) {
  const ref = instance;
  const [inst] = formPartFromAntd(form, option);
  Object.entries(inst).forEach(([n, v]) => {
    ref[n] = v;
  });
}

export function aggreValidators<T>(
  instances: FormPartInstance<any>[],
): () => Promise<ValidatesResult<T>> {
  return async () => {
    let errors: FieldError[] = [];
    let v: any = {};
    await Promise.all(
      instances.map(async (i) => {
        const t = await i.validates();
        errors = [...errors, ...t.errors];
        v = { ...v, ...t.values };
      }),
    );
    return { values: v, errors };
  };
}
