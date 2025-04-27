export type ProjectRequest = {
  priorityScore: any;
  id: string;
  projectId: string;
  projectName: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  role: string;
  message: string;
  status: ProjectRequestStatus;
  createdAt: Date;
  type?: 'sent' | 'received';
};

export type ProjectRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled';
