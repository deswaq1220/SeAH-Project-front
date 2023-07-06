import "../style/ManagerLogin.css";
function ManagerLogin() {
  return (
    <div>
      <div id="wrap">
          <div className="center">
          <div className="logo"></div>
        <form>
          <input type="password" placeholder="비밀번호를 입력하세요" className="pw"></input>
          <button type="submit" className="login">로그인</button>
        </form>
          </div>
      </div>
    </div>
  );
}
export default ManagerLogin;
