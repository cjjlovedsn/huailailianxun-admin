
type IRuleItems = import('element-plus').FormItemRule | import('element-plus').FormItemRule[]
export type IFormRules<T = string> = Partial<Record<T, IRuleItems>>
