# Landing page for Kenon


---

## 下面均为 Kenon的介绍
[![CI](https://github.com/kenon-ai/kenon/actions/workflows/ci.yml/badge.svg)](https://github.com/kenon-ai/kenon/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@kenon-ai/cli.svg)](https://www.npmjs.com/package/@kenon-ai/cli)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)]()

**Kenon：面向 Coding Agents 的本地项目上下文层。**

> **v0.1.0 · Alpha** — 核心协议与 CLI 已可用于真实项目；API 在 1.0 之前可能变化。欢迎试用和反馈。

Kenon 解决的不是“代码怎么改”，而是 **Agent 改代码时如何不失去状态、边界、证据和连续性**。

它不是靠脆弱的 prompt 补丁缝补行为，而是通过一套结构化的本地协议层，系统处理 Agent 协作中的 4 个关键问题：减少开工前的上下文猜测，拦截改动中对历史边界的无意越界，收敛改完后的验证与测试范围，并把设计意图、边界条件和验证证据稳定写回项目。

在运行时层面，Kenon 的确定性主链保持 **零外部依赖**，默认不把 `jj` / `git` / `rg` / MCP SDK / 语义模型之类增强能力当作前提。  
在执行语义层面，主链默认采用 **零 LLM 依赖** 的确定性路径：能用规则、图遍历和结构化数据解决的，就不交给模型；高成本补证和更重的判断默认延后到批末合流（batch-end / flush）阶段统一处理，以降低成本和运行时间。

**支持的运行时**：Claude Code · Cursor · Atomon · Official Codex · GitHub Copilot / VS Code · OpenCode · Pi  
**核心回路**：`load → work → check → save`  
**运行时特征**：确定性主链运行时零外部依赖  
**收口方式**：`save` 保留线程连续性，`finalize` 提炼本次改动

```bash
kenon run onboard
kenon load <module> --scenario edit
kenon check --diff
kenon save --thread <id>
kenon finalize
```

> README 是**给人的前门**；[`AGENTS.md`](AGENTS.md) 是给 Agent 的最短入口；[`docs/core/README.md`](docs/core/README.md) 与 `docs/core/tool-layer/*` 是协议真源。`.generated/*.md` 属于投影层（Projection Surface），不是 Agent 主循环真源。

> 很多工具先服务人，再兼容 Agent；Kenon 不是。  
> 它从第一天开始就按 **Agent 作为第一消费者** 来设计：默认主入口是运行时消费面（Runtime Surface），不是 Markdown 投影。

## 3 分钟 Demo

```bash
# 安装
npm install -g @kenon-ai/cli
# 或从源码：git clone → npm ci → npm link

# 冷启动
kenon --project /path/to/project run onboard

# Agent 开工前读上下文
kenon --project /path/to/project load <module> --scenario edit

# 改完后先做意图守卫
kenon --project /path/to/project check --diff
```

如果你还要同时生成 runtime 壳文件，再跑：

```bash
kenon --project /path/to/project init --wizard
```

普通 `kenon init` 在交互式 TTY 下会继续提示是否执行 `scan → dep-graph-l1 → dep-graph-l2 → compact`；`--wizard` 负责 runtime 壳文件，不会自动跑这段 follow-up。

| 没有 Kenon | 有 Kenon |
|------------|----------|
| 开工前缺少稳定的项目状态入口 | `load` 返回折叠后的最小相关上下文，而不是整仓 dump |
| 已排除路径难以复用 | `excluded`、`grounds` 与 `reconsider_when` 让排除路径及其生效条件可回溯、可重审 |
| 代码改完后验证范围容易失控 | `impact` / `test-affected` 缩小验证范围，`verify` 负责证据收口 |
| 代码变化之外的工程语义难以留存 | `save` / `finalize` 写回 checkpoint、决策脉络与验证证据 |

## 与 Agent 一起使用

对大多数团队来说，正确路径不是先学会 50+ 条命令，再手动操作，而是：

1. 人先读完这页，判断 Kenon 是否适合当前仓库
2. 告诉你的 Agent：把 Kenon 拉下来并初始化
3. 后续主要通过 `load`、`check --diff`、`impact`、`verify`、`save` / `finalize` 这条主路径工作
4. 完整命令面交给 Agent 通过 `kenon help --json` 自行导航

如果你想直接把这件事交给 Agent，可以把下面这段发给它：

```text
请先在这个仓库里安装并初始化 Kenon。
1. 运行 `git clone https://github.com/kenon-ai/kenon.git` 
2. 运行 `kenon run onboard`
3. 运行 `kenon load --global --scenario edit`
4. 告诉我这个仓库最值得先看的模块和原因
5. 后续在变更前默认先经过 `check --diff`
```

## 核心能力对比

| 核心能力 | 它带来的改变 |
|-----------|-----------------|
| **加载上下文** | 开工前获得真实项目状态、历史记录与下一步线索。 |
| **保留历史边界** | 已排除路径及其生效条件持续可见，并在条件变化时触发重审。 |
| **意图防线** | 在变更越过历史边界前给出拦截信号。 |
| **验证收敛** | 先缩小影响范围，再组织验证与证据收口。 |
| **本地记忆治理** | 决策、边界、signals、verification 和 checkpoint 沉淀为可回溯、可修复、可压缩的项目记忆。 |
| **证据收口** | 以验证证据而非主观判断作为完成依据。 |
| **安全写路径** | 通过 append-only、WAL、文件锁、doctor / repair，以及在 invoke 路径上的只读沙盒与 VCS 隔离，尽量把写入风险、并发冲突和恢复语义控制在协议边界内。 |
| **内核零额外依赖** | 确定性主链不把外部 SDK、模型或增强工具当作前提。 |
| **原生对接各平台** | 同一套协议层可挂接多个 Coding Agent runtime。 |

## 安装

```bash
# npm registry（发布后可用）
npm install -g @kenon-ai/cli

# 从源码
git clone https://github.com/kenon-ai/kenon.git
cd kenon && npm ci && npm link
```

支持 **macOS / Linux / Windows**。要求 Node.js ≥ 18。

可选依赖只增强扩展能力；核心确定性主链保持**运行时零依赖**：
- `@modelcontextprotocol/sdk`：`kenon mcp` bridge
- `web-tree-sitter`：scan / deps 的 AST 辅助路径

配置文件为项目根目录的 `kenon.config.json`，可调整 flush 策略、阈值、VCS 行为、语义搜索 provider 等。完整参考见 [`docs/guides/config-reference.md`](docs/guides/config-reference.md)。

## Runtime 集成

Kenon 通过 hooks、MCP 和 repo-local skills 与 7 个 Agent runtime 深度集成：

| Runtime | 集成面 |
|---------|-------|
| Claude Code | hooks + `.mcp.json` + repo-local skill |
| Cursor | hooks + MCP + rules + skill |
| Atomon | native + skill |
| Official Codex | hooks + config + skill |
| GitHub Copilot / VS Code | instructions + MCP + skill |
| OpenCode | plugin + skill |
| Pi | MCPorter + skill |

```bash
kenon init --wizard                 # 交互式选择 runtime 并写入壳文件
kenon gen <target>                  # 打印单个模板到 stdout
kenon mcp --stdio                   # 启动 MCP bridge
kenon mcp --check                   # 预检 bridge readiness
```

模板细节以 [`hooks/templates/README.md`](hooks/templates/README.md) 为准。

## 渐进式接入，不必一次填满五维度

五维度是完整的协议全景，但**不是 Day 1 就要一次填满的表单**。Kenon 的存储和读取模型天然支持渐进接入：目录彼此独立、场景读取自动裁剪、缺少某个维度不会阻塞主链，能力会随着协作过程自然累积。

| 阶段 | 现阶段只需要做这些 | 立即得到什么 |
|------|-------------------|-------------|
| **L0 — 冷启动** | `run onboard` + `load` | 建立 space / deps 基础，并生成第一轮可读投影 |
| **L1 — 日常循环** | + `check --diff` + `finalize` | 增加意图边界把关与可追溯收口 |
| **L2 — 变更收口** | + `impact` + `verify` + `history --trace` | 缩小验证半径，并补齐因果链与证据收口 |
| **L3 — 连续工作** | + `save` + `resume` | 实现线程或会话级断点续传 |
| **L4 — 质量治理** | + `quality-check` + `acceptance-gate` | 增加更严格的质量治理与交付门槛 |

命令数量本身不是使用门槛：人类先看 `kenon help --supported`，Agent 直接消费 `kenon help --json` 的结构化命令面即可。

## 常用命令速查

> 完整 56 命令参考，请见 [docs/reference/cli/README.md](docs/reference/cli/README.md)。用户建议查看 `kenon help --supported`，Agent 直接消费 `kenon help --json`。

### 读取

| 命令 | 说明 | 常用参数 (flags) |
|------|------|------------|
| `status` | 当前 `.kenon/` 状态概览 | `--protocol-summary`, `--health`, `--format json` |
| `load <module>` | 按照场景加载并输出五维度上下文 | `--scenario edit\|resume\|audit`, `--global`, `--format json` |
| `history <keyword>` | 决策搜索与因果链追溯 | `--trace <slug>`, `--include-archive` |
| `view <module>` | 输出五维投影视图 | `--global`, `--decisions [N]`, `--format json` |

### 验证 / 续做

| 命令 | 说明 | 常用参数 (flags) |
|------|------|------------|
| `check` | 回溯桥梁与 diff 意图守卫 | `--diff`, `--reeval <id>` |
| `verify` | 围绕断言展开的验证门卡点（claim-centric） | `--claim ready_to_commit`, `--module <path>` |
| `smoke` | 端到端冒烟验证（沙盒隔离） | `--with-write`, `--archive-test`, `--live` |
| `acceptance-gate` | 采样式模块验收门 | `--dry-run`, `--commit` |
| `impact <file>` | 代码变更后，查询潜在的影响范围 | `--format json` |
| `save` | 保存当前进度的 checkpoint | `--thread <id>`, `--vcs` |
| `resume` | 从 checkpoint 恢复工作进度 | `--thread <id>`, `--session <id>` |

### 写入

| 命令 | 说明 | 常用参数 (flags) |
|------|------|------------|
| `write <type>` | 写入设计原子、排除方案、决策或预警信号 | `--force` |
| `decide` | 快速记录决策、影响因素与排除方案 | stdin 接收 JSON |
| `finalize` | 会话收尾：将建议状态正式提取并落库确认 | `--apply-suggested`, `--check-supersedes` |

### 维护 / 分析

| 命令 | 说明 | 常用参数 (flags) |
|------|------|------------|
| `doctor` | 针对 `.kenon/` 执行一致性健康体检 | — |
| `compact` | 生成供阅读的投影内容 (summary/decisions) | `--dry-run` |
| `dep-graph-l1` | L1 级别的静态依赖引用分析 | `--module <mod>` |
| `dep-graph-l2` | L2 级别的动态事件订阅分析 | `--module <mod>`, `--dry-run` |
| `stale <module>` | 检测并清理过期的关联文档 | `--all`, `--format json` |

## Agent 工作流

```
开始 → load <module> --scenario edit        # 载入前置上下文信息
编辑 → write ...                            # 写入记录，期间 dirty 计数自动累积
     → (当 flush_hint=true 时触发强制校验)
     → check --diff / impact / stale        # 守卫动作：查越界、查影响面、查防过期
     → load --ack-flush                     # 清除积压的 dirty 计数
决策 → decide                               # 在发生架构级改动时沉淀意图
收尾 → finalize                             # 会话收尾，提炼变更并彻底写回
```

触发校验检查的 Flush 策略，可以通过 `kenon.config.json` 进行配置：
- `eager`（默认项）：比较积极，每次发生高风险写入后，便会及时提示执行校验。
- `batched`：允许积攒一组写入动作（默认积满 5 次），随后才会拉通提示校验。

## 验收流水线

代码提交前的多层验证闭环：

```
kenon smoke          端到端冒烟（沙盒隔离，零副作用）
    ↓ 通过
kenon verify         Claim 级别精确验证
    ↓ 通过
kenon acceptance-gate    采样式验收门（可选）
    ↓ 通过
kenon finalize       收尾：提取意图、检查超越、统计
```

`verify` 支持多种 claim 类型：`tests_pass`、`build_passes`、`bug_fixed`、`ready_to_commit`、`ready_to_merge`。每种 claim 自动收集对应证据（如 `check --diff` + `doctor`），以证据而非主观判断驱动验收。`verify --flush` 用于批末的补证与重评。

完整说明见 [`docs/guides/verification-pipeline.md`](docs/guides/verification-pipeline.md)。

## Recipe：可声明的命令管道

常用命令序列可以固化为声明式 JSON recipe，通过 `kenon run <recipe>` 一键执行：

| Recipe | 步骤 | 出错策略 |
|--------|------|----------|
| `quick-check` | scan → audit-status → stale | skip |
| `post-edit` | check --diff → impact → stale → compact | skip |
| `session-end` | finalize → compact | stop |
| `session-end-flush` | finalize → verify --flush → compact | stop |
| `full-audit` | scan → audit → audit-fix → audit-status | stop |
| `onboard` | init → scan → dep-graph-l1 → dep-graph-l2 → compact | skip |

支持自定义 recipe：项目级放 `.kenon/recipes/`，用户级放 `~/.config/pb/recipes/`。格式见 [`docs/guides/recipes.md`](docs/guides/recipes.md)。

## 五维度骨架：一个锚 + 四个面

Kenon 的五维不是平铺的五类信息，而是一个更稳定的结构：

- **空间（模块路径）是公共锚点**
- **时间、质量、意图、依赖** 都围绕这个锚点聚合
- `kenon load <module>` 的本质，就是**以空间为键，拉四个面**

| 维度 | 回答的问题 | 与空间的关系 |
|------|------------|--------------|
| **空间** | 代码在哪、结构是什么 | 公共锚点；所有维度的 join key |
| **时间** | 上次改到哪、历史会话如何恢复 | sessions / threads 最终都会落到模块与文件 |
| **质量** | 代码健不健康、哪些问题仍在生效 | findings / reviews / postmortems 都按模块聚合 |
| **意图** | 为什么这样设计、排除了什么 | decisions / atoms / excluded 都通过模块关联进入当前工作 |
| **依赖** | 改 A 会影响 B 吗 | 依赖图的节点本身就是模块 |

Kenon 关心的不是“把五类信息都堆给 Agent”，而是让 Agent 在进入一个模块时，能看到这个模块当前最相关的**状态、边界、因果和证据**。

在这套骨架里，Kenon 也不只记录“做什么”，还记录“明确不做什么”：

- **做什么（allow）**：决策、默认路径、可行方案
- **不做什么（deny）**：排除路径、边界依据、重审条件

这也是为什么 `decisions` 和 `excluded` 都是一等公民。

更完整的核心模型，见 [`docs/core/tool-layer/01-core-model.md`](docs/core/tool-layer/01-core-model.md)；完整协议文档包见 [`docs/core/tool-layer-five-dimensions.md`](docs/core/tool-layer-five-dimensions.md)。

## Kenon 与 Workflow Layer Tools 的区别

很多 AI coding 工具主要工作在 **workflow layer**：它们帮助团队组织 specs、tasks、journals、review context，并为不同 runtime 生成规则文件、入口脚手架和协作外壳。

Kenon 关注的是 workflow 之下的另一层问题：**Agent 在真实工程中如何带着状态、边界、因果和验证证据持续工作。**

因此，Kenon 更像一层可直接嵌入现有 Agent 工作流的**领域记忆 ledger / protocol layer**：

- 上层 Agent / workflow 负责理解、抽取与提炼
- 下层 ledger 负责 append-only、fold、signals、excluded、审计与并发收敛
- 高语义、高消耗、易漂移的工作留在上层
- 低损耗、高保真、可回溯的真源沉到下层

> Kenon 不是让 Agent 知道更多，而是让 Agent 在工程里持续工作时不失真。

| 维度 | Workflow layer tools | Kenon |
|---|---|---|
| 核心目标 | 组织 AI coding 协作流程 | 为 Agent 提供本地语义协议层 |
| 主要抽象 | specs / tasks / journals / integrations | intent / deps / quality / space / time |
| 上下文方式 | 文档编排与注入 | 按模块、场景、依赖和历史决策动态裁剪 |
| 任务闭环 | PRD、checklist、review 流程 | `load → check → impact → verify → save/finalize` |
| 边界控制 | 更多依赖规范与流程 | 显式建模边界、排除路径和重审条件 |
| 项目记忆 | 可读的工作流资产 | 可回溯的结构化语义账本 |

> Workflow layer tools 主要解决 **如何组织 AI coding 协作**；Kenon 解决的是 **Agent 在复杂工程中如何不失去工程语义**。

## 设计立场：为什么 Kenon 会长成这样

### 1. 望远镜，不是法官

**我们反思：**

- harness 抢编排权
- harness 抢上下文管理权
- harness 抢中间决策权

——真的应该这样吗？

**我们做的是：**

- 去裁决化
- 去越权化
- 保留监督与证据层
- 让模型不要在黑暗里乱跑

> **Kenon 是望远镜，不是法官。**

### 2. 不只记录方案，也记录边界

**我们反思：**

很多系统会记录“做了什么”，却不记录：

- 为什么没这么做？
- 哪条路径已经排除？
- 排除是在什么条件下成立的？
- 什么变化出现时才应该重新考虑？

**我们做的是：**

把负向知识纳入一等公民：

- `excluded`
- `grounds`
- `reconsider_when`

让“明确不做什么”进入当前工作流、进入 inspection、进入 guardrail。

> **Kenon 不只记录方案，也记录边界。**

### 3. 不把项目记忆藏在会话里，而是写回项目

**我们反思：**

如果项目记忆主要存在于 prompt、会话历史、runtime 私有 skill 和一次性的 summary 里，它真的能成为长期稳定的工程基础吗？

**我们做的是：**

把项目记忆写回 repo-local、append-only 的真源层：

- `.kenon/` 是 canonical storage root
- JSON / JSONL 是协议真源
- Markdown 是投影，不是主循环真源

> **Kenon 不把项目记忆藏在会话里，而是把它写回项目。**

### 4. 不只传递“改了什么”，也传递“为什么会变成这样”

**我们反思：**

开源协作当然不只传递代码和 diff，Git commit、PR 讨论和 review 也在传递一部分设计意图；但这些信息往往分散在不同介质里，粒度不稳定、结构不统一，也很难稳定回答“为什么没走另一条路”。

**我们做的是：**

不替代 Git，而是把原本会散落在代码、diff、commit、PR、review 和会话里的工程语义——设计意图、排除路径、边界条件和验证证据——收敛为可协作、可回溯、可供 Agent 直接消费的结构化真源。

> **Git 记录的是代码如何变化；Kenon 记录的是这些变化背后的设计因果、边界条件和验证证据。**

> 工程方法上，Kenon 继续吸收 Harness Engineering 对 change cost、confirmation gate、doom loop 的关注，但不会把监督层偷换成裁决层。

## 并发热层与开源设计意图传递

Kenon 不只面向单次会话，也面向一人多并发、以及多人多 Agent 并行工作的真实工程环境。当前已经成立的是：append-only 真源、文件锁、WAL、checkpoint / resume、BatchRunner 并发调度、以及 `jj / worktree / git` 的隔离后端。这些能力让语义可以先追加式累积，再通过 `compact` / `supersede` / `consolidate` 逐步收敛。完整的语义收敛管道并未全部完成，但热层基础已经具备。

同样地，Kenon 关注的不只是“这次代码怎么改”，也包括**设计意图如何在长期仓库中稳定传递**。当前已经成立的是：决策、排除路径、边界条件和验证证据可以写回 repo-local 真源，并按仓库策略发布公开协作子集；更完整的开源 context governance——例如围绕 PR / merge 的意图提取、贡献者 context 输入和协作写回——已经在 [`docs/design/01-core-model/context-governance.md`](docs/design/01-core-model/context-governance.md) 中明确设计，但当前仍属于 spec-only 方向，不应在 README 中假装为已落地能力。

## 多后端与受控扩展

Kenon 不只服务已经具备 sub-agent / agent teams 能力的运行时，也提供一条**受控扩展**路径：通过 `kenon invoke`、invoke-core、多后端适配器以及 BatchRunner，把更重的 AI 执行层能力接到现有工作流上。

当前已经成立的是：

- `kenon invoke` 已进入主包，作为多后端 AI 调用层存在
- `codex / claude / gemini` 适配器已在本仓库实现
- `batch-runner` 已支持并发控制、DAG 调度、checkpoint / resume 与 VCS 隔离
- audit / debug / quality 相关路径已经能在这套执行层上跑起来

这条能力链的定位不是替代确定性主链，而是**在主链之外做受控增强**：高语义、高消耗、需要多后端或批量编排的工作走 invoke / batch-runner；需要稳定、低成本、可复现的主路径仍留在 `load / check / impact / verify / save` 这一侧。完整的 invoke / sandbox / mode 设计见 [`docs/design/04-coordination/kenon-invoke-design.md`](docs/design/04-coordination/kenon-invoke-design.md)。

## 给 Agent 的监督座舱，而不是命令表

Kenon 的外观是 CLI，运行时消费面更接近一个 **以 inspection 为先的监督座舱（supervisory cockpit）**。当前稳定口径可以分成三层：

- **观测面**：`alerts` / `gauges`
- **导航契约**：`next_actions` / `suggested_next`
- **兼容建议面**：`control_surface.actions.primary_action`

它的职责是：提炼状态摘要、分级异常、定位证据，并给出下一步导航；它不替 Agent 裁决。

| 座舱层 | 主要字段 | 先回答什么 |
|--------|----------|------------|
| **状态摘要** | `control_surface.now` + `gauges` | 当前处于什么状态？是否仍有待完成的验证步骤？ |
| **异常监督** | `alerts` + `warnings` + `evidence` | 哪些位置值得优先检查？哪些证据存在冲突或不足？ |
| **下一步导航** | `next_actions` + `suggested_next` | 下一步代价最低、风险最可控的动作是什么？ |

## 56 个命令，但不需要手工记忆

面向人类的一线支持面只有 **19** 个命令，其余命令保留在 specialized / expert lane。  
对 Agent 来说，完整命令面会先被 `help --json` 折叠成下面四层导航结构：

| 导航层 | 当前规模 | 作用 |
|--------|---------|------|
| **入口通道 (Entry tracks)** | 3 条 | 对应日常开发、质量治理和测试保障三条默认路径 |
| **典型工作流 (Workflow spotlights)** | 4 条 | 对应 VCS、resume、pre-ship 与 audit 四类高频工作流 |
| **决策目标指引 (Decision tree goals)** | 4 个 | 按目标直接给出第一条 inspection-first 命令 |
| **拦截与规划模式 (Gate modes)** | 3 类 | 把命令分成 advisory / planner / gate 三类机器可消费契约 |

最高频的开发环路可以先压成 6 条：

| 常用环路 | 核心流 | 作用 |
|------|--------|------|
| **冷启动** | `run onboard → load` | 建立依赖图和基础投影，再进入上下文加载 |
| **编辑前 inspection** | `load <module> --scenario edit` | 先看历史决策、排除路径和质量压力，再开始变更 |
| **意图边界防线** | `check --diff` | 在 diff 合入前检查是否越过历史边界 |
| **影响面裁剪** | `impact <file> → test-affected → verify --claim ...` | 先缩小验证半径，再组织证据收口 |
| **现场恢复** | `load --global --scenario resume → thread status → resume --thread <id>` | 在恢复工作前重新获得项目状态与线程上下文 |
| **收尾与重整** | `session end --with-flush → finalize → compact` | 完成会话收口、意图提炼与投影刷新 |

README 只展示最高频的几条环路；完整导航仍以 `help --json` 和各命令返回的 `next_actions` 为准。

## 数据目录

```
<project>/
└── .kenon/
    ├── intent/          # 意图层：设计决策、语义原子、排除方案与提示信号
    ├── quality/         # 质量层：审计发现、实际验证结果、复盘归档
    ├── space/           # 空间层：模块化注册与重命名历史
    ├── time/            # 时间层：工作线程与会话跟踪记录
    ├── deps/            # 依赖层：代码依赖图谱与测试覆盖映射
    └── .generated/      # 投影层：用于渲染 Markdown 供人类阅读，并非底层真源
```

完整的 Schema 结构定义，请参阅 [`docs/core/tool-layer/02-storage-and-schema.md`](docs/core/tool-layer/02-storage-and-schema.md)。

`.kenon/` 文件夹是所有记忆的绝对根源（canonical storage root）。但是否将其纳入 Git 的追踪范围，取决于所在团队的部署习惯，协议本身不做硬性捆绑（不同部署策略参考 [`docs/core/kenon-tracking-matrix.md`](docs/core/kenon-tracking-matrix.md)）。

## LLM 模型边界

| 动作类型 | 涉及命令 |
|------|------|
| **确定性的核心主链**（完全不依赖大模型） | `load`, `write`, `check`, `history`, `impact`, `view`, `doctor`, `scan`, `compact`, `dep-graph-*`, `test-map` ... |
| **可接入大模型的辅助命令**（可作为增强项） | `finalize`, `audit*`, `test-gen`, `test-fix`, `module-gen`, `invoke`, `run` |

Kenon 核心的五维度协议，立足于**不依赖外部大模型网络即可100%保证运转**。只有那些带有生成性与建议性质的动作，才需要通过 `--backend` 参数接入外围大模型（如 Codex / Claude / Gemini）来协同作业。

## 测试与质量保障

- **243+ 测试文件**，覆盖单元测试与集成测试（主线套件 + compat 套件）
- **CI 门禁**：typecheck → lint → test（每次 push / PR 自动运行）
- **Smoke 测试**：`kenon smoke` 在独立沙盒中端到端验证所有主路径
- **Guardrails 脚本**：`npm run guardrails` = typecheck + test + smoke + doctor + check --diff
- **跨平台**：核心代码已处理 Windows 兼容（路径分隔符、`.cmd` shim unwrap、POSIX 优雅降级）

测试分层策略见 [`tests/README.md`](tests/README.md)；跨平台方法论见 [`docs/guides/cross-platform-testing.md`](docs/guides/cross-platform-testing.md)。

## 从 ADR / RFC / Changelog 迁移

Kenon 支持从已有的架构决策记录渐进式迁移：

| 源格式 | 映射目标 | 命令 |
|--------|---------|------|
| ADR (Architecture Decision Records) | `intent/decisions/` | `kenon init --from=adr <dir>` |
| RFC (Request for Comments) | `intent/decisions/` | `kenon init --from=rfc <dir>` |
| CHANGELOG | `time/sessions.jsonl` | `kenon init --from=changelog <file>` |

三阶段渐进：**只读试用** → **双写过渡** → **完全迁移**。导入幂等，基于 `content_hash` 自动去重，失败时自动回滚到 `.kenon/backup/`。

完整指南见 [`docs/guides/migration-guide.md`](docs/guides/migration-guide.md)。

## VCS 推荐集成模式

- 推荐配置：**`jj+git colocate`**
- 降级梯队：`git worktree` → 常规的 `plain git` → 退化至纯文件系统
- 环境探测：`kenon vcs-info`
- 安全存档：`kenon save --thread <id> --vcs`

相关工作流约定详见 [`docs/reference/cli/commands/vcs-info.md`](docs/reference/cli/commands/vcs-info.md)。

## 文档导航

| 想要了解哪些内容 | 推荐查阅的文档 |
|-----------|------|
| 核心协议理论白皮书 (Layer A) | [`docs/core/README.md`](docs/core/README.md) |
| 五维度的工具层协议与存储细则 | [`docs/core/tool-layer-five-dimensions.md`](docs/core/tool-layer-five-dimensions.md) |
| Kenon 体系架构全图 | [`docs/architecture-overview.md`](docs/architecture-overview.md) |
| 完整的 CLI 命令速查指南 | [`docs/reference/cli/README.md`](docs/reference/cli/README.md) |
| 迁移、排错及检测工具参考 | [`docs/guides/README.md`](docs/guides/README.md) |
| 各子系统设计稿索引（42 篇） | [`docs/design/README.md`](docs/design/README.md) |
| 绝不妥协的核心红线与底线要求 | [`docs/core/kenon-non-negotiables.md`](docs/core/kenon-non-negotiables.md) |
| 供 Agent 读取的最简入口契约 | [`AGENTS.md`](AGENTS.md) |

> 如果未来 README 与文档内页产生了口径分歧，一律以 **代码实际运作结果 + 关联测试规约 + `docs/core/tool-layer/*` 协议层源文件** 作为最终判准。

## 贡献与社区

- [Contributing](CONTRIBUTING.md) — 开发设置、变更流程、PR 规范
- [Code of Conduct](CODE_OF_CONDUCT.md) — 行为准则
- [Security Policy](SECURITY.md) — 漏洞上报流程（请勿公开提交安全问题）
- [Changelog](CHANGELOG.md) — 版本变更记录

## License

Apache-2.0
