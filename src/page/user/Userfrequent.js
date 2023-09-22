import UserHeader from "../../components/UserHeader";
import { Link, useNavigate } from "react-router-dom";
//import { CheckCircleIcon } from "@heroicons/react/20/solid";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import userSafetyEduAttendance from "./UserSafetyEduAttendance";

export default function Userfrequent() {
  // qr 정보따라 url 파라미터 세팅되어야됨
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataId } = useParams(); // url 설비id 파라미터
  const [masterdataFacility, setMasterdataFacility] = useState("");  // 설비명
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();

  // Json값 가져와서 세팅
  useEffect(() => {
    function fetchDataWithAxios(masterdataPart, masterdataId) {
      axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/user/special/list/${masterdataPart}/${masterdataId}`) //세아
          .then((response) => {
            const dataFromBackend = response.data.listOfFac;
            const facilityFromBack = response.data.facilityName;
            setMasterdataFacility(facilityFromBack);

            // 백엔드에서 받은 데이터를 가공하여 people 배열 생성
            const peopleData = dataFromBackend.map((item) => {
              // 점검일 format 변환
              const dateObj = new Date(item.speDate);
              const formatDate = format(dateObj, "yyyy-MM-dd");
              // 완료일 format 변환
              let formatActDate = null;
              if (item.speActDate !== null) {
                const actDateObj = new Date(item.speActDate);
                formatActDate = format(actDateObj, "yyyy-MM-dd");
              }

              return {
                speId: item.speId,
                date: `[${formatDate}]`, // 등록날짜
                name: `[${item.spePerson}]`, // 점검자
                actName: `[${item.speActPerson}]`, // 조치자
                actDate: formatActDate === null ? "[]" : `[${formatActDate}]`, // 조치일자
                content: item.speContent, // 점검내용
                action: item.speActContent, // 조치요청내용
                icon: item.speComplete === "OK" ? CheckCircleIcon : XCircleIcon,
              };
            });
            setPeople(peopleData);

          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
    }

    fetchDataWithAxios(masterdataPart, masterdataId);
  }, []);


  return (
      <div className="container mx-auto sm:px-6 lg:px-8">
        <UserHeader />
        <div className="px-4">
          <p className="font-bold text-xl mb-2">수시점검</p>
          <div className="flex flex-wrap gap-2">
            <label htmlFor="output" className="sr-only"></label>
            <input
                type="text"
                name="output"
                id="output"
                className="block w-auto rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-4 mr-2"
                value={`${masterdataPart}/${masterdataFacility}`}
                readOnly
            />

            {/*수시점검 등록하기 클릭 시 등록페이지 이동*/}
            <Link to={`/special/new/${masterdataPart}/${masterdataId}`}>
              <button
                  type="button"
                  className="inline-flex items-center gap-x-2 rounded-md bg-seahColor px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
              >
                <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                수시점검 등록하기
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                <tr>
                  <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    조치여부
                  </th>
                  <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    점검자/조치자
                  </th>
                  <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    점검/조치 내용
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person) => (
                    <tr
                        key={person.speId}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          // 해당 줄을 클릭하면 상세 페이지로 이동
                          navigate(`/special/detail/${person.speId}`);
                        }}
                    >
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            <person.icon
                                className={
                                  person.icon === XCircleIcon
                                      ? "text-red-600"
                                      : "text-green-600"
                                }
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {person.date}
                            </div>
                            <div className="mt-1 text-gray-500">
                              {person.actDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="text-gray-900">{person.name}</div>
                        <div className="mt-1 text-gray-500">{person.actName}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="text-gray-900">{person.content}</div>
                        <div className="mt-1 text-gray-500">{person.action}</div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}