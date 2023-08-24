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
import UserFrequentDetailsTable from "./UserFrequentDetails/UserFrequentDetailsTable";

// 추가 플러그인을 라이브러리에 등록
registerPlugin(FilePondPluginImagePreview);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function UserfrequentReg() {
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataFacility } = useParams(); // url 설비 파라미터
  const [speEmpNum, setSpeEmpNum] = useState("");
  const [spePerson, setSpePerson] = useState("");
  const [speEmail, setSpeEmail] = useState("");
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
  const [files, setFiles] = useState(null);
  const emailTitle = `${spePerson}님의 수시점검 요청메일입니다`;

  // Inspector 콜백 함수 : 점검자(이름, 이메일, 사원번호)
  const handleInspectorDataChange = (inspectorForm) => {
    setSpeEmpNum(inspectorForm.employeenumber);
    setSpePerson(inspectorForm.inspectorname);
    setSpeEmail(inspectorForm.inspectoremail);
  };

  // Danger 콜백함수 : 위험분류
  const handleDangerDataChange = (selected) => {
    setSpeDanger(selected.dangerMenu);
  };

  // Injured 콜백함수 : 부상부위
  const handleInjuredDataChange = (speInjuredData) => {
    setSpeInjure(speInjuredData.injuredMenu);
  };

  // Dangersource 콜백함수 : 위험원인
  const handleCauseDataChange = (speCauseData) => {
    setSpeCause(speCauseData.causeMenu);
  };

  // FalseTrap 콜백함수 : 실수함정
  const handleFalsetrapDataChange = (falsetrapSelected) => {
    setSpeTrap(falsetrapSelected.trapMenu);
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

  // 개선대책
  const handleActContChange = (e) => {
    setSpeActContent(e.target.value);
  };

  // IsCompelete 콜백 : 완료여부
  const handleIsCompeleteDataChange = (selected) => {
    setSpeComplete(selected);
  };

  const navigate = useNavigate();

  const handleFormSubmit = () => {
    const formData = new FormData(); // 폼데이터 객체 생성

    // 업로드 파일 배열 저장
    if (files !== null) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    formData.append("speEmpNum", speEmpNum);
    formData.append("spePerson", spePerson);
    formData.append("speEmail", speEmail);
    formData.append("speDanger", speDanger);
    formData.append("speInjure", speInjure);
    formData.append("speCause", speCause);
    formData.append("speTrap", speTrap);
    formData.append("speRiskAssess", speRiskAssess);
    formData.append("speContent", speContent);
    formData.append("speActPerson", speActPerson);
    formData.append("speActEmail", speActEmail);
    formData.append("speActContent", speActContent);
    formData.append("speComplete", speComplete);

    console.log(formData); // 요청 데이터 콘솔에 출력

    // 수시점검 등록 요청
    axios

      .post(
        `${process.env.REACT_APP_API_BASE_URL}/special/new/${masterdataPart}/${masterdataFacility}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        //   setInspectionData("test");

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
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">내용</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검일시</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${formattedSpeDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검자</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.spePerson}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검영역</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.spePart}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검설비</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.speFacility}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">위험분류</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.speDanger}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">위험원인</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.speTrap}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">부상부위</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.speCause}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">위험성평가</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.speRiskAssess}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검내용</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"> ${response.data.speContent}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">개선대책</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.speActContent}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">담당자</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${response.data.speActPerson}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">요청기한</td>
            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">${formattedSpeDeadline}</td>
          </tr>
          </table>
            <p style="font-size:16px;">링크 : <a href="http://172.20.20.252:3000/special/detail/${response.data.speId}">상세보기</a></p>
    `;

          const emailData = {
            recipients: speActEmail.split(", "), // 이메일 주소를 수신자로 설정
            subject: emailTitle, // 이메일 제목
            content: inspectionData, // 이메일 내용 (점검 내용 등)
            // 필요한 다른 속성도 여기에 추가 가능
          };

          axios
            .post(
              `${process.env.REACT_APP_API_BASE_URL}/api/send-email`,
              emailData
            )
            .then((response) => {
              console.log("이메일 전송 완료:", response);
              // ... (나머지 처리 로직)
            })
            .catch((error) => {
              console.error("이메일 전송 오류: ", error);
              // ... (에러 처리 로직)
            });
        } else {
          console.log("이메일 정보가 없습니다. 전송되지 않았습니다.");
          // ... (이메일 정보가 없을 때 처리 로직)
        }

        if (formData !== null) {
          // 등록이 완료되었다는 알림 띄우기
          toast.success("등록이 완료되었습니다.", {
            position: "top-center",
            autoClose: 2000, // 알림이 3초 후에 자동으로 사라짐
            hideProgressBar: true,
          });

          // 저장성공시 해당설비의 리스트 페이지
          navigate(`/special/list/${masterdataPart}/${masterdataFacility}`);
        }
      })
      .catch((error) => {
        // console.log(requestData);
        console.log(formData);
        console.error(error);
        alert("수시점검 등록에 실패했습니다. 다시 시도해주세요.");
      });

    // 이메일 전송
  };

  return (
    <>
      <UserHeader />
      <p>수시점검</p>
      <p>수시점검 내용등록</p>
      <Inspector onFormDataChange={handleInspectorDataChange} /> {/* 점검자 */}
      <Inspectionarea /> {/* 점검영역 */}
      <Facilityname /> {/* 설비명 */}
      <Danger onFormDataChange={handleDangerDataChange} /> {/* 위험분류 */}
      <Injured onFormDataChange={handleInjuredDataChange} /> {/* 부상부위 */}
      <Dangersource onFormDataChange={handleCauseDataChange} /> {/* 위험원인 */}
      <Falsetrap onFormDataChange={handleFalsetrapDataChange} />{" "}
      {/* 실수함정 */}
      <RiskAssessment onFormDataChange={handleRiskAssessmentDataChange} />{" "}
      {/* 위험성평가 */}
      {/* 위험분류 표 */}
      <div className="flex flex-col justify-center items-center border border-gray-300 px-3 mx-3 ">
        <p className=" font-semibold text-lg">평가표</p>
        <img src={DangerImg} className=" p-3 w-100"></img>
      </div>
      <InspectionDetails onFormDataChange={handleInspectionDetailsDataChange} />{" "}
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
            placeholder={"개선대책을 입력하세요"}
            value={speActContent}
            onChange={handleActContChange}
          />
        </div>
      </div>
      <ActionRquest onFormDataChange={handleActionRequestDetailsDataChange} />{" "}
      {/* 조치요청 */}
      {/* 혜영추가-완료여부 */}
      <IsCompelete onFormDataChange={handleIsCompeleteDataChange} />{" "}
      {/* 완료여부 */}
      {/* 경원추가 */}
      <h1>파일 업로드</h1>
      <FilePond
        allowMultiple={true} // 다중 파일 업로드 허용
        maxFiles={5} // 최대 파일 수 설정
        acceptedFileTypes={["image/jpeg", "image/jpg", "image/png"]}
        // 엔드포인트는 백엔드 구현되면 연결요
        onupdatefiles={(fileItems) => {
          // 파일 정보를 상태에 저장하거나 처리
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
              error("업로드할 수 없는 확장자입니다.");
              alert("업로드할 수 없는 확장자입니다.");
              return;
            }
          },
        }}
      />
      <div className="flex justify-center w-full mt-8 mb-10">
        <button
          type="button"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
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
    </>
  );
}

export default UserfrequentReg;
