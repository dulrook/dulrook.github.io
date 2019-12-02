---
layout: splash
title:  "2019-12-02-[모던자바인액션] CompletableFuture와 리액티브 프로그래밍 컨셉의 기초"
date:   2019-12-02 23:27:00 +0900
categories: 자바
---

## 필터링
1. Predicate 필터링
    - 스트림 인터페이스에서 제공하는 filter메서드는 *predicate*를 인수로 받아서, *predicate*과 일치하는 요소들을 스트림으로 리턴한다.
    ```java
    List<Dish> vegetarianMenu = menu.stream()
                                    .filter(Dish::isVegetarian)
                                    .collect(toList());
    ```
2. 고유 요소 필터링
    - 스트림은 unique 요소들만 포함하는 스트림을 반환하는 `distinct` 메서드를 제공한다.
    ```java
    List<Integer> numbers = Arrays.asList(1, 2, 1, 2, 3, 2, 4);
    numbers.stream()
            .filter(i -> i % 2 == 0) // 2, 2, 4
            .distinct() // 2, 4
            .forEach(System.out::println);
    ```

## 스트림 슬라이싱
1. Predicate를 이용한 슬라이싱
    - `takeWhile`
        ```java
        /**
        * Returns, if this stream is ordered, a stream consisting of the remaining
        * elements of this stream after dropping the longest prefix of elements
        * that match the given predicate.  Otherwise returns, if this stream is
        * unordered, a stream consisting of the remaining elements of this stream
        * after dropping a subset of elements that match the given predicate.
        *
        * <p>If this stream is ordered then the longest prefix is a contiguous
        * sequence of elements of this stream that match the given predicate.  The
        * first element of the sequence is the first element of this stream, and
        * the element immediately following the last element of the sequence does
        * not match the given predicate.
        *
        * <p>If this stream is unordered, and some (but not all) elements of this
        * stream match the given predicate, then the behavior of this operation is
        * nondeterministic; it is free to drop any subset of matching elements
        * (which includes the empty set).
        *
        * <p>Independent of whether this stream is ordered or unordered if all
        * elements of this stream match the given predicate then this operation
        * drops all elements (the result is an empty stream), or if no elements of
        * the stream match the given predicate then no elements are dropped (the
        * result is the same as the input).
        *
        * <p>This is a <a href="package-summary.html#StreamOps">stateful
        * intermediate operation</a>.
        *
        * @implSpec
        * The default implementation obtains the {@link #spliterator() spliterator}
        * of this stream, wraps that spliterator so as to support the semantics
        * of this operation on traversal, and returns a new stream associated with
        * the wrapped spliterator.  The returned stream preserves the execution
        * characteristics of this stream (namely parallel or sequential execution
        * as per {@link #isParallel()}) but the wrapped spliterator may choose to
        * not support splitting.  When the returned stream is closed, the close
        * handlers for both the returned and this stream are invoked.
        *
        * @apiNote
        * While {@code dropWhile()} is generally a cheap operation on sequential
        * stream pipelines, it can be quite expensive on ordered parallel
        * pipelines, since the operation is constrained to return not just any
        * valid prefix, but the longest prefix of elements in the encounter order.
        * Using an unordered stream source (such as {@link #generate(Supplier)}) or
        * removing the ordering constraint with {@link #unordered()} may result in
        * significant speedups of {@code dropWhile()} in parallel pipelines, if the
        * semantics of your situation permit.  If consistency with encounter order
        * is required, and you are experiencing poor performance or memory
        * utilization with {@code dropWhile()} in parallel pipelines, switching to
        * sequential execution with {@link #sequential()} may improve performance.
        *
        * @param predicate a <a href="package-summary.html#NonInterference">non-interfering</a>,
        *                  <a href="package-summary.html#Statelessness">stateless</a>
        *                  predicate to apply to elements to determine the longest
        *                  prefix of elements.
        * @return the new stream
        * @since 9
        */
        default Stream<T> dropWhile(Predicate<? super T> predicate) {
            Objects.requireNonNull(predicate);
            // Reuses the unordered spliterator, which, when encounter is present,
            // is safe to use as long as it configured not to split
            return StreamSupport.stream(
                    new WhileOps.UnorderedWhileSpliterator.OfRef.Dropping<>(spliterator(), true, predicate),
                    isParallel()).onClose(this::close);
        }
        ```

    - `dropWhile`
        ```java
        /**
        * Returns, if this stream is ordered, a stream consisting of the remaining
        * elements of this stream after dropping the longest prefix of elements
        * that match the given predicate.  Otherwise returns, if this stream is
        * unordered, a stream consisting of the remaining elements of this stream
        * after dropping a subset of elements that match the given predicate.
        *
        * <p>If this stream is ordered then the longest prefix is a contiguous
        * sequence of elements of this stream that match the given predicate.  The
        * first element of the sequence is the first element of this stream, and
        * the element immediately following the last element of the sequence does
        * not match the given predicate.
        *
        * <p>If this stream is unordered, and some (but not all) elements of this
        * stream match the given predicate, then the behavior of this operation is
        * nondeterministic; it is free to drop any subset of matching elements
        * (which includes the empty set).
        *
        * <p>Independent of whether this stream is ordered or unordered if all
        * elements of this stream match the given predicate then this operation
        * drops all elements (the result is an empty stream), or if no elements of
        * the stream match the given predicate then no elements are dropped (the
        * result is the same as the input).
        *
        * <p>This is a <a href="package-summary.html#StreamOps">stateful
        * intermediate operation</a>.
        *
        * @implSpec
        * The default implementation obtains the {@link #spliterator() spliterator}
        * of this stream, wraps that spliterator so as to support the semantics
        * of this operation on traversal, and returns a new stream associated with
        * the wrapped spliterator.  The returned stream preserves the execution
        * characteristics of this stream (namely parallel or sequential execution
        * as per {@link #isParallel()}) but the wrapped spliterator may choose to
        * not support splitting.  When the returned stream is closed, the close
        * handlers for both the returned and this stream are invoked.
        *
        * @apiNote
        * While {@code dropWhile()} is generally a cheap operation on sequential
        * stream pipelines, it can be quite expensive on ordered parallel
        * pipelines, since the operation is constrained to return not just any
        * valid prefix, but the longest prefix of elements in the encounter order.
        * Using an unordered stream source (such as {@link #generate(Supplier)}) or
        * removing the ordering constraint with {@link #unordered()} may result in
        * significant speedups of {@code dropWhile()} in parallel pipelines, if the
        * semantics of your situation permit.  If consistency with encounter order
        * is required, and you are experiencing poor performance or memory
        * utilization with {@code dropWhile()} in parallel pipelines, switching to
        * sequential execution with {@link #sequential()} may improve performance.
        *
        * @param predicate a <a href="package-summary.html#NonInterference">non-interfering</a>,
        *                  <a href="package-summary.html#Statelessness">stateless</a>
        *                  predicate to apply to elements to determine the longest
        *                  prefix of elements.
        * @return the new stream
        * @since 9
        */
        default Stream<T> dropWhile(Predicate<? super T> predicate) {
            Objects.requireNonNull(predicate);
            // Reuses the unordered spliterator, which, when encounter is present,
            // is safe to use as long as it configured not to split
            return StreamSupport.stream(
                    new WhileOps.UnorderedWhileSpliterator.OfRef.Dropping<>(spliterator(), true, predicate),
                    isParallel()).onClose(this::close);
        }
        ```

