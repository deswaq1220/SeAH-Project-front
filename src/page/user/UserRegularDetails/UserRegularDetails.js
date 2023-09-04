import React from "react";
import UserHeader from "../../../components/UserHeader";
import UserRegularDetailsOutput from "./UserRegularDetailsOutput";
import UserRegularDetailsTable from "./UserRegularDetailsTable";
export default function UserRegularDetails() {
  return (
    <div>
      <UserHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <UserRegularDetailsOutput />
        <UserRegularDetailsTable />
      </div>
    </div>
  );
}
