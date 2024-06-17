export type ActivityLog = {
  id: number,
  type: string,
  user_id: number,
  data: string,  
  createdAt?: Date,
  updatedAt?: Date,
}