import { HomeIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate } from "react-router-dom"; // React Router import 수정
const pages = [
  { name: "점검현황", href: "#", current: false },
  { name: "수시점검", href: "#", current: true },
];

export default function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동 함수 가져오기

  // 홈 아이콘을 클릭하여 이전 페이지로 이동
  const handleHomeIconClick = () => {
    navigate(-1); // -1을 전달하여 이전 페이지로 이동
  };

  return (
    <nav className="flex px-6 mt-4 justify-start" aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex space-x-4 rounded-md bg-white px-6 shadow"
      >
        <li className="flex">
          <div className="flex items-center">
            <button
              onClick={handleHomeIconClick}
              className="text-gray-400 hover:text-gray-500"
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </button>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
                style={{ cursor: "default" }}
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <p
                href={page.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
