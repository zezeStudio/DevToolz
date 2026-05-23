const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const enSource = `"promptInjector.subtitle": "Dynamically inject variables into your AI prompt templates.",`;
const enAppend = `"promptInjector.aboutTitle": "About Prompt Variable Injector",
      "promptInjector.about1": "The Prompt Variable Injector is a flexible 'text preset' tool for developers who frequently design and test AI API prompts. If you repeatedly use the same prompt structures, organizing them by creating templates with dynamic variables saves a massive amount of time.",
      "promptInjector.about2": "By inserting {{variable}} tags in your text, the interface automatically detects them and creates input fields. As you type into these fields, your variables are instantaneously injected into the template, preparing your final query or system message for copy-pasting into your API calls or ChatGPT/Claude interfaces.",
      "promptInjector.howToUseTitle": "How to use",
      "promptInjector.howToUse1": "Write your prompt template in the left pane.",
      "promptInjector.howToUse2": "Use the syntax {{variable_name}} to define a placeholder you want to inject dynamically later.",
      "promptInjector.howToUse3": "Variables will automatically appear on the right side as input fields.",
      "promptInjector.howToUse4": "Type the actual values into the generated form. The Preview Output will update instantly.",
      "promptInjector.howToUse5": "Click 'Copy' to copy your dynamically assembled prompt.",
      "promptInjector.defaultTemplate": "You are an expert copywriter. Please write a highly engaging blog post to market the following product.\\n\\nProduct Name: {{product_name}}\\nKey Features: {{key_features}}\\nTone and Manner: {{tone_and_manner}}\\nTarget Audience: {{target_audience}}\\n\\nMake sure to emphasize the key features naturally.",
      "promptInjector.defaultProduct": "Smartwatch Pro Max",
      "promptInjector.defaultFeatures": "Sleep tracking, Heart rate monitor, Blood pressure, Lightweight design",
      "promptInjector.defaultTone": "Professional yet friendly, persuasive",
      "promptInjector.defaultAudience": "Health-conscious office workers",
      "promptInjector.copyToast": "Prompt copied to clipboard!",`;

code = code.replace(enSource, enSource + '\n      ' + enAppend);

const koSource = `"promptInjector.subtitle": "반복적으로 사용하는 프롬프트 템플릿 문자열 사이에 변수를 지정해 값을 쉽게 치환하세요.",`;
const koAppend = `"promptInjector.aboutTitle": "Prompt Variable Injector 소개",
      "promptInjector.about1": "프롬프트 변수 주입기(Prompt Variable Injector)는 AI 프롬프트를 자주 설계하고 테스트하는 분들을 위한 '텍스트 프리셋' 도구입니다. 반복되는 프롬프트 구조를 동적 변수가 포함된 템플릿으로 만들어두면 작업 시간을 혁신적으로 단축할 수 있습니다.",
      "promptInjector.about2": "텍스트 사이에 {{변수명}} 형태의 태그를 입력하면, 시스템이 이를 자동으로 감지하여 입력 필드를 생성합니다. 해당 필드에 값을 입력하는 즉시 템플릿에 데이터가 주입되며, 완성된 최종 프롬프트를 복사하여 ChatGPT나 API 호출 시 바로 활용할 수 있습니다.",
      "promptInjector.howToUseTitle": "사용 방법",
      "promptInjector.howToUse1": "왼쪽 창에 프롬프트 템플릿을 작성합니다.",
      "promptInjector.howToUse2": "{{변수_이름}} 형식의 문법을 사용하여 동적으로 주입하고 싶은 자리표시자(Placeholder)를 정의합니다.",
      "promptInjector.howToUse3": "오른쪽에 변수 입력 시 사용할 수 있는 필드들이 자동으로 나타납니다.",
      "promptInjector.howToUse4": "생성된 입력 폼에 실제 값을 타이핑하면, 아래의 '미리보기(Preview)' 영역에 즉시 반영됩니다.",
      "promptInjector.howToUse5": "완성된 프롬프트를 복사하려면 'Copy' 버튼을 클릭하세요.",
      "promptInjector.defaultTemplate": "당신은 전문 카피라이터입니다. 다음 제품을 홍보하기 위한 매우 매력적인 블로그 마케팅 글을 작성해주세요.\\n\\n제품명: {{product_name}}\\n핵심 기능: {{key_features}}\\n톤앤매너: {{tone_and_manner}}\\n타겟 고객: {{target_audience}}\\n\\n핵심 기능을 자연스럽게 강조해서 작성해야 합니다.",
      "promptInjector.defaultProduct": "스마트워치 프로 맥스",
      "promptInjector.defaultFeatures": "수면 추적, 심박수 모니터링, 혈압 측정, 초경량 디자인",
      "promptInjector.defaultTone": "전문적이면서도 친근하게, 설득력 있는 어조",
      "promptInjector.defaultAudience": "건강에 관심이 많은 2030 직장인",
      "promptInjector.copyToast": "프롬프트가 클립보드에 복사되었습니다!",`;

code = code.replace(koSource, koSource + '\n      ' + koAppend);

const jaSource = `"promptInjector.subtitle": "プロンプトテンプレートに動的に変数を注入します。",`;
const jaAppend = `"promptInjector.aboutTitle": "Prompt Variable Injector について",
      "promptInjector.about1": "Prompt Variable Injectorは、AI APIプロンプトを頻繁に設計およびテストする開発者向けの柔軟な「テキストプリセット」ツールです。同じプロンプト構造を繰り返し使用する場合、動的変数を含むテンプレートを作成して整理することで、時間を大幅に節約できます。",
      "promptInjector.about2": "テキストに{{変数}}タグを挿入すると、インターフェースが自動的にそれを検出し、入力フィールドを作成します。これらのフィールドに入力すると、変数がテンプレートに瞬時に注入され、API呼び出しまたはChatGPT / Claudeインターフェースにコピー＆ペーストするための最終クエリまたはシステムメッセージが準備されます。",
      "promptInjector.howToUseTitle": "使い方",
      "promptInjector.howToUse1": "左ペインにプロンプトテンプレートを記述します。",
      "promptInjector.howToUse2": "{{変数名}}構文を使用して、後で動的に注入するプレースホルダーを定義します。",
      "promptInjector.howToUse3": "右側に変数入力フィールドが自動的に表示されます。",
      "promptInjector.howToUse4": "生成されたフォームに実際の値を入力します。プレビュー出力が即座に更新されます。",
      "promptInjector.howToUse5": "「Copy」をクリックして、動的に構築されたプロンプトをコピーします。",
      "promptInjector.defaultTemplate": "あなたはプロのコピーライターです。次の製品をマーケティングするための非常に魅力的なブログ記事を書いてください。\\n\\n製品名：{{product_name}}\\n主な機能：{{key_features}}\\nトーン＆マナー：{{tone_and_manner}}\\nターゲット層：{{target_audience}}\\n\\n主な機能を自然に強調するようにしてください。",
      "promptInjector.defaultProduct": "スマートウォッチプロマックス",
      "promptInjector.defaultFeatures": "睡眠追跡、心拍数モニター、血圧測定、軽量デザイン",
      "promptInjector.defaultTone": "プロフェッショナルで親しみやすい、説得力のある",
      "promptInjector.defaultAudience": "健康志向の会社員",
      "promptInjector.copyToast": "プロンプトがクリップボードにコピーされました！",`;

code = code.replace(jaSource, jaSource + '\n      ' + jaAppend);

fs.writeFileSync('src/lib/i18n.ts', code);
console.log('patched i18n.ts again');
