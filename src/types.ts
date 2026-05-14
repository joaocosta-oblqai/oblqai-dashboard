export type Deliverable = {
  title: string;
  filename?: string;
  type?: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'md' | 'html' | 'other';
  url?: string | null;
  description?: string;
  date?: string;
};

export type Customer = {
  id: string;
  slug?: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  vertical?: string;
  verticalPackage?: string;
  tier?: string;
  stage?: string;
  market?: string;
  setupFee?: number;
  mrr?: number;
  nextAction?: string;
  nextActionDate?: string;
  lastTouch?: string;
  notes?: string;
  deliverables?: Deliverable[];
};

export type Cost = {
  id: string;
  description: string;
  customerIds?: string[];
  scope?: string;
  date?: string;
  category?: string;
  vendor?: string;
  amountEur?: number;
  amountUsd?: number;
  cadence?: string;
  notes?: string;
};

export type Activity = {
  id: string;
  activity: string;
  customerIds?: string[];
  date?: string;
  type?: string;
  status?: string;
  details?: string;
  nextStep?: string;
  nextStepDue?: string;
};

export type Update = {
  date: string;
  headline: string;
  body: string[];
};

export type Task = {
  id: string;
  title: string;
  status: 'Todo' | 'In progress' | 'Done' | string;
  owner?: string;
  description?: string;
  dueDate?: string;
  customerIds?: string[];
  notes?: string;
};

export type Snapshot = {
  generatedAt: string;
  customers: Customer[];
  costs: Cost[];
  activities: Activity[];
  updates?: Update[];
  globalDocs?: Deliverable[];
  tasks?: Task[];
};
