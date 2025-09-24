"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { WaterflowBackground } from "@/components/waterflow-background"
import { LiquidGlassNavbar } from "@/components/liquid-glass-navbar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { FilterSelect} from "@/components/search-filters"
import { SearchResults } from "@/components/search-results"
import { Factory, Filter, IconNode, LoaderPinwheel, NotebookText, Search, SlidersHorizontal, TrendingUp } from "lucide-react"
import { ResponsiveDashboardHeader } from "@/components/responsive-dashboard-header"
import { FairyLights } from "@/components/fairy-lights"
import { TwinklingStars } from "@/components/twinkling-stars"
import { useAuth } from "@/context/AuthContext"
// import { useFilters } from "./_use-submission"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getPaginatedCompanies } from "../actions/searchPage"
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@radix-ui/react-select"
import { useFilters } from "./_use-submission"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Mock data for search results
const mockResults = [
  {
    id: "1",
    name: "Zomato",
    industry: "Foodtech",
    sentiment: 0.78,
    sentimentLabel: "Positive",
    articleCount: 45,
    lastUpdated: "2 hours ago",
    recentArticles: [
      {
        title: "Zomato reports strong Q3 growth with 25% increase in orders",
        source: "Economic Times",
        sentiment: 0.85,
        publishedAt: "2 hours ago",
        url: "#",
      },
      {
        title: "Zomato expands grocery delivery to 10 new cities",
        source: "TechCrunch",
        sentiment: 0.72,
        publishedAt: "5 hours ago",
        url: "#",
      },
    ],
  },
  {
    id: "2",
    name: "Paytm",
    industry: "Fintech",
    sentiment: -0.23,
    sentimentLabel: "Negative",
    articleCount: 32,
    lastUpdated: "1 hour ago",
    recentArticles: [
      {
        title: "Paytm faces regulatory challenges in digital payments",
        source: "Business Standard",
        sentiment: -0.45,
        publishedAt: "1 hour ago",
        url: "#",
      },
      {
        title: "Paytm stock drops 5% amid market concerns",
        source: "Mint",
        sentiment: -0.32,
        publishedAt: "3 hours ago",
        url: "#",
      },
    ],
  },
  {
    id: "3",
    name: "Swiggy",
    industry: "Foodtech",
    sentiment: 0.45,
    sentimentLabel: "Positive",
    articleCount: 28,
    lastUpdated: "3 hours ago",
    recentArticles: [
      {
        title: "Swiggy launches new subscription model for frequent users",
        source: "LiveMint",
        sentiment: 0.65,
        publishedAt: "3 hours ago",
        url: "#",
      },
      {
        title: "Swiggy partners with local restaurants for exclusive deals",
        source: "YourStory",
        sentiment: 0.38,
        publishedAt: "6 hours ago",
        url: "#",
      },
    ],
  },
]

export const SearchPage = () => {
  const { authData } = useAuth();
  //use custom hook for filter management
  const {
    filters,
    debouncedSearch,
    hasActiveFilters,
    getApiParams,
    setIndustry,
    setLimit,
    setPage,
    setSentiment,
    setSentimentLimit,
    setSearch,
    clearFilters
  } = useFilters()
  const { data: companiesListResponse, refetch,isRefetching, isLoading } = useQuery({
    queryKey: ['paginatedCompanies', getApiParams()],
    queryFn: () => getPaginatedCompanies({ userToken: authData.token, ...getApiParams() }),
    enabled: !!authData.token,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    
  });
  const companies = companiesListResponse?.startups || [];
  const paginationInfo = companiesListResponse?.meta;

  //handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, [setSearch]);
  const handleSemtimentChange = useCallback((value: string) => {
    setSentiment(value)
  }, [setSentiment]);
  const handleSentimentLimitChange = useCallback((value: number) => {
    setSentimentLimit(value)
  }, [setSentimentLimit])
  const handleIndustryChange = useCallback((value: string) => {
    setIndustry(value)
  }, [setIndustry]);
  const industryOptions=useMemo(()=>[
     { value: 'all', label: 'All Industries' },
    { value: 'Fintech', label: 'Fintech' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Medical', label: 'Medical' }
  ], [])
  const setimentOptions = useMemo(() => [
    { value: 'all', label: 'All Sentiments' },
    { value: 'positive', label: 'PostiveSentiment' },
    { value: 'negative', label: 'Negative Sentiment' },
    { value: 'neutral', label: 'Neutral Sentiment' }
  ], []);
  const limitOptions = useMemo(
    () => [
      { value: "25", label: "25" },
      { value: "50", label: "50" },
      { value: "100", label: "100" },
    ],
    []
  );
  const totalPages = paginationInfo?.totalPages;
  
  const [showFilters, setShowFilters] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gsap").then(({ gsap }) => {
        gsap.fromTo(
          contentRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        )
      })
    }
  }, [])

  

  

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WaterflowBackground />
      <FairyLights />

      <div className="md:ml-64">
        <ResponsiveDashboardHeader
          title="Dashboard Overview"
          subtitle="Real-time sentiment analysis for Indian startups"
        />
        <main className="p-6 w-full" ref={contentRef}>
          {/* Search Bar */}
          <div className="mb-6 w-full">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for startups (e.g., Zomato, Paytm, Swiggy...)"
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-accent focus:border-accent"
                />
              </div>
              <div className="flex gap-2">
                {/* <Button
                  onClick={}
                  className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Search
                </Button> */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-4 border-accent text-accent hover:bg-accent hover:text-accent-foreground sm:hidden"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full ">
            {/* Filters Sidebar */}
            <Card className=" border-none bg-card/0 lg:col-span-4 ">
              <CardHeader className="bg-card p-2 rounded-lg w-auto">
                <div className="flex items-center gap-7 justify-between">
                  <CardTitle className="flex items-center space-x-2 ">
                    <Filter className="h-5 w-5 text-accent" />
                    <span>Filter</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {isRefetching && <LoaderPinwheel className="animate-spin"/>}
                    <Button variant="secondary" size="sm" onClick={clearFilters} className="text-muted-foreground">
                      Clear All
                    </Button>
                    {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            </Button> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent className={`space-x-6 space-y-6 flex `}>
                {/* Sentiment Filter */}
                <FilterSelect Icon={<TrendingUp className="h-4 w-4 text-accent"/> } placeholder="Sentiment Type" options={setimentOptions} value={filters.sentiment} onValueChange={handleSemtimentChange} className="p-2 rounded-lg bg-input  border-border text-foreground"/>
                <FilterSelect Icon={<Factory className="h-4 w-4 text-accent"/>} placeholder={"Industry Type"} options={industryOptions} value={filters.industry} onValueChange={handleIndustryChange} className="p-2 rounded-lg bg-input  border-border text-foreground"/>
                                <FilterSelect Icon={<NotebookText className="h-4 w-4 text-accent"/>} placeholder={"Paper Limit"} options={limitOptions} value={String(filters.limit)} onValueChange={setLimit} className="p-2 rounded-lg bg-input  border-border text-foreground"/>


              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="lg:col-span-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                </h2>
              </div>
              <SearchResults results={companies} loading={isLoading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
