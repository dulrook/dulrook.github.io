---
layout: splash
title:  "템플릿 메소드 패턴(Template method pattern)"
date:   2019-09-06 22:45:52 +0900
categories: 디자인패턴
---

# [템플릿 메소드 패턴]
## 의도(Intent)
알고리즘 연산의 골격을 정의하고, 일부 절차들을 서브클래스들에게 떠넘긴다. 템플릿 메소드는 서브 클래스들이 알고리즘의 구조를 변경없이 특정 절차들을 재정의하도록 한다.

## 동기(Motivation)
Application 클래스와 Document 클래스를 제공하는 프레임워크가 있다고 해보자. Application 클래스는 파일과 같이 외부 포맷으로 저장되어 있는 문서들을 불러오는 역할을 한다. 파일로부터 Document 객체를 읽어오게 되면 Document 객체는 저장하고 있는 정보를 나타낸다.

프레임워크로 구축한 응용 프로그램은 클래스들은 특정한 요구에 맞게 Application 클래스와 Document 클래스의 하위 클래스가 될 수 있다. 예를 들어, 그림판 프로그램은 DrawApplication 과 DrawDocument 라는 하위 클래스를 정의할 수 있고, 스프레드 시트 프로그램은 SpreadsheetApplication 과 SpreadsheetDocument 라는 하위 클래스를 정의할 수 있다.