2. 스트림 축소
    - 스트림은 `limit(n)` 메서드를 제공하여, 주어진 사이즈 이하의 스트림을 리턴하도록한다.
    ```java
    /* Stream.java */
    /**
     * Returns a stream consisting of the elements of this stream, truncated
     * to be no longer than {@code maxSize} in length.
     *
     * <p>This is a <a href="package-summary.html#StreamOps">short-circuiting
     * stateful intermediate operation</a>.
     *
     * @apiNote
     * While {@code limit()} is generally a cheap operation on sequential
     * stream pipelines, it can be quite expensive on ordered parallel pipelines,
     * especially for large values of {@code maxSize}, since {@code limit(n)}
     * is constrained to return not just any <em>n</em> elements, but the
     * <em>first n</em> elements in the encounter order.  Using an unordered
     * stream source (such as {@link #generate(Supplier)}) or removing the
     * ordering constraint with {@link #unordered()} may result in significant
     * speedups of {@code limit()} in parallel pipelines, if the semantics of
     * your situation permit.  If consistency with encounter order is required,
     * and you are experiencing poor performance or memory utilization with
     * {@code limit()} in parallel pipelines, switching to sequential execution
     * with {@link #sequential()} may improve performance.
     *
     * @param maxSize the number of elements the stream should be limited to
     * @return the new stream
     * @throws IllegalArgumentException if {@code maxSize} is negative
     */
    Stream<T> limit(long maxSize);

    /* ReferencePipeline.java*/
    @Override
    public final Stream<P_OUT> limit(long maxSize) {
        if (maxSize < 0)
            throw new IllegalArgumentException(Long.toString(maxSize));
        return SliceOps.makeRef(this, 0, maxSize);
    }
    ```

