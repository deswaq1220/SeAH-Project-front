import { useState,useCallback } from 'react';
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";

const people = [
  {
    id: 1,
    name: "선택",
  },
  {
    id: 2,
    name: "CREW",
    time: 30
  },
  {
    id: 3,
    name: "DM",
    time: 20
  },
  {
    id: 4,
    name: "MANAGE",
    time : 120
  },
  {
    id: 5,
    name: "ETC",
    time: 30
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

const useSafetyEduForm = () => {
  const [selected, setSelected] = useState(people[0]);
  const [selectedDuty, setSelectedDuty] = useState(duty[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    eduCategory: "", // 교육
    eduClass: "", // 교육분류
    eduInstructor: "", // 담당자
    eduPlace: "", // 교육장소
    eduStartTime: new Date(), // 시작시간
    // eduEndTime: new Date(), // 끝나는 시간
    eduTarget: "", // 대상자
    eduContent: "", // 교육내용
    eduWriter: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const handleStartTimeChange = (e) => {
    const newValue = e.target.value;
    setSelectedStartTime(newValue);
    setFormData((prevData) => ({
      ...prevData,
      eduStartTime: newValue, // 시작시간 필드 이름 변경
    }));
  };

  // const handleEndTimeChange = (e) => {
  //   const newValue = e.target.value;
  //   setSelectedEndTime(newValue);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     eduEndTime: newValue, // 종료시간 필드 이름 변경
  //   }));
  // };

  

  const handleCreate = () => {
    // const qrLink = "http://www.seahaerospace.com/kor/index.asp"; // 예시로 가정한 링크입니다. 원하는 링크로 변경해주세요.
    setIsCompleted(true); // 생성 완료 상태 업데이트
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
      if (acceptedFiles.length > 0) {
        setFormData({
          ...formData,
          file: acceptedFiles[0], // Update the file property in the formData state
        });
      }
      alert(acceptedFiles);
      console.log(acceptedFiles);
    },
    [formData, uploadedFiles]
  );

  const deleteFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file, // Update the file property in the formData state
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  const handleListboxChange = (selectedItem) => {
    setSelected(selectedItem);
    setFormData((prevData) => ({
      ...prevData,
      eduCategory: selectedItem.name,
      eduClass: mapEduCategoryName(selectedItem.name),
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
      const formDataWithFile = new FormData();
    
      if (!formData.eduContent) {
        // eduContent 필드가 비어있을 경우 에러 처리
        setError("본문내용없음");
        return;
      }
      if (formData.file) {
        formDataWithFile.append("file", formData.file);
      } else {
        console.log("파일없음");
      }
      if (!formData.eduInstructor) {
        // eduInstructor 필드가 비어있을 경우 에러 처리
        setError("강사없음");
        return;
      }
    
      console.log(formData);
      console.log("카테고리네임", mapEduCategoryName(selected.name));
      console.log("대상자", mapDutyName(selectedDuty.name));
    
      formDataWithFile.append("eduCategory", formData.eduCategory);
      formDataWithFile.append("eduClass", formData.eduClass);
      formDataWithFile.append("eduInstructor", formData.eduInstructor);
      formDataWithFile.append("eduPlace", formData.eduPlace);
      formDataWithFile.append("eduStartTime", formData.eduStartTime);
    
      formDataWithFile.append("eduTarget", formData.eduTarget);
      formDataWithFile.append("eduContent", formData.eduContent);
      formDataWithFile.append("eduWriter", formData.eduWriter);
    
      try {
        const response = await axios.post("http://localhost:8081/edureg" , formDataWithFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // 이 부분 추가
        });
    
        console.log("저장내용:", formData);
        // 저장 성공 시 처리 로직 추가
        navigate("/eduMain"); // 저장 성공 후 화면 이동
        console.log(response.data);
      } catch (error) {
        console.log("여기?:", error);
        // 저장 실패 시 처리 로직 추가
      }
    };
  

  const [selectedEtcTime, setSelectedEtcTime] = useState(30);

  const calculateTotalTime = () => {
    if (selected.name === "ETC") {
      return `총 교육시간: ${selectedEtcTime}분`;
    } else {
      return `총 교육시간: ${selected.time || 0}분`;
    }
  };

  

  const handleEtcTimeChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSelectedEtcTime(newValue);
  };

  return{
    selected,
    selectedDuty,
    isCompleted,
    uploadedFiles,
    error,
    formData,
    handleChange,
    handleStartTimeChange,
    // handleEndTimeChange,
    handleCreate,
    onDrop,
    deleteFile,
    handleFileChange,
    getRootProps,
    getInputProps,
    isDragActive,
    // formatTimeRange,
    handleListboxChange,
    handleDutyChange,
    navigate,
    handleSubmit,
    selectedEtcTime,
    calculateTotalTime,
    handleEtcTimeChange,
    selectedStartTime,
  }
}

export default useSafetyEduForm;