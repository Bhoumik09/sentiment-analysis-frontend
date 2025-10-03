import {
  fetchDashboardData,
  fetchTrendingStartups,
} from "@/app/actions/dashboardAnalytics";

export type TrendingStartups = {
  startupId: string;
  name: string;
  percentage_change: number;
  current_sentiment: number;
};
export type dashboardAnalyticsType = {
  totalStartups: number;
  startUpAnalytics: number;
  statusGrouping: {
    postiveCount: number;
    negativeCount: number;
    neutralCount: number;
    totalCount: number;
  };
  positiveTrendArticles: number;
  negativeTrendArticles: number;
  avgSentiment: number;
};
export type StartupWithStats = {
  id: string;
  name: string;
  sector: string;
  total_articles: number | null;
  avg_sentiment_score: number | null;
  latest_article_title: string | null;
  latest_article_url: string | null;
  latest_article_published_at: Date | null;
};
export type CompanyIntroType = {
  id: string;
  name: string;
  sector: string;
  description: string | null;
} | null;
export type CompanySentimentInfoType = {
  totalArticles: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  averageSentimentScore:number;

};
export type CompanyRecentNewsType = {
      title:string,
      url:string|null,
      content:string,
      publishedAt:Date,
      sentimentScores:number|null,
      sentiment:string
}
export interface sentimentTrendAvg  {
  current_month: number;
  previous_month: number;
  twoMonthsEarlier: number;
  threeMonthsEarlier: number;
  fourMonthsEarlier: number;
  fiveMonthsEarlier: number;
};
export interface StartupResult {
  id: string;
  name: string;
  sector: string;
  total_articles: number | null;
  avg_sentiment_score: number;

  latestArticles: {
    title: string | null;
    url: string | null;
    content: string | null;
    publishedAt: Date | null;
    sentimentScore: number | null;
    sentiment: string | null;
  }[];
}
export type TrendingStartupsFetchType = Awaited<
  ReturnType<typeof fetchTrendingStartups>
>;
export type dashboardAnalyticsFetchType = Awaited<
  ReturnType<typeof fetchDashboardData>
>;
