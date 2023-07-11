import "../style/ManagerLogin.css";
function ManagerLogin() {
  return (
    <div>
      <div id="wrap">
        <div className="center">
          <div className="logo"></div>
          <form id="loginform"className="space-y-6" action="#" method="POST">
            <div>
              <div className="flex items-center justify-between"></div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="block w-96 h-14  border-b-1 py-1.5 placeholder:text-gray-400  focus:ring-seahColor p-3"
                />
              </div>
            </div>

            <div>
              <button
                id="loginbtn"
                type="submit"
                className="flex w-96 h-14 justify-center items-center rounded-md bg-seahColor px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                로그인
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
export default ManagerLogin;
