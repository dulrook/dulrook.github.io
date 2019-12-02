---
layout: splash
title:  "[모던자바인액션] CompletableFuture와 리액티브 프로그래밍 컨셉의 기초"
date:   2019-12-02 23:27:00 +0900
categories: 자바
---

## 소프트웨어 개발의 두가지 트렌드
1. 어플리케이션을 실행시키는 하드웨어
    - 멀티코어 프로세서의 발달
    - 프로세서를 얼마나 효율적으로 사용하는지가 어플리케이션의 성능을 좌우함
    - 간편하게 커다란 태스크를 서브태스크로 나누어 병렬 처리하기 위해 포크/조인 프레임워크(자바7)와 병렬 스트림(자바8)이 등장
    - 병렬 스트림을 사용함으로써 쓰레드를 직접 사용할때보다 효율적이고 간편함
2. 어플리케이션을 상호작용 하도록 구조 설계
    - 마이크로서비스 아키텍처의 증가
    - 최근에는 독립적으로 동작하는 서비스는 거의 없으며, 여러 웹서비스에 접근하여 정보를 처리한다. 
    - 다른 서비스의 응답을 기다리느라 블록킹이 발생하지 않도록해야 한다

- 병렬성과 동시성
    - 동시성은 단일 코어 머신에서 발생할 수 있는 프로그래밍 속성인 반면 병렬성은 하드웨어 실행의 속성이다.
    - 병렬성을 위한 유용한 툴로 포크/조인 프레임워크와 병렬 스트림을 사용할 수 있다.
    - 동시성을 다룰때는, 혹은 주요 목표가 같은 CPU내에서 느슨하게 연관된 여러 태스크들을 수행하는 것이라면, 코어들을 최대한 바쁘게하여 어플리케이션의 처리량(Throughput)을 최대화해야한다. 이를 위해서는 쓰레드 블록킹을 피하고 다른 서비스로부터 계산 결과를 기다리느라 연산 리소스가 낭비되지 않도록 해야한다.

<img src="https://github.com/dulrook/dulrook.github.io/blob/master/assets/images/concurrency%20vs%20parallelism.PNG?raw=true">

## 동시성을 지원하는 자바의 진화
- 초기 자바에는 lock(`synchronized` 키워드가 사용된 클래스와 메서드), `Runnable`, `Threads`가 있었다.
> **14.19. The `synchronized` Statement**
> A synchronized statement acquires a mutual-exclusion lock (§17.1) on behalf of the executing > thread, executes a block, then releases the lock. While the executing thread owns the lock, no > other thread may acquire the lock.
>> SynchronizedStatement:
    synchronized ( Expression ) Block
>
> ***The type of Expression must be a reference type, or a compile-time error occurs.***
>
> 인스턴스 메서드, 스태틱 메서드, 인스턴스 메서드 코드블록, 스태틱 메서드 코드블록에 사용된다.

- 2004년 자바5는 좀 더 표현력있는 동시성을 지원하는 `java.util.concurrent` 패키지를 소개했다. 특히, 쓰레드 실행과 태스크 제출을 분리시킨 `ExecutorService`와 `Callable<T>`, `Future<T>` 를 지원한다.
- 자바 7에서는 분할정복 알고리즘의 포크/조인 구현을 지원하는 `java.util.concurrent.RecursiveTask` 가 추가되었다.
- 자바 8에는 `Streams`과 병렬 처리를 지원한다. 또한 동시성 기능을 강화하기 위해 Future를 조합하는 `CompletableFuture`를 지원한다.
- 자바9는 분산 비동기 프로그래밍을 명시적으로 지원한다.

## Synchronous and asynchronous APIs
다음의 메서드 f와 g의 결과를 합산하는 문제를 예로 생각해보자.
```java
int f(int x);
int g(int x);
```
위 시그니처는 *synchronous API* 인데 왜냐하면 위 메서드들이 물리적으로 값이 반환될 때 반환을 하기 때문이다. 각 함수를 호출하고 더하는 코드는 아래와 같이 작성할 수 있다.
```java
int y = f(x);
int z = g(x);
System.out.println(y+z);
```
여기서 메서드 f와 g가 실행하는데 아주 오래걸린다고 가정해보자. f와 g가 서로 상호작용하지 않는다는 점을 알고있다면 각각을 다른 CPU 코어에서 실행하도록 하는 것이 가장 시간이 적게 드는 방법일 것이다. 별도의 쓰레드에서 f와 g를 실행하도록 구현하기만하면 된다. 그러나 이러한 접근은 단순했던 코드를 복잡하게 만든다.
```java
class ThreadExample {
    public static void main(String[] args) throws InterruptedException {
        int x = 1337;
        Result result = new Result();
        
        Thread t1 = new Thread(() -> { result.left = f(x); } ); // 람다 표현식으로 Runnable 구현
        Thread t2 = new Thread(() -> { result.right = g(x); });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        System.out.println(result.left + result.right);
    }
    private static class Result {
        private int left;
        private int right;
    }
}

class Funtions {
    public static int f(int x) {
         return x * 2;
    }
    
    public static int g(int x) {
        return x + 1;
    }
}
```

