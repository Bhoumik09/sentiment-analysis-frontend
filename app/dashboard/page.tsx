import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WaterflowBackground } from "@/components/waterflow-background"
import { LiquidGlassNavbar } from "@/components/liquid-glass-navbar"
import { ResponsiveDashboardHeader } from "@/components/responsive-dashboard-header"
import { GSAPStagger, GSAPHover } from "@/components/gsap-animations"
import { TrendingUp, TrendingDown, Activity, Users, BarChart3, AlertCircle } from "lucide-react"
import { DashboardPage } from "./_main"
import { useQuery } from "@tanstack/react-query"
import { fetchDashboardData, fetchTrendingStartups } from "../actions/dashboardAnalytics"
import { cookies } from "next/headers"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import {  dashboardAnalyticsFetchType, TrendingStartupsFetchType } from "@/types/types"

const mockData = {
  totalStartups: 247,
  positiveArticles: 1834,
  negativeArticles: 456,
  neutralArticles: 892,
  avgSentiment: 0.34,
  trendingStartups: [
    { name: "Zomato", sentiment: 0.78, change: "+12%" },
    { name: "Swiggy", sentiment: 0.65, change: "+8%" },
    { name: "Paytm", sentiment: -0.23, change: "-15%" },
    { name: "Byju's", sentiment: -0.45, change: "-22%" },
  ],
}
export default async function DashboardMain() {
  const token = cookies().get('user-token');
  if (!token || !token.value) {
    return redirect('/login')
  }
  // const intialStartupTrendindData:TrendingStartupsFetchType = await fetchTrendingStartups({ token: token.value });
  // const intialDashboardData:dashboardAnalyticsFetchType=await fetchDashboardData({ token: token.value });
  

  return (

    <>
      <DashboardPage initalStartupsTrendingData={null} initialDashBoardAnalyticsData={null} token = {token.value}/>
    </>
  )
}
