import UserHeader from "../../components/UserHeader";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import DangerImg from "../../img/danger.png";
import Inspector from "./inspector";
import Inspectionarea from "./inspectionarea";
import Facilityname from "./facilityname";
import Danger from "./danger";
import Injured from "./injured";
import Falsetrap from "./falsetrap";
import RiskAssessment from "./riskAssessment";
import InspectionDetails from "./Inspectiondetails";
import ActionRquest from "./actionrequest";
import Dangersource from "./sourceDanger";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function UserfrequentReg() {
  return (
    <>
      <UserHeader />
      <p>수시점검</p>
      <p>수시점검 내용등록</p>
      <Inspector /> {/* 점검자 */}
      <Inspectionarea /> {/* 점검영역 */}
      <Facilityname /> {/* 설비명 */}
      <Danger /> {/* 위험분류 */}
      <Injured /> {/* 부상부위 */}
      <Dangersource/> {/* 위험원인 */}
      <Falsetrap /> {/* 실수함정 */}
      <RiskAssessment /> {/* 위험성평가 */}
      {/* 위험분류 표 */}
      <div className="flex flex-col justify-center items-center border border-gray-300 px-3 mx-3 ">
        <p className=" font-semibold text-lg">평가표</p>
        <img src={DangerImg} className=" p-3 w-100"></img>
      </div>
      <InspectionDetails /> {/* 점검내용 */}
      {/* 개선대책 */}
      <div id="ReformMeasures" className="grid sm:flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4 ml-4 ">
          개선대책
        </span>

        <div className="mt-2 ">
          <textarea
            rows={4}
            name="comment"
            id="comment"
            className="block w-72 rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 border-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 p-2 mr-3 ml-4"
            defaultValue={""}
          />
        </div>
      </div>
      <ActionRquest /> {/* 조치요청 */}
      <div className="flex justify-center w-full mt-8 mb-10">
        <button
          type="button"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
        >
          등록취소
        </button>
        <button
          type="button"
          className="rounded-md bg-seahColor px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus:outline-none"
        >
          등록
        </button>
      </div>
    </>
  );
}

export default UserfrequentReg;
