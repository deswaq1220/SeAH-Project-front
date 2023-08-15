import Header from "../../components/Header";
import Breadcrumbs from "./Breadcrumbs";
import FrequentInseptionTable from "./FrequentInseptionTable";
import FrequentInsArea from "./FrequentinseptionForm/area";
import EquipmentName from "./FrequentinseptionForm/equipmentName";
import Period from "./FrequentinseptionForm/Period";
import Inspector from "./FrequentinseptionForm/inspector";
//수시점검 현황
export default function FrequentIns() {
  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* 탭 */}
        <Breadcrumbs />

        {/* 여기는 검색폼 좌리*/}
        <form className="flex">
          <div className="flex flex-wrap">
            <div className="flex flex-wrap">
              <FrequentInsArea /> {/* 영역 */}
              <EquipmentName /> {/* 설비명 */}
              <Period /> {/* 기간 */}
            </div>
            <div className="flex items-center">
              <Inspector /> {/* 점검자 */}
              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2 mr-4 h-9 w-28 "
              >
                저장하기
              </button>
            </div>
          </div>
        </form>
        {/* 테이블 */}
        <FrequentInseptionTable />
      </div>
    </>
  );
}
