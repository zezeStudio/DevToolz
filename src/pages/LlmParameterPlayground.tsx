import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { SlidersHorizontal, Info, Sparkles, Shield, BookOpen, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function LlmParameterPlayground() {
  const { t, i18n } = useTranslation();
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [freqPenalty, setFreqPenalty] = useState(0.0);
  const [presPenalty, setPresPenalty] = useState(0.0);
  const [topic, setTopic] = useState<'dog'|'novel'|'code'>('dog');

  const lang = i18n.language.startsWith('ko') ? 'ko' : i18n.language.startsWith('ja') ? 'ja' : 'en';

  const getSimulatedText = () => {
    let tIndex = 0;
    if (temperature < 0.35) tIndex = 0;
    else if (temperature < 0.65) tIndex = 1;
    else if (temperature < 1.0) tIndex = 2;
    else if (temperature < 1.35) tIndex = 3;
    else tIndex = 4;

    const pIndex = topP < 0.5 ? 0 : 1;

    const data = {
      dog: [
        [
          { ko: "개가 담장을 넘었다.", en: "The dog went over the wall.", ja: "犬が塀を越えた。" },
          { ko: "개의 움직임: 담장 너머로 이동함.", en: "Dog movement: Traversed the wall.", ja: "犬の動き：塀の向こうへ移動。" }
        ],
        [
          { ko: "갈색 개가 나무 울타리를 넘었다.", en: "The brown dog went over the wooden fence.", ja: "茶色い犬が木のフェンスを越えた。" },
          { ko: "근처의 개가 정원의 울타리를 뛰어넘었다.", en: "The nearby dog jumped over the garden fence.", ja: "近くの犬が庭のフェンスを飛び越えた。" }
        ],
        [
          { ko: "활기찬 개가 높은 담장을 단숨에 뛰어넘었다.", en: "The lively dog leaped over the high wall in one bound.", ja: "活発な犬が高い塀を一気に飛び越えた。" },
          { ko: "황금빛 리트리버가 공을 쫓아 잔디밭 울타리를 경쾌하게 넘었다.", en: "The golden retriever safely bounded over the lawn fence chasing a ball.", ja: "黄金のレトリバーがボールを追いかけ、芝生のフェンスを軽快に越えた。" }
        ],
        [
          { ko: "성급한 사냥개가 미지의 울타리를 넘어 허공을 갈랐다.", en: "The eager hound breached the unknown fence, slicing through the air.", ja: "せっかちな猟犬が未知のフェンスを越え、虚空を切り裂いた。" },
          { ko: "비글 한 마리가 구름을 밟듯 부드럽게 담장을 도약해 사라졌다.", en: "A beagle smoothly leaped over the wall as if stepping on clouds and vanished.", ja: "一匹のビーグルが雲を踏むように滑らかに塀を跳躍して消えた。" }
        ],
        [
          { ko: "차원을 찢는 개. 담장 붕괴. 오후는 보라색 액체로 녹아내렸다. 🫠", en: "Dimension-tearing dog. Wall collapse. Afternoon melted into purple liquid. 🫠", ja: "次元を裂く犬。塀の崩壊。午後は紫色の液体に溶け出した。 🫠" },
          { ko: "초신성 폭발과 함께 춤추는 비글! 양자 얽힘 속 재즈 바이브 🎷🌌", en: "Dancing beagle amidst a supernova! Jazz vibes in quantum entanglement 🎷🌌", ja: "超新星爆発と共に踊るビーグル！量子もつれの中のジャズバイブス 🎷🌌" }
        ]
      ],
      novel: [
        [
          { ko: "추운 밤이었다. 그녀는 길을 걸어갔다.", en: "It was a cold night. She walked down the street.", ja: "寒い夜だった。彼女は道を歩いた。" },
          { ko: "그날 밤 거리는 조용했다. 그녀는 몸을 움츠렸다.", en: "The streets were quiet that night. She shivered slightly.", ja: "その夜、通りは静かだった。彼女は身をすくめた。" }
        ],
        [
          { ko: "어두운 도심 거리는 고요했고, 그녀는 망토를 단단히 여몄다.", en: "The dark city streets were quiet, and she wrapped her cloak tightly.", ja: "暗い街の通りは静かで、彼女はマントをしっかりと引き寄せた。" },
          { ko: "가로등 불빛 아래 텅 빈 거리, 엘라라는 차가운 밤바람을 피했다.", en: "Under the streetlight of an empty street, Elara avoided the cold night wind.", ja: "街灯の下の空いた通りで、エララは冷たい夜風を避けた。" }
        ],
        [
          { ko: "매서운 한기 속에서 오크헤이븐의 자갈길이 가로등 불빛에 희미하게 빛났다.", en: "In the biting chill, Oakhaven's cobblestones faintly glowed under the streetlights.", ja: "厳しい寒さの中、オークヘイブンの石畳が街灯の下でかすかに光った。" },
          { ko: "호박빛 가로등이 비추는 텅 빈 뒷골목, 엘라라는 숨을 죽인 채 서둘러 발걸음을 옮겼다.", en: "In the empty alley lit by amber streetlights, Elara hurried her steps with bated breath.", ja: "琥珀色の街灯が照らす空の路地で、エララは息を潜めて急ぎ足で進んだ。" }
        ],
        [
          { ko: "어두운 도시에 핏빛 달이 떴다. 그림자 속에서 그림자들이 움직이고 있었다.", en: "A blood moon rose over the dark city. Shadows were moving within shadows.", ja: "暗い街に血の月が昇った。影の中で影が動いていた。" },
          { ko: "진홍빛 달은 구리 첨탑 위로 별가루를 흘려보냈다. 그녀는 바람 속에서 내일의 냄새를 맡았다.", en: "A crimson moon wept stardust onto brass spires. She smelled tomorrow in the wind.", ja: "真紅の月が真鍮の尖塔に星屑を流した。彼女は風の中に明日の匂いを嗅いだ。" }
        ],
        [
          { ko: "달. 파편. 부서진 침묵의 파동. 모든 것은 이미 결정되어 있었다. 👁️", en: "Moon. Fragments. Waves of broken silence. Everything was already decided. 👁️", ja: "月。破片。砕けた沈黙の波。すべては既に決定されていた。 👁️" },
          { ko: "운석이 비처럼 쏟아지는 유리 도시! 다차원의 은하수 속에서 엘라라는 웃음을 터뜨렸다! 🎆🎭", en: "A glass city where meteorites rain! Elara burst into laughter amidst the multidimensional milky way! 🎆🎭", ja: "隕石が雨のように降るガラスの街！多次元の天の川の中で、エララは笑い出した！ 🎆🎭" }
        ]
      ],
      code: [
        [
          { ko: "function add(a, b) {\n  return a + b;\n}", en: "function add(a, b) {\n  return a + b;\n}", ja: "function add(a, b) {\n  return a + b;\n}" },
          { ko: "const sum = (a, b) => {\n  return a + b;\n};", en: "const sum = (a, b) => {\n  return a + b;\n};", ja: "const sum = (a, b) => {\n  return a + b;\n};" }
        ],
        [
          { ko: "function getFibonacci(n) {\n  if (n <= 1) return n;\n  return getFibonacci(n-1) + getFibonacci(n-2);\n}", en: "function getFibonacci(n) {\n  if (n <= 1) return n;\n  return getFibonacci(n-1) + getFibonacci(n-2);\n}", ja: "function getFibonacci(n) {\n  if (n <= 1) return n;\n  return getFibonacci(n-1) + getFibonacci(n-2);\n}" },
          { ko: "const calculateFib = (n: number): number => {\n  return n <= 1 ? n : calculateFib(n-1) + calculateFib(n-2);\n};", en: "const calculateFib = (n: number): number => {\n  return n <= 1 ? n : calculateFib(n-1) + calculateFib(n-2);\n};", ja: "const calculateFib = (n: number): number => {\n  return n <= 1 ? n : calculateFib(n-1) + calculateFib(n-2);\n};" }
        ],
        [
           { ko: "function calculateFibonacciSteps(limit: number): number[] {\n  const sequence = [0, 1];\n  // 동적 계획법 방식...", en: "function calculateFibonacciSteps(limit: number): number[] {\n  const sequence = [0, 1];\n  // Using dynamic programming...", ja: "function calculateFibonacciSteps(limit: number): number[] {\n  const sequence = [0, 1];\n  // 動的計画法..." },
           { ko: "class MathUtils {\n  static fib(n: number): number {\n    // 알고리즘 최적화 적용\n    if (n <= 1) return n;\n    return this.fib(n-1) + this.fib(n-2);\n  }\n}", en: "class MathUtils {\n  static fib(n: number): number {\n    // Recursion algorithm optimized\n    if (n <= 1) return n;\n    return this.fib(n-1) + this.fib(n-2);\n  }\n}", ja: "class MathUtils {\n  static fib(n: number): number {\n    // アルゴリズム最適化適用\n    if (n <= 1) return n;\n    return this.fib(n-1) + this.fib(n-2);\n  }\n}" }
        ],
        [
          { ko: "/* 함수를 만들자. 무엇을 해야하는가. */\nfunction doThing() { return thing(); }\n/* 구현 완료 */", en: "/* Let's write a function. What should it do. */\nfunction doThing() { return thing(); }\n/* Implemented */", ja: "/* 関数を作ろう。何をするのか。 */\nfunction doThing() { return thing(); }\n/* 実装完了 */" },
          { ko: "import { Compute } from 'sys-lib';\n// 비동기 양자 처리 시작\nconst result = await Compute.solve();", en: "import { Compute } from 'sys-lib';\n// Beginning async quantum processing\nconst result = await Compute.solve();", ja: "import { Compute } from 'sys-lib';\n// 非同期量子処理開始\nconst result = await Compute.solve();" }
        ],
        [
          { ko: "// Null Pointer. 메모리 누수 임계점 도달.\nwhile(true) {\n  allocate(RAM * Infinity);\n} // System failure", en: "// Null Pointer. Memory leak threshold reached.\nwhile(true) {\n  allocate(RAM * Infinity);\n} // System failure", ja: "// Null Pointer. メモリリーク閾値到達。\nwhile(true) {\n  allocate(RAM * Infinity);\n} // System failure" },
          { ko: "const evalMeta = (input) => {\n  return input === 'dragon' ? Promise.reject('OutOfUniverseException') : process(input);\n};", en: "const evalMeta = (input) => {\n  return input === 'dragon' ? Promise.reject('OutOfUniverseException') : process(input);\n};", ja: "const evalMeta = (input) => {\n  return input === 'dragon' ? Promise.reject('OutOfUniverseException') : process(input);\n};" }
        ]
      ]
    };

    const currentTopicData = (data as any)[topic];
    let text = currentTopicData[tIndex][pIndex][lang];

    if (freqPenalty >= 0.7) {
      text += '\n\n' + (lang === 'ko' ? '🔄 [이전에 사용한 단어 회피 로직 작동]' : lang === 'ja' ? '🔄 [過去に使用した単語を回避]' : '🔄 [Avoiding previously used words]');
    }

    if (presPenalty >= 0.7) {
      text += '\n\n' + (lang === 'ko' ? '🎭 [화제 전환 기동: 완전히 엉뚱한 주제 도출]' : lang === 'ja' ? '🎭 [話題の転換: 突然別のテーマへ]' : '🎭 [Topic Shift: Suddenly jumping to a new theme]');
    }

    return text;
  };

  const getExplanation = () => {
    const localExps = {
      ko: {
        tempVeryHigh: `Temperature가 매우 높게 설정되어 있어 AI가 극도로 창의적이고 예측 불가능한 문장 구조나 비유를 시도합니다. 다만 수치가 1.0을 크게 웃돌기 때문에 문맥이 무너지거나 환각(Hallucination) 현상이 발생할 가능성이 큽니다.`,
        tempHigh: `Temperature가 높게 설정되어 있어 지루하지 않고 창의적인 결과물을 기대할 수 있습니다. 문맥을 해치지 않는 선에서 다양한 표현이 나옵니다.`,
        tempMid: `Temperature가 중간 수준으로 설정되어, 지나치게 뻔하지도 않고 너무 튀지도 않는 안정적이고 무난한 텍스트가 생성됩니다.`,
        tempLow: `Temperature가 낮게 설정되어 있습니다. 가장 안전하고 확률이 높은 방식(결정론적)으로 텍스트를 출력하므로 창의적인 시도는 하지 않습니다.`,
        topPVeryLow: `반면 Top-P는 매우 낮게 설정되어 있습니다. 이는 아무리 창의적인 시도를 하더라도 단어 후보군을 상위 확률 이내의 안전하고 흔한 단어로만 엄격하게 제한함을 의미합니다. 결과적으로 창의적인 맥락 속에서도 표현 자체는 다소 제한적인 단어들로 구성됩니다.`,
        topPMid: `Top-P가 중간 수준으로 설정되어 너무 희귀한 단어는 배제하되 자연스러운 어휘 다양성을 확보하고 있습니다.`,
        topPHigh: `Top-P가 높게 설정되어 있어 매우 다양한 단어가 선택될 수 있습니다. 평소에 잘 안 쓰는 단어나 독특한 어휘가 등장할 확률이 높아집니다.`,
        freqZero: `Frequency Penalty가 0이므로 동일한 단어나 문구가 누적되어 반복 사용되는 것에 대한 페널티가 없습니다. 문장이 길어질 경우 특정 표현이 중복 출현할 수 있습니다.`,
        freqMid: `Frequency Penalty가 부여되어 있습니다. AI가 이전에 쓴 단어를 가급적 피하려고 하므로, 자연스럽게 동의어나 다른 표현 양식을 섞어 씁니다.`,
        freqHigh: `Frequency Penalty가 매우 높습니다. 이전에 사용한 단어를 극단적으로 기피하므로 억지스러운 동의어가 사용되거나 문장 구조가 꼬일 수 있습니다.`,
        presZero: `Presence Penalty가 0이므로 새로운 주제나 낯선 화제를 적극적으로 도입하지 않고, 기존에 주어진 중심 테마(주제) 범위 내에서만 이야기를 전개하려고 합니다.`,
        presMid: `Presence Penalty가 활성화되어 있어 주어진 화제에만 머무르지 않고 부가적인 관련 주제나 새로운 국면으로 이야기를 전환하려는 성향이 생깁니다.`,
        presHigh: `Presence Penalty가 매우 높습니다. 기존 화제에서 어떻게든 벗어나 완전히 낯선 주제나 상황을 도입하려는 극단적인 전개가 나타날 수 있습니다.`
      },
      en: {
        tempVeryHigh: `Temperature is set very high, encouraging extremely creative, unpredictable sentence structures and metaphors. Since it exceeds 1.0, there is a high risk of incoherence or hallucination.`,
        tempHigh: `Temperature is high, making the output creative and varied while largely maintaining context.`,
        tempMid: `Moderate Temperature balances creativity with coherence. The output is predictable but not too rigid.`,
        tempLow: `Temperature is low, resulting in deterministic and strictly straightforward phrasing. It will typically yield the exact same output for the same prompt.`,
        topPVeryLow: `On the other hand, Top-P is set very low. Even if creativity is high, the vocabulary is strictly limited to the top most probable words. Output will consist only of safe, common words.`,
        topPMid: `Moderate Top-P restricts some obscure vocabulary but allows enough variety for natural text.`,
        topPHigh: `Top-P is high, meaning almost the entire vocabulary distribution is considered. Rare and diverse words can be used.`,
        freqZero: `Frequency Penalty is 0. There is no penalty for repeating the same words or phrases, which might result in duplicate expressions if the text is long.`,
        freqMid: `Frequency Penalty is active. The AI will slightly avoid repeating words it has already used, leading to slightly more varied vocabulary.`,
        freqHigh: `Frequency Penalty is very high. The AI strictly avoids previously used words, forcing it to find synonyms or completely new phrasing.`,
        presZero: `Presence Penalty is 0. The AI is comfortable staying strictly on the current subject without seeking to introduce new topics.`,
        presMid: `Presence Penalty is active. The AI will be somewhat encouraged to shift the narrative to new but related concepts.`,
        presHigh: `Presence Penalty is very high. The AI aggressively attempts to pivot to entirely new topics and avoid staying stuck on the primary theme.`
      },
      ja: {
        tempVeryHigh: `Temperatureが非常に高く設定されており、AIが極めて創造的で予測不可能な文構造や比喩を試みます。ただし、数値が1.0を大きく上回るため、文脈が崩れたりハルシネーション（幻覚）現象が発生する可能性が高いです。`,
        tempHigh: `Temperatureが高く設定されており、退屈せず創造的な結果が期待できます。文脈を損なわない範囲で多様な表現が出てきます。`,
        tempMid: `Temperatureが中間レベルに設定されており、ありきたりすぎず飛び抜けすぎない、安定した無難なテキストが生成されます。`,
        tempLow: `Temperatureが低く設定されています。最も安全で確率の高い方式（決定論的）でテキストを出力するため、創造的な試みはしません。`,
        topPVeryLow: `一方、Top-Pは非常に低く設定されています。これは、いくら創造的な試みをしても、単語の候補群を安全で一般的な単語のみに厳格に制限することを意味します。結果として、創造的な文脈の中でも表現自体は制限された単語で構成されます。`,
        topPMid: `Top-Pが中間レベルに設定されており、珍しすぎる単語は排除しつつ、自然な語彙の多様性を確保しています。`,
        topPHigh: `Top-Pが高く設定されており、非常に多様な単語が選択される可能性があります。普段読まない単語や独特な語彙が登場する確率が高くなります。`,
        freqZero: `Frequency Penaltyが0であるため、同じ単語や語句が蓄積して反復使用されることに対するペナルティがありません。文章が長くなる場合、特定の表現が重複出現する可能性があります。`,
        freqMid: `Frequency Penaltyが付与されています。AIが以前に使った単語をなるべく避けようとするため、自然に同義語や他の表現形式を混ぜて使います。`,
        freqHigh: `Frequency Penaltyが非常に高いです。以前に使用した単語を極端に忌避するため、無理な同義語が使用されたり文構造がねじれる可能性があります。`,
        presZero: `Presence Penaltyが0であるため、新しいテーマや見慣れない話題を積極的に導入せず、既に与えられた中心テーマの範囲内でのみ話を展開しようとします。`,
        presMid: `Presence Penaltyが活性化されており、与えられた話題に留まらず、付加的な関連テーマや新しい局面に話を転換しようとする傾向が生じます。`,
        presHigh: `Presence Penaltyが非常に高いです。既存の話題から何とか抜け出し、完全に未知のテーマや状況を導入しようとする極端な展開が現れる可能性があります。`
      }
    };

    const exps = localExps[lang as 'ko'|'en'|'ja'];
    
    const results = [];
    
    if (temperature >= 1.0) results.push({ label: 'Temperature', value: temperature.toFixed(2), desc: exps.tempVeryHigh });
    else if (temperature >= 0.7) results.push({ label: 'Temperature', value: temperature.toFixed(2), desc: exps.tempHigh });
    else if (temperature >= 0.3) results.push({ label: 'Temperature', value: temperature.toFixed(2), desc: exps.tempMid });
    else results.push({ label: 'Temperature', value: temperature.toFixed(2), desc: exps.tempLow });
    
    if (topP <= 0.4) results.push({ label: 'Top-P', value: topP.toFixed(2), desc: exps.topPVeryLow });
    else if (topP <= 0.9) results.push({ label: 'Top-P', value: topP.toFixed(2), desc: exps.topPMid });
    else results.push({ label: 'Top-P', value: topP.toFixed(2), desc: exps.topPHigh });

    if (freqPenalty <= 0.1) results.push({ label: 'Frequency Penalty', value: freqPenalty.toFixed(2), desc: exps.freqZero });
    else if (freqPenalty < 1.0) results.push({ label: 'Frequency Penalty', value: freqPenalty.toFixed(2), desc: exps.freqMid });
    else results.push({ label: 'Frequency Penalty', value: freqPenalty.toFixed(2), desc: exps.freqHigh });

    if (presPenalty <= 0.1) results.push({ label: 'Presence Penalty', value: presPenalty.toFixed(2), desc: exps.presZero });
    else if (presPenalty < 1.0) results.push({ label: 'Presence Penalty', value: presPenalty.toFixed(2), desc: exps.presMid });
    else results.push({ label: 'Presence Penalty', value: presPenalty.toFixed(2), desc: exps.presHigh });

    return results;
  };

  const guideText = {
    ko: {
      title: '실전 파라미터 튜닝 가이드 및 주의사항',
      items: [
        { title: "둘 중 하나만 조절하기", desc: "Temperature와 Top-P를 동시에 극단적으로 조절하는 것은 권장하지 않습니다. 둘 중 하나를 먼저 조절하고, 다른 하나는 기본값(예: 통상적으로 1.0)에 두는 것이 결과 예측에 유리합니다." },
        { title: "목적에 맞는 범위 설정", desc: "코드 작성이나 데이터 분석처럼 '정확성'이 중요한 작업은 Temperature를 0.0~0.3 수준으로 억제하세요. 반면 소설 작성, 아이디어 브레인스토밍 등 '창의성'이 중요할 때는 0.7~1.0을 권장합니다." },
        { title: "과도한 Penalty 주의", desc: "Frequency/Presence Penalty를 너무 높게 설정하면, AI가 이전에 쓴 단어를 억지로 피하려다 문법이 파괴되거나 엉뚱한 동의어를 남발하는 현상(Alien Text)이 발생할 수 있습니다." },
      ]
    },
    en: {
      title: 'Practical Tuning Guide & Best Practices',
      items: [
        { title: "Tune one at a time", desc: "It is generally not recommended to drastically alter both Temperature and Top-P simultaneously. Adjust one parameter first while leaving the other at its default to better predict the outcome." },
        { title: "Context-specific ranges", desc: "For tasks requiring accuracy (e.g., coding, data extraction), keep Temperature low (0.0-0.3). For creative tasks (e.g., story writing, brainstorming), a higher value (0.7-1.0) is recommended." },
        { title: "Beware of extreme penalties", desc: "Setting Frequency or Presence Penalties too high forces the AI to avoid previous words unnaturally. This can lead to completely broken grammar or bizarre synonyms being used over text coherence." },
      ]
    },
    ja: {
      title: '実践パラメータチューニングガイドと注意事項',
      items: [
        { title: "どちらか一つだけを調整する", desc: "TemperatureとTop-Pを同時に極端に調整することはお勧めしません。片方を先に調整し、もう片方はデフォルト値に保つ方が結果を予測しやすくなります。" },
        { title: "目的に合わせた範囲設定", desc: "コード作成やデータ分析など「正確性」が重要な作業では、Temperatureを0.0〜0.3の低レベルに抑えてください。一方、小説の執筆やアイデア出しなど「創造性」が重要な場合は0.7〜1.0をお勧めします。" },
        { title: "過度なペナルティに注意", desc: "Frequency/Presenceペナルティを高く設定しすぎると、AIが以前に使った単語を無理に避けようとして文法が崩れたり、不自然な同義語を乱発する現象が発生する可能性があります。" },
      ]
    }
  };

  const currentGuide = guideText[lang as 'ko'|'en'|'ja'];

  return (
    <>
      <SEO 
        title={t('llmPlayground.pageTitle') || 'LLM Parameter Playground | DevToolz'}
        description={t('llmPlayground.subtitle') || 'Interactive guide to understand AI parameters like Temperature, Top-P, and Penalties.'}
        url={`/${i18n.language}/llm-parameter-playground`}
      />
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 relative">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 mb-4 relative">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl">
              <SlidersHorizontal className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('llmPlayground.title') || 'LLM Parameter Playground'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-lg">
                {t('llmPlayground.subtitle') || 'Visual guide to AI parameters.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-6 space-y-6">
              
              {/* Topic Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 block mb-2">
                  {t('llmPlayground.topic') || 'Sample Prompt Topic'}
                </label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as any)}
                >
                  <option value="dog">{t('llmPlayground.topic.dog') || '🐕 Dog story'}</option>
                  <option value="novel">{t('llmPlayground.topic.novel') || '📝 Writing a novel'}</option>
                  <option value="code">{t('llmPlayground.topic.code') || '💻 Writing code'}</option>
                </select>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Temperature */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    Temperature <span className="ml-2 text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{temperature.toFixed(2)}</span>
                  </label>
                </div>
                <input 
                  type="range" min="0" max="2" step="0.05" 
                  value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06]"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Deterministic</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Top P */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    Top-P <span className="ml-2 text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{topP.toFixed(2)}</span>
                  </label>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06]"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Narrow Vocab</span>
                  <span>Wide Vocab</span>
                </div>
              </div>

              {/* Frequency Penalty */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    Frequency Penalty <span className="ml-2 text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{freqPenalty.toFixed(2)}</span>
                  </label>
                </div>
                <input 
                  type="range" min="-2" max="2" step="0.1" 
                  value={freqPenalty} onChange={(e) => setFreqPenalty(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06]"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Allows Repetition</span>
                  <span>Avoids Repetition</span>
                </div>
              </div>

              {/* Presence Penalty */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    Presence Penalty <span className="ml-2 text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{presPenalty.toFixed(2)}</span>
                  </label>
                </div>
                <input 
                  type="range" min="-2" max="2" step="0.1" 
                  value={presPenalty} onChange={(e) => setPresPenalty(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06]"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Sticks to Topic</span>
                  <span>Explores New Topics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization */}
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-full flex flex-col justify-between">
              
              <div>
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 mb-4 font-semibold">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>{t('llmPlayground.simulatedOutput') || 'Simulated Sample Output'}</span>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-slate-800 dark:text-slate-200 shadow-sm min-h-[120px] text-lg font-medium leading-relaxed italic whitespace-pre-wrap">
                  "{getSimulatedText()}"
                </div>
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 font-medium text-blue-800 dark:text-blue-300 mb-4">
                  <Info className="w-4 h-4" />
                  <span>{t('llmPlayground.whatItMeans') || 'What this means:'}</span>
                </div>
                <div className="space-y-4">
                  {getExplanation().map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <strong className="text-blue-900 dark:text-blue-200 block mb-1">
                        {item.label} ({item.value}):
                      </strong>
                      <p className="text-blue-700 dark:text-blue-200/80 leading-relaxed border-l-2 border-blue-200 dark:border-blue-700 pl-3 italic">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6">
          <div className="flex items-center space-x-2 font-bold text-amber-800 dark:text-amber-400 mb-4 text-lg">
            <AlertCircle className="w-6 h-6" />
            <span>{currentGuide.title}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentGuide.items.map((item, idx) => (
              <div key={idx} className="bg-white/60 dark:bg-slate-800/50 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">{item.title}</h3>
                <p className="text-sm text-amber-800/80 dark:text-amber-200/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
