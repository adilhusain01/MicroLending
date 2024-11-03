const CONTRACT_ADDRESS = '0xF91c8c2e9aDF8190848d111e7FCA803773EAbbF9';
const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'LoanCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'LoanCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
    ],
    name: 'LoanDefaulted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
    ],
    name: 'LoanFunded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'interest',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
    ],
    name: 'LoanRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'loanId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'remaining',
        type: 'uint256',
      },
    ],
    name: 'PaymentMade',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'borrowerLoans',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'cancelLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'defaultLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'fundLoan',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_borrower',
        type: 'address',
      },
    ],
    name: 'getBorrowerLoans',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_lender',
        type: 'address',
      },
    ],
    name: 'getLenderLoans',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'getLoan',
    outputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interest',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collateralAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isActive',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'repaidAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nextPaymentDue',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'installmentAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalAmountDue',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isDefaulted',
        type: 'bool',
      },
      {
        internalType: 'enum LendingSystem.LoanStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'purpose',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'getLoanPayments',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'timestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'remainingBalance',
            type: 'uint256',
          },
        ],
        internalType: 'struct LendingSystem.Payment[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'lenderLoans',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'loanCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loanPayments',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'remainingBalance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'loans',
    outputs: [
      {
        internalType: 'address',
        name: 'borrower',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interest',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'purpose',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'collateralAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isActive',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isFunded',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'lender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'repaidAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nextPaymentDue',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'installmentAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalAmountDue',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isDefaulted',
        type: 'bool',
      },
      {
        internalType: 'enum LendingSystem.LoanStatus',
        name: 'status',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_loanId',
        type: 'uint256',
      },
    ],
    name: 'makePayment',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_interest',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_duration',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_purpose',
        type: 'string',
      },
    ],
    name: 'requestLoan',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
];

export { CONTRACT_ADDRESS, CONTRACT_ABI };
