import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AlertCircle,
  Building,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  Users,
} from 'lucide-react';

const ERP_API_BASE_URL = (
  import.meta.env.VITE_ERP_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5001/api'
).replace(/\/$/, '');

const emptyCustomer = {
  name: '',
  companyName: '',
  email: '',
  phone: '',
  subscriptionPlan: '',
  employeeCount: '',
  city: '',
  location: '',
  address: '',
};

const getDisplayValue = (value) => String(value || '').trim();

const ReadOnlyField = ({ label, value, icon: Icon, multiline = false }) => {
  const displayValue = getDisplayValue(value);
  if (!displayValue) return null;

  const sharedClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm font-medium text-gray-800 outline-none';

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
      <span className="relative block">
        <Icon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        {multiline ? (
          <textarea className={`${sharedClass} min-h-24 resize-none`} value={displayValue} readOnly />
        ) : (
          <input className={sharedClass} value={displayValue} readOnly />
        )}
      </span>
    </label>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  visible,
  onToggle,
  error,
  autoComplete,
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
    <span className="relative block">
      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className={`w-full rounded-xl border px-4 py-3 pl-11 pr-12 text-sm font-medium text-gray-900 outline-none transition focus:border-[#ffbe01] focus:ring-4 focus:ring-[#ffbe01]/20 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </span>
    {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
  </label>
);

const MessagePanel = ({ type = 'error', title, message }) => {
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const tone =
    type === 'success'
      ? 'border-green-200 bg-green-50 text-green-900'
      : 'border-red-200 bg-red-50 text-red-900';

  return (
    <div className={`mx-auto max-w-2xl rounded-2xl border p-6 shadow-lg ${tone}`}>
      <div className="flex gap-4">
        <Icon className="mt-0.5 h-6 w-6 shrink-0" />
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="mt-2 text-sm leading-6">{message}</p>
        </div>
      </div>
    </div>
  );
};

const InvitationRegistration = () => {
  const { invitationId } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ loading: true, submitting: false, error: '', success: false });

  useEffect(() => {
    let mounted = true;

    const loadInvitation = async () => {
      setStatus((prev) => ({ ...prev, loading: true, error: '' }));

      try {
        const response = await fetch(
          `${ERP_API_BASE_URL}/registration/invitations/${encodeURIComponent(invitationId)}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'This invitation is invalid or no longer available.');
        }

        if (mounted) setInvitation(data.invitation);
      } catch (error) {
        if (mounted) {
          setStatus((prev) => ({
            ...prev,
            error: error.message || 'Unable to validate this invitation.',
          }));
        }
      } finally {
        if (mounted) setStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    loadInvitation();

    return () => {
      mounted = false;
    };
  }, [invitationId]);

  const customer = useMemo(
    () => ({ ...emptyCustomer, ...(invitation?.customer || {}) }),
    [invitation]
  );

  const validatePasswords = () => {
    const errors = {};
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validatePasswords()) return;

    setStatus((prev) => ({ ...prev, submitting: true, error: '' }));

    try {
      const registerResponse = await fetch(
        `${ERP_API_BASE_URL}/registration/invitations/${encodeURIComponent(invitationId)}/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customer.name,
            email: customer.email,
            password,
            companyName: customer.companyName,
            phoneNumber: customer.phone,
            city: customer.city || customer.location,
            address: customer.address,
          }),
        }
      );
      
      const registerData = await registerResponse.json();

      if (!registerResponse.ok || !registerData.success) {
        throw new Error(registerData.error || 'Registration failed.');
      }

      const trialResponse = await fetch(
        `${ERP_API_BASE_URL}/subscription-sync/invitations/${encodeURIComponent(invitationId)}/start-trial`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: registerData.registration?.user?.id }),
        }
      );
      const trialData = await trialResponse.json();

      if (!trialResponse.ok || !trialData.success) {
        throw new Error(trialData.error || 'Registration completed, but trial activation failed.');
      }

      setStatus((prev) => ({ ...prev, success: true }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: error.message || 'Registration failed.',
      }));
    } finally {
      setStatus((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f6f0] px-4 py-10">
      {status.loading && (
        <div className="mx-auto max-w-md rounded-2xl bg-white px-6 py-5 text-center font-semibold text-gray-900 shadow-lg">
          Validating invitation...
        </div>
      )}

      {!status.loading && status.error && !invitation && (
        <MessagePanel title="Invitation unavailable" message={status.error} />
      )}

      {!status.loading && status.success && (
        <MessagePanel
          type="success"
          title="Registration complete"
          message="Your ERP account has been created successfully."
        />
      )}

      {!status.loading && !status.success && invitation && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          <div className="border-b border-gray-100 bg-[#ffbe01] px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-950">Complete ERP Registration</h1>
            <p className="mt-1 text-sm font-medium text-gray-800">
              Review your invitation details and create your password.
            </p>
          </div>

          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            {status.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 md:col-span-2">
                {status.error}
              </div>
            )}

            <ReadOnlyField label="Company Name" value={customer.companyName} icon={Building} />
            <ReadOnlyField label="Contact Person Name" value={customer.name} icon={User} />
            <ReadOnlyField label="Email" value={customer.email} icon={Mail} />
            <ReadOnlyField label="Phone Number" value={customer.phone} icon={Phone} />
            <ReadOnlyField label="Subscription Plan" value={customer.subscriptionPlan} icon={Package} />
            <ReadOnlyField label="Employee Count" value={customer.employeeCount} icon={Users} />
            <ReadOnlyField label="City" value={customer.city || customer.location} icon={MapPin} />
            <ReadOnlyField label="Address" value={customer.address} icon={MapPin} multiline />

            <PasswordField
              label="Create Password"
              value={password}
              onChange={setPassword}
              visible={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
              error={fieldErrors.password}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((value) => !value)}
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
            />
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
            <button
              type="submit"
              disabled={status.submitting}
              className="w-full rounded-xl bg-[#ffbe01] px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status.submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default InvitationRegistration;
