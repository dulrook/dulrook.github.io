---
layout: splash
title:  "장식자 패턴(Decorator pattern)"
date:   2019-09-11 00:51:00 +0900
categories: 디자인패턴
---

## [Decorator 패턴]
## Intent
객체에 동적으로 추가적인 책임을 추가할 때 사용한다. 데코레이터(장식자)는 기능을 확장하는데에 있어서 서브클래싱하는 것 보다 유연한 방법이 될 수 있다.

## Also Known As
Wrapper

## Motivation
개발을 하다보면 전체 클래스가 아닌 개별적인 객체에 책임을 추가하고 싶을 때가 있다. 예를 들어, GUI 툴킷은 사용자가 원하는 유저 인터페이스 컴포넌트에 테두리 추가 혹은 스크롤 추가 등의 기능을 추가할 수 있도록 해야한다. 

책임을 추가하는 방법 중에는 상속(Inheritance)이 있다. 이를 테면, 다른 클래스로부터 상속한 테두리 기능을 모든 서브 클래스 인스턴스에 추가해주는 것이다. 하지만 이런 방법은 유연하지 못하다. 왜냐하면 테두리의 선택이 정적이기 때문이다. 클라이언트는 컴포넌트에 테두리를 언제 어떻게 추가할 지 제어할 수 없게된다.

보다 유연한 접근 방법은 컴포넌트를 테두리를 추가한 다른 객체로 둘러싸는 것이다. 여기서 둘러싸는 역할을 하는 객체를 **데코레이터**(decorator)라고 부른다. 데코레이터는 자신이 꾸미는 컴포넌트의 인터페이스를 따른다. 따라서 데코레이터는 컴포넌트의 클라이언트에게 투명(Transparent)하다. _(Transparent 라는 의미는 클라이언트에게 인터페이스만 알려지고 자세한 구현내용은 숨겨져서 보이지 않는다는 의미. 캡슐화를 떠올리면 된다.)_ 데코레이터는 컴포넌트로 요청을 전달하는데, 전달하기 전에 혹은 후에 테두리 그리기와 같은 추가적인 동작을 수행한다. 투명성은 데코레이터를 반복적으로 중첩시킬 수 있도록 해주며 책임을 무한정 추가할 수 있게 한다.

![1](https://user-images.githubusercontent.com/47546079/57604205-9402ba00-759e-11e9-921d-430cd93abe73.png)


예를 들어, 창에 텍스트를 띄워주는 TextView 라는 객체가 있다고 해보자. 스크롤이 항상 필요한 것은 아니기 때문에 TextView는 기본적으로 스크롤이 없다. 만약 스크롤이 필요한 순간이 오면 그때 우리는 ScrollDecorator를 추가해주면 된다. 마찬가지로 BorderDecorator도 필요에따라 추가하여 사용할 수 있다. 사용자가 원하는 형태로 TextView를 만들기위해 데코레이터들을 간단하게 구성할 수 있다. 

다음 객체 다이어그램은 TextView 객체와 BorderDecorator 그리고 ScrollDecorator가 어떻게 구성되었는지를 나타낸다.
![2](https://user-images.githubusercontent.com/47546079/57604206-9402ba00-759e-11e9-85db-71d75d0eb4d1.png)

ScrollDecorator와 BorderDecorator 클래스들은 Decorator의 서브클래스이며, Decorator는 시각적 구성요소를 위한 추상클래스로 다른 시각적 구성요소를 꾸며(decorate)준다.

![3](https://user-images.githubusercontent.com/47546079/57604207-949b5080-759e-11e9-97fe-93f78a34f813.png)

> 빈 삼각형과 점선으로 연결된 것은 일반화 관계를 의미
> * 여러 클래스가 가진 공통적인 특징을 추출하여 공통적인 클래스로 일반화시키는 것을 의미


VisualComponent는 시각적 객체들을 위한 추상클래스로써, 드로잉과 이벤트 핸들링 인터페이스를 정의한다. Decorator 클래스가 어떻게 단순히 그리기 연산에 대한 요청을 자신의 컴포넌트들에게 전달하고, 어떻게 Decorator의 서브클래스들이 이 연산을 확장할 수 있는지를 주목해야 한다. 

Decorator의 서브클래스들은 특정 기능 수행을 위해 자유롭게 추가될 수 있다. 예를 들어, ScrollDecorator의 ScrollTo 메소드는 다른 객체들이 인터페이스를 스크롤할 수 있도록한다. 이 패턴에서 중요한 점은 VisualComponent가 이 데코레이터들이 필요한 순간 언제라도 사용할 수 있다는 점이다. 클라이언트는 일반적으로 데코레이트된 컴포넌트와 그렇지 않은 것의 차이점을 알 수 없고, 따라서 클라이언트는 모든 데코레이션에 의존성이 있지는 않다.

## Applicability
데코레이터는 다음 상황에서 사용한다

  * 다른 객체에 영향을 미치지 않고, 개별적인 객체에 동적이고 투명하게 책임을 추가하고자 할 때
  * 부여한 책임에 대한 철회가 가능한 경우
  * 서브클래싱을 통한 확장이 실용적이지 못할 때. 때때로 많은 수의 개별적인 확장이 가능하고 이로 인해 모든 조합에 대해 서브클래스를 작성해야할 때. 또는 클래스 정의가 숨겨져야하거나 서브클래싱이 불가능할 때.


## Structure
![4](https://user-images.githubusercontent.com/47546079/57604208-949b5080-759e-11e9-9e5d-a8a205573686.png)

## Participants
  * Component (VisualComponent)
    * 동적으로 책임을 추가할 수 있는 객체들에 대한 인터페이스를 정의한다
  * ConcreteComponent (TextView)
    * 추가적인 책임이 덧붙여질 수 있는 객체를 정의한다
  * Decorator
    * Component 객체에 대한 참조를 관리하고 Component의 인터페이스를 따르는 인터페이스를 정의한다
  * ConcreteDecorator (BorderDecorator, ScrollDecorator)
    * 컴포넌트에 책임을 추가한다
## Consequences
데코레이터 패턴은 두 가지 주요 이점과 두 가지의 단점(liabilities)이 있다. _(단점이라기보다는 사용함으로써 생기는 비용,  부담등을 뜻함)_

* 이점
    1. 정적인 상속보다 유연하다
    2. 기능이 잔뜩 들어간 클래스들이 깊은 계층 구조를 갖게되는 경우를 방지
* 단점
    1. 데코레이터와 컴포넌트는 동일(identical)하지 않다

    > A decorator and its component aren't identical. A decorator acts as a transparent enclosure. But from an object identity point of view, a decorated component is not identical to the component itself. Hence you shouldn't rely on object identity when you use decorators.

    2. 작은 단위의 객체가 많아진다
