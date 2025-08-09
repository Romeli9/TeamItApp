export interface ProjectRequest {
  priorityScore: any;
  HardSkills: any;
  SoftSkills: any;
  id: string;
  projectId: string;
  projectName: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  role: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
  type?: 'sent' | 'received';
}
