## github.io 블로그 만들어보기

![Image](https://github.com/user-attachments/assets/f6f97ce5-2b82-4e44-8c8f-2a67fe87ba01)

###  1. Next.js 선택 이유
---

**dolang** 프로젝트를 진행하며 SNS처럼 동작하는 피드 부분 관련 로직 구현이 필요했습니다. 
당시에는 다른 부분(매칭, 인증 등) 모두를 spring boot로 구현했기 때문에 피드 부분도 spring boot로 구현했습니다.<br />
<br />
프로젝트 종료 후 회고를 하며 피드 부분을 굳이 무거운 spring boot로 구현할 필요가 있었는지에 대해 고민하게 되었습니다. 
심지어 **dolang** 프로젝트는 멀티 모듈 아키텍처를 사용하고 있었기에 피드 부분을 따로 Node.js로 구현했던 것이 더 적합했다고 생각했습니다.<br />
<br />
이에 Node.js에 흥미를 가지게 되었고, 탐색 중 SNS 관련 기능을 구현할 때 프론트로는 Next.js와 자주 같이 사용한다는 점도 알 수 있었습니다.<br />
<br />
이렇게 처음 접한 Next.js 자체도 흥미로웠습니다.<br /> 어느정도의 백엔드 기능을 대체할 수도 있으며, SSG, SSR, ISR 중 원하는 방식으로 페이지를 구성할 수 있어 서버리스 환경에서 사용하기 좋은 프레임워크라는 점은 매력적이었습니다.<br />
<br />
이에 Next.js를 통해 블로그 기능을 할 수 있도록 코드를 작성하고, github action을 통해 github.io에 배포할 수 있도록 SSG를 통한 정적 페이지 생성을 하도록 했습니다. 
후에 github pages를 사용하는 경우가 아닌 상황에서는 백엔드 기능을 좀 더 추가하여 사용해 볼 예정입니다.

###  2. 사용시 유의점
---
- **content** 폴더 밑 **posts**, **resume** 폴더에 담긴 md 파일을 기준으로 포스트와 이력서를 생성합니다.
    - **posts** 폴더 밑에는 **constants/categories.ts** 파일을 기준으로 폴더를 생성해야 카테고리와 서브카테고리가 지정됩니다.
        - categories.ts에 저장된 카테고리 정보는 다음과 같습니다.
            - id: 카테고리 id
            - name: 카테고리 이름
            - description: 카테고리 설명
            - subcategories: 카테고리 하위 카테고리 정보
    - 각 **post.md** 파일에는 포스트 정보를 담아야 합니다..
        - 포스트 정보는 다음과 같습니다.
            - title: 포스트 제목
            - description: 포스트 설명
            - datetime: 포스트 작성일
            - tags: 포스트 태그
            - 추가적으로 category, subcategory 정보를 담을 수는 있으나 폴더로 대체하는 것을 추천합니다.


###  3. 배포 방법
---

```yml
name: Deploy to GitHub Pages

# main 브랜치에 push 이벤트가 발생할 때 실행.
on:
  push:
    branches: [ main ]

# 권한 설정
permissions:
  contents: write

# 빌드 및 배포 작업
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # 체크아웃
      - name: Checkout
        uses: actions/checkout@v4

      # Node.js 설정, cache 사용 (처음 배포시 cache hit가 없음)
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm

                - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          static_site_generator: next

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: |
            .next/cache
          # 소스 파일들이나 패키지들이 변했을 경우 cache key 변경으로 새로 저장 필요.
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}-${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
          # 만약 소스 파일들이 변했지만, 패키지들은 그대로일 경우 일부 재활용
          restore-keys: |
            ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}-
 
      # 의존성 설치
      - name: Install dependencies
        run: npm ci

      # 빌드
      - name: Build
        run: npm run build

      # 배포
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # 배포할 브랜치
          branch: gh-pages
          # 배포할 폴더
          folder: out
          # 배포 전 폴더 정리
          clean: true

```


###  4. 발생한 이슈 및 해결 방법
---

1. generateStaticParams() 미사용으로 인한 SSG 빌드 실패
    - github.io를 활용하기 위해 정적으로 모든 페이지를 생성하는 것이 필요했지만, generateStaticParams() 함수를 사용하지 않았기 때문에 빌드 실패가 발생했습니다.
    - 이에 generateStaticParams() 함수를 사용하여 정적으로 모든 페이지를 생성하도록 수정하였습니다.

2. category에 따른 정적 페이지 빌드 실패
    - 카테고리 정보를 기반으로 정적 페이지를 생성하는 것이 필요했지만, subCategory의 추가 등으로 이를 각각 처리하는 방안에 대해 고민이 필요했습니다.
    - 이에 [..slug]파일 밑 page.tsx 파일에서 카테고리, 서브 카테고리, 포스트인지 판단하는 함수를 불러와 사용하고
    **export const dynamic = "force-static";**
    를 추가하여 정적 페이지 생성을 강제하여 정적 페이지로 모두 생성하도록 수정하였습니다.

3. .nojekyll의 부재로 인한 css 적용 실패
    -  처음에는 prefix에 '.'을 추가하지 않아 생기는 경로 문제인줄 알았으나, 이 경우에도 해결이 이루어지지 않았습니다. 오히려 해당 수정은 font를 불러올 때 필요한 절대 경로까지 수정하게 되어 이를 수정해야하는 필요성을 야기했습니다. 이에 또 다른 방법들을 탐색하던 중, github pages를 통해 배포를 할 경우 jekyll가 아님을 인식시켜야함을 알게 되었습니다.
    - github.io에서 next.js를 활용할 경우 .nojekyll 파일이 필요하다는 점을 알게 되어 .nojekyll 파일을 ghpages 브랜치에 추가하여 css 적용이 제대로 되도록 수정하였습니다.

4. Pagination 처리 관련 문제
    - 포스트 목록을 페이지네이션 처리하고자 했지만, 정적 페이지를 위해 이를 모두 생성하는 것이 옳은지에 대한 고민이 들었습니다. 현재 category와 subCategory를 기준으로 포스트를 불러오는 것만으로 post에 대한 분류가 충분히 이루어질 수 있다 판단하여 페이지네이션 처리를 하지 않았습니다.
    - 이 과정을 통해 정적 페이지 배포만으로는 실시간으로 정보를 반영하는 것에 큰 어려움이 있음을 알 수 있었으며, 서버리스 환경에서는 이 부분이 해결이 될 수 있다는 점도 알 수 있었습니다. 물론 실시간 연결 등이 필요할 경우 서버리스 환경이 아닌 EC2와 같은 전통적인 서버 기반 환경이 필요하긴 하겠지만, '이번 블로그 만들어보기'를 통해 SSR이 필요한 페이지와 SSG로 충분한 페이지의 구분이 어느정도 가능해 졌습니다.

5. 배포에 대한 문제
    - 처음에는 빌드한 파일을 그대로 올리면 배포가 충분이 이루어지지 않을까라고 생각했습니다. 
    하지만 이 경우 정적 페이지가 그대로 배포되는 것이 아니기에, 페이지 로드 시 오류가 발생하였습니다. 
    이에 대한 해결 방법을 찾아보던 중, JamesIves/github-pages-deploy-action을 알게 되었고, 배포를 위한 브랜치를 생성하고, 이를 통해 github pages 배포를 진행하는 것이 매력적으로 보였습니다. 
    또한 직전 프로젝트 진행 시 jenkins를 통해 배포를 진행하였기에, 배포를 자동화하고 싶은 마음이 들었습니다. 
    이에 따로 서버 구축을 할 필요 없이, public repo에서 무료로 사용 가능한 github action을 통해 배포를 진행하고자 결정했고, 이를 위해 workflows에 yml 파일을 작성했습니다. 
    github action을 처음 사용해 보았지만, 개인적으로는 jenkins 파이프라인을 구축하는 것과 유사한 느낌이 들어 쉽고 재밌었습니다. 


###  5. 추후 개선점 및 후기
---

#### 개선점

전반적으로 정적 페이지만을 사용해야 하기 때문에 post를 새로 업데이트 할 때마다 배포를 진행해야 한다는 점이 조금 불편했습니다. 
또한 현재는 많은 정적 페이지들이 필요하지 않아 문제가 발생하지 않지만, 후에 post가 많아지고, category가 많아지면 빌드 시간도 오래 걸릴 것이며, 모든 것을 정적으로 구축하며 큰 용량을 차지하게 될 것으로 예측됩니다. 
물론 혼자 간간히 작성하는 정도로는 큰 문제가 없을 것이나, pagination 등 여러 기능들을 사용하기 위해서는 적어도 서버리스 환경이 필요할 것으로 예상됩니다. 
현재도 댓글같은 기능들은 utterances 혹은 giscus 등을 통해 구현할 수 있는 등 대체 가능한 방법들이 없는 것은 아니지만, 결국 이런 방법 또한 js와 github의 issue 혹은 discussion을 읽어올 수 있어야 가능한 방법이기에 적어도 서버리스가 가능해야 나만의 블로그를 구축할 수 있을 것입니다. 
이에 다음 개선 방향은 vercel 등을 통해 서버리스 환경을 구축하는 것이 우선시 될 것입니다. 

#### 후기
이번 next.js를 통한 블로그 만들어보기를 통해 next.js와 TypeScript가 무엇인지 알 수 있게 되었습니다 
처음 접하는 프레임워크, 언어이기에 사용하는데 어려움이 많았지만, 오히려 처음 접하여서 더 많은 것을 배울 수 있었다 생각합니다. 
한 번의 토이 프로젝트로 해당 언어와 프레임워크를 사용할 수 있다 말 할 수는 없겠으나, 해당 언어와 프레임워크로 작성된 코드를 읽고 해석까지는 가능하게 된 점에 만족스러웠습니다.
