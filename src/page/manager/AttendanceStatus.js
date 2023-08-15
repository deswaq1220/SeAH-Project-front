import {useEffect, useState} from "react";
import axios from 'axios';
import { useParams } from "react-router-dom"; // useParams 임포트
import Header from "../../components/Header";
import { saveAs } from 'file-saver'; // 파일 저장용 라이브러리
import * as XLSX from "xlsx";



export default function AttenStatus() {
  const [attendanceList, setAttendanceList] = useState([]);
  const { eduId } = useParams(); // eduId를 URL 파라미터에서 가져옴
  const [eduData, setEduData] = useState("");
  const [eduTitle, setEduTitle] = useState("");


  useEffect(() => {
    // 교육 아이디에 맞는 출석목록 데이터를 받아오는 API 호출
    axios.get(`http://localhost:8081/usereduatten/list/${eduId}`)
      .then(response => {
        // 받아온 출석목록 데이터를 attendanceList 상태에 저장
        setAttendanceList(response.data);
        console.log(response.data); // 여기서 출력
      })
      .catch(error => {
        console.error("Error fetching attendance data:", error);
      });
  }, [eduId]);

  useEffect(() => {
    const fetchEduDetail = async () => {
      try {
        const response = await axios.get(
          // `http://172.20.20.252:8081/edudetails/${eduId}`,        // 세아
          `http://localhost:8081/edudetails/${eduId}`
        );
        //        setUploadedFiles(response.data.eduFiles);
        setEduData({ ...response.data, eduFiles: response.data.eduFiles });
        setEduTitle(response.data.eduTitle); // eduTitle 설정
        console.log(eduData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEduDetail();
  }, [eduId]);

  const handleExportExcel = () => {
    const excelData = attendanceList.map(attendance => {
      return {
        '교육아이디': attendance.eduId,
        '부서': attendance.attenDepartment,
        '이름': attendance.attenName,
        '사원번호': attendance.attenEmployeeNumber,
        '출석일자': attendance.attenTime
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '출석목록');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${eduTitle}교육_출석명단.xlsx`);
  };

  const formatTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };



  return (
    <>
    <Header/>
    <div className="px-4 sm:px-6 lg:px-8 mx-4 mt-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-extrabold leading-6 text-gray-900">{eduData.eduTitle}</h1>
          <p className="mt-2 text-sm text-gray-700">
            등록한 교육의 출석자 명단입니다.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleExportExcel}
            className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 "
          >
            엑셀저장
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  {/* <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    교육아이디
                  </th> */}
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                    부서
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">
                    이름
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0">
                    사원번호
                  </th>
                  <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0">
                    출석일자
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {attendanceList.map((attendance) => (
                  <tr key={attendance.attenId} className="divide-x divide-gray-200">
                    {/* <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                      {attendance.eduId}
                    </td> */}
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                      {attendance.attenDepartment}
                    </td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{attendance.attenName}</td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{attendance.attenEmployeeNumber}</td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">{formatTime(attendance.attenTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
