import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotificationModal from "../components/Notification";
// import { useCookies } from "react-cookie";
import {useCookies} from "react-cookie"
import fetcher from "../api/fetcher"
const people = [
  {
    id: 1,
    name: "선택",
  },
  {
    id: 2,
    name: "CREW",
    time: 30,
  },
  {
    id: 3,
    name: "DM",
    time: 20,
  },
  {
    id: 4,
    name: "MANAGE",
    time: 120,
  },
  {
    id: 5,
    name: "ETC",
    time: 30,
  },
];

// 한글 값 매핑 함수
function mapEduCategoryName(category) {
  switch (category) {
    case "선택":
      return "[선택]";
    case "CREW":
      return "[크루미팅]";
    case "DM":
      return "[DM미팅]";
    case "MANAGE":
      return "[관리감독]";
    case "ETC":
      return "[기타]";
    default:
      return "";
  }
}

const duty = [
  {
    id: 1,
    name: "선택",
  },
  {
    id: 2,
    name: "T",
  },
  {
    id: 3,
    name: "O",
  },
  {
    id: 4,
    name: "F",
  },
];
// 한글 값 매핑 함수
function mapDutyName(duty) {
  switch (duty) {
    case "선택":
      return "[선택]";
    case "T":
      return "[전체]";
    case "O":
      return "[사무직]";
    case "F":
      return "[현장직]";
    default:
      return "";
  }
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const useSafetyEduForm = (eduData) => {
  const formDataWithFile = new FormData();
  const [selected, setSelected] = useState(people[0]);
  const [selectedDuty, setSelectedDuty] = useState(duty[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [atCookies, setAtCookie] = useCookies(["at"]); // 쿠키 훅
  const [rtCookies, setrtCookie] = useCookies(["rt"]); // 쿠키 훅
  const [formData, setFormData] = useState({
    eduCategory: "", // 교육
    eduTitle: "", // 교육제목\
    eduInstructor: "", // 강사
    eduPlace: "", // 교육장소
    eduStartTime: new Date(), // 현재 시간으로 설정
    // eduEndTime: new Date(), // 끝나는 시간
    eduSumTime: "", // 총시간
    eduTarget: "", // 대상자
    eduContent: "", // 교육내용
    eduWriter: "",
    files: null,
    eduId: "",
  });


  const { eduId } = useParams();
  useEffect(() => {
    const fetchEduDetails = async () => {
      const authToken = atCookies["at"]; // 사용자의 인증 토큰을 가져옵니다.
      console.log("여기는 전달이 안된다",authToken)
      try {
        const response = await fetcher.get(`/edudetails/${eduId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setFormData(response.data);

        const accessToken = response.data.access_token;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        console.log("왜??",response.data.accessToken)
      } catch (error) {
        console.error("교육 세부 정보를 가져오는 중 에러 발생:", error);
      }
    };

    fetchEduDetails();
  }, [eduId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [selectedStartTime, setSelectedStartTime] = useState("");
  // const [selectedEndTime, setSelectedEndTime] = useState("");

  const handleStartTimeChange = (e) => {
    const newValue = e.target.value;
    setSelectedStartTime(newValue);
    setFormData((prevData) => ({
      ...prevData,
      eduStartTime: newValue, // 시작시간 필드 이름 변경
    }));
  };

  // 큐알버튼 누르면 생성도는 버튼
  const handleCreate = () => {
    setIsCompleted(true); // 생성 완료 상태 업데이트
    // setQrValue(JSON.stringify({ ...formData, eduId: eduData.eduId }));
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);

      // for (const file of acceptedFiles) {
      //   formData.append("files", file);
      // }

      if (acceptedFiles.length > 0) {
        setFormData({
          ...formData,
          files: acceptedFiles, // Update the file property in the formData state
        });
      }

      console.log(acceptedFiles);
    },
    [formData, uploadedFiles]
  );

  const deleteFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
    setFormData((prevData) => ({ ...prevData, files: updatedFiles })); // Update formData with new file array
  };

  const handleFileChange = (event) => {
    //이거 이상함? 나중에 터지면 여기 문제일수도
    const selectedFile = event.target.files[0];
    setFormData((prevFormData) => ({ ...prevFormData, file: selectedFile }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // 교육 카테고리를 선택했을 때 호출되는 함수
  const handleListboxChange = (selectedItem) => {
    setSelected(selectedItem);
    if (selectedItem.name === "ETC") {
      // 기타 카테고리인 경우 selectedEtcTime 값을 formData.eduSumTime으로 설정
      setFormData((prevData) => ({
        ...prevData,
        eduCategory: selectedItem.name,
        eduTitle: mapEduCategoryName(selectedItem.name),
        eduSumTime: selectedEtcTime,
      }));
    } else {
      // 기타 카테고리가 아닌 경우 선택한 카테고리의 시간 값을 formData.eduSumTime으로 설정
      setFormData((prevData) => ({
        ...prevData,
        eduCategory: selectedItem.name,
        eduTitle: mapEduCategoryName(selectedItem.name),
        eduSumTime: selectedItem.time,
      }));
    }
  };

  // 기타 카테고리에서 셀렉트 박스의 옵션을 변경했을 때 호출되는 함수
  const handleOptionChange = (e) => {
    const { value } = e.target;
    setSelectedEtcTime(Number(value)); // 선택한 값을 숫자로 변환하여 selectedEtcTime 상태를 업데이트
    setFormData((prevData) => ({
      ...prevData,
      eduSumTime: Number(value), // 선택한 값을 숫자로 변환하여 formData.eduSumTime을 업데이트
    }));
  };

  const handleDutyChange = (value) => {
    setSelectedDuty(value);
    setFormData((prevData) => ({
      ...prevData,
      eduTarget: value.name,
    }));
  };

  // 교육등록 핸들러
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.eduContent || !formData.eduInstructor) {
      setError("본문 내용 또는 강사를 입력하세요.");
      return;
    }
    console.log("여긴가1?: " + formData.eduContent);
    formDataWithFile.append("eduCategory", formData.eduCategory);
    formDataWithFile.append("eduTitle", formData.eduTitle);
    formDataWithFile.append("eduInstructor", formData.eduInstructor);
    formDataWithFile.append("eduPlace", formData.eduPlace);
    formDataWithFile.append("eduStartTime", formData.eduStartTime);
    formDataWithFile.append("eduSumTime", formData.eduSumTime);
    formDataWithFile.append("eduTarget", formData.eduTarget);
    formDataWithFile.append("eduContent", formData.eduContent);
    formDataWithFile.append("eduWriter", formData.eduWriter);

    console.log("여긴가?: " + formDataWithFile.eduTitle);
    const authToken = atCookies["at"];
    console.log("여기는 포스트",authToken)
    try {
      if (formData.eduId) {
        // 기존 교육 데이터를 수정하는 경우 (PUT 요청)
        const response = await fetcher.post(
          //  `http://localhost:8081/edudetails/${formData.eduId}`,
          `/edudetails/${formData.eduId}`, //세아
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("수정 결과:", response.data);
        const accessToken = response.data.access_token;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      } else {
        // 새로운 교육 데이터를 등록하는 경우 (POST 요청)
        const response = await fetcher.post(
          //  "http://localhost:8081/edureg",
          `/edureg`, // 세아
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          }
        );
        console.log("등록 결과:", response.data);
        const accessToken = response.data.access_token;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        
      }

      // 성공적으로 저장되면 알림 띄우기
      setShowNotification(true);
      // 3초 후에 알림이 자동으로 사라지도록 설정
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      // 저장 성공 시 처리 로직 추가
      navigate("/eduMain"); // 저장 성공 후 화면 이동
    } catch (error) {
      console.error("저장/수정 에러:", error);
      // 저장/수정 실패 시 처리 로직 추가
    }
  };

  const [selectedEtcTime, setSelectedEtcTime] = useState(30);

  const calculateTotalTime = () => {
    if (selected.name === "ETC") {
      return `총 교육시간: ${selectedEtcTime}분`;
    } else {
      formData.eduSumTime = selected.time;
      return `총 교육시간: ${selected.time || 0}분`;
    }
  };

  const handleEtcTimeChange = (event) => {
    const { value } = event.target;
    setSelectedEtcTime(Number(value));
  };

  return {
    selected,
    selectedDuty,
    isCompleted,
    uploadedFiles,
    error,
    formData,
    setFormData,
    handleChange,
    handleStartTimeChange,
    handleCreate,
    onDrop,
    deleteFile,
    handleFileChange,
    getRootProps,
    getInputProps,
    isDragActive,
    handleListboxChange,
    handleDutyChange,
    navigate,
    handleSubmit,
    selectedEtcTime,
    calculateTotalTime,
    handleEtcTimeChange,
    selectedStartTime,
    qrValue,
    handleOptionChange,
    showNotification,
  };
};

export default useSafetyEduForm;
