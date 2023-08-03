import {useParams} from "react-router-dom";

export default function Facilityname() {
  const { masterdataFacility } = useParams();       // url 설비 파라미터

  return(
    <div id="Facilityname" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          설비명
        </span>
        <div className="sm:col-span-3">
          <label
            htmlFor="Facilityname"
            className="block text-sm font-medium leading-6 text-gray-900"
          ></label>
          <div className="mt-2">
            <input
              type="text"
              name="Facilityname"
              id="Facilityname"
              // placeholder="직접집진기(900m2/min)"
              // autoComplete=""
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
              value = {masterdataFacility}
              readOnly
            />
          </div>
        </div>
      </div>
  )
}