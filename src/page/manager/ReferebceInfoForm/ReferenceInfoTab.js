import { useState } from "react";
import EmailTable
 from "../ReferenceInfoTable/EmailTable";
 import FacilityTable from "../ReferenceInfoTable/FacilityTable";
import DepartmentTable from "../ReferenceInfoTable/DepartmentTable";
 
const tabs = [
  { name: '설비 관리',  component: [ <FacilityTable />], current: true },
  { name: '조치담당자 관리', component: [<EmailTable />], current: false },
  { name: '부서 관리', component: [<DepartmentTable/>], current: false },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function InfoTab() {
  const [currentTab, setCurrentTab] = useState(tabs.find((tab) => tab.current));

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };


  return (
    <div className="px-8 mt-2">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-seahColor focus:outline-none focus:ring-seahColor sm:text-sm"
          value={currentTab.name}
          onChange={(e) => {
            const selectedTab = tabs.find((tab) => tab.name === e.target.value);
            if (selectedTab) {
              handleTabChange(selectedTab);
            }
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
               <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab === currentTab
                    ? 'border-seahColor text-seahColor'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                )}
                onClick={() => setCurrentTab(tab)}
                aria-current={tab === currentTab ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div>
        {Array.isArray(currentTab.component) ? (
          currentTab.component.map((comp, index) => (
            <div key={index}>{comp}</div>
          ))
        ) : (
          <div>{currentTab.component}</div>
        )}
      </div>
    </div>
  )
}
