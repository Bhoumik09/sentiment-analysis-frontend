"use client"

import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink, BarChart3, Globe } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { FadeIn, ScaleIn, StaggerChildren } from "@/components/gsap-animations"

// Mock data for company details
const mockCompanyData = {
  overview: {
    description: "Leading fintech startup revolutionizing digital payments and financial services in India",
    founded: "2018",
    employees: "500-1000",
    funding: "$150M Series C",
    website: "https://example.com",
    headquarters: "Bangalore, India",
  },
  sentimentTrend: [
    { date: "2024-01", sentiment: 0.2, articles: 15 },
    { date: "2024-02", sentiment: 0.35, articles: 22 },
    { date: "2024-03", sentiment: 0.15, articles: 18 },
    { date: "2024-04", sentiment: 0.45, articles: 28 },
    { date: "2024-05", sentiment: 0.3, articles: 25 },
    { date: "2024-06", sentiment: 0.6, articles: 35 },
  ],
  sentimentDistribution: [
    { name: "Positive", value: 65, color: "#10b981" },
    { name: "Neutral", value: 25, color: "#f59e0b" },
    { name: "Negative", value: 10, color: "#ef4444" },
  ],
  recentNews: [
    {
      title: "Company raises $50M in Series B funding round",
      source: "TechCrunch",
      sentiment: 0.8,
      publishedAt: "2024-06-15",
      url: "#",
      summary: "The startup announced a successful funding round led by major venture capital firms...",
    },
    {
      title: "New product launch receives positive market response",
      source: "Economic Times",
      sentiment: 0.6,
      publishedAt: "2024-06-12",
      url: "#",
      summary: "The company's latest product offering has been well-received by early adopters...",
    },
    {
      title: "Partnership announcement with major bank",
      source: "Business Standard",
      sentiment: 0.4,
      publishedAt: "2024-06-10",
      url: "#",
      summary: "Strategic partnership aims to expand digital payment solutions across India...",
    },
  ],
  keyMetrics: {
    avgSentiment: 0.42,
    totalArticles: 156,
    positiveArticles: 102,
    neutralArticles: 39,
    negativeArticles: 15,
    trendDirection: "up",
  },
}

export default function CompanyDashboard() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const companyId = params.id as string
  const companyName = searchParams.get("name") || "Unknown Company"

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.1) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (sentiment < -0.1) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.1) return "text-green-500"
    if (sentiment < -0.1) return "text-red-500"
    return "text-yellow-500"
  }

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.1) return "Positive"
    if (sentiment < -0.1) return "Negative"
    return "Neutral"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{companyName}</h1>
                <p className="text-muted-foreground">Company ID: {companyId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getSentimentColor(mockCompanyData.keyMetrics.avgSentiment)} bg-opacity-20`}>
                {getSentimentLabel(mockCompanyData.keyMetrics.avgSentiment)}
              </Badge>
              <span className={`text-lg font-semibold ${getSentimentColor(mockCompanyData.keyMetrics.avgSentiment)}`}>
                {mockCompanyData.keyMetrics.avgSentiment > 0 ? "+" : ""}
                {mockCompanyData.keyMetrics.avgSentiment.toFixed(2)}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Key Metrics */}
        <StaggerChildren>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScaleIn>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground">Total Articles</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-2">{mockCompanyData.keyMetrics.totalArticles}</p>
                </CardContent>
              </Card>
            </ScaleIn>
            <ScaleIn>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-muted-foreground">Positive</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {mockCompanyData.keyMetrics.positiveArticles}
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>
            <ScaleIn>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Minus className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-muted-foreground">Neutral</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {mockCompanyData.keyMetrics.neutralArticles}
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>
            <ScaleIn>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Negative</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {mockCompanyData.keyMetrics.negativeArticles}
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>
          </div>
        </StaggerChildren>

        {/* Main Content */}
        <FadeIn>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-card/80 backdrop-blur-sm border border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="news">Recent News</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Company Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{mockCompanyData.overview.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Founded</span>
                          <p className="text-foreground">{mockCompanyData.overview.founded}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Employees</span>
                          <p className="text-foreground">{mockCompanyData.overview.employees}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Funding</span>
                          <p className="text-foreground">{mockCompanyData.overview.funding}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Headquarters</span>
                          <p className="text-foreground">{mockCompanyData.overview.headquarters}</p>
                        </div>
                      </div>
                      <Link href={mockCompanyData.overview.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="bg-card/80 backdrop-blur-sm border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Sentiment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          positive: { label: "Positive", color: "#10b981" },
                          neutral: { label: "Neutral", color: "#f59e0b" },
                          negative: { label: "Negative", color: "#ef4444" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={mockCompanyData.sentimentDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              dataKey="value"
                            >
                              {mockCompanyData.sentimentDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Sentiment Trend Over Time</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Track how public sentiment has changed over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      sentiment: { label: "Sentiment Score", color: "#8b5cf6" },
                      articles: { label: "Article Count", color: "#06b6d4" },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockCompanyData.sentimentTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="sentiment"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent News Coverage</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Latest articles and their sentiment analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCompanyData.recentNews.map((article, index) => (
                      <div key={index} className="p-4 rounded-lg bg-secondary/10 border border-border/50">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
                          <div className="flex items-center space-x-2">
                            {getSentimentIcon(article.sentiment)}
                            <span className={`text-sm font-medium ${getSentimentColor(article.sentiment)}`}>
                              {article.sentiment > 0 ? "+" : ""}
                              {article.sentiment.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{article.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{article.publishedAt}</span>
                          </div>
                          <Link href={article.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Read Full Article
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/80 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Article Volume Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        articles: { label: "Articles", color: "#06b6d4" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockCompanyData.sentimentTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area type="monotone" dataKey="articles" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Sentiment vs Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        sentiment: { label: "Sentiment", color: "#8b5cf6" },
                        articles: { label: "Articles", color: "#06b6d4" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockCompanyData.sentimentTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="articles" fill="#06b6d4" opacity={0.7} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  )
}
