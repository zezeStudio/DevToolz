import * as fs from 'fs';

const path = './src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const targetEn = `"tokenCounter.longDesc.p3": "We aim to keep our model rates up to date, but prices serve merely as an approximate estimation based on the input payload schemas provided by OpenAI, Anthropic, and Google. We calculate the baseline estimation as: (Input Tokens / 1,000,000) × Provider Input Rate (Per 1M tokens) × 1,000 Requests.",`;
const replaceEn = `"tokenCounter.longDesc.p3": "The displayed cost is an estimate based on the latest input payload rates from each provider (OpenAI, Anthropic, Google) fixed as of H1 2026. Slight differences may occur depending on your actual API calling environment and changes in the providers' pricing policies. We calculate the baseline estimation as: (Input Tokens / 1,000,000) × Provider Input Rate (Per 1M tokens) × 1,000 Requests.",`;

const targetKo = `"tokenCounter.longDesc.p3": "당사는 최대한 최신 모델 요금을 유지하려고 노력하고 있으나, 표시되는 비용은 OpenAI, Anthropic, Google에서 제공하는 입력 페이로드 가격 정책에 근거한 예상치입니다. 기본 추정 공식은 다음과 같습니다: (입력 토큰 수 / 1,000,000) × 제공자 입력 단가(100만 토큰당) × 1,000회 요청.",`;
const replaceKo = `"tokenCounter.longDesc.p3": "표시되는 비용은 각 인공지능 제공사(OpenAI, Anthropic, Google)의 최신 입력 페이로드 단가를 기준(2026년 상반기 기준 고정 단가)으로 산출한 예상치입니다. 실제 API 호출 환경 및 제공사의 가격 정책 변동에 따라 미세한 차이가 발생할 수 있습니다. 기본 추정 공식은 다음과 같습니다: (입력 토큰 수 / 1,000,000) × 제공자 입력 단가(100만 토큰당) × 1,000회 요청.",`;

const targetJa = `"tokenCounter.longDesc.p3": "最新のモデル料金を保つよう努めていますが、表示される価格はOpenAI、Anthropic、Googleが提供する料金設定に基づいた概算値です。基本推計式は以下の通りです：（入力トークン / 1,000,000）× プロバイダー入力単価（100万トークンあたり）× 1,000リクエスト。",`;
const replaceJa = `"tokenCounter.longDesc.p3": "表示されるコストは、各AIプロバイダー（OpenAI、Anthropic、Google）の入力ペイロード単価（2026年上半期時点の固定レート）に基づいた見積もりです。実際のAPI呼び出し環境やプロバイダーの価格ポリシーの変更により、わずかな違いが生じる場合があります。基本推計式は以下の通りです：（入力トークン / 1,000,000）× プロバイダー入力単価（100万トークンあたり）× 1,000リクエスト。",`;

content = content.replace(targetEn, replaceEn);
content = content.replace(targetKo, replaceKo);
content = content.replace(targetJa, replaceJa);

fs.writeFileSync(path, content);
console.log('Fixed tokenCounter.longDesc.p3');