3. 스킵
    - 스트림은 `skip(n)` 메서드를 제공하여, 처음 n개의 요소를 건너뛰고 처리된 스트림을 리턴하도록한다. 
    ```java
    /* Stream.java */
    /**
     * Returns a stream consisting of the remaining elements of this stream
     * after discarding the first {@code n} elements of the stream.
     * If this stream contains fewer than {@code n} elements then an
     * empty stream will be returned.
     *
     * <p>This is a <a href="package-summary.html#StreamOps">stateful
     * intermediate operation</a>.
     *
     * @apiNote
     * While {@code skip()} is generally a cheap operation on sequential
     * stream pipelines, it can be quite expensive on ordered parallel pipelines,
     * especially for large values of {@code n}, since {@code skip(n)}
     * is constrained to skip not just any <em>n</em> elements, but the
     * <em>first n</em> elements in the encounter order.  Using an unordered
     * stream source (such as {@link #generate(Supplier)}) or removing the
     * ordering constraint with {@link #unordered()} may result in significant
     * speedups of {@code skip()} in parallel pipelines, if the semantics of
     * your situation permit.  If consistency with encounter order is required,
     * and you are experiencing poor performance or memory utilization with
     * {@code skip()} in parallel pipelines, switching to sequential execution
     * with {@link #sequential()} may improve performance.
     *
     * @param n the number of leading elements to skip
     * @return the new stream
     * @throws IllegalArgumentException if {@code n} is negative
     */
    Stream<T> skip(long n);

    /* ReferencePipeline.java*/
    @Override
    public final Stream<P_OUT> skip(long n) {
        if (n < 0)
            throw new IllegalArgumentException(Long.toString(n));
        if (n == 0)
            return this;
        else
            return SliceOps.makeRef(this, n, -1);
    }
    ```

## 매핑
특정한 객체들로부터 정보를 선택하는 것은 일반적인 데이터 처리에서 가장 흔한 일이다. 예를 들어, SQL에서는 테이블로부터 특정 칼럼을 선택할 수 있다. 스트림 API는 유사한 기능을 `map`과 `flatMap` 메서드를 통해 제공한다.

1. 스트림의 각 요소에 함수 적용하기
스트림은 함수를 인자로 받는 `map` 메서드를 지원한다. 함수는 각 요소에 적용되어, 요소들은 새로운 요소로 매핑된다. 예를 들어, 다음 코드는 메서드 참조로 `Dish::getName`을 `map` 메서드에 전달하여 스트림 내에 요리들의 이름을 추출해낸다. 

    ```java
    List<String> dishNames = menu.stream()
                                .map(Dish::getName)
                                .collect(toList());
    ```

    ```java
    /**
     * Returns a stream consisting of the results of applying the given
     * function to the elements of this stream.
     *
     * <p>This is an <a href="package-summary.html#StreamOps">intermediate
     * operation</a>.
     *
     * @param <R> The element type of the new stream
     * @param mapper a <a href="package-summary.html#NonInterference">non-interfering</a>,
     *               <a href="package-summary.html#Statelessness">stateless</a>
     *               function to apply to each element
     * @return the new stream
     */
    <R> Stream<R> map(Function<? super T, ? extends R> mapper);
    ```

