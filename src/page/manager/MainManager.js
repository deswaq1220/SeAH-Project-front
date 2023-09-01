import "../../style/Main.css";
import safety from "../../img/safety.png";
import worker from "../../img/worker2.png";
import mark from "../../img/x-mark.png";
import logo from "../../img/logo.png";
// import bannerImage from "../img/main_movie_bg.jpg"
import info from "../../img/personal-profile.png";
import axios from "axios";
import fetcher from "../../api/fetcher";
import { useState } from "react";
import { useCookies } from "react-cookie"; // useCookies import
import { getMonth, getYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Mainmanager() {
  const products = [
    {
      id: 1,
      name: "안전교육",
      href: "/admin/eduMain",
      imageSrc: safety,
      imageAlt: "안전교육",
    },
    {
      id: 2,
      name: "안전점검",
      href: "/user/inspection",
      imageSrc: worker,
      imageAlt: "안전점검",
    },
    {
      id: 3,
      name: "기준정보관리",
      href: "/admin/reginfo",
      imageSrc: info,
      imageAlt: "준비중",
    },
    {
      id: 4,
      name: "준비중",
      href: "/404",
      imageSrc: mark,
      imageAlt: "준비중",
    },

    // More products...
  ];

  // const [atCookies, setAtCookie] = useCookies(["at"]); // 엑세스 토큰 쿠키
  // const [rtCookies, setrtCookie] = useCookies(["rt"]); // 리프레시 토큰 쿠키

  const [currentDate, setCurrentDate] = useState(new Date()); // 년,월
  const navigate = useNavigate();

  const handleProductClick = async (e, href, id) => {
    e.preventDefault();

    try {
      // const authToken = atCookies["at"]; // 사용자의 인증 토큰을 가져옵니다.

      const authToken = localStorage.getItem("access_token");
      if (authToken !== "") {
        const requestConfig = {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        };

        // 아이템의 id가 1인 경우에만 year와 month 파라미터 추가
        if (id === 1) {
          const currentMonth = getMonth(currentDate) + 1; // 월은 0부터 시작하므로 1을 더해줌
          const currentYear = getYear(currentDate);
          requestConfig.params = {
            year: currentYear,
            month: currentMonth,
          };
        }

        const response = await fetcher.get(href, requestConfig);

        // 필요하면 navigate 함수를 사용하여 라우트 변경 가능합니다
        navigate(href);
      } else {
        // 로그인 페이지로 이동하도록 처리하거나 에러 메시지를 보여줄 수 있습니다.
      }
    } catch (error) {
      // 에러 처리: 에러를 처리합니다.
      navigate("/login");
      toast.error("로그인이 만료되었습니다.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: {
          marginTop: "5rem", // 원하는 세로 위치로 조정
        },
      });
      console.error("에러:", error);
    }
  };

  return (
    <div id="wrap2">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
          <div className="logoeara mt-4">
            <img src={logo} className="w-80 " />
            <p className=" text-seahColor text-lg ">
              안전도 <b>SeAH</b>답게!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <div className="col-span-full">
              <div className="banner">
                <div className="bannerText">
                  <p className="text1">
                    고객과 함께 성장하는 메탈 산업의 Hidden Champion
                  </p>
                  <p className="text2">
                    ㈜세아항공방산소재는 전세계 시장을 위한 방위 산업, 한공우주
                    및 산업용으로 사용되는 고력합금 알루미늄을 생산합니다
                  </p>
                </div>
              </div>
            </div>
            {products.map((product, index) => (
              <a
                key={product.id}
                href={product.href}
                className="group"
                onClick={(e) => handleProductClick(e, product.href, product.id)}
              >
                <div
                  className={`aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7 shadow ${
                    index % 2 === 0 ? "col-span-2" : "col-span-1"
                  }`}
                >
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full m-0 object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h2 className="mt-4 text-xl text-gray-700 text-center font-semibold">
                  {product.name}
                </h2>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainmanager;
