import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { CompanyDashboard } from "./_main";
import { fetchCompanyInformation } from "@/app/actions/companyInfo";

export default async function CompanyDataPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();

  if (!cookieStore.get("user-token")) {
    return redirect('/login')
  }
  
  const initialData = await fetchCompanyInformation(params.id);
  if (!initialData.companyOverview) {
    return redirect('/not-found')
  }
  return (
    <Fragment>
      <CompanyDashboard />
    </Fragment>
  );
}