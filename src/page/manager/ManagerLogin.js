import "../../style/ManagerLogin.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManagerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // 여기에 로그인 처리 로직을 추가합니다. 아이디와 비밀번호가 일치하면 navigate 함수를 사용하여 /manager로 이동합니다.
    if (username === "admin" && password === "seah1234") {
      navigate("/manager");
    } else {
      alert("로그인 실패")
    }
  };

  return (
      <div>
        <div id="wrap">
          <div className="center">
            <div className="logo"></div>
            <form
                id="loginform"
                className="space-y-6"
                action="#"
                method="POST"
                onSubmit={handleLogin} // 폼 제출 시 handleLogin 함수를 실행합니다.
            >
              <div>
                <div className="flex items-center justify-between"></div>
                <div className="mt-2">
                  <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="아이디를 입력하세요"
                      required
                      className="block w-96 h-14  border-b-1 py-1.5 placeholder:text-gray-400  focus:ring-seahColor p-3"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} // 입력 값이 변경될 때마다 setUsername 함수를 호출하여 상태를 업데이트합니다.
                  />
                </div>
                <div className="mt-2">
                  <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="비밀번호를 입력하세요"
                      required
                      className="block w-96 h-14  border-b-1 py-1.5 placeholder:text-gray-400  focus:ring-seahColor p-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // 입력 값이 변경될 때마다 setPassword 함수를 호출하여 상태를 업데이트합니다.
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