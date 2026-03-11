export interface Product {
  id: number;
  name: string;
  type: 'Individual' | 'Family';
  coverage_limit: number;
  premium_amount: number;
  is_active: number;
}

export interface Policy {
  id: string;
  product_id: number;
  product_name: string;
  coverage_limit: number;
  holder_name: string;
  holder_email: string;
  purchase_date: string;
  expiry_date: string;
  status: 'Active' | 'Expired' | 'Pending Renewal';
}

export interface Claim {
  id: number;
  policy_id: string;
  amount: number;
  description: string;
  document_path: string | null;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Settled';
  created_at: string;
  holder_name?: string;
}
