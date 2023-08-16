import { PaperClipIcon } from "@heroicons/react/20/solid";
import UserHeader from "../../../components/UserHeader";

export default function UserFrequentDetails() {
  return (
    <div>
      <UserHeader />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-5">
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-extrabold leading-7 text-gray-900">
            수시점검
          </h3>
          <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500">
            등록한 해당 수시점검을 수정 및 조회가 가능합니다
          </p>
          <div className="flex justify-end mt-1">
            <button
              type="button"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              점검내용수정
            </button>
            <button
              type="button"
              className="rounded-md bg-seahColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2"
            >
              수정하기
            </button>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                점검일시
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                날짜 자리
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                점검자
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                부서 / 이름
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                점검영역
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                주조
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                설비명
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                직접집진기(900m2/min)
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                위험분류 및 부상부위
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                찔림 / 다리
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                위험원인
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                불안전한 행동 ...........and so on
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                실수함정
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                자만심
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                위험성평가
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                저 위험(1~2): 수용가능
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                점검내용
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                내용
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                개선대책
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                내용
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                조치요청
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                이메일@seah.com
              </dd>
            </div>
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-lg font-bold leading-6 text-gray-900">
                완료여부
              </dt>
              <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                미완료
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex justify-center my-4">
          <button
            type="button"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
          >
           확인
          </button>
          <button
            type="button"
            className="rounded-md bg-seahColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
          >
            조치완료 내용등록
          </button>
        </div>
      </div>
    </div>
  );
}
