import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Regularactionrequest from "./Regularactionrequest";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css"; // 스타일링을 위한 CSS
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import axios from "axios";

// 추가 플러그인을 라이브러리에 등록
registerPlugin(FilePondPluginImagePreview);

export default function FaultyModal({ index, actForm, id }) {
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [regularActPerson, setRegularActPerson] = useState("");
  const [regularActEmail, setRegularActEmail] = useState("");
  const [regularActContent, setRegularActContent] = useState("");
  const [files, setFiles] = useState(null);
  const [content, setContent] = useState(""); // content 상태 초기화
  const [staticEmailPerson, setStaticEmailPerson] = useState([]);


  const handleContentChange = (e) => {
    // textarea 값이 변경될 때마다 content 상태 업데이트
    setContent(e.target.value);

  };


  // ActionRquest 콜백 : 조치자(이름, 이메일)
  const handleActionRequestDetailsDataChange = (data) => {
    setRegularActPerson(data.speActPerson);
    setRegularActEmail(data.speActEmail);
  };

  // 고정수신자
  const handleStaticEmailChange = (staticEmailList) => {

    // staticEmailList가 배열인 경우, 각 이메일 주소를 추출하여 배열에 추가
    const staticEmailAddresses = Array.isArray(staticEmailList)
        ? staticEmailList.map((item) => item.emailAdd)
        : [staticEmailList.emailAdd];

    setStaticEmailPerson(staticEmailAddresses);
  };

  const handleSaveClick = async()=> {
// actForm 함수 호출
      actForm({
      id: id,
      index: index,
        regularActPerson: regularActPerson,
        regularActEmail: regularActEmail,
        regularActContent : content,
        files: files,
        staticEmailPerson: staticEmailPerson,
      });
      setOpen(false);
  }

   const handleCancelClick = async()=> {
  // actForm 함수 호출
//        actForm({
//            isModal
//        });
        setOpen(false);
    }

  

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-fit items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-left sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      개선대책
                    </Dialog.Title>
                    <div className="mt-2">
                      <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
                        defaultValue={""}
                        onChange= {handleContentChange}
                      />
                    </div>
                    <div className="mt-10">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        담당자
                      </Dialog.Title>
                      <Regularactionrequest
                        onFormDataChange={handleActionRequestDetailsDataChange}
                        dataChange={handleStaticEmailChange}
                      />
                    </div>
                    <div className="mt-10">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        사진첨부
                      </Dialog.Title>
                      <FilePond
                        allowMultiple={true} // 다중 파일 업로드 허용
                        maxFiles={5} // 최대 파일 수 설정
                        acceptedFileTypes={[
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                        ]}

                        onupdatefiles={(fileItems) => {
                          // 파일 정보를 상태에 저장하거나 처리
                          const selectedFiles = fileItems.map(
                            (fileItem) => fileItem.file
                          );
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
                        labelIdle='클릭하거나 <span class="filepond--label-action">파일을 여기에 드롭하여 선택하세요</span>'
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-10 mb-16 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor sm:col-start-2"
                    // onClick={() => setOpen(false)}
                    onClick={handleSaveClick} 
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleCancelClick}
                    ref={cancelButtonRef}
                  >
                    취소
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
