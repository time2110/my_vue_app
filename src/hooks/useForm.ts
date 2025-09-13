import type { UnwrapRef } from "vue"

// 单个校验规则
type Rule = {
  required?: boolean // 是否必填
  min?: number // 最小长度或值
  max?: number // 最大长度或值
  type?: "string" | "number" | "email" | "phone" // 类型校验
  pattern?: RegExp
  validator?: (value: any) => boolean | string // 自定义校验函数
  message: string // 错误信息提示
}
// 规则映射：每个字段对应一个 Rule 数组
type Rules<T> = {
  [k in keyof T]?: Rule[]
}

// 表单配置
interface FormOptions<T> {
  initialValues: T // 初始值
  rules?: Rules<T>
}

// 错误信息映射
type FormErrors<T> = {
  [K in keyof T]?: string
}

// 校验器函数类型
type ValidatorFn = (value: any, rule: Rule) => string | null

// =====================
// 校验器集合（策略模式）
// =====================

const validators: Record<string, ValidatorFn> = {
  // 必填校验
  required: (value, rule) => {
    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      return rule.message
    }
    return null
  },

  // 字符串长度校验
  stringLength: (value, rule) => {
    if (typeof value !== "string") return null
    if (rule.min !== undefined && value.length < rule.min) return rule.message
    if (rule.max !== undefined && value.length > rule.max) return rule.message
    return null
  },

  // 数字范围校验
  numberRange: (value, rule) => {
    if (typeof value !== "number") return null
    if (rule.min !== undefined && value < rule.min) return rule.message
    if (rule.max !== undefined && value > rule.max) return rule.message
    return null
  },

  // 正则校验
  pattern: (value, rule) => {
    if (typeof value !== "string") return null
    if (rule.pattern && !rule.pattern.test(value)) return rule.message
    return null
  },

  // 邮箱校验
  email: (value, rule) => {
    if (typeof value !== "string") return null
    if (rule.type === "email" && !/^\S+@\S+\.\S+$/.test(value))
      return rule.message
    return null
  },

  // 手机号校验（示例扩展）
  phone: (value, rule) => {
    if (typeof value !== "string") return null
    if (rule.type === "phone" && !/^1[3-9]\d{9}$/.test(value))
      return rule.message
    return null
  },
}

/**
 * @param options
 * @returns
 *
 * Record<string, any>
 * 内置类型，对象类型
 *
 * { ...options.initialValues }
 * 避免外部对象被意外修改
 * 创建副本，保证表单数据独立
 *
 */
export function useForm<T extends Record<string, any>>(
  options: FormOptions<T>
) {
  // 响应式表单数据
  const form = reactive<T>({ ...options.initialValues })
  // 响应式错误状态
  const errorsRef = ref<FormErrors<T>>({})
  const errors = computed(() => errorsRef.value)

  // 校验单个字段
  // 校验单个字段
  const validateField = (key: keyof T, value: any): string | null => {
    const rules = options.rules?.[key]
    if (!rules) return null // 无规则，跳过

    for (let rule of rules) {
      // 1. 自定义校验器优先
      if (rule.validator) {
        const result = rule.validator(value)
        if (result !== true) {
          return typeof result === "string" ? result : rule.message
        }
        continue // 自定义校验通过，跳过内置校验
      }

      // 2. 内置校验器（按值类型选择）
      const builtInValidators: ValidatorFn[] = [
        validators.required,
        ...(typeof value === "string"
          ? [
              validators.stringLength,
              validators.pattern,
              validators.email,
              validators.phone,
            ]
          : []),
        ...(typeof value === "number" ? [validators.numberRange] : []),
      ]

      // 顺序执行内置校验器
      for (let validator of builtInValidators) {
        const error = validator(value, rule)
        if (error) return error
      }
    }

    return null // 所有规则通过
  }
  // 校验整个表单
  const validate = async (): Promise<boolean> => {
    const newErrors: FormErrors<T> = {}

    for (let key in form) {
      const error = validateField(key as keyof T, form[key])

      if (error) {
        newErrors[key as keyof T] = error
      }
    }

    errorsRef.value = newErrors

    return Object.keys(newErrors).length === 0
  }
  // 重置表单
  const reset = () => {
    Object.assign(form, { ...options.initialValues })
    errorsRef.value = {}
  }

  // 手动设置错误（用于异步校验）
  const setErrors = (errs: Partial<FormErrors<T>>) => {
    errorsRef.value = { ...errorsRef.value, ...errs }
  }

  // 是否校验通过（计算属性）
  const isValid = computed(() => {
    return Object.keys(errorsRef.value).length === 0
  })

  return {
    form: form as UnwrapRef<T>, // 确保 form 类型是“解开后的 T”，模板和脚本都无需 .value
    errors,
    validate,
    reset,
    setErrors,
    isValid,
  }
}
