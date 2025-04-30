export interface IReclameAquiInfo {
  reputation: string,
  complaintsLast12Months: string,
  responseRate: string,
  customersWouldReturn: string,
  latestComplaints: { 
    title: string; 
    text: string; 
    date: string }[],
}
