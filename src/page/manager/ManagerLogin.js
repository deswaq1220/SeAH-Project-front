import "../../style/ManagerLogin.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../img/logo.png";
import { toast } from "react-toastify";

function ManagerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // 여기에 로그인 처리 로직을 추가합니다. 아이디와 비밀번호가 일치하면 navigate 함수를 사용하여 /manager로 이동합니다.

    const data = {
      "loginId": username,
      "loginPw": password
    };
    sessionStorage.setItem('username', username);

    axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/admin/confirm`, data)
        .then((response) => {


          const approvalStatus = response.data;

          if (approvalStatus.includes("approval") && approvalStatus.includes("admin")) {
            sessionStorage.setItem('approval', "approval");
            sessionStorage.setItem('adminOnly', "adminOnly");

            setTimeout(() => {
              navigate("/manager");
            }, 500); // 1000ms (1초) 지연
          } else if(approvalStatus.includes("approval") && approvalStatus.includes("guest")){
            sessionStorage.setItem('approval', "approval");

            setTimeout(() => {
              navigate("/eduMain");
            }, 500);

          } else {
            toast.error(
                <>
                  <p className="font-bold text-red-700">로그인 실패!</p>
                  <p>아이디 또는 비밀번호를 확인해주세요</p>
                </>,
                {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: true,
                }
            );
          }
        })
        .catch((error) => {
          console.error("로그인 오류: ", error);
        });

  };


  return (
      <>

        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src={logo} className="mx-auto h-10 w-auto" />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              반갑습니다 관리자님!
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                  아이디
                </label>
                <div className="mt-2">
                  <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="아이디를 입력하세요"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    비밀번호
                  </label>
                  <div className="text-sm"></div>
                </div>
                <div className="mt-2">
                  <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="비밀번호를 입력하세요"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-seahColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                    onClick={handleLogin}
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
  );
}

export default ManagerLogin;