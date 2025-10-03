
export const getSentimentColor = (setimentNumber:number|null=null) => {
    if ( (setimentNumber && setimentNumber>0.01)) return "text-green-500"
    if ((setimentNumber && setimentNumber<-0.01)) return "text-red-500"
    return "text-yellow-500"
  }
 
 export function getNextFiveMonths(startDate:Date) {
  const result:Record<string,string> = {};
  
  // A helper function to format a date object into "YYYY-MM"
  const formatDate = (date:Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  // Loop to calculate the 5 months
  for (let i = 0; i < 5; i++) {
    // Create a new date for the target month. 
    // Setting the day to 1 prevents issues with month lengths (e.g., 31st vs 30th).
    const targetDate = new Date(startDate.getFullYear(), startDate.getMonth() - i, 1);
    
    // Assign to a key, e.g., 'current_month', 'next_month', etc.
    const key = i === 0 ? 'current_month' : `${i}_months_earlier`;
    result[key] = formatDate(targetDate);
  }

  return result;
} 
export const getSentimentBgColor = (setimentType:string) => {
    switch (setimentType) {
      case "positive":
        return "bg-green-500/10"
      case "negative":
        return "bg-red-500/10"
      case "neutral":
        return "bg-yellow-500/10"
      default:
        return "bg-gray-500/10"
    }
}
export const getSentiment=(value:number)=>{
     if(value>0.01)
        return "Positive"
      else if (value<-0.01)
        return "Negative"
      else
        return "Neutral"
  }
export const getSentimentBadgeColor = (value:number) => {
    
      if(value>0.01)
        return "bg-green-500/20 text-green-500 border-green-500/30"
      else if (value<-0.01)
        return "bg-red-500/20 text-red-500 border-red-500/30"
      else
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
    
  }