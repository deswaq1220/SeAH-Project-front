import { PaperClipIcon } from "@heroicons/react/20/solid";
import Header from "../../components/Header";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function SafetyEduDetails() {
  const handleExport = () => {
    // 엑셀 데이터 생성 로직 작성
    /* 나중에 데이터 뿌려주는 작업하고 다시 동적으로 해봐야함  */
    const data = [
      {
        title: "[집체교육] 제 1차 사무직 안전교육",
        time: "2023-07-13 14:00 ~ 15:00",
        duration: "1시간",
        content: "사무직 안전교육입니다. 참석 바랍니다",
        attachments: [
          { name: "안전교육 참석1.jpeg", size: "2.4mb" },
          { name: "안전교육 참석2.jpeg", size: "4.5mb" },
        ],
      },
    ];
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
    saveAs(excelFile, "안전교육.xlsx");
  };

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-2xl">
        <div className="px-4 sm:px-0 mt-16 flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              [집체교육] 제 1차 사무직 안전교육
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              2023-07-13 14:00 ~ 15:00
            </p>
          </div>
          <div>
          <button
            type="submit"
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
          >
            수정하기
          </button>
          <button
            type="submit"
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
          >
            저장하기
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
                1시간
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-base font-bold leading-6 text-gray-900">
                교육내용
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 whitespace-pre-wrap ">
                
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-base font-bold leading-6 text-gray-900">
                첨부파일
              </dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          안전교육 참석1.jpeg
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          2.4mb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-seahColor hover:text-seahDeep"
                      >
                        파일저장
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          안전교육 참석2.jpeg
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          4.5mb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href="#"
                        className="font-medium text-seahColor hover:text-seahDeep"
                      >
                        파일저장
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-6 pr-3 pb-3 flex items-center justify-center gap-x-6 ">
          
          <div>
          <button
            type="submit"
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
          >
            QR코드  
          </button>
          <button
            type="submit"
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mr-1"
          >
            출석현황
          </button>
          <button
            type="button"
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
            onClick={handleExport}
          >
            엑셀 저장
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
