import React from 'react';
import { Users2, ShieldCheck, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { DEMO_USERS } from '../../data/mockData';

export const AdminCustomersPage: React.FC = () => {
  const customers = [
    DEMO_USERS.customer,
    {
      uid: 'cust-99',
      name: 'Kavita Menon',
      email: 'kavita.menon@example.com',
      photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      role: 'customer' as const,
      phone: '+91 98451 11223',
      address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru',
      createdAt: '2023-11-20T10:00:00Z',
    },
    {
      uid: 'cust-42',
      name: 'Aditya Roy',
      email: 'aditya.roy@example.com',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      role: 'customer' as const,
      phone: '+91 99160 88776',
      address: 'B-203, Renaissance Park, Malleshwaram, Bengaluru',
      createdAt: '2024-02-14T15:30:00Z',
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-civic flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Household Registry
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-0.5">
            Registered Customers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Households engaging cooperative services across municipal districts.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-teal-50 text-[#0D6E66] border border-teal-200 self-start sm:self-auto">
          Active Households
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-civic overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-6">Customer Name</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Residential Ward Address</th>
              <th className="py-3.5 px-4">Member Since</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.uid} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'}
                      alt={c.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <strong className="block text-slate-900">{c.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">UID: {c.uid}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-600">
                  <div className="space-y-0.5">
                    <span className="block">{c.email}</span>
                    <span className="text-slate-400 font-mono">{c.phone}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-700 max-w-xs truncate">
                  {c.address}
                </td>
                <td className="py-4 px-4 text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Verified Household
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
