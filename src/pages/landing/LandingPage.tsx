import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_SERVICES } from '../../data/mockData';
import { FairMatchingCard } from '../../components/common/FairMatchingCard';
import { RoleSwitcherModal } from '../../components/common/RoleSwitcherModal';
import { 
  Wrench, 
  Zap, 
  HeartHandshake, 
  Home, 
  Sparkles, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight, 
  Award, 
  Scale, 
  Heart, 
  Briefcase, 
  Flame,
  CalendarCheck,
  ChevronRight,
  TrendingUp,
  FileBadge
} from 'lucide-react';
import { UserRole } from '../../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, switchDemoRole } = useAuth();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6" />;
      case 'Home': return <Home className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Car': return <Car className="w-6 h-6" />;
      default: return <Wrench className="w-6 h-6" />;
    }
  };

  const handleRoleContinue = async (role: UserRole) => {
    await switchDemoRole(role);
    if (role === 'customer') navigate('/customer/dashboard');
    else if (role === 'worker') navigate('/worker/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A2332]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-[#E8DED1]">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#D05A3F]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Pill announcement badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8DED1] shadow-sm text-xs font-semibold text-slate-700 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Civic Solidarity Protocol</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#D05A3F] font-bold">100% Free For Cooperative Workers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1A2332] tracking-tight leading-[1.15] mb-6">
              Connecting Customers, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D05A3F] via-[#C97716] to-[#0D6E66]">
                Empowering Cooperative Workers
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
              A cooperative-centered platform connecting households and communities with verified local service workers. Part-time flexibility, zero commissions, and algorithmic fairness.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#D05A3F] hover:bg-[#B3442B] text-white font-semibold text-base shadow-civic-hover transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#services"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-[#E8DED1] shadow-civic transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Services</span>
              </a>
            </div>

            {/* Role Selection Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DED1] shadow-civic text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D05A3F]">Direct Role Entry</span>
                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    Continue as:
                  </h3>
                </div>
                <span className="text-xs text-slate-500 hidden sm:block">
                  Click a role to enter with full demo access
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Customer Button */}
                <button
                  onClick={() => handleRoleContinue('customer')}
                  className="group p-4 rounded-2xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 transition-all text-left flex flex-col justify-between hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0D6E66] text-white flex items-center justify-center font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#0D6E66] transition-colors">
                        CUSTOMER
                      </h4>
                      <p className="text-[11px] text-slate-500">Book home services</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0D6E66] pt-2 border-t border-teal-200/50">
                    <span>Customer Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Worker Button */}
                <button
                  onClick={() => handleRoleContinue('worker')}
                  className="group p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-all text-left flex flex-col justify-between hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#C97716] text-white flex items-center justify-center font-bold">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#C97716] transition-colors">
                        WORKER
                      </h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">Zero Fees • Part-Time</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#C97716] pt-2 border-t border-amber-200/50">
                    <span>Worker Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Admin Button */}
                <button
                  onClick={() => handleRoleContinue('admin')}
                  className="group p-4 rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200/70 transition-all text-left flex flex-col justify-between hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#1A283C] text-amber-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#1A283C] transition-colors">
                        ADMIN
                      </h4>
                      <p className="text-[11px] text-slate-500">Cooperative registry</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 pt-2 border-t border-slate-300/60">
                    <span>Admin Desk</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0D6E66] text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200">
            Household & Community Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2332]">
            Cooperative-Verified Trades
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Every technician is a certified member of a registered labor cooperative, ensuring safety, standardized pricing, and peer accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 border border-[#E8DED1] hover:border-[#D05A3F]/50 shadow-civic hover:shadow-civic-hover transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#D05A3F] flex items-center justify-center group-hover:bg-[#FBECE8] transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8DED1]">
                    from ₹{service.baseRate}/{service.rateUnit}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#D05A3F] transition-colors mb-1">
                  {service.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  {service.tagline}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{service.availableWorkersCount} active workers</span>
                </div>
                <button
                  onClick={() => {
                    navigate(`/customer/book?service=${service.id}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] group-hover:bg-[#D05A3F] text-slate-800 group-hover:text-white font-semibold text-xs transition-all flex items-center gap-1"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fair Matching Showcase */}
      <section id="fair-matching" className="py-16 bg-[#F4ECE1]/40 border-y border-[#E8DED1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FairMatchingCard />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBECE8] text-[#D05A3F] text-xs font-bold uppercase tracking-wider mb-2">
            Seamless Civic Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2332]">
            How CoopConnect Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Designed for transparent matching between local residents and autonomous cooperative members.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8DED1] shadow-civic relative">
            <span className="w-8 h-8 rounded-full bg-[#0D6E66] text-white font-bold text-sm flex items-center justify-center mb-4">
              1
            </span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Choose Service & Urgency</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Customers pick emergency or scheduled appointments, specifying task requirements and address.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-teal-50 border border-teal-100 text-xs text-[#0D6E66] flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Emergency dispatch within 45 mins</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8DED1] shadow-civic relative">
            <span className="w-8 h-8 rounded-full bg-[#C97716] text-white font-bold text-sm flex items-center justify-center mb-4">
              2
            </span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Fair Cooperative Dispatch</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The engine balances workload, part-time shifts, and trade certifications to dispatch equitable opportunities.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-[#C97716] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#C97716]" />
              <span>No algorithm favors star monopolies</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8DED1] shadow-civic relative">
            <span className="w-8 h-8 rounded-full bg-[#1A283C] text-white font-bold text-sm flex items-center justify-center mb-4">
              3
            </span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Zero-Fee Transparent Ledger</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Worker receives 100% of service charge with small democratic contribution towards cooperative welfare fund.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero commissions deducted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Triple Benefits Section */}
      <section id="worker-benefits" className="py-20 bg-white border-y border-[#E8DED1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              Cooperative Multiplier
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2332]">
              Benefits for Everyone
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              How CoopConnect restores dignity to workers, peace of mind to households, and strength to cooperatives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Worker Benefits Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#FAF8F4] border-2 border-amber-200 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#C97716] text-white flex items-center justify-center font-bold mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                  For Workers
                </h3>
                <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md mb-4">
                  PART-TIME & ZERO PLATFORM FEES
                </span>
                
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>No registration or subscription fees</strong> — 100% free to join and work.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Flexible part-time schedule matrix</strong> — declare your own working hours.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Portable Skill Passport</strong> validating your trade credentials and experience.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Cooperative Welfare & Healthcare fund</strong> support for families.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-amber-200">
                <button
                  onClick={() => handleRoleContinue('worker')}
                  className="w-full py-3 rounded-xl bg-[#C97716] hover:bg-[#A85F0C] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Worker Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Benefits Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#F8FAF9] border-2 border-teal-200 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0D6E66] text-white flex items-center justify-center font-bold mb-4">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                  For Customers
                </h3>
                <span className="inline-block text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-md mb-4">
                  VERIFIED CIVIC STANDARDS
                </span>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Police & trade-verified workers</strong> from legitimate labor cooperatives.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Transparent pricing</strong> with no surging, hidden markups, or algorithmic gouging.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Live worker tracking</strong> and OTP secure job initiation for peace of mind.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Direct community impact</strong> keeping hard-earned money in the local economy.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-teal-200">
                <button
                  onClick={() => handleRoleContinue('customer')}
                  className="w-full py-3 rounded-xl bg-[#0D6E66] hover:bg-[#0A554F] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Customer Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cooperative Benefits Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#FAF7F2] border-2 border-slate-300 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#1A283C] text-amber-400 flex items-center justify-center font-bold mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                  For Cooperatives
                </h3>
                <span className="inline-block text-xs font-bold text-slate-800 bg-slate-200 px-2.5 py-0.5 rounded-md mb-4">
                  INSTITUTIONAL GOVERNANCE
                </span>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span><strong>Digital Registry</strong> of verified members, certifications, and trade skills.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span><strong>Automated Welfare tracking</strong> creating collective safety nets for members.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span><strong>Civic Dispute Mediation</strong> preserving trust between workers and residents.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span><strong>AI Demand Insights</strong> forecasting local service needs without commercial extraction.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-300">
                <button
                  onClick={() => handleRoleContinue('admin')}
                  className="w-full py-3 rounded-xl bg-[#1A283C] hover:bg-slate-900 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Admin Governance Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
};
