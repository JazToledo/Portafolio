export interface Project {
  _id: string;
  name: string;
  description?: string;
  url: string;
  // image: string;
  timeAgo: string;
  startDate?: Date;
  endDate?: Date;
}
