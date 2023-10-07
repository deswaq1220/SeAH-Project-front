import { PaperClipIcon } from "@heroicons/react/20/solid";
import Header from "../../components/Header";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useSafetyEduForm from "../../useHook/useSafetyEduForm";
import QRCode from "qrcode.react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { format, parseISO } from 'date-fns';
import { toast } from "react-toastify";
import DeleteEduModal from "../../components/DeleteEduModal ";



export default function SafetyEduDetails() {
  const { eduId } = useParams(); // useParams 훅을 사용하여 URL 파라미터에서 eduId 가져오기
  const [eduData, setEduData] = useState([]);
  const { isCompleted, handleCreate, qrValue, formData, setFormData } =
    useSafetyEduForm(eduData);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [updatedData, setUpdatedData] = useState({});

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달의 상태
  const [currentEduId, setCurrentEduId] = useState(null); // 현재 선택된 출석자 ID



  useEffect(() => {
    const fetchEduDetail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/edudetails/${eduId}`,        // 세아
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );
        setEduData({ ...response.data, eduFileList: response.data.eduFileList });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEduDetail();
  }, [eduId]);


  // 엑셀

  const createExcelData = (eduData) => {
    // 교육 정보를 바탕으로 엑셀 데이터를 생성하는 로직 작성
    const data = [
      {
        분류: `${eduData.eduCategory}`,
        제목: `${eduData.eduTitle}`,
        교육시작시간: `${eduData.eduStartTime}`,
        교육시간: `${eduData.eduSumTime} 분`,
        교육내용: eduData.eduContent,
        강사: `${eduData.eduInstructor}`,
        작성자: eduData.eduWriter,
        교육대상자: eduData.eduTarget,
        설명: "T는 전체, F는 현장직 O는 사무직입니다",
        파일첨부: eduData.eduFileList.map(file => file.eduFileName).join(', '),
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
    return <div>Loading...</div>;
  }

  const mapDutyName = (duty) => {
    switch (duty) {
      case "T":
        return "전체";
      case "O":
        return "사무직";
      case "F":
        return "현장직";
      default:
        return duty;
    }
  };

  // 교육 삭제
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/admin/edudetails/${eduId}`
      );

      if (response.status === 200) {
        toast.success("교육이 삭제되었습니다.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
        navigate('/eduMain');
      }
    } catch (error) {
      toast.error("교육이 삭제 중 오류가 생겼습니다.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      console.error('교육 삭제 에러', error);
    }
  };

  //수정하기
  const handleEditClick = () => {

    navigate(`/edureg/${eduId}`);
  };

  return (
    <div>
      <Header />
      {eduData ? (
        <div className="mx-auto max-w-2xl">
          <div className="px-4 sm:px-0 mt-16 flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                {eduData.eduTitle}
              </h3>
            </div>
            <div>
              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
                onClick={handleEditClick}
              >
                수정하기
              </button>
              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                onClick={() => { setCurrentEduId(eduData.eduId); setShowDeleteModal(true); }}
              >
                삭제하기
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
                  {eduData.eduStartTime ? format(parseISO(eduData.eduStartTime), 'yyyy-MM-dd HH시mm분') : ''}
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
                  교육장소
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 whitespace-pre-wrap ">
                  {eduData.eduPlace}
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
                  대상자
                </dt>
                <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 whitespace-pre-wrap ">
                  {mapDutyName(eduData.eduTarget)}
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
                  {eduData.eduFileList && eduData.eduFileList.length > 0 ? (
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 rounded-md border border-gray-200"
                    >
                      {eduData.eduFileList.map((eduFiles) => (
                        <li
                          key={eduFiles.eduFileId}
                          className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                        >
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                              <span className="truncate font-medium">
                                {eduFiles.eduFileName}
                              </span>

                              <span className="flex-shrink-0 text-gray-400">
                                {eduFiles.size}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>첨부된 파일이 없습니다</div>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mt-6 pr-3 pb-3 flex items-center justify-center gap-x-6 ">
            <div>
              {isCompleted ? (
                <div className="mt-4">
                  <QRCode
                      value={`http://112.220.233.236/userattendance/register/${eduData.eduId}`}
                  />
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
              <Link to={`/attenstatus/${eduId}`}>
                <button
                  type="submit"
                  className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
                >
                  출석현황
                </button>
              </Link>

              <button
                type="button"
                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                onClick={handleExport}
              >
                엑셀 저장
              </button>
              <button
                type="button"
                onClick={() => navigate(`/training/${eduId}`)}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-1"
              >
                공적 증빙
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {showDeleteModal && <DeleteEduModal open={showDeleteModal} setOpen={setShowDeleteModal} onConfirm={() => handleDelete(currentEduId)} />}
    </div>
  );
}