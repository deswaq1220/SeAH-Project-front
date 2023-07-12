import { Link } from "react-router-dom"
export default function Error() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">준비중입니다</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/manager"
              className="rounded-md bg-seahColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDepp focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              메인으로가기
            </Link>
            {/* 아마 링크부분은 조건문써서 관리자계정인지 일반사용자인지 따져서 메인으로 이동하는 페이지를 다를게 해야할듯 */}
            <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

