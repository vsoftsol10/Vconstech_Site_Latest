import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect ,useRef } from 'react';
import pricingHeroVideo from '../assets/pricing-hero.mp4';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
const ERP_API_BASE_URL = (
  import.meta.env.VITE_ERP_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5001/api'
).replace(/\/$/, '');
const WEBSITE_API_BASE_URL = (import.meta.env.VITE_WEBSITE_API_BASE_URL || '/api').replace(/\/$/, '');

const getPricingLookupParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {
    userId: searchParams.get('userId') || '',
    customerId: searchParams.get('customerId') || searchParams.get('crmCustomerId') || searchParams.get('erpCustomerId') || '',
    crmCustomerId: searchParams.get('crmCustomerId') || '',
    erpCustomerId: searchParams.get('erpCustomerId') || '',
    email: searchParams.get('email') || ''
  };

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => String(value || '').trim())
  );
};

const buildQueryString = (params) => new URLSearchParams(params).toString();

const normalizePlanName = (value) =>
  String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');

const hasActiveSelectedPlan = (customer, planName) =>
  normalizePlanName(customer?.subscriptionStatus) === 'subscription_active' &&
  normalizePlanName(customer?.subscriptionPlan) === normalizePlanName(planName);

const isTrialPlan = (planName) => ['trial', 'free trial', 'trail'].includes(normalizePlanName(planName));

const isAdvancedPlan = (planName) => {
  const normalized = normalizePlanName(planName);
  return normalized.includes('advanced') || normalized === 'advance' || normalized === 'pro';
};

const getPlanSortRank = (planName) => {
  const normalized = normalizePlanName(planName);
  if (['trial', 'free trial', 'trail'].includes(normalized)) return 1;
  if (normalized === 'basic') return 2;
  if (normalized === 'premium') return 3;
  if (isAdvancedPlan(normalized)) return 4;
  return 99;
};

const sortPricingPlans = (plans) =>
  [...plans].sort((a, b) => {
    const rankDiff = getPlanSortRank(a.name) - getPlanSortRank(b.name);
    if (rankDiff !== 0) return rankDiff;
    return normalizePlanName(a.name).localeCompare(normalizePlanName(b.name));
  });

const formatPlanPrice = (plan) => {
  if (isAdvancedPlan(plan?.name) && (plan?.price === null || plan?.price === undefined || Number(plan?.price) === 0)) {
    return null;
  }

  const priceText = String(plan?.price ?? '').trim();
  const numericText = priceText.replace(/[^0-9.]/g, '');
  if (!numericText) return priceText || null;

  const numeric = Number(numericText);
  if (!Number.isFinite(numeric)) return plan?.price ? String(plan.price) : null;

  return `₹${numeric.toLocaleString('en-IN')}`;
};

const isPlanVisible = (plan) => {
  if (plan?.is_active === false || plan?.active === false || plan?.enabled === false) return false;
  const status = normalizePlanName(plan?.status || plan?.plan_status);
  return !['inactive', 'disabled', 'disable', 'off', 'archived'].includes(status);
};

const getFeatureLabel = (feature) =>
  String(feature?.feature_name || feature?.name || feature || '').trim();

const isFeatureAdvanced = (feature) =>
  normalizePlanName(feature?.tier) === 'advanced' ||
  normalizePlanName(feature?.category_name) === 'advanced';

const isAdvancedProjectFeature = (feature) => {
  const label = normalizePlanName(feature?.label || feature);
  return label.includes('advanced project management') || label.includes('advance project management');
};

