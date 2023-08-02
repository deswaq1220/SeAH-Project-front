import { PaperClipIcon } from "@heroicons/react/20/solid";
import Header from "../../components/Header";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import useSafetyEduForm from "../../useHook/useSafetyEduForm";
import QRCode from "qrcode.react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function SafetyEduDetails() {
  const { eduId } = useParams(); // useParams 훅을 사용하여 URL 파라미터에서 eduId 가져오기
  const [eduData, setEduData] = useState(null);
  const { isCompleted, handleCreate, qrValue, formData } =
    useSafetyEduForm(eduData);
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchEduDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/edudetails/${eduId}`,
          {
            // // "http://172.20.10.5:3000/edudetails/${eduId}"
          }
        );
        setEduData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEduDetail(); 
  }, [eduId]);

  useEffect(() => {}, [eduData]);

  // 엑셀!!!!!!!!!!!

  const createExcelData = (eduData) => {
    // 교육 정보를 바탕으로 엑셀 데이터를 생성하는 로직 작성
    const data = [
      {
        category: `${eduData.eduCategory}`,
        title: `${eduData.eduCategory}`,
        time: `${eduData.eduStartTime}`,
        duration: `${eduData.eduSumTime} 분`,
        content: eduData.eduContent,
        Instructor: `${eduData.eduInstructor}`,
        eduWriter: eduData.eduWriter,
        target: eduData.eduTarget,
        attachments: eduData.attachments,
      },
    ];

    return data;
  };

  const handleExport = () => {
    if (!eduData) return; // eduData가 없을 경우 빠른 리턴

    // 엑셀 데이터 생성
    const data = createExcelData(eduData);

    // 엑셀 시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 엑셀 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 엑셀 파일 저장
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelFile = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelFile, `${eduData.eduCategory}_안전교육.xlsx`);
  };

  if (!eduData) {
    return <div>Loading...</div>; // 데이터가 로딩되기 전에는 null을 반환하거나 로딩 스피너를 추가할 수 있습니다.
  }
  // const { title, time, duration, content, attachments } = eduData;

  return (
    <div>
      <Header />
      {eduData ? (
        <div className="mx-auto max-w-2xl">
          <div className="px-4 sm:px-0 mt-16 flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                {eduData.eduCategory}
              </h3>
              {/* <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {eduData.eduStartTime}
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {eduData.eduEndTime}
            </p> */}
            </div>
            <div>
              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
              >
                수정하기
              </button>
              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
              >
                저장하기
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-bold leading-6 text-gray-900">
                  교육시간
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {eduData.eduStartTime} ~ {eduData.eduEndTime}
                </dd>
                <dt className="text-base font-bold leading-6 text-gray-900">
                  총 교육시간
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {eduData.eduSumTime} 분
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-bold leading-6 text-gray-900">
                  교육내용
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 whitespace-pre-wrap ">
                  {eduData.eduContent}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-bold leading-6 text-gray-900">
                  강사
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 whitespace-pre-wrap ">
                  {eduData.eduInstructor}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-bold leading-6 text-gray-900">
                  작성자
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 whitespace-pre-wrap ">
                  {eduData.eduWriter}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-base font-bold leading-6 text-gray-900">
                  첨부파일
                </dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {/* <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  { eduData &&eduData.attachments.map((attachment) => (
                    <li
                      key={attachment.name}
                      className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            {attachment.name}
                          </span>
                          <span className="flex-shrink-0 text-gray-400">
                            {attachment.size}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href="#"
                          className="font-medium text-seahColor hover:text-seahDeep"
                        >
                          파일저장
                        </a>
                      </div>
                    </li>
                  ))}
                </ul> */}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mt-6 pr-3 pb-3 flex items-center justify-center gap-x-6 ">
            <div>
              {isCompleted ? (
                <div className="mt-4">
                  {/* <QRCode value={JSON.stringify(formData)} /> */}

                  <Link to={`/userattendance/register/${eduData.eduId}`}>
                    <QRCode
                      value={`http://172.20.10.5:3000/userattendance/register/${eduData.eduId}`}
                    />
                  </Link>

                  <div className="flex items-center mt-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="ml-1">생성완료</span>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
                  onClick={handleCreate}
                >
                  QR CODE
                </button>
              )}

              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
              >
                출석현황
              </button>
              <button
                type="button"
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                onClick={handleExport}
              >
                엑셀 저장
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div> // eduData가 유효하지 않은 경우 로딩 상태를 나타내는 메시지 또는 스피너를 렌더링
      )}
    </div>
  );
}
