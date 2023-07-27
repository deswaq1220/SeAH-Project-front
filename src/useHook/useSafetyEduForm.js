import { useState, useCallback } from "react";
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
const formDataWithFile = new FormData();
const useSafetyEduForm = () => {
  const [selected, setSelected] = useState(people[0]);
  const [selectedDuty, setSelectedDuty] = useState(duty[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    eduCategory: "", // 교육
    eduTitle: "", // 교육제목\
    eduInstructor: "", // 강사
    eduPlace: "", // 교육장소
    eduStartTime: new Date(), // 시작시간
    // eduEndTime: new Date(), // 끝나는 시간
    eduSumTime: "", // 총시간
    eduTarget: "", // 대상자
    eduContent: "", // 교육내용
    eduWriter: "",
    files: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // 기존 값과 새로운 값이 누적되는 문제를 해결하기 위해 아래와 같이 수정합니다.
      // 예를 들어, name이 'eduCategory'인 경우 이전 값의 'eduTitle'을 수정하지 않도록 합니다.
      ...(name === "eduCategory"
        ? { eduTitle: mapEduCategoryName(value) }
        : {}),
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

  // 큐알코드 생성하기 누르면 활성화되는 함수
  const handleCreate = () => {
    // const qrLink = "http://www.seahaerospace.com/kor/index.asp"; // 예시로 가정한 링크입니다. 원하는 링크로 변경해주세요.
    setIsCompleted(true); // 큐알코드 생성 완료 상태 업데이트
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);

      for (const file of acceptedFiles) {
        formDataWithFile.append("files", file);
      }

      if (acceptedFiles.length > 0) {
        setFormData({
          ...formData,
          files: acceptedFiles, // Update the file property in the formData state
        });
      }
      // alert(acceptedFiles);

      console.log(acceptedFiles);
    },
    [formData, uploadedFiles]
  );

  const deleteFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleFileChange = (event) => {
    //이거 이상함? 나중에 터지면 여기 문제일수도
    const selectedFile = event.target.files[0];
    setFormData((prevFormData) => ({ ...prevFormData, file: selectedFile }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleListboxChange = (selectedItem) => {
    setSelected(selectedItem);
    setFormData((prevData) => ({
      ...prevData,
      eduCategory: selectedItem.name,
      eduTitle: mapEduCategoryName(selectedItem.name),
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

    if (!formData.eduContent) {
      // eduContent 필드가 비어있을 경우 에러 처리
      setError("본문내용없음");
      return;
    }
    // if (formData.files) {

    //   formDataWithFile.append("files", formData.files);
    //   console.log("여기 파일"+formDataWithFile.files);
    // } else {
    //   console.log("파일없음");
    // }
    if (!formData.eduInstructor) {
      // eduInstructor 필드가 비어있을 경우 에러 처리
      setError("강사없음");
      return;
    }

    console.log(formData);

    formDataWithFile.append("eduCategory", formData.eduCategory);
    formDataWithFile.append("eduTitle", formData.eduTitle);
    formDataWithFile.append("eduInstructor", formData.eduInstructor);
    formDataWithFile.append("eduPlace", formData.eduPlace);
    formDataWithFile.append("eduStartTime", formData.eduStartTime);
    formDataWithFile.append("eduSumTime", formData.eduSumTime);
    console.log("formDataWithFile 파일" + formDataWithFile.get("files"));
    formDataWithFile.append("eduTarget", formData.eduTarget);
    formDataWithFile.append("eduContent", formData.eduContent);
    formDataWithFile.append("eduWriter", formData.eduWriter);

    try {
      const response = await axios.post(
        "http://localhost:8081/edureg",
        // // "http://172.20.10.5:3000/edureg"
        formDataWithFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // withCredentials: true, // 이 부분 추가
        }
      );

      console.log("저장내용:", formDataWithFile);
      // 저장 성공 시 처리 로직 추가
      setFormData({
        eduCategory: "",
        eduTitle: "",
        eduInstructor: "",
        eduPlace: "",
        eduStartTime: new Date(),
        eduSumTime: "",
        eduTarget: "",
        eduContent: "",
        eduWriter: "",
        files: null,
      });

      // 데이터 전송 후 formDataWithFile 초기화
      formDataWithFile.delete("eduCategory");
      formDataWithFile.delete("eduTitle");
      formDataWithFile.delete("eduInstructor");
      formDataWithFile.delete("eduPlace");
      formDataWithFile.delete("eduStartTime");
      formDataWithFile.delete("eduSumTime");
      formDataWithFile.delete("eduTarget");
      formDataWithFile.delete("eduContent");
      formDataWithFile.delete("eduWriter");
      formDataWithFile.delete("files");
      navigate("/eduMain"); // 저장 성공 후 화면 이동
    } catch (error) {
      console.log("여기 오류:", error);
      // 저장 실패 시 처리 로직 추가
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

  const qrValue = "http://172.20.10.5:3000/usereduatten";

  const handleEtcTimeChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSelectedEtcTime(newValue);

    // 기타 선택 시, eduSumTime 값을 업데이트합니다.
    if (selected.name === "ETC") {
      setFormData((prevData) => ({
        ...prevData,
        eduSumTime: newValue,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      eduCategory: "",
      eduTitle: "",
      eduInstructor: "",
      eduPlace: "",
      eduStartTime: new Date(),
      eduSumTime: "",
      eduTarget: "",
      eduContent: "",
      eduWriter: "",
      files: null,
    });

    setIsCompleted(false); // 생성 완료 상태 업데이트
    setUploadedFiles([]); // 업로드된 파일 초기화
    setError(null); // 에러 초기화
    setSelected(people[0]); // 기본 선택 항목으로 변경
    setSelectedDuty(duty[0]); // 기본 선택 항목으로 변경
    setSelectedStartTime(""); // 기본 값으로 변경
    setSelectedEtcTime(30); // 기본 값으로 변경
  };

  return {
    selected,
    selectedDuty,
    isCompleted,
    uploadedFiles,
    error,
    formData,
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
    resetForm,
  };
};

export default useSafetyEduForm;
