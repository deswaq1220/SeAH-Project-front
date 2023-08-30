

export default function Inspector(){
  return(
    <div className=" flex flex-col   ">
      <div className="">
        <input
          type="text"
          name="Employeenumber"
          id="Employeenumber"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
          placeholder="사원번호"
        />
      </div>
      <div className="my-2">
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
          placeholder="이름"
        />
      </div>
      <div className="">
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
          placeholder="세아@seah.co.kr"
        />
      </div>
    </div>
  )
}