const toWebsitePlan = (plan) => {
  const features = Array.isArray(plan?.features)
    ? plan.features
        .map((feature, index) => ({
          id: feature?.id || `${plan.id || plan.name}-feature-${index}`,
          label: getFeatureLabel(feature),
          categoryName: feature?.category_name || '',
          tier: feature?.tier || '',
          displayOrder: Number.isFinite(Number(feature?.display_order))
            ? Number(feature.display_order)
            : index,
          isAdvanced: isFeatureAdvanced(feature),
        }))
        .filter((feature) => feature.label)
    : [];

  const advancedParent = features.find(isAdvancedProjectFeature);
  const advancedFeatures = features.filter(
    (feature) => feature.isAdvanced && feature.id !== advancedParent?.id
  );
  const displayFeatures = [];
  let advancedDropdownAdded = false;

  features.forEach((feature) => {
    if (feature.id === advancedParent?.id) {
      if (advancedFeatures.length > 0) {
        displayFeatures.push({
          ...feature,
          label: feature.label || 'Advanced project management',
          isAdvancedDropdown: true,
          children: advancedFeatures,
        });
        advancedDropdownAdded = true;
      } else {
        displayFeatures.push(feature);
      }
      return;
    }

    if (!feature.isAdvanced) {
      displayFeatures.push(feature);
    }
  });

  if (!advancedDropdownAdded && advancedFeatures.length > 0) {
    displayFeatures.push({
      id: `${plan.id || plan.name}-advanced-dropdown`,
      label: 'Advanced project management',
      isAdvancedDropdown: true,
      children: advancedFeatures,
    });
  }

  return {
    id: plan.id,
    name: plan.name,
    price: formatPlanPrice(plan),
    gst: Number(plan?.price || 0) > 0 && !isTrialPlan(plan.name) ? '+ GST' : '',
    period: plan.duration || '',
    description: plan.description || '',
    features,
    displayFeatures,
    popular: isAdvancedPlan(plan.name),
  };
};

