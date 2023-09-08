import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Regularactionrequest from "../UserRegularReg/Regularactionrequest";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css"; // 스타일링을 위한 CSS
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import axios from "axios";
import song from "../../../img/1610879591623－1.jpg";
// 추가 플러그인을 라이브러리에 등록
registerPlugin(FilePondPluginImagePreview);

export default function DetailedModal({cancel}) {
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [files, setFiles] = useState(null);
  // const []
  // ActionRquest 콜백 : 조치자(이름, 이메일)

const  handleCancelClick = () =>{
  const cancel = false;
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
                      />
                    </div>
                    <div className="mt-10">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        점검자
                      </Dialog.Title>
                      <div className="flex flex-wrap">
                      <div className="mt-2 mr-2">
                        <input
                          type="text"
                          name="inspector"
                          id="inspector"
                          // defaultValue=""
                          disabled
                          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                          placeholder="정수인"
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          // defaultValue=""
                          disabled
                          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                          placeholder="cutysexy@seah.co.kr"
                        />
                      </div>
                      </div>
                    </div>
                    <div className="mt-10">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        사진등록(전)
                      </Dialog.Title>
                      <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                        <img
                          src={song}
                          alt=""
                          className="pointer-events-none object-cover group-hover:opacity-75"
                        />
                      </div>
                    </div>
                    <div className="mt-10">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        사진등록(후)
                      </Dialog.Title>
                      <FilePond
                        allowMultiple={true} // 다중 파일 업로드 허용
                        maxFiles={5} // 최대 파일 수 설정
                        acceptedFileTypes={[
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                        ]}
                        // 엔드포인트는 백엔드 구현되면 연결요
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
//                    onClick={handleSaveClick}
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
