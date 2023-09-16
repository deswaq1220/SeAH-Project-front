import React, {Fragment, useRef, useState, useEffect} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {CheckIcon} from "@heroicons/react/24/outline";
import Regularactionrequest from "../UserRegularReg/Regularactionrequest";
import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css"; // 스타일링을 위한 CSS
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import axios from "axios";
import song from "../../../img/1610879591623－1.jpg";
// 추가 플러그인을 라이브러리에 등록

registerPlugin(FilePondPluginImagePreview);

export default function DetailedModal({fetchData, actForm, index}) {
    const [open, setOpen] = useState(true);
    const modalRef = useRef(null);
    const [regularActPerson, setRegularActPerson] = useState("");
    const [regularActEmail, setRegularActEmail] = useState("");
    const [regularActContent, setRegularActContent] = useState("");
    const [files, setFiles] = useState([]);
    const [beforeFilePath, setBeforeFilePath] = useState();
    const [aftereFilePath, setAfterFilePath] = useState();

    const content = useRef();
    const [newFiles, setNewFiles] = useState([]);
    const [regularComplete, setRegularComplete] = useState([]);


    //파일 삭제
    const deleteFile = (index) => {

        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles); // Update formData with new file array
    };

    //등록버튼
    const handleSaveClick = async () => {

        // actForm 함수 호출
        actForm({
            regularActPerson: regularActPerson,
            regularActEmail: regularActEmail,
            // regularActContent: content.current.value,
            regularActContent: fetchData.regularActContent,
            files: newFiles.length > 0 ? [...newFiles,...files] : [...files],
            index: index,
        });
        setOpen(false);
    };

    const handleCancelClick = async () => {
        actForm({
            regularActPerson: fetchData.regularActPerson,
            regularActEmail: fetchData.regularActEmail,
            regularActContent: fetchData.regularActContent,
            files: fetchData.files,
            index: index,
        });
        setOpen(false);
    };

    useEffect(() => {
        const fetchRegularDetail = () => {
            setRegularActContent(fetchData.regularActContent);
            setRegularActEmail(fetchData.regularActEmail);
            setRegularActPerson(fetchData.regularActPerson);
            setBeforeFilePath(fetchData.beforeFilePath|| []);
            setAfterFilePath(fetchData.afterFilePath|| []);
            setRegularComplete(fetchData.regularComplete);
            setFiles(fetchData.files || []);
            // fetchData.files가 존재하면 해당 값을 사용하고, 그렇지 않으면 빈 배열을 사용합니다.
        }
        fetchRegularDetail();
    }, [fetchData]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                // initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <div
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-75"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </div>

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
                            <div
                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                              ref={content}
                              rows={4}
                              name="comment"
                              id="comment"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
                              defaultValue={regularActContent}
                              disabled

                          />
                                        </div>
                                        <div className="mt-10">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900"
                                            >
                                                조치자
                                            </Dialog.Title>
                                            <div className="flex flex-wrap">
                                                <div className="mt-2 mr-2">
                                                    <input
                                                        type="text"
                                                        name="inspector"
                                                        id="inspector"
                                                        defaultValue={regularActPerson}
                                                        disabled
                                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"

                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        defaultValue={regularActEmail}
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
                                            <div
                                                className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                                {fetchData?.beforeFilePath?.map((file, index) => (
                                                    <img
                                                        key={index} // 각 이미지에 고유한 key를 지정해야 합니다.
                                                        src={process.env.REACT_APP_API_BASE_URL + file}
                                                        alt=""
                                                        className="pointer-events-none object-cover group-hover:opacity-75"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-10">
                                            <Dialog.Title as="h3"
                                                          className="text-base font-semibold leading-6 text-gray-900">
                                                사진등록(후)
                                            </Dialog.Title>
                                            {/* 이미지를 표시할 부분 */}
                                            {fetchData?.afterFilePath && fetchData?.afterFilePath.length > 0 ? (
                                                <div>
                                                    {fetchData.afterFilePath.map((file, index) => (
                                                        <div key={index}>
                                                            <img
                                                                src={process.env.REACT_APP_API_BASE_URL + file}
                                                                alt=""
                                                                className="pointer-events-none object-cover group-hover:opacity-75"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                /* 파일 업로드 부분 */
                                                <div>
                                                    {files && files.length > 0 ? (
                                                        <div>
                                                            {files.map((file, index) => (
                                                                <div key={index}>
                                                                    <img
                                                                        src={URL.createObjectURL(file)}
                                                                        alt="Preview"
                                                                        className="pointer-events-none object-cover group-hover:opacity-75"
                                                                    />
                                                                    {file.name}
                                                                    <button
                                                                        onClick={() => deleteFile(index)}
                                                                        className="ml-2 text-red-600"
                                                                        type="button"
                                                                    >
                                                                        삭제
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <FilePond
                                                                key="uniqueKey"
                                                                allowMultiple={true}
                                                                maxFiles={5}
                                                                acceptedFileTypes={["image/jpeg", "image/jpg", "image/png"]}
                                                                onupdatefiles={(fileItems) => {
                                                                    const updatedFiles = [...newFiles];
                                                                    fileItems.forEach((fileItem) => {
                                                                        updatedFiles.push(fileItem.file);
                                                                    });
                                                                    setNewFiles(updatedFiles);
                                                                }}
                                                                labelIdle='클릭하거나 <span class="filepond--label-action">파일을 여기에 드롭하여 선택하세요</span>'
                                                            />
                                                        </div>
                                                    ) : (
                                                        <FilePond
                                                            key="uniqueKey"
                                                            allowMultiple={true}
                                                            maxFiles={5}
                                                            acceptedFileTypes={["image/jpeg", "image/jpg", "image/png"]}
                                                            onupdatefiles={(fileItems) => {
                                                                const updatedFiles = [...newFiles];
                                                                fileItems.forEach((fileItem) => {
                                                                    updatedFiles.push(fileItem.file);
                                                                });
                                                                setNewFiles(updatedFiles);
                                                            }}
                                                            labelIdle='클릭하거나 <span class="filepond--label-action">파일을 여기에 드롭하여 선택하세요</span>'
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {regularComplete === 'NO' ? (
                                    <div className="mt-10 mb-16 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor sm:col-start-2"
                                            onClick={handleSaveClick}
                                        >
                                            저장
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                            onClick={handleCancelClick}
                                            // ref={cancelButtonRef}
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (

                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor sm:col-start-2"
                                        onClick={handleCancelClick}
                                    >
                                        닫기
                                    </button>
                                )}
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
