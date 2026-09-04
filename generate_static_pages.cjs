const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('Compiling blog data and tools content for static rendering...');
esbuild.buildSync({
  entryPoints: {
    blogData: 'src/pages/blogData.tsx',
    blogDataKo: 'src/pages/blogDataKo.tsx',
    blogDataJa: 'src/pages/blogDataJa.tsx',
    toolsContent: 'src/data/toolsContent/index.ts'
  },
  bundle: true,
  outdir: 'temp_build',
  format: 'cjs',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  outExtension: { '.js': '.cjs' }
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { blogArticles } = require('./temp_build/blogData.cjs');
const { blogArticlesKo } = require('./temp_build/blogDataKo.cjs');
const { blogArticlesJa } = require('./temp_build/blogDataJa.cjs');
const { toolsContentMap } = require('./temp_build/toolsContent.cjs');

const LANGUAGES = ['en', 'ko', 'ja'];
const baseRoutes = [
  '',
  'json-formatter',
  'password-generator',
  'text-analyzer',
  'base64-converter',
  'url-encoder',
  'jwt-decoder',
  'color-converter',
  'markdown-editor',
  'uuid-generator',
  'hash-generator',
  'unix-timestamp',
  'qr-code',
  'regex-tester',
  'diff-checker',
  'image-compressor',
  'json-to-ts',
  'json-schema-generator',
  'function-calling-builder',
  'token-counter',
  'llm-optimizer',
  'prompt-wrapper',
  'chunking-simulator',
  'prompt-variable-injector',
  'prompt-token-splitter',
  'llm-parameter-playground',
  'xml-guardrail-generator',
  'few-shot-builder',
  'system-prompt',
  'blog',
  'privacy',
  'terms',
  'contact',
  'about'
];

const blogMetadata = {
  'why-typescript-interfaces-matter': {
    title: {
      en: 'Why TypeScript Interfaces Matter in Modern Web Development | DevToolz',
      ko: '현대 웹 개발에서 TypeScript 인터페이스가 중요한 이유 | DevToolz',
      ja: '現代のWeb開発でTypeScriptインターフェースが重要な理由 | DevToolz'
    },
    desc: {
      en: 'Explore why strict typing and TypeScript interfaces prevent runtime errors and streamline frontend-backend contract-driven development.',
      ko: '컴파일 타임 타입 검사와 인터페이스를 통해 런타임 에러를 방지하고 프론트엔드-백엔드 간 계약 기반 개발을 구축하는 방법을 알아봅니다.',
      ja: '厳格な型定義とTypeScriptインターフェースが実行時エラーを防ぎ、契約駆動開発を実現する理由を解説します。'
    }
  },
  'regex-mastery-for-developers': {
    title: {
      en: 'Regular Expressions Mastery for Developers | DevToolz',
      ko: '개발자를 위한 정규 표현식 완벽 가이드 | DevToolz',
      ja: '開発者のための正規表現マスターガイド | DevToolz'
    },
    desc: {
      en: 'Master regular expressions syntax, capture groups, and learn how to prevent catastrophic backtracking in production environments.',
      ko: '정규 표현식 문법, 캡처 그룹, 그리고 실무 서비스에서 성능을 저하시키는 Catastrophic Backtracking 방지 기법을 배웁니다.',
      ja: '正規表現の構文、キャプチャグループ、そして破滅的バックトラッキングを防ぐ実践的手法を学びます。'
    }
  },
  'secure-password-generation': {
    title: {
      en: 'Cryptographic Entropy and Secure Password Generation | DevToolz',
      ko: '암호학적 엔트로피와 안전한 비밀번호 생성 원리 | DevToolz',
      ja: '暗号論的エントロピーと安全なパスワード生成原理 | DevToolz'
    },
    desc: {
      en: 'Understand password entropy calculations and why browser Web Crypto API CSPRNG is essential for secure credential generation.',
      ko: '비밀번호 엔트로피의 수학적 계산법과 왜 Math.random() 대신 Web Crypto API CSPRNG를 사용해야 하는지 살펴봅니다.',
      ja: 'パスワードエントロピーの計算方法と、安全な認証情報生成にWeb Crypto APIが不可欠な理由を解説します。'
    }
  },
  'jwt-security-principles': {
    title: {
      en: 'JSON Web Token (JWT) Security Architecture & Best Practices | DevToolz',
      ko: 'JSON Web Token (JWT) 보안 아키텍처 및 실무 가이드 | DevToolz',
      ja: 'JSON Web Token (JWT) セキュリティアーキテクチャと実践 | DevToolz'
    },
    desc: {
      en: 'Learn how JWT claims, expiry verification, and digital signatures protect stateless APIs against unauthorized tampering.',
      ko: 'JWT 클레임 구조, 만료 시간(exp) 검증, 디지털 서명의 원리와 무상태 인증 시스템에서의 보안 주의사항을 점검합니다.',
      ja: 'JWTクレーム構造、有効期限検証、デジタル署名の仕組みとセキュリティ上の注意点を解説します。'
    }
  },
  'understanding-base64': {
    title: {
      en: 'Deep Dive into Base64 & Base64URL Encoding | DevToolz',
      ko: 'Base64 및 Base64URL 인코딩 원리 심층 분석 | DevToolz',
      ja: 'Base64およびBase64URLエンコードの徹底解剖 | DevToolz'
    },
    desc: {
      en: 'Discover how binary data is converted to 6-bit ASCII characters and why URL-safe Base64URL is required for web tokens.',
      ko: '바이너리 데이터를 6비트 ASCII 문자로 변환하는 원리와 웹 토큰 전송에 안전한 Base64URL 규격을 분석합니다.',
      ja: 'バイナリデータを6ビットASCII文字に変換する仕組みと、URLセーフなBase64URLの必要性を解説します。'
    }
  },
  'webassembly-and-local-processing': {
    title: {
      en: 'The Future of Browser Compute: WebAssembly and Privacy | DevToolz',
      ko: '브라우저 연산의 미래: WebAssembly와 클라이언트 처리 | DevToolz',
      ja: 'ブラウザ計算の未来：WebAssemblyとクライアント処理 | DevToolz'
    },
    desc: {
      en: 'How modern WebAssembly enables high-performance local processing without transmitting sensitive user data to cloud servers.',
      ko: 'WebAssembly를 활용해 민감한 데이터를 클라우드로 전송하지 않고 브라우저에서 안전하게 처리하는 패러다임을 소개합니다.',
      ja: '機密データをクラウドに送信せず、ブラウザ内で高速に安全処理するWebAssemblyの可能性を考察します。'
    }
  },
  'json-parsing-strategies': {
    title: {
      en: 'Resilient JSON Parsing & Schema Validation Strategies | DevToolz',
      ko: '안전한 대용량 JSON 파싱 및 스키마 검증 전략 | DevToolz',
      ja: '堅牢なJSONパースとスキーマ検証戦略 | DevToolz'
    },
    desc: {
      en: 'Techniques for handling malformed JSON, streaming large datasets, and enforcing strict JSON Schema validation.',
      ko: '깨진 JSON 복구 기법, 대용량 데이터 스트리밍 처리, 그리고 엄격한 JSON Schema 검증 전략을 공유합니다.',
      ja: '不正なJSONの自動修復、大規模データのストリーミング処理、JSON Schemaによる厳格な検証法を解説します。'
    }
  },
  'prompt-engineering-best-practices': {
    title: {
      en: 'System Prompt Engineering Best Practices for Production AI | DevToolz',
      ko: '실무 AI 에이전트를 위한 시스템 프롬프트 엔지니어링 | DevToolz',
      ja: '実務AIエージェントのためのシステムプロンプトエンジニアリング | DevToolz'
    },
    desc: {
      en: 'Structural patterns, few-shot conditioning, and guardrail constraints for building deterministic LLM applications.',
      ko: '결정론적인 LLM 출력을 얻기 위한 구조화된 프롬프트 작성법, 퓨샷(Few-Shot) 학습, XML 가드레일 설계법을 정리합니다.',
      ja: '安定したLLM出力を得るための構造化プロンプト設計、Few-Shot設定、XMLガードレールの活用法を解説します。'
    }
  },
  'uuid-version-differences': {
    title: {
      en: 'Understanding UUID Versions: v1, v4, v7 and Database Performance | DevToolz',
      ko: 'UUID 버전별 차이점 비교: v1, v4, v7과 데이터베이스 인덱스 성능 | DevToolz',
      ja: 'UUIDバージョンの違い：v1, v4, v7とDBインデックス性能 | DevToolz'
    },
    desc: {
      en: 'Compare random UUID v4 with timestamp-ordered UUID v7 to optimize B-tree database indexing and eliminate page splits.',
      ko: '완전 무작위 UUID v4와 시간 순서가 보장되는 UUID v7의 차이점을 분석하고 데이터베이스 B-tree 인덱스 분할 문제를 방지하는 법을 알아봅니다.',
      ja: 'ランダムなUUID v4と時系列順のUUID v7を比較し、DBのB-treeインデックス断片化を防ぐ最適な選択肢を提示します。'
    }
  },
  'diff-algorithms-explained': {
    title: {
      en: 'How Diff Algorithms Work: Myers Algorithm and Code Comparison | DevToolz',
      ko: '텍스트 Diff 알고리즘의 동작 원리와 코드 비교 분석 | DevToolz',
      ja: '差分比較（Diff）アルゴリズムの仕組みとコード比較 | DevToolz'
    },
    desc: {
      en: 'An explanation of the Myers diff algorithm behind Git and code comparison tools, finding the Shortest Edit Script.',
      ko: 'Git과 텍스트 비교 도구의 핵심인 마이어스(Myers) Diff 알고리즘과 최단 편집 스크립트(SES) 계산 원리를 쉽게 설명합니다.',
      ja: 'Gitやコード比較ツールの根幹にあるMyers差分アルゴリズムと最短編集シーケンスの導出方法を解説します。'
    }
  },
  'optimizing-web-apps': {
    title: {
      en: 'Modern Front-End Web Application Performance Optimization | DevToolz',
      ko: '프론트엔드 웹 성능 최적화: 메모이제이션과 비동기 렌더링 | DevToolz',
      ja: 'モダンフロントエンドWebアプリのパフォーマンス最適化 | DevToolz'
    },
    desc: {
      en: 'Actionable strategies for reducing bundle sizes, memoizing heavy calculations, and optimizing Core Web Vitals.',
      ko: '번들 사이즈 경량화, 비용 높은 연산의 메모이제이션, Web Worker 오프로딩을 통한 코어 웹 바이탈 최적화 기법을 제시합니다.',
      ja: 'バンドルサイズの削減、重い計算のメモ化、Web Worker活用によるCore Web Vitals最適化の実践手法を紹介します。'
    }
  },
  'regex-performance-backtracking': {
    title: {
      en: 'Avoiding Catastrophic Backtracking in Regular Expressions | DevToolz',
      ko: '정규식 파국적 되돌아보기(Catastrophic Backtracking) 방지 | DevToolz',
      ja: '正規表現の破滅的バックトラッキング回避法 | DevToolz'
    },
    desc: {
      en: 'Diagnose ReDoS vulnerabilities and learn how atomic grouping and possessive quantifiers eliminate infinite loops in regex engines.',
      ko: 'ReDoS 취약점을 진단하고, 비결정론적 유한 오토마타(NFA) 엔진의 무한 탐색을 차단하는 원자적 그룹화 기법을 다룹니다.',
      ja: 'ReDoS脆弱性の原因を特定し、正規表現エンジンの無限探索を防ぐアトミックグループ化の手法を学びます。'
    }
  },
  'understanding-unix-epoch': {
    title: {
      en: 'The Unix Timestamp: 1970 Epoch and Year 2038 Problem | DevToolz',
      ko: '유닉스 타임스탬프의 원리와 2038년 문제 대비 | DevToolz',
      ja: 'Unixタイムスタンプの仕組みと2038年問題への対策 | DevToolz'
    },
    desc: {
      en: 'Learn how POSIX time works, leap second handling, and why 32-bit timestamp systems must migrate before 2038.',
      ko: '1970년 1월 1일 기준 POSIX 시간 표현법, 윤초 처리, 그리고 32비트 정수 오버플로우로 인한 2038년 문제의 기술적 해법을 분석합니다.',
      ja: '1970年基準のPOSIX時間、閏秒の扱い、そして32ビット整数のオーバーフローによる2038年問題の技術的対策を解説します。'
    }
  },
  'the-math-behind-qr-codes': {
    title: {
      en: 'The Mathematics and Reed-Solomon Error Correction of QR Codes | DevToolz',
      ko: 'QR 코드의 수학적 원리와 리드-솔로몬 오류 정정 | DevToolz',
      ja: 'QRコードの数学的原理とリード・ソロモン誤り訂正 | DevToolz'
    },
    desc: {
      en: 'Explore Galois fields, Reed-Solomon error correction codewords, and alignment patterns that allow QR codes to be decoded even when damaged.',
      ko: '갈루아 필드(Galois Field) 수학, 리드-솔로몬 오류 정정 코드, 오염되거나 훼손되어도 복원 가능한 2차원 바코드의 원리를 설명합니다.',
      ja: 'ガロア体の数学、リード・ソロモン誤り訂正コード、汚れや欠損があっても読み取れる2次元バーコードの仕組みを解剖します。'
    }
  }
};

const blogIds = Object.keys(blogArticles);
blogIds.forEach(id => baseRoutes.push(`blog/${id}`));

const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');
const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

function createStaticPage(route, lang) {
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  const fullRoute = `${langPrefix}${route ? `/${route}` : ''}`;
  const dir = path.join(__dirname, 'dist', fullRoute);
  fs.mkdirSync(dir, { recursive: true });

  let pageTitle = 'DevToolz - Essential Developer Tools & AI Utilities';
  let pageDesc = 'Free, fast, and privacy-focused online developer tools, formatters, and AI engineering utilities running 100% in your browser without server transmission.';
  let staticHtml = '';
  let pageGraph = [
    {
      "@type": "WebSite",
      "name": "DevToolz",
      "url": "https://www.zezelab.xyz",
      "description": "Free, private, and client-side online developer tools and LLM utilities."
    }
  ];

  const currentUrl = `https://www.zezelab.xyz${fullRoute === '/' ? '' : fullRoute}`;
  const toolData = toolsContentMap[route];

  if (route.startsWith('blog/')) {
    const id = route.split('/')[1];
    let articleData = blogArticles[id];
    if (lang === 'ko' && blogArticlesKo[id]) articleData = blogArticlesKo[id];
    if (lang === 'ja' && blogArticlesJa[id]) articleData = blogArticlesJa[id];
    
    const meta = blogMetadata[id] || {
      title: { en: `${id} | DevToolz Tech Blog`, ko: `${id} | DevToolz 기술 블로그`, ja: `${id} | DevToolz技術ブログ` },
      desc: { en: `In-depth technical insights on ${id} for modern software engineers.`, ko: `${id}에 관한 실무 소프트웨어 엔지니어링 심층 분석.`, ja: `${id}に関する実践的なソフトウェア技術解説。` }
    };

    const langKey = ['en', 'ko', 'ja'].includes(lang) ? lang : 'en';
    pageTitle = meta.title[langKey] || meta.title.en;
    pageDesc = meta.desc[langKey] || meta.desc.en;

    let renderedArticle = '';
    if (articleData) {
      try {
        renderedArticle = ReactDOMServer.renderToString(articleData);
      } catch (e) {
        console.error(`Error rendering blog post ${id} in ${lang}:`, e);
      }
    }

    staticHtml = `
      <article>
        <h1>${pageTitle}</h1>
        <p class="lead">${pageDesc}</p>
        <div class="article-body">
          ${renderedArticle}
        </div>
        <p><a href="${langPrefix}/blog">← Back to Blog List</a></p>
      </article>
    `;

    pageGraph.push({
      "@type": "BlogPosting",
      "headline": pageTitle,
      "description": pageDesc,
      "url": currentUrl,
      "author": {
        "@type": "Organization",
        "name": "DevToolz Engineering"
      },
      "publisher": {
        "@type": "Organization",
        "name": "DevToolz",
        "url": "https://www.zezelab.xyz"
      }
    });

    pageGraph.push({
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.zezelab.xyz${langPrefix || '/'}` },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `https://www.zezelab.xyz${langPrefix}/blog` },
        { "@type": "ListItem", "position": 3, "name": pageTitle, "item": currentUrl }
      ]
    });

  } else if (route === 'blog') {
    const titles = {
      en: 'DevToolz Engineering Blog | Tech Articles & Architecture',
      ko: 'DevToolz 기술 블로그 | 개발자를 위한 심층 기술 아티클',
      ja: 'DevToolz 技術ブログ | 開発者のための実践的技術記事'
    };
    const descs = {
      en: 'Read our technical articles covering TypeScript interfaces, regular expressions, password entropy, JWT architecture, and LLM prompt engineering.',
      ko: 'TypeScript 인터페이스, 정규식 최적화, 암호학적 엔트로피, JWT 보안 및 LLM 프롬프트 엔지니어링에 관한 실무 기술 아티클을 제공합니다.',
      ja: 'TypeScript、正規表現、パスワードエントロピー、JWTセキュリティ、LLMプロンプト設計に関する実践的記事をお届けします。'
    };
    const langKey = ['en', 'ko', 'ja'].includes(lang) ? lang : 'en';
    pageTitle = titles[langKey];
    pageDesc = descs[langKey];

    const blogListHtml = blogIds.map(id => {
      const meta = blogMetadata[id] || { title: { en: id }, desc: { en: '' } };
      const itemTitle = (meta.title[langKey] || meta.title.en).replace(' | DevToolz', '');
      const itemDesc = meta.desc[langKey] || meta.desc.en;
      return `
        <li>
          <a href="${langPrefix}/blog/${id}"><strong>${itemTitle}</strong></a>
          <p>${itemDesc}</p>
        </li>
      `;
    }).join('\n');

    staticHtml = `
      <article>
        <h1>${pageTitle}</h1>
        <p>${pageDesc}</p>
        <h2>Technical Articles</h2>
        <ul>
          ${blogListHtml}
        </ul>
      </article>
    `;

    pageGraph.push({
      "@type": "CollectionPage",
      "name": pageTitle,
      "description": pageDesc,
      "url": currentUrl
    });

  } else if (toolData) {
    const langKey = ['en', 'ko', 'ja'].includes(lang) ? lang : 'en';
    pageTitle = toolData.meta.title[langKey] || toolData.meta.title.en;
    pageDesc = toolData.meta.description[langKey] || toolData.meta.description.en;

    const labels = {
      en: {
        whenToUse: 'When to Use This Tool',
        howToUse: 'How to Use',
        example: 'Input & Output Example',
        faq: 'Frequently Asked Questions (FAQ)',
        notes: 'Engineering & Privacy Notes',
        related: 'Related Developer Tools'
      },
      ko: {
        whenToUse: '이런 상황에서 사용하세요',
        howToUse: '사용 방법 및 실무 가이드',
        example: '입출력 실무 예시',
        faq: '자주 묻는 질문 (FAQ)',
        notes: '기술 및 보안 유의사항',
        related: '함께 사용하면 좋은 관련 도구'
      },
      ja: {
        whenToUse: 'このような場面で活用できます',
        howToUse: '使い方と実務ガイド',
        example: '入出力の実務例',
        faq: 'よくある質問（FAQ）',
        notes: '技術・セキュリティ上の注意事項',
        related: 'あわせて使える関連ツール'
      }
    }[langKey];

    const whenToUseList = (toolData.whenToUse[langKey] || toolData.whenToUse.en)
      .map(item => `<li><strong>${item.title}:</strong> ${item.desc}</li>`)
      .join('\n');

    const howToUseList = (toolData.howToUse[langKey] || toolData.howToUse.en)
      .map(item => `<li><strong>${item.title}:</strong> ${item.desc}</li>`)
      .join('\n');

    const faqs = (toolData.faq[langKey] || toolData.faq.en);
    const faqList = faqs
      .map(item => `<h3>Q. ${item.q}</h3>\n<p>A. ${item.a}</p>`)
      .join('\n');

    const notesList = (toolData.notes[langKey] || toolData.notes.en)
      .map(item => `<li>${item}</li>`)
      .join('\n');

    const relatedList = (toolData.relatedTools || [])
      .map(rel => {
        const relDesc = rel.desc[langKey] || rel.desc.en;
        const targetHref = `${langPrefix}/${rel.id}`;
        return `<li><a href="${targetHref}"><strong>${rel.name}</strong></a>: ${relDesc}</li>`;
      })
      .join('\n');

    staticHtml = `
      <article>
        <h1>${pageTitle}</h1>
        <p>${toolData.overview[langKey] || toolData.overview.en}</p>

        <h2>${labels.whenToUse}</h2>
        <ul>
          ${whenToUseList}
        </ul>

        <h2>${labels.howToUse}</h2>
        <ol>
          ${howToUseList}
        </ol>

        <h2>${labels.example}</h2>
        <h3>Input:</h3>
        <pre><code>${toolData.example.input}</code></pre>
        <h3>Output:</h3>
        <pre><code>${toolData.example.output}</code></pre>

        <h2>${labels.faq}</h2>
        ${faqList}

        <h2>${labels.notes}</h2>
        <ul>
          ${notesList}
        </ul>

        <h2>${labels.related}</h2>
        <ul>
          ${relatedList}
        </ul>
      </article>
    `;

    // 1. SoftwareApplication Schema
    pageGraph.push({
      "@type": "SoftwareApplication",
      "name": pageTitle,
      "description": pageDesc,
      "url": currentUrl,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    });

    // 2. FAQPage Schema (Google Rich Results snippet support)
    if (faqs && faqs.length > 0) {
      pageGraph.push({
        "@type": "FAQPage",
        "mainEntity": faqs.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      });
    }

    // 3. BreadcrumbList Schema
    pageGraph.push({
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.zezelab.xyz${langPrefix || '/'}` },
        { "@type": "ListItem", "position": 2, "name": pageTitle, "item": currentUrl }
      ]
    });

  } else if (route === '') {
    // Homepage
    const titles = {
      en: 'DevToolz - Fast & Private Online Developer Tools & AI Utilities',
      ko: 'DevToolz - 안전한 무료 온라인 개발자 도구 및 AI 유틸리티 모음',
      ja: 'DevToolz - 安全で高速な無料オンライン開発者ツール＆AIユーティリティ'
    };
    const descs = {
      en: 'A suite of 28+ free, fast, and privacy-focused online developer tools running 100% in your browser. JSON formatters, JWT decoders, UUID generators, and LLM prompt engineering utilities.',
      ko: '브라우저에서 100% 로컬로 동작하는 28개 이상의 무료 개발자 도구 모음. JSON 정렬기, JWT 디코더, 비밀번호 생성기, 정규식 테스터, LLM 프롬프트 엔지니어링 유틸리티를 서버 전송 없이 안전하게 사용하세요.',
      ja: 'ブラウザ内で100%安全に動作する28種以上の無料開発者ツール。JSON整形、JWTデコード、UUID生成、正規表現テスト、LLMプロンプト支援ツールを完備。'
    };
    const langKey = ['en', 'ko', 'ja'].includes(lang) ? lang : 'en';
    pageTitle = titles[langKey];
    pageDesc = descs[langKey];

    // Build categories of tools for crawler discovery
    const toolLinks = Object.values(toolsContentMap).map(t => {
      const name = t.meta.title[langKey] || t.meta.title.en;
      const desc = t.meta.description[langKey] || t.meta.description.en;
      return `<li><a href="${langPrefix}/${t.id}"><strong>${name}</strong></a>: ${desc}</li>`;
    }).join('\n');

    staticHtml = `
      <article>
        <h1>${pageTitle}</h1>
        <p>${pageDesc}</p>
        <h2>Developer Tools Directory</h2>
        <ul>
          ${toolLinks}
        </ul>
        <h2>Technical Engineering Blog</h2>
        <ul>
          ${blogIds.map(id => {
            const meta = blogMetadata[id] || { title: { en: id } };
            const title = (meta.title[langKey] || meta.title.en).replace(' | DevToolz', '');
            return `<li><a href="${langPrefix}/blog/${id}">${title}</a></li>`;
          }).join('\n')}
        </ul>
      </article>
    `;

    pageGraph.push({
      "@type": "ItemList",
      "itemListElement": Object.values(toolsContentMap).map((t, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": t.meta.title[langKey] || t.meta.title.en,
        "url": `https://www.zezelab.xyz${langPrefix}/${t.id}`
      }))
    });

  } else {
    // Informational pages: privacy, terms, contact, about
    const staticInfo = {
      about: {
        title: { en: 'About DevToolz | Mission & Architecture', ko: 'DevToolz 소개 | 개발 철학 및 보안 원칙', ja: 'DevToolzについて | 開発理念とセキュリティ' },
        desc: { en: 'Learn about DevToolz: a client-side, privacy-first developer utility suite built for speed and security.', ko: 'DevToolz의 설립 목적, 클라이언트 사이드 데이터 보안 철학 및 기술 스택을 소개합니다.', ja: 'DevToolzの開発理念、クライアント完結型のプライバシー保護方針を紹介します。' }
      },
      privacy: {
        title: { en: 'Privacy Policy | DevToolz', ko: '개인정보 처리방침 | DevToolz', ja: 'プライバシーポリシー | DevToolz' },
        desc: { en: 'DevToolz operates 100% locally in your browser. Read our comprehensive Privacy Policy.', ko: 'DevToolz는 사용자의 모든 입력 데이터를 브라우저 내부에서만 처리합니다. 상세 개인정보 처리방침을 확인하세요.', ja: 'DevToolzの包括的プライバシーポリシー。入力データはサーバーに一切送信されません。' }
      },
      terms: {
        title: { en: 'Terms of Service | DevToolz', ko: '서비스 이용약관 | DevToolz', ja: '利用規約 | DevToolz' },
        desc: { en: 'Terms and conditions governing the use of DevToolz developer utilities.', ko: 'DevToolz 웹 서비스 및 개발자 유틸리티 이용 약관입니다.', ja: 'DevToolzの開発者向けユーティリティ利用規約です。' }
      },
      contact: {
        title: { en: 'Contact Us | DevToolz', ko: '문의하기 | DevToolz', ja: 'お問い合わせ | DevToolz' },
        desc: { en: 'Get in touch with DevToolz engineering team for tool requests, feedback, or bug reports.', ko: '도구 추가 요청, 버그 제보, 기능 개선 의견을 DevToolz 팀에 전달하세요.', ja: 'ツールの追加要望、バグ報告、フィードバックはこちらからお問い合わせください。' }
      }
    }[route] || {
      title: { en: `${route.toUpperCase()} | DevToolz`, ko: `${route.toUpperCase()} | DevToolz`, ja: `${route.toUpperCase()} | DevToolz` },
      desc: { en: 'DevToolz developer utility page.', ko: 'DevToolz 개발자 유틸리티 안내 페이지.', ja: 'DevToolz開発者ユーティリティページ。' }
    };

    const langKey = ['en', 'ko', 'ja'].includes(lang) ? lang : 'en';
    pageTitle = staticInfo.title[langKey] || staticInfo.title.en;
    pageDesc = staticInfo.desc[langKey] || staticInfo.desc.en;

    staticHtml = `
      <article>
        <h1>${pageTitle}</h1>
        <p>${pageDesc}</p>
      </article>
    `;
  }

  let newHtml = baseHtml.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
  newHtml = newHtml.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${pageDesc}" />`);
  newHtml = newHtml.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${pageDesc}" />`);
  newHtml = newHtml.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${pageDesc}" />`);
  newHtml = newHtml.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${pageTitle}" />`);
  newHtml = newHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${pageTitle}" />`);
  newHtml = newHtml.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${currentUrl}" />`);
  
  const routeSuffix = route ? `/${route}` : '';
  newHtml = newHtml.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${currentUrl}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="en" href=".*?" \/>/, `<link rel="alternate" hreflang="en" href="https://www.zezelab.xyz${routeSuffix}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="ko" href=".*?" \/>/, `<link rel="alternate" hreflang="ko" href="https://www.zezelab.xyz/ko${routeSuffix}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="ja" href=".*?" \/>/, `<link rel="alternate" hreflang="ja" href="https://www.zezelab.xyz/ja${routeSuffix}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/, `<link rel="alternate" hreflang="x-default" href="https://www.zezelab.xyz${routeSuffix}" />`);

  // Replace default JSON-LD with structured data tailored specifically to this page
  const formattedJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": pageGraph
  }, null, 2);

  newHtml = newHtml.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${formattedJsonLd}\n</script>`
  );

  // Replace default noscript fallback with route-specific static content for search crawlers & SEO
  // Complies with Google Webmaster guidelines: clean noscript fallback, semantic markup, zero cloaking.
  newHtml = newHtml.replace(
    /<noscript>[\s\S]*?<\/noscript>/,
    `<noscript>\n<div class="static-seo-container">\n${staticHtml}\n</div>\n</noscript>`
  );
  
  fs.writeFileSync(path.join(dir, 'index.html'), newHtml);
}

baseRoutes.forEach(route => {
  LANGUAGES.forEach(lang => {
    createStaticPage(route, lang);
  });
});

console.log(`Static pages generated for ${baseRoutes.length} routes across ${LANGUAGES.length} languages!`);

// Clean up temp_build directory
fs.rmSync(path.join(__dirname, 'temp_build'), { recursive: true, force: true });
