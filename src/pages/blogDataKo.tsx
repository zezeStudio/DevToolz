import React from 'react';

export const blogArticlesKo: Record<string, React.ReactNode> = {
  'why-typescript-interfaces-matter': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        최신 웹 애플리케이션을 구축할 때 데이터 구조의 무결성과 예측 가능성은 매우 중요합니다. TypeScript 인터페이스는 객체가 예상되는 형태와 일치한다는 구조화된 컴파일 타임 보장을 제공합니다. 이러한 간단한 추가 기능은 개발자가 대규모 코드베이스와 상호 작용하는 방식을 근본적으로 바꾸어 디버깅 프로세스를 런타임 'undefined' 오류에서 편집기 수준의 즉각적인 피드백으로 이동시킵니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">'Any'와 암시적 타입의 위험성</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        TypeScript 이전의 JavaScript 개발자들은 데이터의 무결성을 보장하기 위해 문서와 런타임 검사에 크게 의존했습니다. REST API나 데이터베이스 쿼리에서 JSON 페이로드를 가져올 때 데이터의 형태는 실행 전까지 기본적으로 블랙박스였습니다. 초기 TypeScript 도입에 'any'가 도입되면서 팀이 유형 검사기를 우회할 수 있는 허점이 생겼습니다. 그러나 any를 활용하면 언어의 목적 자체를 완전히 무효화합니다. 이는 구조적 불일치를 마스킹하여 프로덕션 환경에서 치명적인 "undefined의 속성을 읽을 수 없음" 등과 같은 시스템 오류로 이어집니다. 인터페이스를 통한 엄격한 타이핑은 이러한 모호성을 제거합니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">계약 주도 개발 (Contract-Driven Development)</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        TypeScript 인터페이스는 코드베이스 내에서 법적 구속력이 있는 계약 역할을 합니다. 백엔드가 JSON 스키마를 노출하면 프론트엔드 엔지니어는 즉시 해당 스키마를 해당하는 TypeScript 인터페이스에 매핑할 수 있습니다. 당사의 JSON-TS 변환기와 같은 도구는 이 프로세스를 자동화하여 API에서 반환된 원격 객체가 React 컴포넌트에서 소비되는 인터페이스와 완벽하게 일치하도록 보장합니다. API가 버전 변경을 거쳐 필드르 제거하는 경우 TypeScript 컴파일러는 해당 제거된 필드를 렌더링하려는 모든 UI 구성 요소를 즉시 플래그하여 오류를 방지합니다. 이러한 계약 위주의 접근 방식은 리팩토링 프로세스를 막대하게 가속화하고 팀 협업을 강화합니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">개발자 경험(DX) 향상</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        아마도 TypeScript 인터페이스의 가장 즉각적인 이점은 IntelliSense를 통한 개발자 경험의 향상일 것입니다. VS Code와 같은 최신 편집기는 인터페이스 정의를 실시간으로 구문 분석합니다. 개발자가 'user.'를 입력하면 유효한 속성을 나열하는 드롭다운이 즉시 나타납니다. 이 자동 완성 기능은 단축키 간의 컨텍스트 전환을 획기적으로 줄이고 중첩된 속성의 정확한 철자를 기억하기 위해 API 문서 또는 네트워크 탭을 지속적으로 참조할 필요성을 없앱니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">고급 인터페이스 기능: 확장성</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        인터페이스는 단순한 정적 매핑이 아닙니다. 이들은 확장성이 뛰어난 구조상 특징입니다. extends 키워드를 사용하여 개발자는 단순한 유형 중에서 복잡한 유형을 구성할 수 있습니다. 예를 들어, Manager 인터페이스는 기본 Employee 인터페이스를 확장하여 모든 기준 속성을 상속받고 특정 관리 권한을 시스템 상으로 추가할 수 있습니다. 이 객체 지향 (OOP) 디자인 패턴은 DRY(반복하지 않기) 원칙을 촉진하여 실제 엔터티 관계를 정확하게 반영하는 깔끔한 계층 데이터 구조를 설정합니다.
      </p>

      <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 my-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">사례 연구: 대규모 마이그레이션</h3>
        <p className="text-slate-700 dark:text-slate-300">
          플랫폼을 빠르게 확장하는 핀테크 스타트업을 생각해 보세요. 처음 바닐라 JavaScript로 구축된 팀은 금융 데이터 구조의 복잡성이 인간의 운영 한계를 초과함에 따라 많은 기술 부채를 겪었습니다. 엄격한 TypeScript 인터페이스로의 대대적인 마이그레이션을 시행하여 모든 네트워크 응답 페이로드를 유형 선언으로 변환함으로써 QA 팀은 첫 달 이내에 런타임 오류가 85% 감소했다고 보고했습니다. 엄격한 타이핑의 중요성을 증명한 결과입니다.
        </p>
      </div>

      <p className="mb-4 text-slate-700 dark:text-slate-300">
        결론적으로 TypeScript 인터페이스는 최신의 소프트웨어 엔지니어링 팀에게 필수적인 도구입니다. 애플리케이션 경계를 설정하고 기본적으로 API 계약을 문서화하며 코드베이스를 안전하고 효율적으로 확장하는 데 필요한 필수 도구를 제공합니다.
      </p>
    </div>
  ),
  'regex-mastery-for-developers': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        정규표현식(Regex)은 종종 초보 프로그래머와 노련한 개발자 모두에게 두려움을 불러일으킵니다. 그들의 암호화된 구문은 컴퓨터 논리라기보다는 노이즈처럼 보입니다. 그러나 백슬래시와 괄호의 복잡한 조합 아래에는 현대 개발에서 사용할 수 있는 가장 강력한 텍스트 처리 알고리즘이 있습니다. 정규식을 마스터하는 것은 수동 문자열 조작과 우아한 데이터 통합 방식을 구분하는 기준이 됩니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">백슬래시 해독하기</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        핵심적으로 정규표현식은 검색 패턴을 지정하는 문자열의 연속입니다. 각각의 문자를 일일이 확인하는 반복 루프를 작성하는 대신 정규식은 하위 문자열을 찾고 변형하는 선언적 방법을 제공합니다. 예를 들어 문자열에 숫자가 포함되어 있는지 쉽게 테스트할 수 있습니다. 
      </p>
      
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        데이터 수집이나 추출 방식에서 정규식은 매우 중요한 툴입니다. 덜 복잡한 언어 코드를 작성함으로써 정규식은 단일 정규 표현식으로 엄청난 양을 한 번에 정리합니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">치명적인 백트래킹 방지</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        정규식과 관련하여 매우 위험하지만 잊기 쉬운 것은 치명적인 백트래킹의 존재입니다. 제대로 작성되지 않은 패턴에서 엔진이 멈춰 CPU 자원을 모두 빨아들일 수 있습니다. 중첩 문자열 및 다중 양화사는 성능 저하를 일으킬 수 있으므로 DevToolz의 정규식 기능 등을 활용하여 정규식을 시뮬레이션해 보는 것이 필요합니다.
      </p>
      
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        정규식을 이해함으로써 개발자의 작업 효율성이 획기적으로 올라갑니다. 대규모 리팩토링 및 텍스트 검증에서 이 우아한 텍스트 처리 알고리즘을 사용해 보세요.
      </p>
    </div>
  ),
  'secure-password-generation': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        디지털 환경이 날이 갈수록 자동화된 봇넷 등으로 위협을 겪고 있습니다. 길이가 긴 문자열만이 비밀번호 보안의 요소가 아닙니다. 생성 과정 중 사용되는 암호화학적 엔트로피가 본질적인 강력함을 구성합니다. 본 문서는 비밀번호 도구에 사용되는 웹 크립토 기반의 생성 원리를 분석합니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Math.random() 함수의 치명적 결함</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        가장 일반적인 자바스크립트의 표준 함수인 Math.random()은 유사 난수 생성기(PRNG)로 동작합니다. 인간에게 무작위로 보이지만 이는 결정론적인 시드 상태에서 파생되며, 해커가 이 초기 상태만 유추하면 암호학적 규칙을 모두 해제할 수 있습니다. 이를 사용한 토큰이나 키의 보안 생성은 가장 중요한 취약점으로 분류됩니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Web Crypto API 및 하드웨어 연산</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        현대 브라우저는 Web Crypto API의 window.crypto.getRandomValues()를 제공합니다. 이는 물리적 운영체제와 통신하며 진정한 하드웨어 엔트로피 (마우스 이동, 하드웨어 클럭의 불규칙성, 열 노이즈 등) 를 끌어들여 예측 불가능한 값을 도출합니다. 이것이 안전한 비밀번호 생성에 있어서 가장 중요한 규칙입니다.
      </p>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        비밀번호가 안전한지는 "이론적인 엔트로피 비트"에 의해 결정됩니다. 문자 조합 및 순열을 통해 80~100비트를 넘기면 현대 컴퓨팅으로도 크랙이 무용지물이 됩니다. 비밀번호를 길게 만드는 것이 더 중요합니다.
      </p>
    </div>
  ),
  'jwt-security-principles': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">JSON Web Tokens: 구조와 보안 취약성</h1>
      <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        JSON Web Tokens(JWT)는 RESTful API와 현대 싱글 페이지 애플리케이션 보안 통신의 표준이 되었습니다. 상태를 저장하지 않고 클라이언트 인증 등 뛰어난 확장성을 보여주나, 올바른 지식이 없을 경우 중요한 시스템 위협이 될 수 있습니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">JWT의 기본 구조</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        모든 JWT는 Header, Payload, Signature라는 세 부분으로 나뉩니다. 핵심적인 Payload에는 본질적인 클레임이 포함되어 있으며, 암호화되지 않고 Base64Url로 인코딩만 되어 있습니다. 따라서 비밀 정보가 노출되지 않도록 하는 것이 필수입니다.
      </p>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">암호학적 서명과 취약점</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        보안은 세 번째 세그먼트인 Signature에 크게 의존합니다. 토큰 검증은 서버에서 이루어집니다만, 취약점 중 "None 알고리즘 무시 공격", 즉 서명 자체를 우회하는 라이브러리 결함이나 무차별 대입하기 쉬운 약한 시크릿 키가 공격의 원인이 됩니다. 클라이언트 측에서 JWT 구조를 디버그하고 이를 보호하는 방법과 로컬 환경을 유지하는 방법을 반드시 숙지해야 합니다.
      </p>
    </div>
  ),
  'understanding-base64': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Base64 인코딩 원리 이해하기</h1>
      <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        Base64 인코딩은 파일, 이미지 데이터를 텍스트 전용 시스템의 네트워크를 통해 구조화하고 전송하는 데 폭넓게 사용되는 훌륭한 방법론입니다. 그러나 개발자들은 여전히 종종 암호화와 혼동하는 경우가 있습니다. 
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Base64의 동작 메커니즘</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        바이너리를 받아 6비트로 된 알파벳/숫자의 조합으로 치환하여 ASCII 문자열로 만듭니다. JSON 같은 텍스트 기반 시스템이 아무 훼손도 일으키지 않고 원시 데이터를 안전하게 파싱할 수 있게 도와줍니다. 네트워크 데이터 전달이 Base64를 요구하는 가장 큰 이유입니다.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">가장 핵심적인 차이: 인코딩 대 암호화</h2>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        Base64는 암호화 (Encryption)가 아닙니다. 누구나 Base64 문자열을 원본 데이터로 해독할 수 있으며 암호화적 보안이 전혀 없습니다. 따라서 Base64로 전송하기 전에 비밀 데이터는 항상 강력한 알고리즘(예: AES-256)을 통해 보호해야 합니다.
      </p>
    </div>
  ),
  'webassembly-and-local-processing': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        과거 브라우저는 단지 원격 서버에 종속적인 문서 뷰어에 불과했습니다. 그러나 오늘날 우리는 WebAssembly(Wasm)로의 진화와 매우 최적화된 자바스크립트 엔진 덕분에, 클라이언트 내에서 네이티브 속도에 가까운 연산을 실행할 수 있는 시대에 살고 있습니다.
      </p>
      
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        이러한 기술적 변화는 무엇보다 중요한 '프라이버시'라는 측면과 연결됩니다. 서버 자원이 필요하지 않으므로 사용자의 민감한 파일이나 비밀번호는 서버에 전달되지 않고 오직 로컬 머신의 메모리 상에서 처리되어 'Zero Data Transmission' 효과를 내며 서버 비용 또한 발생하지 않습니다.
      </p>
    </div>
  ),
  'json-parsing-strategies': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        JSON은 XML을 밀어내고 현대 웹 애플리케이션 데이터를 관통하는 가장 핵심적인 기술 척도입니다. 하지만 고도로 구조화되고 큰 페이로드를 처리할 때는 브라우저의 메인 스레드를 과부하시키는 심각한 요인이 될 수 있습니다.
      </p>
      
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        Web Worker 기법으로 이러한 메가바이트 규모의 JSON 페이로드 처리 로직을 격리 스레드에 배치하면 렌더링에 끊김이 생기지 않습니다. 이 밖에 스트리밍 JSON 등 데이터 청킹 기술의 발달은 대규모 데이터를 서버 간 API로 전송할 때 프론트엔드 최적화의 큰 숙제입니다.
      </p>
    </div>
  ),
  'prompt-engineering-best-practices': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        프롬프트 엔지니어링은 인공지능이 인간의 명령을 모호함 없이 이해하고 가장 정확하게 반환할 수 있도록 통제하는 것입니다. 시스템 프롬프트의 체계적이고 구조화된 구성은 비결정론적 한계를 줄이기 위해 필수적입니다.
      </p>
      
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        주요 기술로는 XML 형식으로 맥락을 구획하여 환각(Hallucination) 현상을 차단하고, LLM의 토큰 경제성을 염두에 두어 과도한 논리를 단순화시키는 '퓨샷 기법(Few-Shot Prompting)' 등이 있습니다. 개발자의 프롬프트 구조화 기술이 점차 핵심적인 역량이 될 전망입니다.
      </p>
    </div>
  ),
  'uuid-version-differences': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        데이터베이스의 데이터 고유성을 부여할 때 자주 쓰이는 Universally Unique Identifier, 일명 UUID는 각기 다른 버전과 생성 방식으로 설계되었습니다. UUID의 버전 1은 네트워크 인터페이스와 타임스탬프를 혼합하여 물리적인 장치를 파악할 우려가 있어 프라이버시가 취약했습니다.
      </p>
      
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        반면 현대 대부분의 개발은 완전히 랜덤한 암호화 기반 버전 4를 준수합니다. 엔드 투 엔드로 무작위성을 부여하기 때문에 초당 매우 많은 규모의 정보를 생성해도 우주의 스케일로 충돌할 확률은 현저히 낮습니다. 이러한 수학적 고유성에 대한 기초적 이해를 제공합니다.
      </p>
    </div>
  ),
  'diff-algorithms-explained': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
       <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        우리가 자주 쓰는 Git이나 텍스트 비교 알고리즘은 마법이 아닙니다. 이것은 Eugene Myers의 차분 탐색 알고리즘과 같은 고도의 트리 순회와 행렬 동적 컴퓨팅으로 처리된 것입니다. 이를 통해 LCS(최장 공통 부분 수열)를 발견하여 추가와 삭제를 도출합니다.
      </p>
      
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        더 나아가 추상 구문 트리 기반의 지능적이고 의미론적인 비교 모델들이 최신 클라이언트 성능의 이점을 받아 개발되어 메모리를 소비하지 않고 동작합니다. 이는 Diff 체커가 매우 경량화되어 사용할 수 있는 토대를 제공합니다.
      </p>
    </div>
  ),
  'optimizing-web-apps': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        React의 프레임워크 생태계는 항상 Virtual DOM 성능 개선을 요구해왔습니다. 자식 컴포넌트의 불필요한 렌더 재호출 문제를 차단하기 위한 메모이제이션과 깊은 콜백 참조 고정 등 고급 기술이 요구됩니다. 
      </p>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        더불어 React Compiler라는 혁신적인 도구가 2026년 프론트엔드 최적화 세계를 지배하고 있으며, 개발자가 메모이제이션 기술에 몰두하지 않도록 구조 트리 자체를 개선하는 방식으로 나아가고 있습니다. 
      </p>
    </div>
  ),
  'regex-performance-backtracking': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        정규식에서 백트래킹 취약성은 서버 시스템의 Denial of Service 공격에 노출될 만큼 치명적입니다. 패턴의 한 갈래가 실패할 경우 다른 모든 조합으로 되돌아가며 CPU 리소스를 잠식합니다.
      </p>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        중첩된 수량자와 그리디 표현식을 억제하고 탐욕 엔진을 올바르게 제어함으로써 안정적인 앱 상태를 유지해야 하는 것이 매우 핵심적인 개발 규칙입니다.
      </p>
    </div>
  ),
  'understanding-unix-epoch': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        소프트웨어 공학에서 1970년 1월 1일 자정의 의미는 Unix 기반 타임스탬프의 원년에 해당합니다. 시간대 문제, 윤년 등 현실적인 계산 복잡성에 직면하기 전 컴퓨팅 산업의 표준화가 제정되었습니다. 
      </p>
      <p className="mb-4 text-slate-700 dark:text-slate-300">
        이후 발생하는 2038년의 32비트 Integer 오버플로우 한계를 극복하기 위한 수많은 64비트 시스템으로의 전환 등 인프라의 과제들은 여전히 진행 중에 있습니다. 컴퓨팅 시간에 기초가 되는 지식입니다.
      </p>
    </div>
  ),
  'the-math-behind-qr-codes': (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <p className="lead text-lg text-slate-700 dark:text-slate-300 md:text-xl md:leading-relaxed mb-6">
        QR 코드는 리드 솔로몬 오류 수정 알고리즘과 수학적 구조를 결합하여 엄청난 데이터 오류 저항성을 달성했습니다. 코드 귀퉁이의 위치 찾기 코드를 활용해 회전과 오염에 대응하는 기술의 혁신을 다룹니다.
      </p>
    </div>
  )
};