위 코드를 `Runnable` 대신 `Future`를 이용해 단순화시킬 수 있다. `ExecutorService`로 쓰레드 풀을  설정했다고 가정하자.
```java
public class ExecutorServiceExample {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        int x = 1337;

        ExecutorService executorService = Executors.newFixedThreadPool(2);
        Future<Integer> y = executorService.submit(() -> f(x));
        Future<Integer> z = executorService.submit(() -> g(x));
        System.out.println(y.get() + z.get());
    
        executorService.shutdown();
    }
}
```
그러나 여전히 위 코드도 명시적으로 `submit`를 호출하여 코드를 오염시키고 있다. 문제의 해결은 API를 *asynchronous API* 로 전환하는 것이다. 메서드가 물리적으로 계산이 끝남과 동시에 caller에게 값을 리턴하는 synchronous 방식 대신에, 물리적으로 계산이 끝나기 전에 caller에게 리턴하도록 하는것이다. 따라서 f 를 호출하고나서 병렬로 g를 호출할 수 있게된다. 병렬성을 사용하기 위해 두 가지 방법을 사용할 수 있는데, 두 방법은 모두 f 와 g의 시그니처를 변경한다.

*1. Futures 사용하기*
- 자바 5에서 등장하였고 자바8에서 조합 가능하도록 `ComletableFuture`로 발전되었다.
- 이 방법을 사용하면 f,g의 시그니처는 다음처럼 바뀐다. 
    ```java
    Future<Integer> f(int x);
    Future<Integer> g(int x);

    Future<Integer> y = f(x);
    Future<Integer> z = g(x);
    System.out.println(y.get() + z.get());
    ```
- 좀 더 큰 프로그램에서는 이러한 방식은 사용하지 않는다.

*2. 리액티브 프로그래밍 스타일*
- 발행-구독 프로토콜 기반의 자바9 `java.util.concurrent.Flow` 인터페이스
- 이 방식에서의 핵심 아이디어는 f와 g의 시그니처를 변경하여 콜백 스타일 프로그래밍을 사용하는 것이다.
- `void f(int x, IntConsumer dealWithResult);`
- `f`가 아무것도 리턴하지 않는데 어떻게 동작될 수 있을까? 답은 `f`에 추가적인 argument로 *callback*(람다)을 대신 전달하고 `f`가 준비됐을 때 어떤 값을 리턴하는것이 아니라 이 람다를 호출하도록 만드는 것이다.
    ```java
    class CallbackStyleExample {
        public static void main(String[] args) throws InterruptedException {
            int x = 1337;
            Result result = new Result();

            f(x, (int y) -> { 
                result.left = y; 
                System.out.println((result.left + result.right));
            });
            
            g(x, (int z) -> { 
                result.right = z; 
                System.out.println((result.left + result.right));
            });
        }
        private static class Result {
            private int left;
            private int right;
        }

        private static void f(int x, IntConsumer dealWithResult) {
            dealWithResult.accept(f(x));
        }

        private static void g(int x, IntConsumer dealWithResult) {
            dealWithResult.accept(g(x));
        }

        private static int f(int x) {
            return x * 2;
        }
        private static int g(int x) {
            return x + 1;
        }
    }

    // 2674
    // 4012
    ```
- 그러나 위처럼 실행할 시 결과가 달라진다. f와 g의 호출 합계를 정확하게 출력하지 않고 상황에 따라 먼저 계산된 결과를 출력한다. 이러한 문제에 대한 두가지 답이 있다.
    - if-then-else를 이용해 적절한 락을 걸어서 계산하고 `println`을 호출한다.
    - 리액티브 스타일 API는 일련의 이벤트에 반응하기 위해 사용하는 것이지 단일 결과를 위해 사용하기엔 부적합하다. 이런 경우는 `Future`가 더 적절하다.