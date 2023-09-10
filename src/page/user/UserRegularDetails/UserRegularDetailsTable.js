import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import FaultyModal from "../UserRegularReg/FaultyModal";
import UserHeader from "../../../components/UserHeader";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserRegularDetailsOutput from "./UserRegularDetailsOutput";
import DetailedModal from"./DetailedModal";

const notificationMethods = [
  { id: "GOOD", title: "양호", color: "text-blue-600" },
  { id: "BAD", title: "불량", color: "text-red-600" },
  { id: "NA", title: "N/A", color: "text-gray-900" },
];



export default function UserRegularDetails() {

const [selectedValue, setSelectedValue] = useState();

function handleRadioChange(value) {
    setSelectedValue(value);
}

const [regularDetailDTOList, setRegularDetailDTOList] = useState([]);
const {regularId} = useParams();
 const [regularIns, setRegularIns] = useState([]);
 const [regularData, setRegularData] = useState({
   regularEmpNum:"",
   regularPart:"",
   regularPerson:"",
   regularDate: "",
   regularInsName:"",
   regularEmail:"",
 });
const [isModalOpen, setIsModalOpen] = useState(false); // 각 행마다 모달 상태 저장

  // handleChecklistClick 함수 정의
  function handleChecklistClick(index) {
  console.log(regularDetailDTOList[index]);

    regularDetailDTOList[index].isModalState = "open";

    setIsModalOpen(true);
  }

    const handleActDataChange = (actForm) => {
        console.log("actForm");
        console.log(actForm);

        regularDetailDTOList[actForm.index].isModalState = "close";
        regularDetailDTOList[actForm.index].regularActContent = actForm.regularActContent;



        setIsModalOpen(false);
    };



  useEffect(() => {

    const fetchRegularDetail = async () => {
      try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/user/regular/detail/${regularId}`,        // 세아
            {
              headers: {
                'Content-Type': 'application/json'
              },
            }
        );

        setRegularData(response.data.regularDTO );
        setRegularDetailDTOList([...response.data.regularDetailDTOList])


        console.log("파일이름 찾기");
        console.log(response.data);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRegularDetail();
  }, []);

const dataTest =  ()=>{
  console.log(regularIns);
}


  return (
    <div>
      <UserRegularDetailsOutput regularData={regularData} />
      <div className="px-4 sm:px-6 lg:px-8 mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              정기점검 상세
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {regularData.regularPerson} 님께서 점검하신 정기점검 리스트입니다.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
        </div>
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  번호
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  유해위험요인확인
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  확인결과
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  조치여부
                </th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {regularDetailDTOList.map((regularDetail, index) => (
                  <tr key={index }>
                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                      {index+1}
                      <dl className="font-normal lg:hidden">
                        <dt className="sr-only">Title</dt>
                        <dd className="mt-1 truncate text-gray-700">{regularDetail.checklist}</dd>
                        <dt className="sr-only sm:hidden">Email</dt>
                        <dd className="mt-1 truncate text-gray-500 sm:hidden">
                          <div className="space-x-4 flex">
                            {notificationMethods.map((notificationMethod) => (
                              <div key={notificationMethod.id} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`radio-group-${index}`}
                                 defaultChecked={regularDetail.regularCheck === notificationMethod.id}
//                                    onChange={() => handleRadioChange(notificationMethod.id)}
                                  className="h-4 w-4 border-gray-300 text-seahColor focus:ring-seahColor"
                                />
                                <label
                                  htmlFor={notificationMethod.id}
                                  className={`ml-3 block text-sm font-bold leading-6 ${notificationMethod.color}`}
                                >
                                  {notificationMethod.title}
                                </label>
                              </div>
                            ))}
                          </div>
                        </dd>
                      </dl>
                    </td>
                     <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"
                        onClick={() => handleChecklistClick(index)}
                     >
                        {regularDetail.checklist}
                      </td>
                      <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        <div className="space-x-4 flex">
                           {notificationMethods.map((notificationMethod) => (
                             <div key={notificationMethod.id} className="flex items-center">
                               <input
                                 type="radio"
                                 name={`radio-group-${index}`}
                                defaultChecked={regularDetail.regularCheck === notificationMethod.id}
//                                    onChange={() => handleRadioChange(notificationMethod.id)}
                                 className="h-4 w-4 border-gray-300 text-seahColor focus:ring-seahColor"
                               />
                               <label
                                 htmlFor={notificationMethod.id}
                                 className={`ml-3 block text-sm font-bold leading-6 ${notificationMethod.color}`}
                               >
                                 {notificationMethod.title}
                               </label>
                             </div>
                           ))}
                        {regularDetail.isModalState === "open" ? (
                             <DetailedModal
                                 actForm={handleActDataChange}
                                 fetchData={regularDetail}
                                 index={index}
                             />
                           ):null}
                     </div>
                    </td>
                  </tr>

                ))}
              </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">

          <button
            type="button"
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
            onClick={dataTest}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
