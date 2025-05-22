export interface CallbackFn {
  (state?: any): void;
}

export interface GetStateFn<T> {
  (): T;
}

export interface SetStateFn<T> {
  (newState: Partial<T>, callback?: CallbackFn): void;
}

export interface SetSingleStateFn<T> {
  (partialStates: Partial<T>, callback?: CallbackFn): void;
}

export type KeyOf<T> = Extract<keyof T, string>;

export type CancelDebounceFn = () => void;

export type IntervalClear = () => void;
export type IntervalFn = (
  fn: Function,
  delay: number,
  options: {
    immediate?: boolean;
  }
) => () => void;
export type IntervalHook = readonly [IntervalFn, IntervalClear];

export type FormField<T, D extends FormDataType> = {
  value: T;
  required?: boolean;
  validator?: (value: T, data: D) => string | null | undefined;
  message?: string;
};

export type FormDataType = {
  [key: string]: any;
};

export type FormSubmitResult<T extends FormDataType> =
  | T
  | {[K in keyof T]?: string};

export type UseFormChangeResult<
  T extends Record<string, FormField<any, FormDataType>>,
> = [
  FormDataType,
  (formItem: Partial<FormDataType>) => void,
  {[K in keyof T]?: string},
  () => Promise<FormSubmitResult<FormDataType>>,
  () => void,
];

export type DebounceOptions = {
  delay: number; // 防抖间隔（毫秒）
  leading?: boolean; // 是否在防抖开始时立即执行（默认 true）
  trailing?: boolean; // 是否在防抖结束后执行最后一次调用（默认 true）
};

export type DebounceFn<T extends (...args: any[]) => any> = {
  execute: (...args: Parameters<T>) => void; // 【必选】包装后的防抖函数
  flush: () => void;
  cancel: () => void; // 【必选】取消待执行的防抖调用
  isPending: boolean; // 【推荐】当前是否有待处理的防抖调用
};

export type ThrottleOptions = {
  delay: number; // 节流间隔（毫秒）
  leading?: boolean; // 是否在节流开始时立即执行（默认 true）
  trailing?: boolean; // 是否在节流结束后执行最后一次调用（默认 true）
};

export type ThrottledFn<T extends (...args: any[]) => any> = {
  execute: (...args: Parameters<T>) => void; // 【必选】包装后的节流函数
  cancel: () => void; // 【必选】取消待执行的节流调用
  flush: () => void; // 【推荐】立即执行最后一次调用
  isPending: boolean; // 【推荐】当前是否有待处理的节流调用
};

export type MockRequestConfig<T = any> = {
  delay?: number; // 延迟时间（默认 200-500ms 随机）
  successRate?: number; // 成功概率（0-1，默认 0.8）
  mockData?: T; // 自定义返回数据
};

export type RequestState<T> = {
  loading: boolean;
  error: Error | null;
  data: T | null;
};

export type ApiResponse<T> = {
  status: number;
  data: T;
};

export interface UseMockRequestReturn<T> extends RequestState<ApiResponse<T>> {
  mockRequest: (config?: MockRequestConfig<T>) => Promise<ApiResponse<T>>;
  cancelRequest: () => void;
}
