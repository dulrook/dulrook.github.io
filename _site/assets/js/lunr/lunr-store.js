var store = [{
        "title": "템플릿 메소드 패턴(Template method pattern)",
        "excerpt":"[템플릿 메소드 패턴] 의도(Intent) 알고리즘 연산의 골격을 정의하고, 일부 절차들을 서브클래스들에게 떠넘긴다. 템플릿 메소드는 서브 클래스들이 알고리즘의 구조를 변경없이 특정 절차들을 재정의하도록 한다. 동기(Motivation) Application 클래스와 Document 클래스를 제공하는 프레임워크가 있다고 해보자. Application 클래스는 파일과 같이 외부 포맷으로 저장되어 있는 문서들을 불러오는 역할을 한다. 파일로부터 Document 객체를 읽어오게 되면 Document...","categories": ["디자인패턴"],
        "tags": [],
        "url": "http://localhost:4000/%EB%94%94%EC%9E%90%EC%9D%B8%ED%8C%A8%ED%84%B4/%ED%85%9C%ED%94%8C%EB%A6%BF-%EB%A9%94%EC%86%8C%EB%93%9C-%ED%8C%A8%ED%84%B4(Template-method-pattern)/",
        "teaser":null},{
        "title": "전략 패턴(Strategy pattern)",
        "excerpt":"[전략 패턴] 의도(Intent) 동일 계열의 알고리즘군을 정의하고, 각각의 알고리즘을 캡슐화한다. 그리고 각 알고리즘을 상호 교환되게 한다. 알고리즘을 사용하는 클라이언트와 상관없이 독립적으로 알고리즘을 다양하게 변경할 수 있게 한다. 다른 이름(Also Known As) Policy 동기(Motivation) 텍스트의 줄을 바꿔주는(Line breaking) 알고리즘은 다양하다. 그러나 이 알고리즘들을 한 클래스에 하드코딩하는 것은 다음의 이유로 바람직하지 않다:...","categories": ["디자인패턴"],
        "tags": [],
        "url": "http://localhost:4000/%EB%94%94%EC%9E%90%EC%9D%B8%ED%8C%A8%ED%84%B4/%EC%A0%84%EB%9E%B5-%ED%8C%A8%ED%84%B4(Strategy-pattern)/",
        "teaser":null},{
        "title": "제어의 역전(IoC) 요약",
        "excerpt":"[ 제어의 역전(IoC) ] Summary 어플리케이션을 구성하는 객체 간의 느슨합 결합을 위해 IoC를 적용한다. IoC가 적용되지 않은 것은 객체의 생성이나 객체 사이의 관계를 개발자가 직접 자바 코드로 처리하는 것이며, IoC가 적용되면 객체 생성 및 * 객체 간에 의존관계를 컨테이너가 대신 처리한다. *IoC 의 대표적인 종류는 의존관계 주입(Dependency Injection)가 있으며, 그...","categories": ["스프링"],
        "tags": [],
        "url": "http://localhost:4000/%EC%8A%A4%ED%94%84%EB%A7%81/%EC%A0%9C%EC%96%B4%EC%9D%98-%EC%97%AD%EC%A0%84(IoC)-%EC%9A%94%EC%95%BD/",
        "teaser":null},{
        "title": "JUnit 과 테스트 주도개발(TDD)",
        "excerpt":"[JUnit] JUnit은 자바 프로그래밍을 위한 단위 테스트 프레임 워크 켄트 벡, 에릭 감마 등에 의해 개발되어졌으며, 최근 Stable 릴리즈는 5.3.1, 2018.09.11 테스트 주도 개발에서 중요한 역할 JUnit 4의 기능 Assertions JUnit은 모든 primitive types, objects, array에 대해 오버로드된 assertion 메소드를 제공 파라미터의 순서는 기대값, 실제값 순 (반대로 적으면 나중에 로그도...","categories": ["테스트"],
        "tags": [],
        "url": "http://localhost:4000/%ED%85%8C%EC%8A%A4%ED%8A%B8/JUnit-%EA%B3%BC-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%A3%BC%EB%8F%84%EA%B0%9C%EB%B0%9C(TDD)/",
        "teaser":null},{
        "title": "[모던자바인액션] 메서드 참조, 람다, 익명함수",
        "excerpt":"Functions in Java 메서드 참조(Method reference) 디렉토리에서 숨겨진 파일들을 필터링 하는 프로그램을 만든다고 했을 때, 기존 방식(자바8 이전)으로는 다음과 같이 구현할 수 있다. File[] hiddenFiles = new File(\".\").listFiles(new FileFilter() { @Override public boolean accept(File pathname) { return pathname.isHidden(); } }); 위의 코드를 이해하기 위해 java.io.File 과 java.io.FileFilter에 대한 문서를 참조해보면...","categories": ["자바"],
        "tags": [],
        "url": "http://localhost:4000/%EC%9E%90%EB%B0%94/%EB%AA%A8%EB%8D%98%EC%9E%90%EB%B0%94%EC%9D%B8%EC%95%A1%EC%85%98-%EB%A9%94%EC%84%9C%EB%93%9C-%EC%B0%B8%EC%A1%B0,-%EB%9E%8C%EB%8B%A4,-%EC%9D%B5%EB%AA%85%ED%95%A8%EC%88%98/",
        "teaser":null}]
