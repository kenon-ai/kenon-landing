# Landing page for Kenon


---

# Kenon

[![CI](https://github.com/kenon-ai/kenon/actions/workflows/ci.yml/badge.svg)](https://github.com/kenon-ai/kenon/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@kenon-ai/cli.svg)](https://www.npmjs.com/package/@kenon-ai/cli)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
![Node.js >= 20.19.0](https://img.shields.io/badge/node-%3E%3D20.19.0-brightgreen.svg)

**Kenon：面向 Coding Agents 的上下文协议与并发协调层，让 Agent 在真实工程里持续工作而不失去状态、边界和证据。**

2 分钟装上，让你的 Agent 不再每次都从零理解仓库。  

> **Kenon 是一个 append-only 的 repo-local 工程语义账本：它不试图记录一切，而是为 Agent 沉淀关键决策、历史边界与验证证据，并在需要时折叠出最相关的上下文。**

开工前加载最小相关上下文，改动中检查是否越过历史边界，收尾时写回证据与决策；跨会话、跨 Agent 工作也能继续和收敛。


<sub>支持的运行时：Claude Code · Cursor · Codex · GitHub Copilot / VS Code · OpenCode · Pi</sub>  
<sub>主链特性：确定性 · 零外部依赖 · 默认零 LLM 依赖 · 多 Agent 并发受控协同</sub>

> **v0.1.0 · Alpha** — 核心协议与 CLI 已可用于真实项目；API 在 1.0 之前可能变化。欢迎试用和反馈。

```bash
kenon run onboard
kenon load <module> --scenario edit
kenon check --diff
```

## 它解决什么

Kenon 解决的不是“代码怎么改”，而是 **Agent 在真实工程里持续工作时，如何不丢失关键状态、越过既有边界、缺少验证证据，或在并发协作中失去收敛**。

它不是靠脆弱的 prompt 补丁维持行为，而是通过一套 repo-local 的结构化协议与监督面，让 Agent 在工程中持续工作时不失真，系统处理 5 个关键问题：

1. **开工前少猜**：减少开工前的上下文猜测，加载最小相关上下文
2. **改动中少越界**：拦截对历史设计边界和已排除路径的无意越界
3. **收尾时少扩散**：收敛改完后的验证与测试范围
4. **会话后少丢关键决策**：将关键决策、边界条件与验证证据稳定写回项目
5. **并发时可收敛**：在多个 Agent / skills 并发时，提供 repo-local 的追加式语义层，让状态追加、执行隔离与结果合流保持可追溯、可恢复

当一个 skill 不够、任务开始并发拆分时，Kenon 不是让更多 Agent 各自乱跑，而是让它们围绕同一个仓库内真源协作：**先追加、再隔离、再合流**。
这使得 debug、audit、test-fix、repair batch 这类重操作可以受控并发，而不是互相抢上下文、抢写入权、抢最终解释权。

> **Kenon 不是让 Agent 记住一切，而是让关键决策、边界和证据不再丢失。**


## Why Kenon

| 没有 Kenon | 有 Kenon |
|------------|----------|
| 开工前缺少稳定的项目状态入口 | `load` 返回折叠后的最小相关上下文，而不是整仓 dump |
| 已排除路径难以复用 | `excluded`、`grounds` 与 `reconsider_when` 让排除路径及其生效条件可回溯、可重审 |
| 变更容易无意越过历史边界 | `check --diff` 在合入前拦截越界，给出拦截信号而非直接阻断 |
| 代码改完后验证范围容易失控 | `impact` / `test-affected` 缩小验证范围，`verify` 以证据驱动验收 |
| 工程语义散落在会话和 prompt 中 | `save` / `finalize` 把决策、边界、证据写回项目，可回溯、可压缩 |
| 多个 Agent / skills 并发时容易抢上下文、抢工作区、抢最终解释权 | append-only 真源 + 隔离执行 + checkpoint / resume，让多 Agent 并行追加、隔离、合流而不互相踩状态 |
| Agent 每轮都要自己从日志、diff 和文档里重新拼当前态势 | `load` / `control_surface` 返回最小可消费的状态摘要、异常分级和下一步导航 |
| 想做批量审计、调试等重操作缺乏受控通道 | `kenon invoke` 提供多后端（Codex / Claude / Gemini）受控执行层 |
| 每个 Agent runtime 各搞一套 | 同一套协议层原生对接 6 个 Coding Agent runtime |

> 📖 **[Why Kenon is Kenon?](#设计立场为什么-kenon-会长成这样)**

## 适合什么场景

Kenon 更适合中大型、长期演进的仓库：

尤其是 Agent 需要跨会话持续工作、需要边界与证据可追溯、或存在多 Agent 并发 / 批量修复 / audit / debug 场景时。

对于一次性脚本、极小型 demo 仓库、或只需要简单 spec / task 模板的场景，Kenon 往往不是最小成本的选择。


## Kenon 与 Workflow Layer Tools 的区别


很多 AI coding 工具主要工作在 workflow layer：组织 **specs / tasks / journals / integrations**，帮助团队把 AI 协作流程搭起来。

Kenon 关注的是这之下的另一层：**Agent 在仓库中持续工作时，如何保住状态、边界、证据，以及并发协作时的收敛能力。**

因此，Kenon 更像一层可嵌入现有工作流之下的 **repo-local 工程语义账本与监督协议层**：

| 维度 | Workflow layer tools | Kenon |
|---|---|---|
| 第一消费者 | 人类 + Agent 共读的工作流资产 | Agent-first 的运行时状态、边界与证据协议 |
| 核心目标 | 组织 AI coding 协作流程 | 让 Agent 在复杂工程中持续工作而不失真 |
| 主要抽象 | specs / tasks / journals / integrations | intent / deps / quality / space / time |
| 上下文方式 | 文档编排与注入 | 按模块、场景、依赖和历史决策动态裁剪 |
| 任务闭环 | PRD、checklist、review 流程 | `load → check → impact → verify → save/finalize` |
| 边界控制 | 更多依赖规范与流程 | 显式建模边界、排除路径和重审条件 |
| 项目记忆 | 可读的工作流资产 | 可回溯的结构化语义账本 |

Workflow layer tools 主要解决“如何组织 AI coding 协作”；  
Kenon 解决的是“Agent 在复杂工程里如何持续工作而不失去工程语义”。

## 给 Agent 的监督座舱，而不是命令表

Kenon 的外观是 CLI，但对 Agent 来说，它更像一个 **以 inspection 为先的监督座舱（supervisory cockpit）**。当前稳定的运行时消费面主要分成三层：

- **观测面**：`alerts` / `gauges`
- **导航契约**：`next_actions` / `suggested_next`
- **兼容建议面**：`control_surface.actions.primary_action`

对 Agent 来说，Kenon 默认暴露的不是一堆文档，而是折叠后的监督面：**状态摘要、异常信号、证据缺口和下一步导航**。  
它的职责是提炼状态、定位证据、给出下一步建议，但不替 Agent 裁决。

| 座舱层 | 主要字段 | 先回答什么 |
|--------|----------|------------|
| **状态摘要** | `control_surface.now` + `gauges` | 当前处于什么状态？是否仍有待完成的验证步骤？ |
| **异常监督** | `alerts` + `warnings` + `evidence` | 哪些位置值得优先检查？哪些证据存在冲突或不足？ |
| **下一步导航** | `next_actions` + `suggested_next` | 下一步代价最低、风险最可控的动作是什么？ |

## 五维度骨架：一个锚 + 四个面


监督座舱回答的是“Agent 现在该看什么”；  
五维骨架回答的是“这些状态、边界和证据在底层是如何组织起来的”。

Kenon 的五维不是平铺的五类信息，而是一个更稳定的结构：

- **空间（模块路径）是公共锚点**
- **时间、质量、意图、依赖** 都围绕这个锚点聚合- `kenon load <module>` 的本质，就是 **以空间为键，拉四个面**

| 维度 | 回答的问题 | 与空间的关系 |
|------|------------|--------------|
| **空间** | 代码在哪、结构是什么 | 公共锚点；所有维度的 join key |
| **时间** | 上次改到哪、历史会话如何恢复 | sessions / threads 最终都会落到模块与文件 |
| **质量** | 代码健不健康、哪些问题仍在生效 | findings / reviews / postmortems 都按模块聚合 |
| **意图** | 为什么这样设计、排除了什么 | decisions / atoms / excluded 都通过模块关联进入当前工作 |
| **依赖** | 改 A 会影响 B 吗 | 依赖图的节点本身就是模块 |

在这套骨架里，Kenon 不只记录“做什么”，也记录“明确不做什么”：

- **做什么（allow）**：决策、默认路径、可行方案
- **不做什么（deny）**：排除路径、边界依据、重审条件

这也是为什么 `decisions` 和 `excluded` 在 Kenon 里都是一等公民。

## 渐进式接入

不需要一次理解完整协议。Day 1 只需跑通 `kenon run onboard → kenon load → kenon check --diff`。  

Kenon 提供 50+ 条命令，但在 L0~L1 阶段：

| 阶段 | 现阶段只需要做这些 | 立即得到什么 |
|------|-------------------|-------------|
| **L0 — 冷启动** | `run onboard` + `load` | 建立 space / deps 基础，并生成第一轮可读投影与基础上下文 |
| **L1 — 日常循环** | + `check --diff` + `finalize` | 增加意图边界把关与可追溯收口 |
| **L2 — 变更收口** | + `impact` + `verify` + `history --trace` | 缩小验证半径，并补齐因果链与证据收口 |
| **L3 — 连续工作** | + `save` + `resume` | 支持线程或会话级断点续传 |
| **L4 — 质量治理** | + `quality-check` + `acceptance-gate` | 增加更严格的质量治理与交付门槛 |

支持 macOS / Linux / Windows，要求 Node.js ≥ 20.19.0。

## 并发热层与收敛

Kenon 不只面向单次会话，也面向一人多并发、以及多 Agent 并行工作的真实工程环境。

从存储上看，它是 append-only 的 repo-local 语义账本；从协作上看，它提供了一层可追加、可隔离、可合流的热层。

当前已经成立的基础能力包括：append-only 真源、文件锁、WAL、checkpoint / resume、BatchRunner 并发调度，以及 `jj / worktree / git` 的隔离后端。

这些能力让状态可以先追加式累积，再通过 `compact`、`supersede` 与 `finalize` 逐步收敛，使 debug、audit、repair 等重操作能够在同一仓库里受控并发，而不是互相抢上下文、抢写入权、抢最终解释权。

## 开源设计意图写回与治理

Kenon 不只关注“这次代码怎么改”，也关注设计意图如何在长期仓库中稳定传递。关键决策、排除路径与边界条件可以写回 repo-local 真源，并按仓库策略发布公开协作子集。

更完整的开源 context governance（如围绕 PR / merge 的意图提取与贡献者 context 输入）仍在底层设计与演进中，不应视为当前已完全落地的能力。

## 多后端与受控扩展


Kenon 提供一条受控扩展路径：通过 `kenon invoke`、多后端适配器以及 BatchRunner，把更重的 AI 执行层能力接到现有工作流上。当前已支持 Codex / Claude / Gemini 及多节点 DAG 调度。

> 注意：`invoke` 是受控增强面，不是 Kenon 的主链定义；需要稳定、低成本、可复现的主路径仍在 `load / check / impact / verify / save` 这一侧。

## VCS 推荐集成模式

为多 Agent 隔离、恢复与安全存档，Kenon 推荐以下 VCS 集成梯队：

- 推荐配置：**`jj+git colocate`**
- 降级梯队：`git worktree` → 常规的 `plain git` → 退化至纯文件系统- 环境探测：`kenon vcs-info`


## 数据目录

> `.kenon/` 中的 JSON / JSONL 是协议真源；Markdown 仅作为投影与人类阅读层。

```text
<project>/
└── .kenon/
    ├── intent/          # 意图层：设计决策、排除方案
    ├── quality/         # 质量层：审计发现、复盘归档
    ├── space/           # 空间层：模块化注册与映射
    ├── time/            # 时间层：会话与线程跟踪
    ├── deps/            # 依赖层：代码图谱与测试覆盖
    └── .generated/      # 投影层：用于渲染 Markdown 供人类阅读
```

## 测试与质量保障

- **测试防线**：243+ 测试文件覆盖单元/集成测试；完整 CI 门禁。
- **端到端校验**：`kenon smoke` 与 guardrails 脚本覆盖主路径回归。
- **跨平台**：核心路径已覆盖 Windows 与 POSIX 兼容性。

## 从 ADR / RFC / Changelog 迁移

支持 `kenon init --from=adr|rfc|changelog` 进行渐进式导入，把已有决策记录和变更历史迁入 `.kenon/` 真源。

## 设计立场：为什么 Kenon 会长成这样

> **Kenon 源自希腊语 kenon（κενόν），意为“空处”或“留白”。**

### 1. 望远镜，不是法官
我们反思：harness 工具是否应该无限抢占编排和裁决权？我们选择的是去裁决化、去越权化，保留强大的监督与证据层，给模型正确的信号。
> **Kenon 是望远镜，不是法官。**

### 2. 不只记录方案，也记录边界
为什么没这么做？哪条路径已经排除？什么条件下结论需要重审？我们将负向知识作为一等公民纳入当前工作。
> **Kenon 不只记录方案，也记录边界。**

### 3. 不把项目记忆藏在会话里，而是写回项目
把关键项目记忆从 prompt、会话历史中抽离，以 repo-local、append-only 的真源结构写回 `.kenon/`。
> **Kenon 不把项目记忆藏在会话里，而是把它写回项目。**

### 4. 传递变更背后的因果与证据
不替代 Git，但把 Git 难以稳定承载的设计因果、排除路径、边界条件和验证证据收敛为可供 Agent 直接消费的结构化真源。
> **Git 记录的是代码如何变化；Kenon 记录的是这些变化背后的设计因果、边界条件和验证证据。**

## 文档导航

> **首次阅读建议：CLI 工作回路 → 核心协议白皮书 → 五维协议 → 架构总览。**

| 想了解 | 去哪看 |
|--------|--------|
| Agent 完整工作回路 | [`docs/reference/cli/README.md`](docs/reference/cli/README.md) |
| 验收流水线 | [`docs/guides/verification-pipeline.md`](docs/guides/verification-pipeline.md) |
| Recipe 管道 | [`docs/guides/recipes.md`](docs/guides/recipes.md) |
| 全部命令速查 | `kenon help --supported`（人）/ `kenon help --json`（Agent） |
| Runtime 集成 | [`hooks/templates/README.md`](hooks/templates/README.md) |
| 配置项参考 | [`docs/guides/config-reference.md`](docs/guides/config-reference.md) |
| 核心协议白皮书 (Layer A) | [`docs/core/README.md`](docs/core/README.md) |
| 五维度协议全文 | [`docs/core/tool-layer-five-dimensions.md`](docs/core/tool-layer-five-dimensions.md) |
| 架构全图 | [`docs/architecture-overview.md`](docs/architecture-overview.md) |
| 设计稿索引 | [`docs/design/README.md`](docs/design/README.md) |
| 核心红线 | [`docs/core/kenon-non-negotiables.md`](docs/core/kenon-non-negotiables.md) |
| 最简入口契约 | [`AGENTS.md`](AGENTS.md) |

## 贡献与社区
- [Contributing](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

## License
Apache-2.0
