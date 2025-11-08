"use server"; 
import { api } from "@/lib/constants";
import {
  CompanyIntroType,
  CompanyRecentNewsType,
  CompanySentimentInfoType,
  sentimentTrendAvg,
} from "@/types/types";
import axios from "axios"; // or your preferred fetching library
import { cookies } from "next/headers";
// Assuming your API types are in a separate file

// Define your fetcher functions
export const fetchCompanyInformation = async (
  companyId: string
): Promise<CompanyIntroType> => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("user-token")?.value;
  const response = await axios.get(`${api}/company/${companyId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data as  CompanyIntroType ;
};

export const fetchCompanyOverview = async (
  companyId: string
): Promise<CompanySentimentInfoType > => {
    const cookieStore = cookies();

  const authToken = cookieStore.get("user-token")?.value;

  const response = await axios.get(`${api}/company/overview/${companyId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data as  CompanySentimentInfoType ;
};

export const fetchRecentNews = async (
  companyId: string
): Promise<{ recentNews: CompanyRecentNewsType[] }> => {
    const cookieStore = cookies();

  const authToken = cookieStore.get("user-token")?.value;

  const response = await axios.get(`${api}/company/recent-news/${companyId}`, {
    headers: {
      Authorization: `Bearer ${authToken} `,
    },
  });
  return response.data as { recentNews: CompanyRecentNewsType[] };
};

export const fetchSentimentTrend = async (
  companyId: string
): Promise<{ sentimentTrendOverPeriod: sentimentTrendAvg }> => {
    const cookieStore = cookies();

  const authToken = cookieStore.get("user-token")?.value;

  const response = await axios.get(
    `${api}/company/sentiment-trend/${companyId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken} `,
      },
    }
  );
  return response.data as { sentimentTrendOverPeriod: sentimentTrendAvg };
};

export const fetchAnalysisTrend = async (
  companyId: string
): Promise<{ month: Date; articleCount: number }[]> => {
    const cookieStore = cookies();

  const authToken = cookieStore.get("user-token")?.value;
  const response = await axios.get(
    `${api}/company/company-analysis-trend/${companyId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken} `,
      },
    }
  );
  return response.data as { month: Date; articleCount: number }[];
};
