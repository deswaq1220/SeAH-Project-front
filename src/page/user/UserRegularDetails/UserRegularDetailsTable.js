import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import UserRegularDetailsOutput from "./UserRegularDetailsOutput";
import DetailedModal from "./DetailedModal";

const notificationMethods = [
    {id: "GOOD", title: "양호", color: "text-blue-600"},
    {id: "BAD", title: "불량", color: "text-red-600"},
    {id: "NA", title: "N/A", color: "text-gray-900"},
];

const notificationMethods2 = [
    {id: "GOOD", title: "양호", color: "text-blue-600"},
    {id: "BAD", title: "불량", color: "text-red-600"},
    {id: "NA", title: "N/A", color: "text-gray-900"},
];


export default function UserRegularDetails() {

    const [selectedValue, setSelectedValue] = useState();
    const navigate = useNavigate();
    const [staticEmailPerson, setEmailYDataList] = useState([]);

    function handleRadioChange(value) {
        setSelectedValue(value);
    }

    const [regularDetailDTOList, setRegularDetailDTOList] = useState([]);
    const {regularId} = useParams();
    const [regularIns, setRegularIns] = useState([]);
    const [regularData, setRegularData] = useState({
        regularEmpNum: "",
        regularPart: "",
        regularPerson: "",
        regTime: "",
        regularInsName: "",
        regularEmail: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // 각 행마다 모달 상태 저장


    // handleChecklistClick 함수 정의
    function handleChecklistClick(index) {
        console.log(regularDetailDTOList[index]);

        regularDetailDTOList[index].isModalState = "open";
        console.log(regularDetailDTOList[index].isModalState);
        setIsModalOpen(false);
        setIsModalOpen(true);
    }

    const handleActDataChange = (actForm) => {

        console.log(actForm);

        regularDetailDTOList[actForm.index].isModalState = "close";
        regularDetailDTOList[actForm.index].regularActContent = actForm.regularActContent;
        regularDetailDTOList[actForm.index].files = actForm.files;
        console.log("ㅇㅇㅇㅇㅇㅇ"+ regularDetailDTOList[actForm.index].isModalState);
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

                setRegularData(response.data.regularDTO);
                setRegularDetailDTOList([...response.data.regularDetailDTOList])


                console.log("파일이름 찾기");
                console.log(response.data);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchRegularDetail();
    }, []);




    const updateBadDetail = async (index) => {
        console.log(regularDetailDTOList[index]);

        let regularBadId = regularDetailDTOList[index].regularBadId;

        let regularDetailDTO = regularDetailDTOList[index];

        regularDetailDTO.regularInspectionId = regularId;


        try {

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/user/regular/badDetailModify/${regularBadId}`,
                regularDetailDTO,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

        // 이메일 고정수신자 리스트
            const responseStaticEmail = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/user/regularemail`
            );


            const emailYListFromBack = responseStaticEmail.data.staticEmailList;
            const emailAdds = emailYListFromBack.map((item) => item.emailAdd);
            const emailAddsJoin = emailAdds.join(", ");


//날짜
            console.log("regularData.regularDate============" + regularData.regTime );

        // 이메일 발송기능
        const completeDate = new Date(response.data);
        const registerDate = new Date(regularData.regTime);

        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
        };

        //조치완료일
        const formattedCompleteDate = completeDate.toLocaleDateString(
            "ko-KR", options
        );
        //점검일
        const formattedRegisterDate = registerDate.toLocaleDateString(
            "ko-KR", options
        );


      const spendForm = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">항목</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>내용</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검일시</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${formattedRegisterDate}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검항목</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularData.regularInsName}</strong></td>
          </tr>          
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검구역</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularData.regularPart}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검자</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularData.regularEmpNum}/ ${regularData.regularPerson}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">유해위험요인</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularDetailDTOList[index].checklist}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">개선대책</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularDetailDTOList[index].regularActContent}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">조치자</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularDetailDTOList[index].regularActPerson}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">조치완료일</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${formattedCompleteDate}</strong></td>
          </tr>
          </table>
            <p style="font-size:16px;">링크 : <a href="http://localhost:3000/regulardetails/${regularId}">상세보기</a></p>
            <p style="font-size:16px;">해당 메일은 발신전용 메일입니다.</p>
            `;

            const regularPersonEmails = regularData.regularEmail; //점검자 이메일
            console.log("발신자========재확인" + JSON.stringify(regularPersonEmails));


            const staticPersonEmails = emailAddsJoin
                /*.join(",") // 배열을 문자열로 변환*/
                .split(",")
                .map((email) => email.trim());
            console.log("고정수신자========재확인" + JSON.stringify(staticPersonEmails));
            const finalEmailList = [regularPersonEmails, ...staticPersonEmails];
            const uniqueRecipientsSet = new Set(finalEmailList); //이메일 중복제거
            const uniqueRecipientsArray = Array.from(uniqueRecipientsSet); // Set을 다시 배열로 변환



            const emailTitle = `${regularDetailDTOList[index].regularActPerson}님의 정기점검완료 메일입니다`;

            const emailData = {
                recipients: uniqueRecipientsArray,
                subject: emailTitle,
                content: spendForm,
            };
            console.log(
                "emailData===============" + JSON.stringify(emailData, null, 2)
            );

            axios
                .post(
                    `${process.env.REACT_APP_API_BASE_URL}/api/send-email`,
                    emailData
                )
                .then((response) => {
                    console.log("이메일 전송 완료:", response);
                })
                .catch((error) => {
                    console.error("이메일 전송 오류: ", error);
                });


            // 페이지 새로고침
             window.location.reload();
            // 요청이 성공했을 때 수행할 작업 (예: 응답 데이터 확인)
            console.log("성공"+ response.data);
        } catch (error) {
            console.error("점검리스트 조회 오류", error);
        }
    };


// 삭제버튼 클릭 핸들러
    const handleDeleteButtonClick = (regularId) => {
        const confirmDelete = window.confirm("해당 정기점검 내역을 삭제하시겠습니까?");
        console.log("regularId: " + regularId);
        if (confirmDelete) {
            axios
                .delete(`${process.env.REACT_APP_API_BASE_URL}/user/regular/detail/${regularId}`)
                .then((response) => {
                    // 삭제 요청이 성공한 경우 처리
                    console.log("삭제 성공:", response);
                    navigate(-1);

                })
                .catch((error) => {
                    // 삭제 요청이 실패한 경우 처리
                    console.error("삭제 실패:", error);
                    // 실패한 경우 사용자에게 알림을 표시하거나 다른 작업을 수행할 수 있습니다.
                });
        }
    };

    return (
        <div>
            <UserRegularDetailsOutput regularData={regularData}/>
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
                                className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                                번호
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                                유해위험요인 확인
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 sm:table-cell"
                            >
                                확인결과
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                            >
                                조치여부
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {regularDetailDTOList.map((regularDetail, index) => (
                            <tr key={index}>
                                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0 text-center">
                                    {index + 1}
                                    <dl className="font-normal lg:hidden">
                                        <dt className="sr-only">Title</dt>
                                        {
                                            regularDetail.regularCheck === 'BAD' ? (
                                                <dd
                                                    className="mt-1 truncate text-gray-700 cursor-pointer"
                                                    onClick={() => handleChecklistClick(index)}
                                                >
                                                    {regularDetail.checklist}
                                                </dd>
                                            ) : (
                                                <dd className="mt-1 truncate text-gray-700">
                                                    {regularDetail.checklist}
                                                </dd>
                                            )
                                        }

                                        <dt className="sr-only sm:hidden">Email</dt>
                                        <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                            <div className="space-x-4 flex">
                                                {notificationMethods.map((notificationMethod) => (
                                                    <div key={notificationMethod.id} className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`radio-group-${index}-1`}
                                                            defaultChecked={regularDetail.regularCheck === notificationMethod.id}
                                                            disabled
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
                                {
                                    regularDetail.regularCheck === 'BAD' ? (
                                        <td
                                            className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"
                                            onClick={() => handleChecklistClick(index)}
                                        >
                                            {regularDetail.checklist}
                                        </td>
                                    ) : (
                                        <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                            {regularDetail.checklist}
                                        </td>
                                    )
                                }

                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell text-center">
                                    <div className="space-x-4 flex">
                                        {notificationMethods.map((notificationMethod) => (
                                            <div key={notificationMethod.id} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`radio-group-${index}-2`}
                                                    defaultChecked={regularDetail.regularCheck === notificationMethod.id}
                                                    disabled
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
                                        ) : null}
                                    </div>
                                </td>
                                <td>
                                    {
                                        regularDetail.regularCheck === 'BAD' ? (
                                            regularDetail.regularComplete !== 'OK' ? (
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                                                    onClick={() => updateBadDetail(index)}
                                                >
                                                    조치 완료
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                                                >
                                                    조치 완료
                                                </button>
                                            )
                                        ) : (
                                            null
                                        )
                                    }
                                </td>
                            </tr>

                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
                        onClick={() => handleDeleteButtonClick(regularId)} // regularId 값을 넘겨줍니다.
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
