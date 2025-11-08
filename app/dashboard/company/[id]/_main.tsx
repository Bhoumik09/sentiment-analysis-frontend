"use client"

import React, { use, useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink, ChevronLeft, ChevronRight, Loader } from "lucide-react"
import Link from "next/link"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { FadeIn, ScaleIn, StaggerChildren } from "@/components/gsap-animations"
import { CompanyIntroType, CompanySentimentInfoType } from "@/types/types"
import { fetchCompanyInformation, fetchCompanyOverview } from "@/app/actions/companyInfo"
import { useFilters } from "@/hooks/_use-submission"
import { getPaginatedCompanies, getPaginatedNews } from "@/app/actions/searchPage"
import Cookies from "js-cookie"
import { NewsResults } from "@/components/news-list"
import { calculatePaginationWindow } from "@/lib/helper"
// Mock data
const mockCompanyData = {
  id: "1",
  name: "Swiggy",
  sector: "Food Delivery",
  imageUrl: "/food-delivery-startup-logo.jpg",
  description:
    "Leading online food delivery platform revolutionizing the way Indians order food with innovative technology and exceptional service quality.",
  founded: "2014",
  employees: "5000+",
  funding: "$1.3B+ Series J",
  website: "https://swiggy.com",
  headquarters: "Bangalore, India",
  keyMetrics: {
    avgSentiment: 0.65,
    totalArticles: 245,
    positiveArticles: 159,
    neutralArticles: 61,
    negativeArticles: 25,
    trendDirection: "up",
  },
  sentimentStats: {
    positive: { count: 159, percentage: 65, avgScore: 0.82 },
    neutral: { count: 61, percentage: 25, avgScore: 0.0 },
    negative: { count: 25, percentage: 10, avgScore: -0.71 },
  },
  sentimentDistribution: [
    { name: "Positive", value: 65, color: "#10b981" },
    { name: "Neutral", value: 25, color: "#f59e0b" },
    { name: "Negative", value: 10, color: "#ef4444" },
  ],
  sentimentTrend: [
    { date: "2024-01", sentiment: 0.35, articles: 32 },
    { date: "2024-02", sentiment: 0.42, articles: 38 },
    { date: "2024-03", sentiment: 0.38, articles: 35 },
    { date: "2024-04", sentiment: 0.58, articles: 42 },
    { date: "2024-05", sentiment: 0.62, articles: 48 },
    { date: "2024-06", sentiment: 0.65, articles: 50 },
  ],
  sectorComparison: [
    { date: "2024-01", swiggy: 0.35, zomato: 0.42, blinkit: 0.45 },
    { date: "2024-02", swiggy: 0.42, zomato: 0.38, blinkit: 0.5 },
    { date: "2024-03", swiggy: 0.38, zomato: 0.45, blinkit: 0.48 },
    { date: "2024-04", swiggy: 0.58, zomato: 0.52, blinkit: 0.55 },
    { date: "2024-05", swiggy: 0.62, zomato: 0.55, blinkit: 0.58 },
    { date: "2024-06", swiggy: 0.65, zomato: 0.6, blinkit: 0.62 },
  ],
  recentNews: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Swiggy ${i % 3 === 0 ? "announces expansion" : i % 3 === 1 ? "launches new feature" : "wins award"} - ${i + 1}`,
    source: ["TechCrunch", "Economic Times", "Business Standard"][i % 3],
    sentiment: [0.8, 0.5, -0.4, 0.7, 0.3, -0.2][i % 6],
    publishedAt: `2024-06-${15 - i}`,
    url: "#",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  })),
}

const ITEMS_PER_PAGE = 5
interface CompanyDashboardProps {
  companyInfo: CompanyIntroType
  sentimentInfo: CompanySentimentInfoType
  companyId: string;
}
export function CompanyDashboard({ companyInfo, sentimentInfo, companyId }: CompanyDashboardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const params = useParams();
  const searchParams = useSearchParams()
  const router = useRouter();
  const authToken = Cookies.get('user-token');
  const {
    setPage,
    getApiParams,
    
    filters
  }=useFilters();
    
  
  const { data: companyDataQuery } = useQuery({
    queryKey: ['companyInfo', companyId],
    queryFn: () => fetchCompanyInformation(companyId),
    initialData: companyInfo,
    select: (data) => ({ companyData: data?.companyOverview, avgSentiment: data?.avgSentiment }),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData
  })
  const { data: sentimentDataQuery } = useQuery({
    queryKey: ['company-sentiment-info', companyId],
    queryFn: () => fetchCompanyOverview(companyId),
    initialData: sentimentInfo,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData
  })
   const { data: companyNewsQuery,isLoading:isCompanyNewsLoading } = useQuery({
    queryKey: ['paginatedNews',getApiParams()],
    queryFn: () =>getPaginatedNews({ userToken: authToken, ...getApiParams(), searchQuery:companyDataQuery.companyData?.name }),
    staleTime: 5 * 60 *1000,
    placeholderData: keepPreviousData,
    enabled:!!companyDataQuery.companyData
  })
  
  const getPagesList = useMemo(() => {
      if(!companyNewsQuery)return[1];
      return calculatePaginationWindow(filters.page, companyNewsQuery.paginationInfo?.totalPages ? companyNewsQuery.paginationInfo?.totalPages : 1);
    }, [filters.page,companyNewsQuery]);
  

  const getSentimentColor = (sentiment: number | undefined) => {

    if (sentiment === undefined) return "text-gray-500"
    if (sentiment > 0.1) return "text-green-500"
    if (sentiment < -0.1) return "text-red-500"
    return "text-yellow-500"
  }

  const getSentimentLabel = (sentiment: number | undefined) => {
    if (sentiment === undefined) return "Unknown"
    if (sentiment > 0.1) return "Positive"
    if (sentiment < -0.1) return "Negative"
    return "Neutral"
  }
  const percentageandTotal= useMemo(():{positive:number, neutral:number, negative:number, totalArticles:number} => {
    if (!sentimentDataQuery) return { positive: 0, neutral: 0, negative: 0,totalArticles:0 };
    const total: number = sentimentDataQuery.sentimentStats.reduce((acc, stat) => acc + stat.sentimentCount, 0);
    const postivePercent: number = (sentimentDataQuery.sentimentStats.find((stat) => stat.sentiment === "positive")?.sentimentCount || 0) / total * 100;
    const neutralPercent: number = (sentimentDataQuery.sentimentStats.find((stat) => stat.sentiment === "neutral")?.sentimentCount || 0) / total * 100;
    const negativePercent: number = (sentimentDataQuery.sentimentStats.find((stat) => stat.sentiment === "negative")?.sentimentCount || 0) / total * 100;
    return { positive: postivePercent, neutral: neutralPercent, negative: negativePercent , totalArticles: total};
  }, [sentimentDataQuery])

  return (
    <div className=" bg-background">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground mt-2 sticky left-2 top-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <FadeIn>
          <div className="flex items-start justify-between gap-6 mb-8">

            <div className="flex-1 flex max-lg:flex-col gap-6">
              {/* Company Image */}
              <div className="lg:flex-shrink-0 max-lg:m-auto">
                <img
                  src={companyDataQuery.companyData?.imageUrl || "/placeholder.svg"}
                  alt={companyDataQuery.companyData?.name}
                  className="w-40 h-40 rounded-2xl border-2 border-accent/30 object-cover"
                />
              </div>
              {/* Company Info */}
              <div className="lg:flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{companyInfo?.companyOverview.name}</h1>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="text-accent border-accent/50">
                        {companyDataQuery.companyData?.sector.name}
                      </Badge>
                      <Badge className={`${getSentimentColor(companyDataQuery.avgSentiment)} bg-white/10`}>
                        {getSentimentLabel(mockCompanyData.keyMetrics.avgSentiment)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-3xl font-bold ${getSentimentColor(companyDataQuery.avgSentiment)}`}
                    >
                      {companyDataQuery.avgSentiment! > 0 ? "+" : ""}
                      {companyDataQuery.avgSentiment!.toFixed(2)}
                    </span>
                    <p className="text-sm text-muted-foreground">Average Sentiment</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 max-lg:text-center">{companyDataQuery.companyData?.description}</p>

              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <Tabs defaultValue="sentiment-stats" className="space-y-6">
            <TabsList className="bg-card/80 backdrop-blur-sm border border-border flex w-full justify-center">
              <TabsTrigger value="sentiment-stats">Sentiment Stats</TabsTrigger>
              <TabsTrigger value="recent-news">Recent News</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment-stats" className="space-y-6">
              <StaggerChildren>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                  {/* Positive */}
                  <ScaleIn>
                    <Card className="bg-gradient-to-br from-green-500/30 to-emerald-500/10 border-green-500/30 shadow-md shadow-green-300 hover:border-green-500/60 transition-colors">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-4">
                          <TrendingUp className="h-6 w-6 text-green-500" />
                          <span className="text-sm font-semibold text-green-500">
                            {percentageandTotal.positive.toFixed(2)}%
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Positive Sentiment</h3>
                        <p className="text-3xl font-bold text-green-500 mb-2">
                          {sentimentDataQuery.sentimentStats.find((stat) => stat.sentiment === "positive")?.sentimentCount}
                        </p>

                      </CardContent>
                    </Card>
                  </ScaleIn>

                  {/* Neutral */}
                  <ScaleIn>
                    <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/30 shadow-md shadow-yellow-300 hover:border-yellow-500/60 transition-colors">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-4">
                          <Minus className="h-6 w-6 text-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-500">
                            {percentageandTotal.neutral.toFixed(2)}%
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Neutral Sentiment</h3>
                        <p className="text-3xl font-bold text-green-500 mb-2">
                          {sentimentDataQuery.sentimentStats.find((stat) => stat.sentiment === "neutral")?.sentimentCount}
                        </p>

                      </CardContent>
                    </Card>
                  </ScaleIn>

                  {/* Negative */}
                  <ScaleIn>
                    <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/30 shadow-md shadow-red-300  hover:border-red-500/60 transition-colors">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-4">
                          <TrendingDown className="h-6 w-6 text-red-500" />
                          <span className="text-sm font-semibold text-red-500">
                            {percentageandTotal.negative.toFixed(2)}%
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Negative Sentiment</h3>
                        <p className="text-3xl font-bold text-green-500 mb-2">
                          {sentimentDataQuery.sentimentStats.find((stat) => stat.sentiment === "negative")?.sentimentCount}
                        </p>

                      </CardContent>
                    </Card>
                  </ScaleIn>
                </div>

                {/* Overall Stats */}
                <ScaleIn>
                  <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Overall Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Total Articles Analyzed</p>
                          <p className="text-4xl font-bold text-foreground">
                            {percentageandTotal.totalArticles}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Average Sentiment Score</p>
                          <p className="text-4xl font-bold text-accent">
                            {companyInfo?.avgSentiment.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleIn>
              </StaggerChildren>
            </TabsContent>

            <TabsContent value="recent-news" className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground">Recent News Coverage</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Latest articles and their sentiment analysis
                      </CardDescription>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Page {filters.page} of {companyNewsQuery?.paginationInfo?.totalPages}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <NewsResults results={companyNewsQuery?.paginatedNews??[]} loading={isCompanyNewsLoading}/>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage (Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      {getPagesList.map((page) => (
                        <Button
                          key={page}
                          variant={filters.page === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage (Math.min(companyNewsQuery?.paginationInfo?.totalPages!,  filters.page + 1))}
                      disabled={filters.page === companyNewsQuery?.paginationInfo?.totalPages}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <ScaleIn>
                  <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Sentiment Distribution</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Breakdown of sentiment across all articles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={mockCompanyData.sentimentDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              dataKey="value"
                              label={({ name, value }: { name: string; value: number }) => `${name} ${value}%`}
                            >
                              {mockCompanyData.sentimentDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid #06b6d4" }}
                              formatter={(value: number) => `${value}%`}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleIn>

                {/* Sector Comparison - Area Chart */}
                <ScaleIn>
                  <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Sector Sentiment Comparison</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Compare with other companies in your sector
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockCompanyData.sectorComparison}>
                            <defs>
                              <linearGradient id="colorSwiggy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid #06b6d4" }}
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="swiggy"
                              stroke="#06b6d4"
                              fill="url(#colorSwiggy)"
                              name={mockCompanyData.name}
                            />
                            <Area
                              type="monotone"
                              dataKey="zomato"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.1}
                              name="Zomato"
                            />
                            <Area
                              type="monotone"
                              dataKey="blinkit"
                              stroke="#ec4899"
                              fill="#ec4899"
                              fillOpacity={0.1}
                              name="Blinkit"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleIn>
              </div>

              {/* Sentiment Trend Line Chart */}
              <ScaleIn>
                <Card className="bg-card/80 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Sentiment Trend Analysis</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Historical sentiment score and article volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockCompanyData.sentimentTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid #06b6d4" }} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="sentiment"
                            stroke="#06b6d4"
                            strokeWidth={3}
                            dot={{ fill: "#06b6d4", r: 5 }}
                            activeDot={{ r: 7 }}
                            name="Sentiment Score"
                          />
                          <Line
                            type="monotone"
                            dataKey="articles"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ fill: "#8b5cf6", r: 4 }}
                            yAxisId="right"
                            name="Article Count"
                          />
                          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </ScaleIn>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  )
}
