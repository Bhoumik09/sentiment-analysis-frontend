import {
  fetchDashboardData,
  fetchTrendingStartups,
} from "@/app/actions/dashboardAnalytics";
import { WeekNumberLabel } from "react-day-picker";

export type TrendingStartups = {
  startupId: string;
  name: string;
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
export type CompanyIntroType ={
  companyOverview: {
    sector: {
      name: string;
      id: number;
    };
  } & {
    id: string;
    name: string;
    sectorId: number;
    description: string;
    imageUrl: string;
  };
  avgSentiment: number;
}|null
export type CompanySentimentInfoType = {
  sentimentStats:{
      sentiment: string;
      sentimentCount: number;
  }[]
};
export type CompanyRecentNewsType = {
  
};
export interface sentimentTrendAvg {
  sentiments:{
    "companyId":string;
    "companyName":string;
    "stats":{
      "time_bucket":Date;
      "avgSentiment":number;
    }[]
  }[]
}
export interface StartupResult {
  id: string;
  name: string;
  sector: { name: string };
  description: string;
  total_articles: number | null;
  avg_sentiment_score: number;
  image_url: string | null;
}
export interface StartupInfo {
  id: string;
  name: string;
}
export interface NewsPaginatedDataType {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  url: string;
  ArticlesSentiment: {
    id: string;
    sentiment: string;
    positiveScore: number;
    negativeScore:number;
    neutralScore:number;
    Startups: {
      id: string;
      name: string;
      sector: {
        name: string;
      };
    };
  }[];
}

export type TrendingStartupsFetchType = Awaited<
  ReturnType<typeof fetchTrendingStartups>
>;
export type dashboardAnalyticsFetchType = Awaited<
  ReturnType<typeof fetchDashboardData>
>;