추상 클래스인 Application은 문서를 열고 읽는 알고리즘인 OpenDocument()를 정의한다.
![1](https://user-images.githubusercontent.com/47546079/57598138-fce13680-758c-11e9-8d3c-325ac475074c.png)
```cpp
void Application::OpenDocument (const char* name) {
    if (!CanOpenDocument(name)) {
        // cannot handle this document
        return;
    }

    Document* doc = DoCreateDocument();

    if (doc) {
        _docs->AddDocument(doc);
        AboutToOpenDocument(doc);
        doc->Open();
        doc->DoRead();
    }
}
```


OpenDocument()는 문서를 열기 위한 절차들을 정의한다. 이 메소드는 문서가 열수 있는 것인지를 체크하고, Document 객체를 생성한 뒤에, 문서들의 집합에 이 객체를 추가하고, 마지막으로 파일로부터 Document 객체를 읽어온다.

위에서 소개한 OpenDocument가 **템플릿 메소드**라는 개념에 해당한다. 템플릿 메소드는 추상화된 연산의 관점으로 알고리즘을 정의하고, 하위 클래스에서는 이를 오버라이드(override)하여 구체적인 동작을 제공한다. Application의 하위 클래스들은 문서가 열 수 있는 것인지를 체크(CanOpenDocument)하는 절차와 Document 객체를 생성(DoCreateDocument)하는 절차를 정의한다. Document 클래스들은 문서를 읽는 절차(DoRead)를 정의한다. 템플릿 메소드도 Application의 하위 클래스들이 문서가 열리기 직전을 알게(AboutToOpenDocument)하는 연산을 정의한다.

추상화된 연산을 이용해 알고리즘의 일부 절차를 정의함으로써, 템플릿 메소드는 실행되는 연산들의 순서를 정할 수 있다. 또한 템플릿 메소드는 Application 과 Document의 하위 클래스들이 요구에 맞게 절차들을 다양하게 할 수 있도록 한다.

## 활용성(Applicability)
템플릿 메소드 패턴은 다음과 같은 경우에 사용된다.

* 알고리즘의 부분 중 변하지 않는 부분을 구현하고 이 부분을 하위 클래스들이 다양한 방식으로 구현할 수 있도록 내버려두는 경우에 사용한다.

* 하위 클래스들간에 공통적인 동작을 추출하여 코드의 중복을 피하고자 할 때 사용한다. 먼저 소스 코드간에 차이점을 확인하고 차이점을 새로운 연산으로 분리시킨다. 그러고나서 새로운 연산 중 하나를 호출하는 템플릿 메소드로 다른 코드를 대체시킨다.

* 하위 클래스의 확장(extension)을 유연하게 다루고자 할 때 템플릿 메소드 패턴을 사용한다. 템플릿 메소드가 특정 부분에서 "훅(Hook) 오퍼레이션"을 호출하도록 정의하여 오직 그 부분에서만 확장할 수 있도록 한다. (특정을 부분을 하위 클래스가 구현을 해도 되고 안해도 될 수 있도록 한다는 뜻)

## 구조(Structure)
![2](https://user-images.githubusercontent.com/47546079/57598139-fd79cd00-758c-11e9-92f1-b62f220fae6b.png)

## 참여자(Participant)
* AbstractClass (Application)
  * 기초 연산들을 추상화하고, 이를 하위 클래스에서 구체적으로 구현하도록 한다.
  * 알고리즘의 뼈대를 정의하는 템플릿 메소드를 구현한다. 템플릿 메소드는 기초 연산들을 호출한다.
* ConcreteClass (MyApplication)
  * 추상화된 기초 연산들을 구체적으로 구현하여 하위 클래스별로 특정한 알고리즘이 수행되도록 한다.
협력 방법(Collaborations)
ConcreteClass는 알고리즘의 변하지 않는 순서를 구현하기 위해 AbstractClass에 의존적이다.
## 결과(Consequences)
템플릿 메소드는 코드 재사용의 근본적인 기술이다. 템플릿 메소드는 라이브러리 클래스들의 공통 부분을 뽑아내기 때문에 클래스 라이브러리에 특히 중요하다.

템플릿 메소드는 역전된 제어 구조를 이끌어낸다.

템플릿 메소드는 다음과 같은 종류의 연산을 호출한다:

* 구체적인 연산 (ConcreteClass 혹은 클라이언트 class 상의 연산)
* 구체적인 AbstractClass 연산
* 기초적인 연산
* 팩토리 메소드
* *훅 오퍼레이션*, 하위 클래스에서 필요에 따라 확장할 수 있도록 하는 연산. 보통 훅 오퍼레이션의 기본값은 '아무것도 하지 않음' 이다.

템플릿 메소드에서 어떤 연산을 훅으로 할 지(오버라이드 할 수 도 있는), 어떤 연산을 추상화된 연산(반드시 오버라이드 해야하는)으로 정의할 지 정하는 것은 중요하다. 추상 클래스를 효과적으로 재사용하기 위해서, 하위클래스 작성자는 어떤 연산이 오버라이딩을 위해 설계되었는지를 반드시 이해하여야 한다.

하위 클래스는 오버라이딩을 통해 부모 클래스의 연산을 확장할 수 있다:
```cpp
void DerivedClass::Operation () { 
ParentClass::Operation (); 
// DerivedClass extends behavior 
}
```

불행하게도 상속된 연산을 호출해야하는 사실을 깜빡하기 쉽다. 그래서 그러한 연산들을 템플릿 메소드로 넣고 부모 클래스가 이 연산들을 하위 클래스에서 어떻게 확장해야할 지를 제어하도록 한다. 즉, 아이디어는 부모 클래스 내에 템플릿 메소드로부터 훅 오퍼레이션을 호출하는 것이다. 그러고나면 하위클래스들은 이 훅 오퍼레이션을 다음과 같이 오버라이드 할 수 있다:
```cpp
void ParentClass::Operation () { 
// ParentClasss behavior 
HookOperation(); 
}
```
훅 오퍼레이션(HookOperation)은 부모 클래스에서 아무동작도 하지않는다:
```cpp
void ParentClass::HookOperaetion () { }
```

하위클래스는 동작을 확장하기 위해 훅 오퍼레이션을 오버라이드한다:
```cpp
void DerivedClass::HookOperation () { 
// derived class extension 
}
```
***
