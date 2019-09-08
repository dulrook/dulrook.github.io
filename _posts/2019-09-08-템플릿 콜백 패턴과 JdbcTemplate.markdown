---
layout: splash
title:  "템플릿 콜백 패턴과 JdbcTemplate"
date:   2019-09-08 11:07:00 +0900
categories: 디자인패턴
---

## [템플릿/콜백]
* 개방 폐쇄 원칙(OCP): 코드에서 어떤 부분은 변경을 통해 해당 기능이 다양해지고 확장하려는 성질이 있고, 어떤 부분은 고정되어 있어 변하지 않으려는 성질이 있음
* 템플릿이란 코드에서 변경이 거의 일어나지 않으며 일정한 패턴으로 유지되는 특성을 가지는 부분을 독립시킨 것
* 분리와 재사용을 위한 디자인 패턴 적용
  * 메소드 추출 : 가장 먼저 생각해 볼 수 있는 방법으로써 중복되는 코드를 메소드로 분리한다.
  * 템플릿 메소드 패턴의 적용 : 템플릿 메소드 패턴은 상속을 통해 기능을 확장해서 사용하는데에 사용된다. 변하지 않는 부분은 슈퍼클래스에 두고  변하는 부분은 추상 메소드로 정의해둬서 서브 클래스에서 오버라이드하여 새롭게 정의하도록 하는 것이다.
    * 장점 
      * 기능을 확장하고 싶을때마다 상속을 통해 자유롭게 확장 가능
      * OCP원칙을 지킬 수 있음
    * 단점
      * 기능을 확장할때마다 상속을 통해 새로운 클래스를 만들어야 함
      * 확장구조가 이미 클래스를 설계하는 시점에서 고정됨
  * 전략 패턴의 적용 : 확장에 해당하는 변하는 부분을 별도의 클래스로 만들어 추상화된 인터페이스를 통해 위임하는 방식이다. 변하지 않는 작업 부분, 즉 일정한 구조를 유지하며 동작되는 부분이 컨텍스트에 해당이되고, 컨텍스트는 특정 기능 확장을 위해 전략 인터페이스를 통해 외부의 독립된 전략 클래스에 위임한다.
* 전략 패턴의 컨텍스트를 템플릿이라 부르고, 익명 내부 클래스로 만들어지는 오브젝트를 콜백이라고 부른다. 템플릿은 고정된 작업 흐름을 가진 코드를 재사용한다는 의미에서 붙인 이름이며, 콜백은 템플릿 안에서 호출되는 것을 목적으로 만들어지는 오브젝트를 말한다.
  * 여러 개의 메소드를 가진 일반적인 인터페이스를 사용할 수 있는 전략 패턴의 전략과 달리 템플릿/콜백 패턴의 콜백은 보통 단일 메소드 인터페이스를 사용한다.
  * 콜백 인터페이스의 메소드에는 보통 파라미터가 있어서 이 파라미터를 통해 템플릿의 작업 흐름 중에 만들어지는 컨텍스트 정보를 전달받을 때 사용한다.

    ![1](https://user-images.githubusercontent.com/47546079/57600338-81838300-7594-11e9-98bc-dfd08363979a.png)

  * 클라이언트의 역할은 템플릿 안에서 실행될 로직을 담은 콜백 오브젝트를 만들고, 콜백이 참조할 정보를 제공한다. 만들어진 콜백은 클라이언트가 템플릿을 호출할 때 파라미터로 전달된다.
  * 템플릿은 정해진 흐름대로 작업을 진행하다가 내부에서 생성한 참조 정보를 가지고 콜백 오브젝트의 메소드를 호출한다. 콜백은 클라이언트 메소드에 있는 정보와 템플릿이 제공한 참조 정보를 이용해서 작업을 수행하고 그 결과를 다시 템플릿에 리턴한다.
  * 템플릿은 콜백이 돌려준 정보를  사용해서 작업을 마무리한다. 경우에 따라 결과를 클라이언트에 리턴하기도 한다.


## [JdbcTemplate]
* 스프링은 JDBC를 이용하는 DAO에서 사용할 수 있도록 준비된 다양한 템플릿과 콜백을 제공한다. 스프링이 제공하는 JDBC 코드용 기본 템플릿이 JdbcTemplate이다.
* update()
    ```java
    //UserDao.java
    public void deleteAll() {
            this.jdbcTemplate.update("delete from users");
        }
    //JdbcTemplate.class
    public int update(final String sql) throws DataAccessException {
            Assert.notNull(sql, "SQL must not be null");
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("Executing SQL update [" + sql + "]");
            }
 
            class UpdateStatementCallback implements StatementCallback<Integer>, SqlProvider {
                UpdateStatementCallback() {
                }
 
               public Integer doInStatement(Statement stmt) throws SQLException {
                    int rows = stmt.executeUpdate(sql);
                    if (JdbcTemplate.access$1(JdbcTemplate.this).isDebugEnabled()) {
                        JdbcTemplate.access$1(JdbcTemplate.this).debug("SQL update affected " + rows + " rows");
                    }
 
                    return rows;
                }
 
                public String getSql() {
                    return sql;
                }
            }
 
            return (Integer)this.execute((StatementCallback)(new UpdateStatementCallback()));
        }
 
 
    public <T> T execute(StatementCallback<T> action) throws DataAccessException {
            Assert.notNull(action, "Callback object must not be null");
            Connection con = DataSourceUtils.getConnection(this.getDataSource());
            Statement stmt = null;
 
            Object var8;
            try {
                Connection conToUse = con;
                if (this.nativeJdbcExtractor != null && this.nativeJdbcExtractor.isNativeConnectionNecessaryForNativeStatements()) {
                    conToUse = this.nativeJdbcExtractor.getNativeConnection(con);
                }
 
                stmt = conToUse.createStatement();
                this.applyStatementSettings(stmt);
                Statement stmtToUse = stmt;
                if (this.nativeJdbcExtractor != null) {
                    stmtToUse = this.nativeJdbcExtractor.getNativeStatement(stmt);
                }
 
                T result = action.doInStatement(stmtToUse);
                this.handleWarnings(stmt);
                var8 = result;
            } catch (SQLException var11) {
                JdbcUtils.closeStatement(stmt);
                stmt = null;
                DataSourceUtils.releaseConnection(con, this.getDataSource());
                con = null;
                throw this.getExceptionTranslator().translate("StatementCallback", getSql(action), var11);
            } finally {
                JdbcUtils.closeStatement(stmt);
                DataSourceUtils.releaseConnection(con, this.getDataSource());
            }
 
            return var8;
        }
    ```