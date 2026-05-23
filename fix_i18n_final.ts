import * as fs from 'fs';

const path = './src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const targetEn = `"tokenCounter.longDesc.p3": "The displayed cost is an estimate based on the latest input payload rates from each provider (OpenAI, Anthropic, Google) fixed as of H1 2026. Slight differences may occur depending on your actual API calling environment and changes in the providers' pricing policies. We calculate the baseline estimation as: (Input Tokens / 1,000,000) × Provider Input Rate (Per 1M tokens) × 1,000 Requests.",`;
const replaceEn = `"tokenCounter.longDesc.p3": "The displayed cost is a simple estimate based on the latest input payload rates from each provider (OpenAI, Anthropic, Google) fixed as of H1 2026. Slight differences may occur depending on your actual API calling environment, context delivery methods, and changes in the providers' pricing policies. Therefore, please use the results of this simulator only as a reference when building infrastructure and predicting costs, and be sure to re-verify directly based on each company's official rate card when planning actual operational tactics. Estimation Formula: (Input Tokens / 1,000,000) × Provider Input Rate (Per 1M tokens) × 1,000 Requests",`;

const targetKo = `"tokenCounter.longDesc.p3": "표시되는 비용은 각 인공지능 제공사(OpenAI, Anthropic, Google)의 최신 입력 페이로드 단가를 기준(2026년 상반기 기준 고정 단가)으로 산출한 예상치입니다. 실제 API 호출 환경 및 제공사의 가격 정책 변동에 따라 미세한 차이가 발생할 수 있습니다. 기본 추정 공식은 다음과 같습니다: (입력 토큰 수 / 1,000,000) × 제공자 입력 단가(100만 토큰당) × 1,000회 요청.",`;
const replaceKo = `"tokenCounter.longDesc.p3": "표시되는 비용은 각 인공지능 제공사(OpenAI, Anthropic, Google)의 최신 입력 페이로드 단가를 기준(2026년 상반기 기준 고정 단가)으로 산출한 단순 추정치입니다. 실제 API 호출 환경, 컨텍스트 전달 방식, 제공사의 가격 정책 변동에 따라 실제 청구 비용과 미세한 차이가 발생할 수 있습니다. 따라서 본 시뮬레이터의 결과는 인프라 구축 및 비용 예측 시 참고용으로만 활용하시고, 실제 운영 전술은 각 사의 공식 단가표를 기반으로 직접 재검증하여 구상하시기 바랍니다. 추정 공식: (입력 토큰 수 / 1,000,000) × 제공자 100만 토큰당 입력 단가 × 1,000회 요청",`;

const targetJa = `"tokenCounter.longDesc.p3": "表示されるコストは、各AIプロバイダー（OpenAI、Anthropic、Google）の入力ペイロード単価（2026年上半期時点の固定レート）に基づいた見積もりです。実際のAPI呼び出し環境やプロバイダーの価格ポリシーの変更により、わずかな違いが生じる場合があります。基本推計式は以下の通りです：（入力トークン / 1,000,000）× プロバイダー入力単価（100万トークンあたり）× 1,000リクエスト。",`;
const replaceJa = `"tokenCounter.longDesc.p3": "表示されるコストは、各AIプロバイダー（OpenAI、Anthropic、Google）の最新の入力ペイロード単価（2026年上半期時点の固定レート）に基づいた単純な見積もりです。実際のAPI呼び出し環境、コンテキストの配信方法、プロバイダーの価格ポリシーの変更により、実際の請求コストとわずかな違いが生じる場合があります。したがって、このシミュレーターの結果は、インフラストラクチャの構築とコスト予測の参考としてのみ使用し、実際の運用戦略を計画する際は、各社の公式料金表に基づいて直接再確認してください。 推計式：（入力トークン数 / 1,000,000）× プロバイダーの100万トークンあたりの入力単価 × 1,000回のリクエスト",`;

content = content.replace(targetEn, replaceEn);
content = content.replace(targetKo, replaceKo);
content = content.replace(targetJa, replaceJa);

content = content.replace(/"common.sample": "Sample Data",/, '"common.sample": "Sample Data",\n      "common.sampleData": "Sample Data",');
content = content.replace(/"common.sample": "샘플 데이터",/, '"common.sample": "샘플 데이터",\n      "common.sampleData": "샘플 데이터",');
content = content.replace(/"common.sample": "サンプルデータ",/, '"common.sample": "サンプルデータ",\n      "common.sampleData": "サンプルデータ",');

fs.writeFileSync(path, content);
console.log('Final fixes applied.');
