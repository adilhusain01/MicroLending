import { useState } from 'react';
import { useLending } from '../contexts/LendingContext';
import { useWallet } from '../contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban,
  XCircle,
} from 'lucide-react';

const LoanStatus = {
  PENDING: 0,
  FUNDED: 1,
  REPAYING: 2,
  COMPLETED: 3,
  DEFAULTED: 4,
  CANCELLED: 5,
};

const StatusConfig = {
  [LoanStatus.PENDING]: {
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: Clock,
    label: 'Pending',
  },
  [LoanStatus.FUNDED]: {
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    icon: AlertCircle,
    label: 'Funded',
  },
  [LoanStatus.REPAYING]: {
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: CheckCircle2,
    label: 'Repaying',
  },
  [LoanStatus.COMPLETED]: {
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    icon: CheckCircle2,
    label: 'Completed',
  },
  [LoanStatus.DEFAULTED]: {
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: XCircle,
    label: 'Defaulted',
  },
  [LoanStatus.CANCELLED]: {
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    icon: Ban,
    label: 'Cancelled',
  },
};

const LoanCard = ({ loan }) => {
  const StatusIcon = StatusConfig[loan.status].icon;

  return (
    <Card className='bg-slate-900 border border-slate-800 shadow-xl'>
      <CardContent className='p-6'>
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h3 className='text-lg font-semibold text-white mb-1'>
              Loan #{loan.id}
            </h3>
            <p className='text-slate-400'>{loan.purpose}</p>
          </div>
          <div
            className={`flex items-center px-3 py-1 rounded-full ${
              StatusConfig[loan.status].bgColor
            }`}
          >
            <StatusIcon
              className={`w-4 h-4 mr-2 ${StatusConfig[loan.status].color}`}
            />
            <span
              className={`text-sm font-medium ${
                StatusConfig[loan.status].color
              }`}
            >
              {StatusConfig[loan.status].label}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6 mb-4'>
          <div className='bg-slate-800/50 p-4 rounded-lg'>
            <p className='text-sm text-slate-400 mb-1'>Amount</p>
            <p className='text-lg font-semibold text-white'>
              {loan.amount} ETH
            </p>
          </div>
          <div className='bg-slate-800/50 p-4 rounded-lg'>
            <p className='text-sm text-slate-400 mb-1'>Interest</p>
            <p className='text-lg font-semibold text-white'>{loan.interest}%</p>
          </div>
          <div className='bg-slate-800/50 p-4 rounded-lg'>
            <p className='text-sm text-slate-400 mb-1'>Collateral</p>
            <p className='text-lg font-semibold text-white'>
              {loan.collateralAmount} ETH
            </p>
          </div>
          <div className='bg-slate-800/50 p-4 rounded-lg'>
            <p className='text-sm text-slate-400 mb-1'>Duration</p>
            <p className='text-lg font-semibold text-white'>
              {loan.duration / 86400} days
            </p>
          </div>
        </div>

        {loan.lender !== '0x0000000000000000000000000000000000000000' && (
          <div className='mb-4'>
            <p className='text-sm text-slate-400 mb-2'>Progress</p>
            <div className='w-full bg-slate-800 rounded-full h-2'>
              <div
                className='bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-2'
                style={{
                  width: `${(loan.repaidAmount / loan.totalAmountDue) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RequestLoanForm = () => {
  const { requestLoan } = useLending();
  const [formData, setFormData] = useState({
    amount: '',
    interest: '',
    duration: '',
    purpose: '',
    collateral: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestLoan(
        formData.amount,
        formData.interest,
        formData.duration,
        formData.purpose,
        formData.collateral
      );
      setFormData({
        amount: '',
        interest: '',
        duration: '',
        purpose: '',
        collateral: '',
      });
    } catch (error) {
      console.error('Error requesting loan:', error);
    }
  };

  return (
    <Card className='bg-slate-900 border border-slate-800 shadow-xl'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent'>
          Request a Loan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-300 mb-1'>
              Loan Amount (ETH)
            </label>
            <input
              type='number'
              step='0.01'
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-300 mb-1'>
              Interest Rate (%)
            </label>
            <input
              type='number'
              value={formData.interest}
              onChange={(e) =>
                setFormData({ ...formData, interest: e.target.value })
              }
              className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-300 mb-1'>
              Duration (Days)
            </label>
            <input
              type='number'
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-300 mb-1'>
              Purpose
            </label>
            <input
              type='text'
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-300 mb-1'>
              Collateral Amount (ETH)
            </label>
            <input
              type='number'
              step='0.01'
              value={formData.collateral}
              onChange={(e) =>
                setFormData({ ...formData, collateral: e.target.value })
              }
              className='w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-purple-500/20'
          >
            Request Loan
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

const LoanActions = ({ loan }) => {
  const { fundLoan, makePayment, defaultLoan, cancelLoan } = useLending();
  const { account } = useWallet();

  const handleFund = async () => {
    try {
      await fundLoan(loan.id, loan.amount);
    } catch (error) {
      console.error('Error funding loan:', error);
    }
  };

  const handlePayment = async () => {
    try {
      await makePayment(loan.id);
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  const handleDefault = async () => {
    try {
      await defaultLoan(loan.id);
    } catch (error) {
      console.error('Error defaulting loan:', error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelLoan(loan.id);
    } catch (error) {
      console.error('Error cancelling loan:', error);
    }
  };

  const isBorrower = loan.borrower.toLowerCase() === account.toLowerCase();
  const isLender = loan.lender.toLowerCase() === account.toLowerCase();

  const buttonClasses = {
    primary:
      'w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-purple-500/20',
    danger:
      'w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-rose-500/20',
  };

  return (
    <div className='mt-4 space-y-4'>
      {loan.status === LoanStatus.PENDING && !isBorrower && (
        <button onClick={handleFund} className={buttonClasses.primary}>
          Fund Loan
        </button>
      )}

      {isBorrower && loan.status === LoanStatus.PENDING && (
        <button onClick={handleCancel} className={buttonClasses.danger}>
          Cancel Loan
        </button>
      )}

      {isBorrower &&
        (loan.status === LoanStatus.FUNDED ||
          loan.status === LoanStatus.REPAYING) && (
          <button onClick={handlePayment} className={buttonClasses.primary}>
            Make Payment
          </button>
        )}

      {isLender &&
        (loan.status === LoanStatus.FUNDED ||
          loan.status === LoanStatus.REPAYING) && (
          <button onClick={handleDefault} className={buttonClasses.danger}>
            Mark as Defaulted
          </button>
        )}
    </div>
  );
};

const Dashboard = () => {
  const { loans, userLoans, loading } = useLending();
  const [activeTab, setActiveTab] = useState('all');

  const filteredLoans = loans.filter((loan) => {
    if (activeTab === 'borrower') {
      return userLoans.borrower.includes(loan.id.toString());
    } else if (activeTab === 'lender') {
      return userLoans.lender.includes(loan.id.toString());
    }
    return true;
  });

  const tabButtonClasses = (isActive) =>
    `px-6 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/20'
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    }`;

  return (
    <div className='min-h-screen bg-slate-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='mb-6'>
              <div className='flex space-x-4 mb-6'>
                <button
                  onClick={() => setActiveTab('all')}
                  className={tabButtonClasses(activeTab === 'all')}
                >
                  All Loans
                </button>
                <button
                  onClick={() => setActiveTab('borrower')}
                  className={tabButtonClasses(activeTab === 'borrower')}
                >
                  My Borrowings
                </button>
                <button
                  onClick={() => setActiveTab('lender')}
                  className={tabButtonClasses(activeTab === 'lender')}
                >
                  My Lendings
                </button>
              </div>
            </div>

            {loading ? (
              <div className='text-center py-12'>
                <Loader2 className='w-12 h-12 animate-spin text-purple-500 mx-auto' />
                <p className='mt-4 text-slate-400'>Loading loans...</p>
              </div>
            ) : filteredLoans.length === 0 ? (
              <Card className='bg-slate-900 border border-slate-800 shadow-xl'>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                  <AlertCircle className='w-12 h-12 text-slate-500 mb-4' />
                  <p className='text-slate-400 text-lg'>No loans found</p>
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-6'>
                {filteredLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className='bg-slate-900 rounded-lg overflow-hidden'
                  >
                    <LoanCard loan={loan} />
                    <div className='px-6 pb-6'>
                      <LoanActions loan={loan} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='lg:col-span-1 lg:sticky lg:top-8 self-start'>
            <RequestLoanForm />

            {/* Optional Stats Cards */}
            <div className='grid grid-cols-2 gap-4 mt-6'>
              <Card className='bg-slate-900 border border-slate-800'>
                <CardContent className='p-4'>
                  <p className='text-sm text-slate-400'>Total Active Loans</p>
                  <p className='text-2xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent'>
                    {
                      filteredLoans.filter(
                        (loan) =>
                          loan.status === LoanStatus.FUNDED ||
                          loan.status === LoanStatus.REPAYING
                      ).length
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className='bg-slate-900 border border-slate-800'>
                <CardContent className='p-4'>
                  <p className='text-sm text-slate-400'>Pending Requests</p>
                  <p className='text-2xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent'>
                    {
                      filteredLoans.filter(
                        (loan) => loan.status === LoanStatus.PENDING
                      ).length
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