2. 스트림 납작하게 만들기
["Hello", "World"] 를 ["H","e","l","o","W","r","d"] 와 같은 고유한 문자들의 리스트로 만드려면 `flatmap` 메서드를 사용해야한다.
    ```java
    List<String> uniqueChars = words.stream()
                                    .map(word -> word.split(""))
                                    .flatMap(Arrays::stream)
                                    .distinct()
                                    .collect(toList());

    ```
    <img src="https://github.com/dulrook/dulrook.github.io/blob/master/assets/images/flatmap.PNG?raw=true">


    ```java
     /**
     * Returns a stream consisting of the results of replacing each element of
     * this stream with the contents of a mapped stream produced by applying
     * the provided mapping function to each element.  Each mapped stream is
     * {@link java.util.stream.BaseStream#close() closed} after its contents
     * have been placed into this stream.  (If a mapped stream is {@code null}
     * an empty stream is used, instead.)
     *
     * <p>This is an <a href="package-summary.html#StreamOps">intermediate
     * operation</a>.
     *
     * @apiNote
     * The {@code flatMap()} operation has the effect of applying a one-to-many
     * transformation to the elements of the stream, and then flattening the
     * resulting elements into a new stream.
     *
     * <p><b>Examples.</b>
     *
     * <p>If {@code orders} is a stream of purchase orders, and each purchase
     * order contains a collection of line items, then the following produces a
     * stream containing all the line items in all the orders:
     * <pre>{@code
     *     orders.flatMap(order -> order.getLineItems().stream())...
     * }</pre>
     *
     * <p>If {@code path} is the path to a file, then the following produces a
     * stream of the {@code words} contained in that file:
     * <pre>{@code
     *     Stream<String> lines = Files.lines(path, StandardCharsets.UTF_8);
     *     Stream<String> words = lines.flatMap(line -> Stream.of(line.split(" +")));
     * }</pre>
     * The {@code mapper} function passed to {@code flatMap} splits a line,
     * using a simple regular expression, into an array of words, and then
     * creates a stream of words from that array.
     *
     * @param <R> The element type of the new stream
     * @param mapper a <a href="package-summary.html#NonInterference">non-interfering</a>,
     *               <a href="package-summary.html#Statelessness">stateless</a>
     *               function to apply to each element which produces a stream
     *               of new values
     * @return the new stream
     */
    <R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper);
    ```

## 검색과 매칭
데이터 처리에서 또다른 일반적인 연산은 주어진 자료에서 일치하는 데이터를 찾아내는 '검색'이다.  스트림 API는 검색 기능을 다음과 같은 `allMatch, anyMatch, noneMatch, findFirst, findAny`와 같은 메서드를 통해 제공한다.
1. Predicate가 적어도 하나의 요소와 일치하는지를 확인
    ```java
    if(menu.stream().anyMatch(Dish::isVegetarian)) {
        System.out.println("The menu is (somewhat) vegetarian friendly!!");
    }
    ```

2. Predicate가 모든 원소와 일치하는지를 확인
    ```java
    boolean isHealthy = menu.stream()
                            .allMatch(dish -> dish.getCalories() < 1000);
    ```

    **NONEMATCH**
    `noneMatch`는 `allMatch`와 정반대되는결과를 리턴한다. 이 메서드는 스트림 내에서 주어진 predicate에 대해 어떠한 요소도 일치하지 않음을 확인한다. 
    ```java
    boolean isHealthy = menu.stream()
                            .noneMatch(d -> d.getCalories() >= 1000);
    ```

3. 요소 검색
`findAny` 메서드는 현재의 스트림에서 임의의 요소를 리턴한다. 스트림 파이프라인은 스스로 최적화된 연산을 수행하여 short-circuiting을 사용해 결과를 찾고 끝낸다.
    ```java
    Optional<Dish> dish = menu.stream()
                            .filter(Dish::isVegetarian)
                            .findAny();
    ```

4. 첫 번째 요소 찾기
    ```java
    List<Integer> someNumbers = Arrays.asList(1, 2, 3, 4, 5);
    Optional<Integer> firstSquareDivisibleByThree = someNumbers.stream()
                                                                .map(n -> n * n)
                                                                .filter(n -> n % 3 == 0)
                                                                .findFirst(); // 9
    ```

    > **findFirst와 findAny는 언제사용해야할까?**
    답은 병렬성이다. 첫번째 원소를 찾는 것은 병렬 연산에서 더욱 제한적이다. 어떠한 원소가 리턴되는지 상관없다면, `findAny`를 사용해라. 왜냐면 이 메서드는 병렬 스트림을 사용할 때 덜 제약적이기 때문이다. 

## 리듀싱
스트림 내에 모든 요소들을 반복적으로 결합하여 단일 값으로 만드는 쿼리를 *reduction operations* 라고 한다. 즉, 스트림이 하나의 값으로 리듀스된것이다. 
    ```java
    int sum = numbers.stream().reduce(0, (a,b) -> a+b);
    ```
`reduce`는 두 개의 인자를 갖는다:
    - 초기값, 여기서는 0
    - 두 요소를 결합하고 하나의 새로운 값을 만들어내는 `BinaryOperator<T>`; 여기서는 람다 (a, b) -> a + b를 사용하였다.
    
