import logo from "../img/logo.png";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


export default function TrainingReport() {
  const { eduId } = useParams();
  const [eduDetails, setEduDetails] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  useEffect(() => {
    // API 요청을 통해 해당 교육 아이디에 해당하는 데이터 가져오기
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/edudetails/${eduId}`, {
        
      })
      .then((response) => {
        setEduDetails(response.data);
        console.log(eduDetails);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [eduId]);

  function mapEduCategoryName(category) {
    switch (category) {
      case "선택":
        return "선택";
      case "CREW":
        return "크루미팅";
      case "DM":
        return "DM미팅";
      case "MANAGE":
        return "관리감독";
      case "ETC":
        return "기타";
      default:
        return "";
    }
  }

  useEffect(() => {
    // 교육 아이디에 맞는 출석목록 데이터를 받아오는 API 호출
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/list/${eduId}`) //세아
      // axios.get(`http://localhost:8081/usereduatten/list/${eduId}`)
      .then((response) => {
        // 받아온 출석목록 데이터를 attendanceList 상태에 저장
        setAttendanceList(response.data);
        console.log(response.data); // 여기서 출력
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  }, [eduId]);

  const formatTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };

  return (
    <div className="w-[210mm]  p-8">
      <div>
        <header className="flex justify-between">
          <img className="h-8 w-auto" src={logo} alt="" />
          <div className="flex  flex-col items-center">
            {eduDetails && (
              <p className=" font-bold text-xl">{eduDetails.eduTitle}</p>
            )}
            <p className="text-lg">안전교육수강확인서</p>
          </div>
        </header>
        <section className="flex ">
          <div className="flex ">
            <div className="w-[150px] flex justify-center items-center text-lg font-bold border-black border-l border-t">
              1.일시
            </div>
            <table className="w-[310px]">
              <tr className="border border-black">
                <td className="p-1 border-r border-black text-center">날짜</td>
                <td className="p-1">
                  {formatTime(eduDetails && eduDetails.eduStartTime)}
                </td>
              </tr>
              <tr className="border border-black">
                <td className="p-1 border-r border-black text-center">시간</td>
                <td className="p-1">{eduDetails && eduDetails.eduSumTime}분</td>
              </tr>
              <tr className="border-x border-black">
                <td className="p-1 border-r border-black text-center">장소</td>
                <td className="p-1">{eduDetails && eduDetails.eduPlace}</td>
              </tr>
            </table>
          </div>
          <div className="flex  ">
            <div className="w-[120px] flex justify-center items-center text-lg  border-black border-t text-lg font-bold">
              2.강사
            </div>
            <div className="w-[149.7px] flex justify-center items-center text-lg  border-black border-l border-t border-r">
              {eduDetails && eduDetails.eduInstructor}
            </div>
          </div>
        </section>
        <section className="border flex border-black ">
          <table className="">
            <tr>
              <td className=" p-1 border-black text-lg font-bold">3.분류</td>
              <td className="p-1 border-black ">
                {mapEduCategoryName(eduDetails && eduDetails.eduCategory)}
              </td>
            </tr>
          </table>
        </section>
        <section className="border-x flex border-black ">
          <table className="">
            <tr>
              <td className=" p-1 border-b border-black w-[210mm] text-lg font-bold">
                4.교육내용 요약
              </td>
            </tr>
            <tr className="flex">
              <td className=" p-4  border-black w-[97mm] h-[350px] sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                <p>{eduDetails && eduDetails.eduContent}</p>
              </td>
            </tr>
          </table>
        </section>
        <section className="border-x  border-y flex border-black ">
          <table className="">
            <tr>
              <td className=" p-1 w-[210mm] text-lg font-bold">5.참석자</td>
            </tr>
            <tr>
              <td className=" p-1 w-[210mm] border-t border-r text-center border-black">
                소속
              </td>
              <td className=" p-1 w-[210mm] border-black text-center border-t border-r">
                성명
              </td>
              <td className=" p-1 w-[210mm] border-black text-center border-t ">
                사원번호
              </td>
            </tr>
            {attendanceList.map((attendance) => (
              <tr key={attendance.attenId}>
                <td className=" p-1 w-[210mm] border-t border-r text-center border-black">
                  {attendance.attenDepartment}
                </td>
                <td className=" p-1 w-[210mm] border-black text-center border-t border-r">
                  {attendance.attenName}
                </td>
                <td className=" p-1 w-[210mm] border-black text-center border-t ">
                  {attendance.attenEmployeeNumber}
                </td>
              </tr>
            ))}
          </table>
        </section>
        <section className="border-x border-b flex border-black ">
          <table className="">
            <tr>
              <td className=" p-1 border-b border-black w-[210mm] text-center text-lg font-bold">
                교육사진
              </td>
            </tr>
            <tr className="flex">
              <td className=" p-4  border-black  w-[97mm] h-[350px]">
                <p> {eduDetails && eduDetails.eduFileUrl
                ? eduDetails.eduFileUrl.map((file, index) => (
                    <img
                      key={index}
                      src={process.env.REACT_APP_API_BASE_URL + file}
                      alt={`사진 ${index + 1}`}
                    />
                  ))
                : "첨부된 사진이 없습니다"}</p>
              </td>
            </tr>
          </table>
        </section>
      </div>
    </div>
  );
}
