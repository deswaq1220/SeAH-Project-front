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
        <UserRegularTable/>
      </div>
    </div>
  );
}
