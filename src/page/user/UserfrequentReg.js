import UserHeader from "../../components/UserHeader";
import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import DangerImg from "../../img/danger.png";
import Inspector from "./inspector";
import Inspectionarea from "./inspectionarea";
import Facilityname from "./facilityname";
import Danger from "./danger";
import Injured from "./injured";
import Falsetrap from "./falsetrap";
import RiskAssessment from "./riskAssessment";
import InspectionDetails from "./Inspectiondetails";
import ActionRquest from "./actionrequest";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import data from "bootstrap/js/src/dom/data";
import { toast } from "react-toastify";
import Dangersource from "./sourceDanger";
import IsCompelete from "./isCompelete";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css"; // 스타일링을 위한 CSS
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";


function UserfrequentReg() {
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataId } = useParams(); // url 설비 파라미터
  const [updateSpeId, setUpdateSpeId] = useState("");
  const [speEmpNum, setSpeEmpNum] = useState("");
  const [spePerson, setSpePerson] = useState("");
  const [speEmail, setSpeEmail] = useState(""); // 조치자 이메일정보
  const [staticEmailPerson, setStaticEmailPerson] = useState(() => {
    // 초기값 설정
    return [];
  });
  const [speFacility, setSpeFacility] = useState("");
  const [speDanger, setSpeDanger] = useState("");
  const [speInjure, setSpeInjure] = useState("");
  const [speCause, setSpeCause] = useState("");
  const [speTrap, setSpeTrap] = useState("");
  const [speRiskAssess, setSpeRiskAssess] = useState("");
  const [speContent, setSpeContent] = useState("");
  const [speActContent, setSpeActContent] = useState("");
  const [speActPerson, setSpeActPerson] = useState("");
  const [speActEmail, setSpeActEmail] = useState("");
  const [speComplete, setSpeComplete] = useState("");
  const [files, setFiles] = useState("");     // 백으로 넘길 파일
  const [fileDatas, setFileDatas] = useState([]);   // 백에서 가져온 파일정보(업데이트정보)
  const [deleteFileIds, setDeleteFileIds] = useState([]);
  const emailTitle = `${spePerson}님의 수시점검 요청메일입니다`;
  const [isLoading, setIsLoading] = useState(true);
  const [speData, setSpeData] = useState({
    employeenumber :"",
    inspectorname: "",
    inspectoremail: "",
  });

  const [injuredData, setInjuredData] = useState("");
  const [causeData, setCauseData] = useState("");
  const [speActData, setSpeActData] = useState({
    speActPerson: "",
    speActEmail: "",
  });

    // 세아도메인
    const [seahDomain, setSeahDomain] = useState("@seah.co.kr");

  // ----------- 콜백 함수

  // Inspector 콜백 함수 : 점검자(이름, 이메일, 사원번호)
  const handleInspectorDataChange = (inspectorForm) => {
    setSpeEmpNum(inspectorForm.employeenumber);
    setSpePerson(inspectorForm.inspectorname);
    inspectorForm.inspectoremail !== null && inspectorForm.inspectoremail !=="" ?
        setSpeEmail(inspectorForm.inspectoremail+seahDomain) : setSpeEmail(inspectorForm.inspectoremail);

  };

  // Facilityname 콜백 : 설비명
  const handleFacilityChange = (facility) => {
    setSpeFacility(facility);
  };

  // Danger 콜백함수 : 위험분류
  const handleDangerDataChange = (selected) => {
    setSpeDanger(selected);
  };

  // Injured 콜백함수 : 부상부위
  const handleInjuredDataChange = (speInjuredData) => {
    setSpeInjure(speInjuredData);
  };

  // Dangersource 콜백함수 : 위험원인
  const handleCauseDataChange = (speCauseData) => {
    setSpeCause(speCauseData);
  };

  // FalseTrap 콜백함수 : 실수함정
  const handleFalsetrapDataChange = (falsetrapSelected) => {
    setSpeTrap(falsetrapSelected);
  };

  // RiskAssessment 콜백 : 위험성평가
  const handleRiskAssessmentDataChange = (riskAssessmentSelected) => {
    setSpeRiskAssess(riskAssessmentSelected);
  };

  // InspectionDetails 콜백 : 점검내용
  const handleInspectionDetailsDataChange = (data) => {
    setSpeContent(data);
  };

  // ActionRquest 콜백 : 조치자(이름, 이메일)
  const handleActionRequestDetailsDataChange = (data) => {
    setSpeActPerson(data.speActPerson);
    setSpeActEmail(data.speActEmail);
  };

  // 고정수신자
  const handleStaticEmailChange = (staticEmailList) => {
    // staticEmailList가 배열인 경우, 각 이메일 주소를 추출하여 배열에 추가
    const staticEmailAddresses = Array.isArray(staticEmailList)
      ? staticEmailList.map((item) => item.emailAdd)
      : [staticEmailList.emailAdd];

    setStaticEmailPerson(staticEmailAddresses);
  };

  // 개선대책
  const handleActContChange = (e) => {
    const value = e.target.value;
    if (value.length > 300) {
      toast.warn("개선대책은 최대 300자까지 입력 가능합니다.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      setSpeActContent(value.slice(0, 300));
    } else {
      setSpeActContent(value);
    }
  };

  // IsCompelete 콜백 : 완료여부
  const handleIsCompeleteDataChange = (selected) => {
    setSpeComplete(selected);
  };

  // 파일제거
  const handleRemoveFile = (fileItem, index) => {
    // 1. 파일 아이디를 저장하는 새로운 배열 생성
    const updatedFiles = [...fileDatas]; // fileDatas 배열 복사
    // 2. 화면에서 삭제할 파일 아이템 제거
    updatedFiles.splice(index, 1);
    // 3. 업데이트된 배열을 state로 설정
    setFileDatas(updatedFiles);
    // 4. 삭제할 파일 아이디를 state로 설정 (리스트 형태로 저장하려면 여러 아이디를 배열로 관리)
    setDeleteFileIds((prevIds) => [...prevIds, fileItem.speFileId]);
  }


  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const speId = params.get("speId");

  useEffect(() => {
    // 서버에서 교육 세부 정보 가져오기 (교육 아이디값 이용)

    if (speId) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user/special/detail/${speId}`)
        .then((response) => {
          // 가져온 데이터로 상태 업데이트
          // 조치자정보
          setSpeData({
            employeenumber: response.data.specialData.speEmpNum,
            inspectorname: response.data.specialData.spePerson,
            inspectoremail: response.data.specialData.speEmail.split('@')[0],
          });
          setSpeEmpNum(response.data.specialData.speEmpNum);
          setSpePerson(response.data.specialData.spePerson);
          setSpeEmail(response.data.specialData.speEmail);

          setSpeFacility(response.data.specialData.speFacility);
          setSpeDanger(response.data.specialData.speDanger);

          setInjuredData(response.data.specialData.speInjure);
          setSpeInjure(response.data.specialData.speInjure);

          setCauseData(response.data.specialData.speCause);
          setSpeCause(response.data.specialData.speCause);

          setSpeTrap(response.data.specialData.speTrap);

          setSpeRiskAssess(response.data.specialData.speRiskAssess);
          setSpeContent(response.data.specialData.speContent);

          setSpeActData({
            speActPerson: response.data.specialData.speActPerson,
            speActEmail: response.data.specialData.speActEmail,
          });
          setSpeActPerson(response.data.specialData.speActPerson);
          setSpeActEmail(response.data.specialData.speActEmail);

          setSpeActContent(response.data.specialData.speActContent);

          setSpeComplete(response.data.specialData.speComplete);

          // 수정할 파일 데이터 업데이트
          setFileDatas(response.data.specialData.speFiles);

          setUpdateSpeId(speId);
          
          setIsLoading(false);
        })
        .catch((error) => {
          // 에러 처리
          console.error("교육 세부 정보를 가져오는 중 에러 발생:", error);
        });
      } else {
        // speId 값이 없으면 로딩 상태 업데이트
        setIsLoading(false);
      }
    }, [speId]);

  if (isLoading) {
    return <div>Loading...</div>; // or return null; or a loading spinner;
  }

  const handleFormSubmit  = () => {

    const formData = new FormData();
    // 업로드 파일 배열 저장
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    if(speId) {
      formData.append("speDeleteFileIds", deleteFileIds);
    }
    formData.append("speEmpNum", speEmpNum);
    formData.append("spePerson", spePerson);
    formData.append("speEmail", speEmail);
    formData.append("speFacility", speFacility);
    formData.append("speDanger", speDanger);
    formData.append("speInjure", speInjure);
    formData.append("speCause", speCause)
    formData.append("speTrap", speTrap);
    formData.append("speRiskAssess", speRiskAssess);
    formData.append("speContent", speContent);
    formData.append("speActPerson", speActPerson);
    formData.append("speActEmail", speActEmail);
    formData.append("speActContent", speActContent);
    formData.append("speComplete", speComplete);


    const requiredFields = [
      { value: speEmpNum, name: "사원번호" },
      { value: spePerson, name: "이름" },
      { value: speEmail, name: "이메일" },
      { value: speFacility, name: "설비명" },
      { value: speDanger, name: "위험분류" },
      { value: speInjure, name: "부상부위" },
      { value: speCause, name:"위험원인"},
      { value: speTrap, name:"실수함정"},
      { value: speRiskAssess, name:"위험성평가"},
      { value: speContent, name:"점검내용"},
      { value: speActEmail, name:"조치요청"},
      { value: speContent, name:"점검내용"},
    ];
  
    for (let field of requiredFields) {
        if (!field.value) {
          toast.warn(`${field.name} 항목이 작성되지 않았습니다.`, {
            position:"top-center",
            autoClose :2000,
            hideProgressBar:true,
          });
          return;
        }
     }


    if (speId) {
      // speId 값이 있으면 수정 요청 보내기
      axios
        .put(
          `${process.env.REACT_APP_API_BASE_URL}/user/special/detail/${speId}`, formData)
        .then((response) => {

          toast.success("수정이 완료되었습니다.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
          });

          navigate(`/special/list/${masterdataPart}/${masterdataId}`);
        })
        .catch((error) => {
          console.error(error);
          toast.error("수시점검 수정에 실패했습니다. 다시 시도해주세요.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
          });
        });
    } else {
      // 수시점검 등록 요청
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/user/special/new/${masterdataPart}/${masterdataId}`, formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        .then((response) => {

          const speDate = new Date(response.data.speDate);
          const speDeadline = new Date(response.data.speDeadline);

          // 원하는 날짜와 시간 형식으로 포맷팅
          const formattedSpeDate = `${speDate.toLocaleDateString()} ${speDate.toLocaleTimeString()}`;
          const formattedSpeDeadline = `${speDeadline.toLocaleDateString()} ${speDeadline.toLocaleTimeString()}`;

          if (speActPerson && speActEmail) {
            const inspectionData = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">항목</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>내용</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검일시</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${formattedSpeDate}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검자</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.spePerson}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검영역</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.spePart}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검설비</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speFacility}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">위험분류</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speDanger}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">위험원인</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speCause}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">부상부위</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speInjure}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">실수함정</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speTrap}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">위험성평가</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speRiskAssess}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검내용</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speContent}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">개선대책</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speActContent}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">담당자</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${response.data.speActPerson}</strong></td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">요청기한</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${formattedSpeDeadline}</strong></td>
          </tr>
          </table>
            <p style="font-size:16px;">링크 : <a href="http://112.220.233.236/special/detail/${response.data.speId}">상세보기</a></p>
            <p style="font-size:16px;">해당 메일은 발신전용 메일입니다.</p>
    `;

            const emailData = {
              recipients: [...speActEmail.split(", "), ...staticEmailPerson], // 이메일 주소를 수신자로 설정
              subject: emailTitle, // 이메일 제목
              content: inspectionData, // 이메일 내용 (점검 내용 등)
            };

            axios
              .post(
                `${process.env.REACT_APP_API_BASE_URL}/api/send-email`,
                emailData
              )
              .then((response) => {
              })
              .catch((error) => {
                console.error("이메일 전송 오류: ", error);

              });
          } else {
            console.log("이메일 정보가 없습니다. 전송되지 않았습니다.");

          }

          if (formData !== null) {
            // 등록이 완료되었다는 알림 띄우기
            toast.success("등록이 완료되었습니다.", {
              position: "top-center",
              autoClose: 2000, // 알림이 3초 후에 자동으로 사라짐
              hideProgressBar: true,
            });
            // 저장성공시 해당설비의 리스트 페이지
            navigate(-1);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("수시점검 등록에 실패했습니다. 다시 시도해주세요.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
          });
        });
    }
  };

  // 등록취소 버튼 클릭 시 바로 이전페이지 이동
  const backBtn = () => { navigate(-1); };

  return (
    <>
      <UserHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              수시점검 등록
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {masterdataPart}/{speFacility}에 관한 수시점검을 등록할 수 있습니다.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          </div>
        </div>
      <Inspector onFormDataChange={handleInspectorDataChange}
                 defaultState={speData} /> {/* 점검자 */}
      <Inspectionarea /> {/* 점검영역 */}
      <Facilityname onChange={handleFacilityChange} /> {/* 설비명 */}
      <Danger onFormDataChange={handleDangerDataChange}
              defaultState={speDanger}/> {/* 위험분류 */}
      <Injured onFormDataChange={handleInjuredDataChange}
               defaultState={injuredData} /> {/* 부상부위 */}
      <Dangersource onFormDataChange={handleCauseDataChange}
                    defaultState={causeData} /> {/* 위험원인 */}
      <Falsetrap onFormDataChange={handleFalsetrapDataChange}
                 defaultState={speTrap}/>{" "} {/* 실수함정 */}
      <RiskAssessment onFormDataChange={handleRiskAssessmentDataChange}
                      defaultState={speRiskAssess} updateSpeId={updateSpeId}/>{" "} {/* 위험성평가 */}
      {/* 위험분류 표 */}
      <div className="flex flex-col justify-center items-center border border-gray-300 px-3 mx-3 ">
        <p className=" font-semibold text-lg">평가표</p>
        <img src={DangerImg} className=" p-3 w-100"></img>
      </div>
      <InspectionDetails onFormDataChange={handleInspectionDetailsDataChange}
                         defaultState={speContent}/>{" "}
      {/* 점검내용 */}
      {/* 개선대책 */}
      <div
        id="ReformMeasures"
        className="grid sm:flex items-baseline justify-start"
      >
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4 ml-4 ">
          개선대책
        </span>

        <div className="mt-2 ">
          <textarea
            rows={4}
            name="comment"
            id="comment"
            className="block w-72 rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 p-2 mr-3 ml-4"
            placeholder={"개선대책을 입력하세요. 300자 이내 작성"}
            value={speActContent}
            onChange={handleActContChange}
          />
        </div>
      </div>
      <div
        id="ActionRequest"
        className="grid sm:flex items-baseline justify-start"
      >
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4 ml-4 ">
          조치요청
        </span>
        <ActionRquest onFormDataChange={handleActionRequestDetailsDataChange}
                      onChange={handleStaticEmailChange} defaultState={speActData} updateSpeId={updateSpeId}/>{" "}
      </div>
      {/* 조치요청 */}
      {/* 혜영추가-완료여부 */}
      <IsCompelete onFormDataChange={handleIsCompeleteDataChange} />{" "}
      {/* 완료여부 */}
      {/* 경원추가 */}
      <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4 ml-4 ">
        사진첨부
      </span>

      <FilePond
        allowMultiple={true} // 다중 파일 업로드 허용
        maxFiles={5} // 최대 파일 수 설정
        acceptedFileTypes={["image/jpeg", "image/jpg", "image/png"]}
        onupdatefiles={(fileItems) => {
          const selectedFiles = fileItems.map((fileItem) => fileItem.file);
          setFiles(selectedFiles);
        }}
        server={{
          process: (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort
          ) => {
            // 확장자 검사
            if (
              !file.type.includes("image/jpeg") &&
              !file.type.includes("image/jpg") &&
              !file.type.includes("image/png")
            ) {

                toast.error(<div>
                    업로드할 수 없는 확장자입니다.<br />
                    jpg/jpeg/png 파일만 업로드 가능합니다.
                </div>, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    style: {
                        width: "400px",
                    },
                });
              return;
            }
          },
        }}
        labelIdle='클릭하거나 <span class="filepond--label-action">파일을 여기에 드롭하여 선택하세요</span>'
      />
      {fileDatas.map((fileItem, index) => (
        <div key={index} className="flex items-start mt-2">
          <div className="text-left">
              <img
                  key={index}
                  src={process.env.REACT_APP_API_BASE_URL + fileItem.speFileUrl}
                  alt={`사진 ${index + 1}`}
              />
            {fileItem.speFileOriName}

          <button
            onClick={() => handleRemoveFile(fileItem, index)}
            className="ml-2 text-red-600"
            type="button"
          >
            삭제
          </button>
          </div>
        </div>
      ))}

      <div className="flex justify-center w-full mt-8 mb-10">
        <button
          type="button"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
          onClick={backBtn}
        >
          등록취소
        </button>
        <button
          type="submit"
          className="rounded-md bg-seahColor px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus:outline-none"
          onClick={handleFormSubmit} // 등록 버튼 클릭 시 handleFormSubmit 실행
        >
          등록
        </button>
      </div>
      </div>
    </>
  );
}

export default UserfrequentReg;