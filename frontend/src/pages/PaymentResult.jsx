import { Link, useLocation } from 'react-router-dom';

const ERP_LOGIN_URL = import.meta.env.VITE_ERP_LOGIN_URL || 'http://localhost:5173';

const getParams = (search) => {
  const params = new URLSearchParams(search);
  return {
    purchaseFlow: params.get('purchaseFlow') || '',
    plan: params.get('plan') || 'Selected',
    paymentId: params.get('paymentId') || '',
    returnTo: params.get('returnTo') || '/pricing',
    userId: params.get('userId') || '',
    customerId: params.get('customerId') || '',
    crmCustomerId: params.get('crmCustomerId') || '',
    erpCustomerId: params.get('erpCustomerId') || '',
    name: params.get('name') || '',
    companyName: params.get('companyName') || '',
    email: params.get('email') || '',
    phone: params.get('phone') || '',
    activated: params.get('activated') !== 'false'
  };
};

const PaymentResult = ({ type }) => {
  const { search } = useLocation();
  const params = getParams(search);
  const { plan, paymentId, returnTo, activated } = params;
  const isSuccess = type === 'success';
  const activationStatus = activated
    ? 'ERP account is ready. Login details have been sent to your email.'
    : 'Payment received. ERP activation is still syncing and our team will complete it shortly.';

  return (
    <section className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <svg
            className={`w-8 h-8 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSuccess ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {isSuccess ? 'Payment Successful' : 'Payment Failed'}
        </h1>

        {isSuccess ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">Purchased Plan:</span> {plan}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">Status:</span> Subscription Activated
              </p>
              {activationStatus && (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-gray-900">ERP:</span> {activationStatus}
                </p>
              )}
              {paymentId && (
                <p className="text-sm text-gray-700 break-all">
                  <span className="font-semibold text-gray-900">Payment ID:</span> {paymentId}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={ERP_LOGIN_URL}
                className="flex-1 py-3 px-4 rounded-md font-semibold bg-[#ffbe01] text-black hover:bg-yellow-400 transition-colors"
              >
                Go to ERP Login
              </a>
              <Link
                to="/"
                className="flex-1 py-3 px-4 rounded-md font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Back to Website
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              We could not complete the payment for the {plan} plan. Your subscription was not activated.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={returnTo}
                className="flex-1 py-3 px-4 rounded-md font-semibold bg-[#ffbe01] text-black hover:bg-yellow-400 transition-colors"
              >
                Retry Payment
              </Link>
              <Link
                to="/pricing"
                className="flex-1 py-3 px-4 rounded-md font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Back to Pricing
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PaymentResult;
