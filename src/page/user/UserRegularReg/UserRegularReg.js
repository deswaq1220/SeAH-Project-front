import UserHeader from "../../../components/UserHeader";
import InspectionItem from "./InspectionItem";
import InspectionArea from "./InspectionArea";
import Inspector from "./Inspector";
import UserRegularTable from "./UserRegularTable";

export default function UserRegularReg() {
  return (
    <div className="container mx-auto sm:px-6 lg:px-8">
      <UserHeader />
      <div className="p-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900 ml-4">
          정기점검 등록
        </h1>
        <div id="ReformMeasures" className="flex items-center">
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            점검항목
          </span>
          <InspectionItem />
        </div>

        <div id="ReformMeasures" className="flex items-center">
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            점검구역
          </span>
          <InspectionArea />
        </div>

        <div id="ReformMeasures" className="flex items-center flex-wrap">
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4">
            점검자
          </span>
          <Inspector />
        </div>
        <UserRegularTable />

        
      </div>
    </div>
  );
}