const DEFAULT_PRICING_PLANS = sortPricingPlans([
  {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    duration: '7 days',
    description: 'Explore Vconstech ERP with the essential tools to evaluate your workflow.',
    features: [
      { feature_name: 'Project dashboard' },
      { feature_name: 'Lead and customer management' },
      { feature_name: 'Basic reports' },
      { feature_name: 'Email support' },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    duration: '/ month',
    description: 'Simple construction ERP tools for small teams getting organized.',
    features: [
      { feature_name: 'Project management' },
      { feature_name: 'Customer and lead tracking' },
      { feature_name: 'Billing management' },
      { feature_name: 'Standard reports' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    duration: '/ month',
    description: 'A complete plan for growing teams that need stronger operational control.',
    features: [
      { feature_name: 'Everything in Basic' },
      { feature_name: 'Cost estimation' },
      { feature_name: 'Material management' },
      { feature_name: 'Advanced reports and analytics' },
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 0,
    duration: '',
    description: 'Custom ERP support for larger teams with advanced project needs.',
    features: [
      { feature_name: 'Everything in Premium' },
      { feature_name: 'Advanced project management' },
      { feature_name: 'Custom member pricing' },
      { feature_name: 'Priority implementation support' },
    ],
  },
].map(toWebsitePlan));

const fetchPricingPlans = async () => {
  const response = await fetch(`${WEBSITE_API_BASE_URL}/plans`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to load plans');
  }

  return Array.isArray(data) ? data : [];
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const UPIIcon = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#6B3FA0" />
    <path d="M24 10L34 20H28V30H20V20H14L24 10Z" fill="white" />
    <path d="M24 38L14 28H20V18H28V28H34L24 38Z" fill="#00BCD4" />
  </svg>
);

const CardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="#1a1a2e" fill="none" />
    <path d="M2 10H22" stroke="#1a1a2e" strokeWidth="2" />
    <rect x="5" y="14" width="4" height="2" rx="0.5" fill="#1a1a2e" />
    <rect x="11" y="14" width="3" height="2" rx="0.5" fill="#1a1a2e" />
  </svg>
);


const NetBankingIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21" stroke="#1a5276" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M3 10H21" stroke="#1a5276" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 3L21 10H3L12 3Z" fill="#1a5276" />
    <path d="M6 10V21" stroke="#1a5276" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 10V21" stroke="#1a5276" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 10V21" stroke="#1a5276" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);


const CheckoutPanel = ({ plan, onClose, onCancel, pricingCustomer }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [coupon, setCoupon] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    city: '',
    address: '',
    customMembers: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const hasLockedCustomer = Boolean(pricingCustomer?.userId);


  useEffect(() => {
    if (!pricingCustomer) return;

    setForm(prev => ({
      ...prev,
      name: pricingCustomer.name || prev.name,
      email: pricingCustomer.email || prev.email,
      phone: String(pricingCustomer.phone || prev.phone).replace(/\D/g, '').slice(-10),
      companyName: pricingCustomer.companyName || prev.companyName,
      city: pricingCustomer.city || prev.city,
      address: pricingCustomer.address || prev.address,
    }));
  }, [pricingCustomer]);

  const updateForm = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  if (!plan) return null;

  const advancedPrice = isAdvancedPlan(plan.name)
    ? (parseInt(form.customMembers) || 0) * 1000
    : 0;

  const priceNum = isAdvancedPlan(plan.name)
    ? advancedPrice
    : (plan.price ? parseInt(plan.price.replace(/[^0-9]/g, '')) : 0);

  const tax   = Math.round(priceNum * 0.18);
  const total = priceNum + tax;

  const paymentMethods = [
    { id: 'upi',        label: 'UPI',                sublabel: 'Pay via UPI ID',             Icon: UPIIcon        },
    { id: 'card',       label: 'Credit / Debit Card', sublabel: 'Visa, Mastercard, Rupay',    Icon: CardIcon       },
    { id: 'netbanking', label: 'Net Banking',          sublabel: 'All major banks supported',  Icon: NetBankingIcon },
  ];

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim())        errors.name        = 'Name is required';
    if (!form.email.trim())       errors.email       = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.phone.trim())       errors.phone       = 'Phone is required';
    else if (form.phone.length !== 10) errors.phone  = 'Phone must be 10 digits';
    if (!form.companyName.trim()) errors.companyName = 'Company name is required';
    if (!form.city.trim())        errors.city        = 'City is required';
    if (!form.address.trim())     errors.address     = 'Address is required';
    if (isAdvancedPlan(plan.name)) {
      if (!form.customMembers || parseInt(form.customMembers) < 1)
        errors.customMembers = 'Enter number of members (min 1)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!plan) return;

    if (hasActiveSelectedPlan(pricingCustomer, plan.name)) {
      setFormErrors({
        form: `Your ${plan.name} subscription is already active. Please choose a different plan.`
      });
      return;
    }

    if (!validateForm()) return;

    if (paymentMethod === 'upi' && !upiId.trim()) {
      alert('Please enter your UPI ID to continue.');
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      alert('Unable to load payment gateway. Please check your connection and try again.');
      return;
    }

    const purchaseFlow = hasLockedCustomer ? 'TRIAL_UPGRADE' : 'DIRECT_WEBSITE_PURCHASE';
    const purchaseData = {
      purchaseFlow,
      userId: pricingCustomer?.userId || '',
      customerId: pricingCustomer?.crmCustomerId || pricingCustomer?.erpCustomerId || '',
      crmCustomerId: pricingCustomer?.crmCustomerId || '',
      erpCustomerId: pricingCustomer?.erpCustomerId || '',
      name: form.name,
      companyName: form.companyName,
      email: form.email,
      phone: form.phone,
      plan: plan.name,
    };

    let orderData;

    try {
      const orderResponse = await fetch(`${WEBSITE_API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle: plan.period,
          customMembers: isAdvancedPlan(plan.name) ? form.customMembers : null,
          purchaseFlow,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            companyName: form.companyName,
            city: form.city,
            address: form.address,
          },
          pricingCustomer: {
            userId: pricingCustomer?.userId || '',
            crmCustomerId: pricingCustomer?.crmCustomerId || '',
            erpCustomerId: pricingCustomer?.erpCustomerId || '',
          },
        })
      });

      orderData = await orderResponse.json().catch(() => ({}));

      if (!orderResponse.ok || orderData.success === false) {
        throw new Error(orderData.message || 'Unable to create payment order.');
      }
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      alert(error?.message || 'Unable to create payment order. Please try again.');
      return;
    }

    const razorpayOrder = orderData?.data?.order;
    if (!razorpayOrder?.id || !razorpayOrder?.amount) {
      alert('Unable to create payment order. Please try again.');
      return;
    }

    const razorpayKeyId = orderData?.data?.razorpayKeyId || RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      alert('Payment gateway is not configured. Please try again later.');
      return;
    }

    const options = {
      key: razorpayKeyId,
      amount: razorpayOrder?.amount,
      currency: 'INR',
      name: 'Vconstech',
      description: `${plan.name} Plan (${plan.period})`,
      order_id: razorpayOrder?.id,
      handler: async function (response) {
        console.log('Razorpay payment success:', response);
        try {
          const verifyResponse = await fetch(`${WEBSITE_API_BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response?.razorpay_order_id,
              razorpay_payment_id: response?.razorpay_payment_id,
              razorpay_signature: response?.razorpay_signature,
              purchaseData,
            })
          });

          const verifyData = await verifyResponse.json().catch(() => ({}));

          if (!verifyResponse.ok || verifyData.success === false) {
            throw new Error(verifyData.message || 'Payment verification failed.');
          }

          const params = new URLSearchParams({
            ...purchaseData,
            paymentId: response?.razorpay_payment_id || '',
          });
          navigate(`/payment-success?${params.toString()}`);
        } catch (error) {
          console.error('Payment verification failed:', error);
          const params = new URLSearchParams({
            plan: plan.name,
            returnTo: `${window.location.pathname}${window.location.search}`
          });
          navigate(`/payment-failed?${params.toString()}`);
        }
      },
      prefill: {
        name:    form.name,
        email:   form.email,
        contact: form.phone,
      },
      notes: {
        purchaseFlow,
        userId:        pricingCustomer?.userId || '',
        customerId:    pricingCustomer?.crmCustomerId || pricingCustomer?.erpCustomerId || '',
        crmCustomerId: pricingCustomer?.crmCustomerId || '',
        erpCustomerId: pricingCustomer?.erpCustomerId || '',
        name:          form.name,
        email:         form.email,
        phone:         form.phone,
        companyName:   form.companyName,
        city:          form.city,
        address:       form.address,
        package:       plan.name,
        customMembers: isAdvancedPlan(plan.name) ? form.customMembers : null,
      },
      theme: { color: '#ffbe01' },
      modal: {
        ondismiss: function () {
          onCancel?.(plan);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response);
      const params = new URLSearchParams({
        plan: plan.name,
        returnTo: `${window.location.pathname}${window.location.search}`
      });
      navigate(`/payment-failed?${params.toString()}`);
    });
    razorpay.open();
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[10000] transition-opacity duration-300"
            onClick={() => { setShowSuccessModal(false); onClose(); }}
          />
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) { setShowSuccessModal(false); onClose(); }
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
              style={{ animation: 'modalIn 0.4s cubic-bezier(0.4,0,0.2,1)' }}
            >
              <style>{`
                @keyframes modalIn {
                  from { transform: scale(0.9); opacity: 0; }
                  to   { transform: scale(1);   opacity: 1; }
                }
              `}</style>

              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
   
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                {hasLockedCustomer
                  ? 'Your subscription is being activated on your existing ERP account.'
                  : 'Your account is being set up. Check your email for login credentials.'}
              </p>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-sm text-blue-800">
                  {hasLockedCustomer ? (
                    <>
                      <span className="font-semibold">Use your existing login</span> - your password remains unchanged
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Check your email</span> - your ERP login details will arrive shortly
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={() => { setShowSuccessModal(false); onClose(); }}
                className="w-full bg-[#ffbe01] text-black font-semibold py-3 rounded-xl hover:bg-yellow-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300" onClick={onClose} />

      {/* Side Panel */}
      <div
        className="fixed bottom-0 right-0 z-[9999] bg-white shadow-2xl flex flex-col
                   w-full h-[92vh]
                   sm:top-0 sm:bottom-auto sm:h-full sm:w-[420px] sm:max-w-full"
        style={{ animation: 'panelIn 0.32s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <style>{`
          @keyframes panelIn {
            from { transform: translateY(60px); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
          @media (min-width: 640px) {
            @keyframes panelIn {
              from { transform: translateX(100%); opacity: 0; }
              to   { transform: translateX(0);    opacity: 1; }
            }
          }
        `}</style>

        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Complete Purchase</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Review your plan and proceed</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Plan Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-block bg-[#ffbe01] text-black text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5">
                  {plan.name} Plan
                </span>
                <p className="text-xs text-gray-500">{plan.period}</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 whitespace-nowrap">
                {isAdvancedPlan(plan.name)
                  ? (form.customMembers ? `₹${(parseInt(form.customMembers) * 1000).toLocaleString('en-IN')}` : 'Custom')
                  : plan.price}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {plan.features.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#ffbe01] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-600 leading-snug">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details Form */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Your Details</p>
            <div className="space-y-2">
              {formErrors.form && (
                <p className="text-xs bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-yellow-800">
                  {formErrors.form}
                </p>
              )}

              {/* Name */}
              <input
                type="text"
                placeholder="Full name *"
                value={form.name}
                readOnly={hasLockedCustomer}
                onChange={e => !hasLockedCustomer && updateForm('name', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe01]/20 focus:border-[#ffbe01] ${
                  formErrors.name ? 'border-red-400' : 'border-gray-300'
                } ${hasLockedCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                }`}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}

              {/* Email */}
              <input
                type="email"
                placeholder="Email address *"
                value={form.email}
                readOnly={hasLockedCustomer}
                onChange={e => !hasLockedCustomer && updateForm('email', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe01]/20 focus:border-[#ffbe01] ${
                  formErrors.email ? 'border-red-400' : 'border-gray-300'
                } ${hasLockedCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                }`}
              />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}

              {/* Phone */}
              <input
                type="tel"
                placeholder="Phone number (10 digits) *"
                value={form.phone}
                maxLength={10}
                readOnly={hasLockedCustomer}
                onChange={e => !hasLockedCustomer && updateForm('phone', e.target.value.replace(/\D/g, ''))}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe01]/20 focus:border-[#ffbe01] ${
                  formErrors.phone ? 'border-red-400' : 'border-gray-300'
                } ${hasLockedCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                }`}
              />
              {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}

              {/* Company Name */}
              <input
                type="text"
                placeholder="Company name *"
                value={form.companyName}
                readOnly={hasLockedCustomer}
                onChange={e => !hasLockedCustomer && updateForm('companyName', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe01]/20 focus:border-[#ffbe01] ${
                  formErrors.companyName ? 'border-red-400' : 'border-gray-300'
                } ${hasLockedCustomer ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                }`}
              />
              {formErrors.companyName && <p className="text-xs text-red-500">{formErrors.companyName}</p>}

              {/* City */}
              <input
                type="text"
                placeholder="City *"
                value={form.city}
                onChange={e => updateForm('city', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe01]/20 focus:border-[#ffbe01] ${
                  formErrors.city ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {formErrors.city && <p className="text-xs text-red-500">{formErrors.city}</p>}

              {/* Address */}
              <textarea
                placeholder="Full address *"
                value={form.address}
                onChange={e => updateForm('address', e.target.value)}
                rows={2}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe01]/20 focus:border-[#ffbe01] resize-none ${
                  formErrors.address ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {formErrors.address && <p className="text-xs text-red-500">{formErrors.address}</p>}

              {/* Custom Members — Advanced plan only */}
              {isAdvancedPlan(plan.name) && (
                <>
                  <input
                    type="number"
                    placeholder="Number of members needed *"
                    min={1}
                    value={form.customMembers}
                    onChange={e => updateForm('customMembers', e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffbe01]/20 focus:border-[#ffbe01] ${
                      formErrors.customMembers ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.customMembers && (
                    <p className="text-xs text-red-500">{formErrors.customMembers}</p>
                  )}
                  {form.customMembers && parseInt(form.customMembers) > 0 && (
                    <p className="text-xs bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-gray-600">
                      Estimated cost: ₹{(parseInt(form.customMembers) * 1000).toLocaleString('en-IN')} / month
                      <span className="text-gray-400"> + 18% GST</span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Payment Method</p>
            <div className="space-y-2">
              {paymentMethods.map(({ id, label, sublabel, Icon: IconComponent }) => {
                void IconComponent;
                return (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === id
                        ? 'border-[#ffbe01] bg-yellow-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="accent-[#ffbe01] w-4 h-4 flex-shrink-0"
                    />
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <IconComponent />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
                      <p className="text-xs text-gray-400 truncate">{sublabel}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            {paymentMethod === 'upi' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. name@ybl)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffbe01] focus:ring-2 focus:ring-[#ffbe01]/20"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Card number"
                  maxLength={19}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffbe01] focus:ring-2 focus:ring-[#ffbe01]/20"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    maxLength={5}
                    className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffbe01] focus:ring-2 focus:ring-[#ffbe01]/20"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={3}
                    className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ffbe01] focus:ring-2 focus:ring-[#ffbe01]/20"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="mt-3">
                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#ffbe01] focus:ring-2 focus:ring-[#ffbe01]/20 bg-white">
                  <option value="">Select your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Bank of Baroda</option>
                  <option>Punjab National Bank</option>
                  <option>Canara Bank</option>
                </select>
              </div>
            )}
          </div>

          {/* Coupon Code */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Coupon Code</span>
              </div>
              {!showCouponInput && (
                <button
                  onClick={() => setShowCouponInput(true)}
                  className="text-sm font-semibold text-[#c9960a] hover:underline"
                >
                  Add
                </button>
              )}
            </div>
            {showCouponInput && (
              <div className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ffbe01] min-w-0"
                />
                <button className="bg-black text-white text-sm px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap flex-shrink-0">
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span className="truncate mr-2">{plan.name} Plan ({plan.period})</span>
              <span className="font-medium text-gray-900 whitespace-nowrap">
                {isAdvancedPlan(plan.name)
                  ? (priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : '—')
                  : plan.price}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes &amp; fees (18% GST)</span>
              <span className="font-medium text-gray-900">
                {priceNum > 0 ? `₹${tax.toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-base font-bold text-gray-900">
                {priceNum > 0 ? `₹${total.toLocaleString('en-IN')}` : 'Enter members above'}
              </span>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-400 leading-relaxed pb-2">
            By completing payment, you agree to our{' '}
            <span className="underline cursor-pointer text-gray-500">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer text-gray-500">Privacy Policy</span>.
            You can cancel your subscription at any time.
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 bg-white flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isAdvancedPlan(plan.name) && priceNum === 0}
            className="flex-1 py-3 rounded-xl bg-[#ffbe01] text-black font-semibold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Payment
          </button>
        </div>
      </div>
    </>
  );
};

const Pricing = () => {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const hero = document.querySelector('.hero-content');
      if (hero) {
        gsap.fromTo(hero, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });
      }

      gsap.utils.toArray('.animate-section').forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);


  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [expandedDropdowns, setExpandedDropdowns] = useState({});
  const [pricingCustomer, setPricingCustomer] = useState(null);
  const [pricingMessage, setPricingMessage] = useState('');
  const [cancelledPlan, setCancelledPlan] = useState(null);
  const [plans, setPlans] = useState(DEFAULT_PRICING_PLANS);
  const [plansError, setPlansError] = useState('');

  useEffect(() => {
    const params = getPricingLookupParams();
    const queryString = buildQueryString(params);

    if (!queryString) return;

    let ignore = false;

    const fetchPricingCustomer = async () => {
      try {
        const response = await fetch(`${ERP_API_BASE_URL}/subscription-sync/pricing/customer?${queryString}`);
        const result = await response.json();

        if (!ignore && response.ok && result.success) {
          setPricingCustomer(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch ERP pricing customer:', error);
      }
    };

    fetchPricingCustomer();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchPlans = async () => {
      setPlansError('');

      try {
        const data = await fetchPricingPlans();
        const nextPlans = Array.isArray(data)
          ? sortPricingPlans(data.filter(isPlanVisible).map(toWebsitePlan))
          : [];

        if (!ignore && nextPlans.length > 0) {
          setPlans(nextPlans);
        }
      } catch (error) {
        console.error('Failed to fetch pricing plans:', error);
        if (!ignore) {
          setPlansError('Live pricing is temporarily unavailable. Showing our standard plans.');
        }
      }
    };

    fetchPlans();

    return () => {
      ignore = true;
    };
  }, []);

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 7-day free trial for all our plans. No credit card required to get started.',
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for Starter plans, priority support for Professional plans, and 24/7 phone support for Enterprise clients.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes, we offer a 20% discount when you choose annual billing for Professional plans.',
    },
  ];

  const openCheckout = (plan) => {
    if (hasActiveSelectedPlan(pricingCustomer, plan.name)) {
      setPricingMessage(`Your ${plan.name} subscription is already active. Please choose another plan.`);
      setCancelledPlan(null);
      return;
    }

    setPricingMessage('');
    setCancelledPlan(null);
    setCheckoutPlan(plan);
  };

  const handleTryNow = () => {
    navigate('/contact');
  };

  const handlePaymentCancel = (plan) => {
    setCheckoutPlan(null);
    setCancelledPlan(plan);
    setPricingMessage(`Payment cancelled for the ${plan.name} plan. You can retry when ready.`);
  };

  return (
    <div className="min-h-screen">
      {checkoutPlan && (
        <CheckoutPanel
          plan={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          onCancel={handlePaymentCancel}
          pricingCustomer={pricingCustomer}
        />
      )}

      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        <video className="absolute inset-0 w-full h-full object-cover z-0" autoPlay muted loop playsInline preload="metadata">
          <source src={pricingHeroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center hero-content">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="text-[#ffbe01]">Plan</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your construction business.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {pricingMessage && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span>{pricingMessage}</span>
              {cancelledPlan && (
                <button
                  onClick={() => openCheckout(cancelledPlan)}
                  className="self-start sm:self-auto rounded-md bg-[#ffbe01] px-4 py-2 font-semibold text-black hover:bg-yellow-400 transition-colors"
                >
                  Retry Payment
                </button>
              )}
            </div>
          )}
          {plansError && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              {plansError}
            </div>
          )}
          {!plansError && plans.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-6 text-center text-gray-600">
              No subscription plans are currently available.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id || plan.name || index}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-[#ffbe01] transform scale-105' : ''
                }`}
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-[#ffbe01]">
                      {plan.price ?? 'Custom'}
                    </span>
                    <span className="text-4l font-bold text-[#000]">
                      {plan.gst}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <ul className="mb-8 space-y-3">
                    {plan.displayFeatures.map((feature, featureIndex) => {
                      const isExpandable = feature.isAdvancedDropdown;
                      const isExpanded = expandedDropdowns[`${index}-${feature.id || featureIndex}`];
                      return (
                        <li key={featureIndex} className="flex flex-col">
                          <div 
                            className={`flex items-center ${isExpandable ? 'cursor-pointer hover:bg-gray-50 transition-colors rounded px-2 py-1' : ''}`}
                            onClick={isExpandable ? () => setExpandedDropdowns(prev => ({
                              ...prev,
                              [`${index}-${feature.id || featureIndex}`]: !prev[`${index}-${feature.id || featureIndex}`]
                            })) : undefined}
                          >
                            <svg className="w-5 h-5 text-[#ffbe01] mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 flex-1">{feature.label}</span>
                            {isExpandable && (
                              <svg 
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                          {isExpandable && isExpanded && (
                            <ul className="ml-8 mt-2 space-y-2">
                              {feature.children.map((child) => (
                                <li key={child.id || child.label} className="flex items-center">
                                  <svg className="w-4 h-4 text-[#ffbe01] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm text-gray-600">{child.label}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {/* Buttons — Advanced shows only Enquiry Now; others show Buy Now + Enquiry Now */}
                  <div className="flex gap-3">
                    {isAdvancedPlan(plan.name) ? (
                      <Link
                        to="/contact"
                        className="flex-1 text-center py-3 px-4 rounded-md font-semibold transition-colors duration-200 bg-black text-white hover:bg-gray-800"
                      >
                        Enquiry Now
                      </Link>
                    ) : isTrialPlan(plan.name) ? (
                      <>
                        <button
                          onClick={handleTryNow}
                          className="flex-1 text-center py-3 px-4 rounded-md font-semibold transition-colors duration-200 bg-[#ffbe01] text-black hover:bg-yellow-400"
                        >
                          Try Now
                        </button>
                        <Link
                          to="/contact"
                          className="flex-1 text-center py-3 px-4 rounded-md font-semibold transition-colors duration-200 bg-black text-white hover:bg-gray-800"
                        >
                          Enquiry Now
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => openCheckout(plan)}
                          className="flex-1 text-center py-3 px-4 rounded-md font-semibold transition-colors duration-200 bg-[#ffbe01] text-black hover:bg-yellow-400"
                        >
                          Buy Now
                        </button>
                        <Link
                          to="/contact"
                          className="flex-1 text-center py-3 px-4 rounded-md font-semibold transition-colors duration-200 bg-black text-white hover:bg-gray-800"
                        >
                          Enquiry Now
                        </Link>
                      </>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-yellow-100 animate-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose Vconstech?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just software – a complete solution for construction management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized for speed and performance, even with large construction projects.</p>
            </div>
            <div className="text-center">
              <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee for your critical data.</p>
            </div>
            <div className="text-center">
              <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#ffbe01]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock support from our expert team whenever you need assistance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white-50 animate-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing and services.</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-black mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white animate-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your free trial today and see how Vconstech can transform your construction business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-[#ffbe01] text-black px-8 py-3 rounded-md font-semibold text-lg hover:bg-yellow-400 transition-colors duration-200">
              Start Free Trial
            </Link>
            <Link to="/contact" className="border-2 border-[#ffbe01] text-[#ffbe01] px-8 py-3 rounded-md font-semibold text-lg hover:bg-[#ffbe01] hover:text-black transition-colors duration-200">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
