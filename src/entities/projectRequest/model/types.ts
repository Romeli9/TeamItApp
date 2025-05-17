export type ProjectRequest = {
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
  priorityScore: number;
  HardSkills: string[];
  SoftSkills: string[];
};

export type ProjectRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'cancelled';
