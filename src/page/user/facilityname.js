import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Facilityname(onFormDataChange) {
 const { masterdataPart } = useParams(); // url 영역 파라미터
 const { masterdataId } = useParams(); // url 설비코드 파라미터
 const [masterdataFacility, setMasterdataFacility] = useState(""); // 설비이름


 // 위험분류 get
 useEffect(() => {
  function specialDangerFetchDataWithAxios(masterdataPart, masterdataId) {
   axios
       .get(`${process.env.REACT_APP_API_BASE_URL}/user/special/new/${masterdataPart}/${masterdataId}`)   // 세아
       .then((response) => {
        const facilityFromBack = response.data.facilityName;
        setMasterdataFacility(facilityFromBack); // 설비코드에 따른 설비명
       })
       .catch((error) => {
        console.error("Error fetching data: ", error);
       });
  }

  specialDangerFetchDataWithAxios(masterdataPart, masterdataId);
 }, [masterdataPart, masterdataId]);



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
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
              value={masterdataFacility}
              readOnly
            />
          </div>
        </div>
      </div>
  )
}