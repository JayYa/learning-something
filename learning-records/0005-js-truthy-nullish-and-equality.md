# 掌握第 0.5 阶段第 1 课：JS 空值、真假值与判等及 TS 边界分工

用户已掌握 JavaScript 的 `undefined` 与 `null` 语义及序列化差异、8 个 Falsy 值（及 `[]`/`{}` 为 Truthy）、`||` 与 `??` / `?.` 的短路返回机制、严格相等 `===` 与 `NaN` / `Number.isFinite` 校验。更重要的是，用户在追问中理清了两个关键心智模型：第一，理解了为何只写 TS 也绕不开 JS 运行时规则，并明确区分了"`tsc` 静态检查会拦住的跨类型 `==` 与 `isNaN("abc")`"和"`tsc` 完全放行、审阅时必须手盯的四类静默陷阱（`||` 吞零、`if ([])`、`Number.isFinite`、`JSON.stringify` 丢 `undefined`）"；第二，理解了 `NaN` 是具体的 `number` 数值，以及全局 `isNaN` 因隐式调用 `Number(x)` 而导致 `""` / `"   "` / `null` 漏判的原因。

**Evidence**: 完成课程 [0003 · JS 的空值、真假值与判等](../lessons/0003-js-truthy-nullish-and-equality.html)，就实验适用边界与第 7 题（`isNaN` 三兄弟差异）追问并确认理解，全页 8 道自测题全部答对（8/8，2026-11-26）。

**Implications**: 可以直接推进第 0.5 阶段第 2 课（对象、解构展开与数组链式操作）。后续课程在展示 JS 运行时坑时，继续明确标注"哪些 `tsc` 会拦截、哪些 `tsc` 不会报错"，能显著降低用户的记忆负担并精准对齐"审阅 TS 代码"的目标。
