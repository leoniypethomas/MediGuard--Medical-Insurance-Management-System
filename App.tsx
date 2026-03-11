import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronRight,
  Filter,
  Download,
  Upload,
  User,
  LogOut,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addYears, isAfter } from 'date-fns';
import { Product, Policy, Claim } from './types';

// --- Components ---

const Navbar = ({ view, setView, userEmail, setUserEmail }: any) => (
  <nav className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="bg-emerald-600 p-2 rounded-lg">
        <Shield className="text-white w-6 h-6" />
      </div>
      <span className="text-xl font-bold text-zinc-900 tracking-tight">MediGuard</span>
    </div>
    
    <div className="flex items-center gap-6">
      <button 
        onClick={() => setView('customer')}
        className={`text-sm font-medium transition-colors ${view === 'customer' ? 'text-emerald-600' : 'text-zinc-500 hover:text-zinc-900'}`}
      >
        Customer Portal
      </button>
      <button 
        onClick={() => setView('admin')}
        className={`text-sm font-medium transition-colors ${view === 'admin' ? 'text-emerald-600' : 'text-zinc-500 hover:text-zinc-900'}`}
      >
        Admin Panel
      </button>
      
      {userEmail && (
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
          <div className="text-right">
            <p className="text-xs text-zinc-500 font-medium">Logged in as</p>
            <p className="text-sm font-semibold text-zinc-900">{userEmail}</p>
          </div>
          <button 
            onClick={() => setUserEmail('')}
            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  </nav>
);

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', type: 'Individual', coverage_limit: 500000, premium_amount: 5000 });

  useEffect(() => {
    fetchProducts();
    fetchClaims();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchClaims = async () => {
    const res = await fetch('/api/admin/claims');
    const data = await res.json();
    setClaims(data);
  };

  const toggleProduct = async (id: number, current: number) => {
    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: current === 0 })
    });
    fetchProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    setShowAddProduct(false);
    fetchProducts();
  };

  const updateClaimStatus = async (id: number, status: string) => {
    await fetch(`/api/claims/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchClaims();
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Product Catalog</h2>
            <p className="text-zinc-500 mt-1">Manage insurance plans and coverage rules.</p>
          </div>
          <button 
            onClick={() => setShowAddProduct(true)}
            className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Plan Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Coverage Limit</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Premium</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">{p.name}</td>
                  <td className="px-6 py-4 text-zinc-600">{p.type}</td>
                  <td className="px-6 py-4 text-zinc-600">${p.coverage_limit.toLocaleString()}</td>
                  <td className="px-6 py-4 text-zinc-600">${p.premium_amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleProduct(p.id, p.is_active)}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      {p.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-zinc-900">Claims Queue</h2>
          <p className="text-zinc-500 mt-1">Review and process reimbursement requests.</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Policy ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Holder</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {claims.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-zinc-600">{c.policy_id}</td>
                  <td className="px-6 py-4 text-zinc-900 font-medium">{c.holder_name}</td>
                  <td className="px-6 py-4 text-zinc-600">${c.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    {c.status === 'Submitted' && (
                      <>
                        <button 
                          onClick={() => updateClaimStatus(c.id, 'Approved')}
                          className="text-xs font-bold text-emerald-600 uppercase tracking-wider hover:underline"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateClaimStatus(c.id, 'Rejected')}
                          className="text-xs font-bold text-red-600 uppercase tracking-wider hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">Create New Plan</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Plan Name</label>
                  <input 
                    required
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Type</label>
                  <select 
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.type}
                    onChange={e => setNewProduct({...newProduct, type: e.target.value as any})}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Coverage Limit ($)</label>
                  <input 
                    type="number"
                    required
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.coverage_limit}
                    onChange={e => setNewProduct({...newProduct, coverage_limit: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Premium Amount ($)</label>
                  <input 
                    type="number"
                    required
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newProduct.premium_amount}
                    onChange={e => setNewProduct({...newProduct, premium_amount: Number(e.target.value)})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg font-medium hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Create Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomerPortal = ({ userEmail, setUserEmail }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filter, setFilter] = useState({ type: 'All', maxPremium: 50000 });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<'details' | 'payment' | 'success'>('details');
  const [purchaseData, setPurchaseData] = useState({ name: '', email: userEmail || '' });
  const [showClaimModal, setShowClaimModal] = useState<string | null>(null);
  const [claimData, setClaimData] = useState({ amount: '', description: '', file: null as File | null });

  useEffect(() => {
    fetchProducts();
    if (userEmail) fetchPolicies();
  }, [userEmail]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.filter((p: Product) => p.is_active));
  };

  const fetchPolicies = async () => {
    const res = await fetch(`/api/my-policies?email=${userEmail}`);
    const data = await res.json();
    setPolicies(data);
  };

  const handlePurchase = async () => {
    const res = await fetch('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: selectedProduct?.id,
        holder_name: purchaseData.name,
        holder_email: purchaseData.email
      })
    });
    if (res.ok) {
      setUserEmail(purchaseData.email);
      setPurchaseStep('success');
      fetchPolicies();
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('policy_id', showClaimModal!);
    formData.append('amount', claimData.amount);
    formData.append('description', claimData.description);
    if (claimData.file) formData.append('document', claimData.file);

    await fetch('/api/claims', {
      method: 'POST',
      body: formData
    });
    setShowClaimModal(null);
    setClaimData({ amount: '', description: '', file: null });
  };

  const filteredProducts = products.filter(p => 
    (filter.type === 'All' || p.type === filter.type) && 
    p.premium_amount <= filter.maxPremium
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-zinc-900 tracking-tight">Protect what matters most.</h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto">Flexible medical insurance plans designed for individuals and families. Simple, transparent, and reliable.</p>
      </section>

      {/* Discovery UI */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Available Plans</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg">
              {['All', 'Individual', 'Family'].map(t => (
                <button 
                  key={t}
                  onClick={() => setFilter({...filter, type: t})}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter.type === t ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Max Premium: ${filter.maxPremium}</span>
              <input 
                type="range" min="1000" max="50000" step="1000"
                value={filter.maxPremium}
                onChange={e => setFilter({...filter, maxPremium: Number(e.target.value)})}
                className="accent-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map(p => (
            <motion.div 
              key={p.id}
              whileHover={{ y: -4 }}
              className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{p.type}</span>
                <Shield className="text-emerald-600 w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">{p.name}</h3>
              <div className="space-y-2 mb-6 flex-grow">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Coverage Limit</span>
                  <span className="font-semibold text-zinc-900">${p.coverage_limit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Network Hospitals</span>
                  <span className="font-semibold text-zinc-900">5000+</span>
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Annual Premium</p>
                  <p className="text-2xl font-bold text-zinc-900">${p.premium_amount.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedProduct(p)}
                  className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard */}
      {userEmail && (
        <section className="pt-16 border-t border-zinc-200">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900">My Policies</h2>
              <p className="text-zinc-500 mt-1">Manage your active coverage and claims.</p>
            </div>
          </div>

          {policies.length === 0 ? (
            <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center">
              <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 font-medium">No active policies found for this email.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {policies.map(pol => (
                <div key={pol.id} className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-zinc-900">{pol.product_name}</h3>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{pol.status}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Policy ID</p>
                        <p className="font-mono text-sm font-semibold">{pol.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Coverage</p>
                        <p className="font-semibold">${pol.coverage_limit.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Purchased</p>
                        <p className="font-semibold">{format(new Date(pol.purchase_date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Expires</p>
                        <p className="font-semibold">{format(new Date(pol.expiry_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 justify-center">
                    <button 
                      onClick={() => setShowClaimModal(pol.id)}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> File Claim
                    </button>
                    <button className="text-zinc-600 px-6 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 border border-zinc-200">
                      <Download className="w-4 h-4" /> Policy Doc
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              {purchaseStep === 'details' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold">Policyholder Details</h3>
                    <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-zinc-100 rounded-full"><XCircle className="w-6 h-6 text-zinc-400" /></button>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <p className="text-sm text-zinc-500">Selected Plan</p>
                    <p className="text-lg font-bold text-zinc-900">{selectedProduct.name}</p>
                    <p className="text-emerald-600 font-bold">${selectedProduct.premium_amount.toLocaleString()} / year</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                      <input 
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="John Doe"
                        value={purchaseData.name}
                        onChange={e => setPurchaseData({...purchaseData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                      <input 
                        className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="john@example.com"
                        value={purchaseData.email}
                        onChange={e => setPurchaseData({...purchaseData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setPurchaseStep('payment')}
                    disabled={!purchaseData.name || !purchaseData.email}
                    className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}

              {purchaseStep === 'payment' && (
                <div className="space-y-6 text-center py-4">
                  <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Mock Payment</h3>
                  <p className="text-zinc-500">This is a simulation. No real charges will be made.</p>
                  <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 text-left">
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-500">Amount to Pay</span>
                      <span className="font-bold text-xl">${selectedProduct.premium_amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setPurchaseStep('details')}
                      className="flex-1 py-4 border border-zinc-200 rounded-xl font-bold hover:bg-zinc-50"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePurchase}
                      className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </div>
              )}

              {purchaseStep === 'success' && (
                <div className="space-y-6 text-center py-8">
                  <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-bold">Policy Issued!</h3>
                  <p className="text-zinc-500">Your insurance is now active. You can view your policy details in the dashboard.</p>
                  <button 
                    onClick={() => {
                      setSelectedProduct(null);
                      setPurchaseStep('details');
                    }}
                    className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Claim Modal */}
      <AnimatePresence>
        {showClaimModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-2">Submit Reimbursement</h3>
              <p className="text-zinc-500 mb-6 text-sm">Policy: <span className="font-mono font-bold text-zinc-900">{showClaimModal}</span></p>
              
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Claim Amount ($)</label>
                  <input 
                    type="number"
                    required
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={claimData.amount}
                    onChange={e => setClaimData({...claimData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Describe the medical event..."
                    value={claimData.description}
                    onChange={e => setClaimData({...claimData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Upload Documents (PDF/JPG)</label>
                  <div className="border-2 border-dashed border-zinc-200 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer relative">
                    <input 
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => setClaimData({...claimData, file: e.target.files?.[0] || null})}
                    />
                    <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500">{claimData.file ? claimData.file.name : 'Click or drag hospital bills here'}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowClaimModal(null)}
                    className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg font-medium hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Submit Claim
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [userEmail, setUserEmail] = useState('');

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar view={view} setView={setView} userEmail={userEmail} setUserEmail={setUserEmail} />
      
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {view === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AdminPanel />
            </motion.div>
          ) : (
            <motion.div
              key="customer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CustomerPortal userEmail={userEmail} setUserEmail={setUserEmail} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-zinc-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="text-emerald-600 w-6 h-6" />
            <span className="text-xl font-bold text-zinc-900">MediGuard</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 MediGuard Insurance Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Privacy Policy</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Terms of Service</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-900">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
