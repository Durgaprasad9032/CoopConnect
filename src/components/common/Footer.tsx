import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Heart, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A2332] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#D05A3F] text-white flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl text-white tracking-tight">
                Coop<span className="text-[#E66E55]">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              A civic ledger-backed cooperative gig services platform connecting local households with vetted, dignified labor cooperative workers.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Registration & Subscription Fees for Workers</span>
            </div>
          </div>

          {/* Quick Role Dashboards */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Platform Dashboards</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/customer/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D6E66]"></span>
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/worker/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C97716]"></span>
                  Worker Part-Time Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Admin Governance Desk
                </Link>
              </li>
              <li>
                <Link to="/auth/role-select" className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-400 font-medium">
                  Switch Active Role <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Cooperative Services</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/#services" className="hover:text-white">Emergency Plumbing</Link></li>
              <li><Link to="/#services" className="hover:text-white">Domestic Electrical Safety</Link></li>
              <li><Link to="/#services" className="hover:text-white">Part-Time Caregiving</Link></li>
              <li><Link to="/#services" className="hover:text-white">Household Domestic Assistance</Link></li>
              <li><Link to="/#services" className="hover:text-white">Sanitation & Deep Cleaning</Link></li>
              <li><Link to="/#services" className="hover:text-white">Chauffeur Transit & Driving</Link></li>
            </ul>
          </div>

          {/* Cooperative Principles */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Civic Principles</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Anti-monopolistic Fair Job Distribution algorithm</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Transparent Cooperative Welfare & Healthcare Fund</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verified Skill Passports & National Trade Standards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CoopConnect. Designed with Civic Ledger Warmth for Smart India Hackathon.</p>
          <div className="flex items-center gap-6">
            <span>Built for Labor Cooperatives</span>
            <span>•</span>
            <span>Non-extractive Architecture</span>
            <span>•</span>
            <span>Firebase & React 18</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
