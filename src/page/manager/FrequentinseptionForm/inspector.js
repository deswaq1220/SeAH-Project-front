// 점검자
export default function Inspector() {
  return (
    <>
      <div id="inspector" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          점검자
        </span>
        <div className="sm:col-span-3">
          <div className="mt-2">
            <input
              type="text"
              name="inspector"
              id="inspector"
              autoComplete="off"
              placeholder="사원번호"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
          </div>
        </div>
        <div className="sm:col-span-3 ml-2">
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              placeholder="이름"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 "
            />
          </div>
        </div>
      </div>
    </>
  );
}
