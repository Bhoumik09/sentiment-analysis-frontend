"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, ExternalLink, Calendar, BarChart3, ArrowRight } from "lucide-react"
import { StartupResult, } from "@/types/types"
import { formatDistanceToNow } from 'date-fns';
import { getSentiment, getSentimentBadgeColor, getSentimentColor } from "@/lib/helper"
import { getSentimentIcon } from "./sentiment-Icon"




interface SearchResultsProps {
  results: StartupResult[]
  loading: boolean
}

export function SearchResults({ results, loading }: SearchResultsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const router = useRouter()

  

  

  const handleStartupClick = (startupId: string, startupName: string) => {
    router.push(`/dashboard/company/${startupId}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-card/80 backdrop-blur-sm border-border animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-secondary rounded mb-2"></div>
              <div className="h-4 bg-secondary rounded w-3/4 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-secondary rounded w-16"></div>
                <div className="h-6 bg-secondary rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
          <p className="text-muted-foreground">Try adjusting your search query or filters to find more startups.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card
          key={result.id}
          className="bg-card/80 backdrop-blur-sm border-border hover:border-accent/50 transition-all duration-200 group cursor-pointer"
          onClick={() => handleStartupClick(result.id, result.name)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center space-x-2 text-foreground group-hover:text-accent transition-colors">
                  <span className="text-lg">{result.name}</span>
                  {getSentimentIcon(result?.avg_sentiment_score!)}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription className="text-muted-foreground">{result?.sector}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getSentimentBadgeColor(result?.avg_sentiment_score!)}>{getSentiment(result?.avg_sentiment_score!)}</Badge>
                <span className={`text-sm font-medium ${getSentimentColor(result?.avg_sentiment_score!)}`}>
                  {result?.avg_sentiment_score! > 0 ? "+" : ""}
                  {result?.avg_sentiment_score!.toFixed(2)}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* {result.latestArticles[0]  && (
              <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-border/50">
                <h4 className="text-sm font-semibold text-foreground mb-2">Latest News</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{result.latest_article_title}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    
                  </div>
                  <Link
                    href={result.latest_article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-accent hover:text-accent/80 text-xs flex items-center space-x-1"
                  >
                    <span>Read Full</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )} */}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>{result.total_articles} articles</span>
                </span>
                <span className="hidden items-center space-x-1 sm:flex">
                  <Calendar className="h-4 w-4" />
                  <span> {!result.latestArticles[0]  ?"No Articles":`Latest news was  ${ result.latestArticles[0].publishedAt && formatDistanceToNow(result?.latestArticles[0]?.publishedAt)}`}</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedCard(expandedCard === result.id ? null : result.id)
                }}
                className="text-accent hover:text-accent/80"
              >
                {expandedCard === result.id ? "Hide Details" : "View Details"}
              </Button>
            </div>
            <div>
              <span className="flex items-center space-x-1 sm:hidden text-sm">
                  <Calendar className="h-4 w-4" />
                  <span> {!result.latestArticles[0]  ?"No Articles":`Latest news was  ${ result.latestArticles[0].publishedAt && formatDistanceToNow(result?.latestArticles[0]?.publishedAt)}`}</span>
                </span>
            </div>
            {expandedCard === result.id && (
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Recent Articles</h4>
                <div className="space-y-3">
                  {result.latestArticles.map((article, index) => (
                    article &&
                    <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-secondary/10">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-foreground mb-1">{article.title}</h5>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          {/* <span>{article.source}</span> */}
                          <span>{article.publishedAt &&formatDistanceToNow(article.publishedAt!) } ago</span>
                          <span className={getSentimentColor(article.sentimentScore)}>
                            {article.sentimentScore && article.sentimentScore >= 0 ? "+" : ""}
                            {article?.sentimentScore?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={article.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
