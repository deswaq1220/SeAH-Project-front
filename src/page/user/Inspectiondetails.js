import {useEffect, useState} from "react";
import { toast } from "react-toastify";

export default function InspectionDetails({onFormDataChange, defaultState ,complete}){
  const [content, setContent] = useState();

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length > 300) {
      toast.warn("점검내용은 최대 300자까지 입력 가능합니다.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      setContent(value.slice(0, 300));
    } else {
      setContent(value);
    }
    onFormDataChange(value);
  };

  // 수정/완료등록일 경우
  useEffect(() => {
    if (defaultState) {
      setContent(defaultState);
    }
  }, [defaultState]);


  return(
    // {/* 점검내용 */}
    <div id="Inspectiondetails" className="grid sm:flex items-baseline justify-start">
      <span className="w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4 ml-4">
        점검내용
      </span>

      <div className="mt-2 ">
        <textarea
          rows={4}
          name="comment"
          id="comment"
          className="block w-72 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 p-2 mr-3 ml-4"
          defaultValue={''}
          placeholder={"내용을 입력하세요. 300자 이내 작성"}
          value={content}
          required
          onChange={handleContentChange}
          readOnly={complete}
        />
      </div>
    </div>
  )
}