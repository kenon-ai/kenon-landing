const fs = require('fs');
let html = fs.readFileSync('code.html', 'utf8');

const headInsertion = `
    <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet"/>
    <style>
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body[data-lang="en"] .lang-zh { display: none !important; }
        body[data-lang="zh"] .lang-en { display: none !important; }
        
        /* Pixel aesthetic overrides */
        .pixel-shadow { box-shadow: 4px 4px 0px 0px rgba(0,229,255,0.4) !important; }
        .pixel-shadow:active { box-shadow: 1px 1px 0px 0px rgba(0,229,255,0.4) !important; transform: translate(3px, 3px); }
        .pixel-border { border: 2px solid rgba(255,255,255,0.1) !important; border-radius: 0 !important; }
        .pixel-border-hover:hover { border-color: rgba(0,229,255,0.5) !important; }
    </style>
    <script>
        function toggleLang() {
            const body = document.body;
            body.setAttribute('data-lang', body.getAttribute('data-lang') === 'zh' ? 'en' : 'zh');
        }
    </script>
`;
html = html.replace(/<style>[\s\S]*?<\/style>/, headInsertion);
html = html.replace('<body class="', '<body data-lang="zh" class="');

html = html.replace(/"headline": \[[^\]]*\]/, '"headline": ["DotGothic16", "monospace"]');

html = html.replace(/rounded-2xl|rounded-xl|rounded-lg|rounded-full/g, 'rounded-none pixel-border');

html = html.replace(/shadow-\[[^\]]*\]/g, 'pixel-shadow');
html = html.replace(/tonal-glow/g, 'pixel-shadow blur-none backdrop-blur-md bg-surface-container/40');

const langBtn = `<button onclick="toggleLang()" class="mr-4 px-3 py-1 bg-surface-variant text-on-surface font-headline border-2 border-cyan-500 rounded-none hover:bg-cyan-500 hover:text-[#0b1326] transition-colors cursor-pointer"><span class="lang-zh">EN</span><span class="lang-en">中</span></button>`;
html = html.replace(/(<div class="hidden md:flex gap-6">)/, `$1\n${langBtn}`);

html = html.replace('The local context layer for coding agents.', '<span class="lang-en">The local context layer for coding agents.</span><span class="lang-zh">面向 Coding Agents 的本地项目上下文层。</span>');
html = html.replace('Keep agents grounded in state, boundaries, evidence, and continuity. A repo-local protocol for project memory and safety guardrails.', '<span class="lang-en">Keep agents grounded in state, boundaries, evidence, and continuity. A repo-local protocol for project memory and safety guardrails.</span><span class="lang-zh">在改写代码时不失去状态、边界、证据和连续性。一套管理项目记忆与安全护栏的本地协议。</span>');

html = html.replace(/>\s*Get Started\s*</g, '><span class="lang-en">Get Started</span><span class="lang-zh">快速上手</span><');
html = html.replace(/>\s*View on GitHub\s*</g, '><span class="lang-en">View on GitHub</span><span class="lang-zh">查看 GitHub</span><');

html = html.replace('text-2xl font-bold">Dependencies', 'text-xl sm:text-2xl lg:text-base xl:text-xl font-bold break-words sm:break-normal">Dependencies');

html = html.replace('3-Minute Fast Track', '<span class="lang-en">3-Minute Fast Track</span><span class="lang-zh">3分钟快速上手</span>');
html = html.replace('Do it yourself, or just hand the keys to your agent.', '<span class="lang-en">Do it yourself, or just hand the keys to your agent.</span><span class="lang-zh">手动操作，或者把钥匙直接交给 Agent。</span>');

html = html.replace('Do It Yourself', '<span class="lang-en">Do It Yourself</span><span class="lang-zh">手动集成</span>');
html = html.replace('Delegate To Agent', '<span class="lang-en">Delegate To Agent</span><span class="lang-zh">自动托管</span>');

html = html.replace('Prompt Drop-in', '<span class="lang-en">Prompt Drop-in</span><span class="lang-zh">开箱即用 Prompt</span>');
html = html.replace('Drop this straight into your agent. It will install and configure Kenon.', '<span class="lang-en">Drop this straight into your agent. It will install and configure Kenon.</span><span class="lang-zh">复制这段文本发给你的 Agent 进行全自动初始化。</span>');

const promtEN = `Please install and initialize Kenon in this repository first.
1. Run \`git clone https://github.com/kenon-ai/kenon.git\`
2. Run \`kenon run onboard\`
3. Run \`kenon load --global --scenario edit\`
4. Tell me which module in this repository is most worth looking at first and why.
5. In future changes, always pass through \`check --diff\` by default.`;

const promtZH = `请先在这个仓库里安装并初始化 Kenon。
1. 运行 \`git clone https://github.com/kenon-ai/kenon.git\` 
2. 运行 \`kenon run onboard\`
3. 运行 \`kenon load --global --scenario edit\`
4. 告诉我这个仓库最值得先看的模块和原因
5. 后续在变更前默认先经过 \`check --diff\``;

html = html.replace(/<pre id="agent-prompt-text"[\s\S]*?<\/pre>/, 
    `<pre id="agent-prompt-text" class="whitespace-pre-wrap leading-relaxed text-[#bac3ff]"><span class="lang-zh">${promtZH}</span><span class="lang-en">${promtEN}</span></pre>`
);

// Translation injection for Copy buttons
html = html.replace(/>\s*Copy\s*</g, '><span class="lang-en">Copy</span><span class="lang-zh">复制</span><');
html = html.replace(/btnText.innerText = 'Copied!';/g, "btnText.innerText = document.body.getAttribute('data-lang') === 'zh' ? '已复制!' : 'Copied!';");
html = html.replace(/btnText.innerText = 'Copy';/g, "btnText.innerHTML = '<span class=\"lang-en\">Copy</span><span class=\"lang-zh\">复制</span>';");

fs.writeFileSync('code.html', html, 'utf8');
console.log('success');
