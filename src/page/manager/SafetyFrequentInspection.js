import Header from "../../components/Header";
import Breadcrumbs from "./Breadcrumbs";
import FrequentInseptionTable from "./FrequentInseptionTable";
import FrequentInsArea from "./FrequentinseptionForm/area";
import EquipmentName from "./FrequentinseptionForm/equipmentName";

export default function FrequentIns() {
  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* 탭 */}
        <Breadcrumbs />

        {/* 여기는 검색폼 좌리*/}
        <div className="flex flex-wrap">
          <FrequentInsArea /> {/* 영역 */}
          <EquipmentName /> {/* 설비명 */}
        </div>

        {/* 테이블 */}
        <FrequentInseptionTable />
      </div>
    </>
  );
}
