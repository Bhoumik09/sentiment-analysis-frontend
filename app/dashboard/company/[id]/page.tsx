import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { fetchCompanyInformation, fetchCompanyOverview } from "@/app/actions/companyInfo";
import { CompanyDashboard } from "./_main";
import { AuthProvider } from "@/context/AuthContext";
import { TwinklingStars } from "@/components/twinkling-stars";
import { WaterflowBackground } from "@/components/waterflow-background";
export default async function CompanyDataPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();

  if (!cookieStore.get("user-token")) {
    return redirect('/login')
  }

  const initialDataQuery = fetchCompanyInformation(params.id);
  const companySentimentQuery = fetchCompanyOverview(params.id);
  const [initialData, companySentiment] = await Promise.all([initialDataQuery, companySentimentQuery])
  if (!initialData || !companySentiment) {
    return redirect('/not-found')
  }
  return (
    <Fragment>
      <AuthProvider>
        <TwinklingStars />
        <WaterflowBackground />
        <CompanyDashboard companyInfo={initialData} sentimentInfo={companySentiment} companyId={params.id} />
      </AuthProvider>
    </Fragment>
  );
}