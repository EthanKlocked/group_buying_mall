const customSlide = (defaultPage=null) => {
    // 기본 세팅
    const links = document.querySelectorAll("#nav > ul > li"); // nav link
    const firstList = document.querySelector("#nav > ul > li:first-child"); // nav 첫 번째 link
    const line = document.querySelector("#line"); // menu하단에 존재하는 line
    const contents__list = document.querySelector("#contentList"); // 컨텐츠 목록
    const width = document.querySelector("#wrapper").clientWidth; // wrapper 너비

    // 슬라이드 세팅
    firstList.style.color = "crimson";
    const body = document.querySelector("body"); // body
    let contentsIndex = 0; // 현재 컨텐츠 인덱스
    let isSlide = false; // 슬라이드 status
    let slideStartX = 0; // 처음 눌러진 슬라이드의 X값
    let slideGab = 0; // 처음 눌러진 슬라이드의 X값과 현재 눌러진 슬라이드의 X값의 차이
    const flipGab = 80; // 화면이 넘어가지기 위한 기준 값

    // 기본 세팅
    // link click 이벤트
    const clickLink = (e, index) => {
        contents__list.style.transform = `translateX(${-index * width}px)`;
        links.forEach((l, i) => { l.style.color = "black" } );
        links[index].style.color = "crimson";
        line.style.width = `${e.currentTarget.offsetWidth}px`;
        line.style.left = `${e.currentTarget.offsetLeft}px`;
        line.style.top = `${e.currentTarget.offsetTop + e.currentTarget.offsetHeight}px`;

        contentsIndex = index;
    }

    // 각 link 별 click 이벤트 등록
    links.forEach((link, index) => { link.addEventListener('click', (e) => clickLink(e, index)); } );

    // 초기 line 위치 지정
    line.style.width = `${firstList.offsetWidth}px`;
    line.style.left = `${firstList.offsetLeft}px`;
    line.style.top = `${firstList.offsetTop + firstList.offsetHeight}px`;

    // 슬라이드 세팅
    // 화면을 처음 클릭할 때
    const slideStart = (clientX) => {
        slideStartX = clientX;
        isSlide = true;

        // 트랜지션 상태를 초기화 (트랜지션이 적용되어 있으면 반응이 느려짐)
        contents__list.style.transition = 'initial';
        line.style.transition = 'initial';
    }

    // 화면을 클릭하고 이동할 때
    const slideMove = (clientX) => {
        if(isSlide) {
            slideGab = slideStartX - clientX;
            // slideGab만큼 화면 움직이기
            if(slideGab < 80 && slideGab > -80) return;
            contents__list.style.transform = `translateX(-${width * contentsIndex + slideGab}px)`;

            // slideGab의 비율을 구해서 메뉴 밑줄 움직이기
            const ratio = slideGab / width; // ex) 1.xx
            const ratioInt = parseInt(ratio); // ex) 1
            const ratioDecimal = ratio - ratioInt; // ex) 0.xx

            const currentIndex = contentsIndex + ratioInt; // 움직였을 때 현재 컨텐츠 index

            if(slideGab > 0 && currentIndex < links.length - 1) {
                line.style.left = `${links[currentIndex].offsetLeft + (links[currentIndex + 1].offsetLeft - links[currentIndex].offsetLeft) * ratioDecimal}px`; // 현재 index의 left + 다음 index까지 비율의 차이만큼 이동
                line.style.width = `${links[currentIndex].offsetWidth * (1-ratioDecimal) + links[currentIndex + 1].offsetWidth * ratioDecimal}px`; // 현재 index의 width * (1-비율) + 다음 index의 width * 비율만큼 너비 변화
            } else if(slideGab < 0 && currentIndex > 0) {
                line.style.left = `${links[currentIndex].offsetLeft + (links[currentIndex].offsetLeft - links[currentIndex - 1].offsetLeft) * ratioDecimal}px`; // 현재 index의 left + 다음 index까지 비율의 차이만큼 이동
                line.style.width = `${links[currentIndex].offsetWidth * (1-Math.abs(ratioDecimal)) + links[currentIndex - 1].offsetWidth * Math.abs(ratioDecimal)}px`; // 현재 index의 width * (1-비율) + 다음 index의 width * 비율만큼 너비 변화
            }
        }
    }

    // 화면 클릭이 중단될 때
    const slideEnd = () => {
        // flipGab을 기준으로 화면 넘어갈지를 판단
        if(slideGab >= flipGab) {
            contentsIndex++;
            contentsIndex = contentsIndex >= links.length ? links.length - 1 : contentsIndex;
        } else if(slideGab <= -flipGab) {
            contentsIndex--;
            contentsIndex = contentsIndex < 0 ? 0 : contentsIndex;
        }

        contents__list.style.transform = `translateX(-${width * contentsIndex}px)`;
        slideGab = 0;
        isSlide = false;

        // 트랜지션 다시 적용
        contents__list.style.transition = '.3s ease-out';
        line.style.transition = '.3s ease-out';

        // 변경된 index로 line 이동
        line.style.width = `${links[contentsIndex].offsetWidth}px`;
        line.style.left = `${links[contentsIndex].offsetLeft}px`;
        line.style.top = `${links[contentsIndex].offsetTop + links[contentsIndex].offsetHeight}px`;

        links.forEach((l, i) => { l.style.color = "black" } );
        links[contentsIndex].style.color = "crimson";        
    }

    //마우스 이벤트 등록 (웹 전용)
    contents__list.addEventListener('mousedown', (e) => {
        slideStart(e.clientX);
    })

    body.addEventListener('mousemove', (e) => {
        slideMove(e.clientX);
    })

    body.addEventListener('mouseup', () => {
        slideEnd();
    })

    //터치 이벤트 등록 (모바일 전용)
    contents__list.addEventListener('touchstart', (e) => {
        slideStart(e.changedTouches[0].clientX);
    })

    body.addEventListener('touchmove', (e) => {
        slideMove(e.changedTouches[0].clientX);
    })

    body.addEventListener('touchend', () => {
        slideEnd();
    })    

    if(defaultPage){
        clickLink(links[defaultPage], defaultPage);
    }
}

export default customSlide;