// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LendingSystem {
    struct LoanRequest {
        address borrower;
        uint256 amount;
        uint256 interest;
        uint256 duration;
        uint256 deadline;
        string purpose;
        uint256 collateralAmount;
        bool isActive;
        bool isFunded;
        address lender;
        uint256 repaidAmount;
        uint256 nextPaymentDue;
        uint256 installmentAmount;
        uint256 totalAmountDue;
        bool isDefaulted;
        LoanStatus status;
    }

    enum LoanStatus {
        PENDING,
        FUNDED,
        REPAYING,
        COMPLETED,
        DEFAULTED,
        CANCELLED
    }

    struct Payment {
        uint256 amount;
        uint256 timestamp;
        uint256 remainingBalance;
    }

    mapping(uint256 => LoanRequest) public loans;
    mapping(uint256 => Payment[]) public loanPayments;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256[]) public lenderLoans;
    
    uint256 public loanCount;
    
    event LoanRequested(
        uint256 indexed loanId,
        address borrower,
        uint256 amount,
        uint256 interest,
        uint256 duration
    );
    event LoanFunded(uint256 indexed loanId, address lender);
    event PaymentMade(uint256 indexed loanId, uint256 amount, uint256 remaining);
    event LoanCompleted(uint256 indexed loanId);
    event LoanDefaulted(uint256 indexed loanId);
    event LoanCancelled(uint256 indexed loanId);

    modifier onlyBorrower(uint256 _loanId) {
        require(loans[_loanId].borrower == msg.sender, "Not the borrower");
        _;
    }

    modifier onlyLender(uint256 _loanId) {
        require(loans[_loanId].lender == msg.sender, "Not the lender");
        _;
    }

    modifier loanExists(uint256 _loanId) {
        require(_loanId < loanCount, "Loan does not exist");
        _;
    }

function requestLoan(
    uint256 _amount,
    uint256 _interest,
    uint256 _duration,
    string memory _purpose
) external payable returns (uint256) {
    require(_amount > 0, "Amount must be greater than 0");
    require(_duration > 0, "Duration must be greater than 0");
    require(msg.value > 0, "Collateral required");

    uint256 loanId = loanCount++;
    LoanRequest storage loan = loans[loanId];
    
    loan.borrower = msg.sender;
    loan.amount = _amount;
    loan.interest = _interest;
    loan.duration = _duration;
    loan.deadline = block.timestamp + _duration;
    loan.purpose = _purpose;
    loan.collateralAmount = msg.value;
    loan.isActive = true;
    loan.status = LoanStatus.PENDING;
    
    // Calculate total interest and total amount due
    uint256 totalInterest = (_amount * _interest * _duration) / (365 days * 100);
    loan.totalAmountDue = _amount + totalInterest;
    
    // Ensure duration is a multiple of 30 days to avoid division by zero
    require(_duration % 30 days == 0, "Duration must be a multiple of 30 days");
    loan.installmentAmount = loan.totalAmountDue / (_duration / 30 days);

    borrowerLoans[msg.sender].push(loanId);
    
    emit LoanRequested(loanId, msg.sender, _amount, _interest, _duration);
    return loanId;
}

    function fundLoan(uint256 _loanId) external payable loanExists(_loanId) {
        LoanRequest storage loan = loans[_loanId];
        
        require(loan.status == LoanStatus.PENDING, "Loan not available");
        require(msg.value == loan.amount, "Incorrect amount");
        require(loan.borrower != msg.sender, "Cannot fund own loan");

        loan.lender = msg.sender;
        loan.isFunded = true;
        loan.status = LoanStatus.FUNDED;
        loan.nextPaymentDue = block.timestamp + 30 days;

        lenderLoans[msg.sender].push(_loanId);
        
        payable(loan.borrower).transfer(loan.amount);
        emit LoanFunded(_loanId, msg.sender);
    }

    function makePayment(uint256 _loanId) external payable loanExists(_loanId) onlyBorrower(_loanId) {
        LoanRequest storage loan = loans[_loanId];
        
        require(loan.status == LoanStatus.FUNDED || loan.status == LoanStatus.REPAYING, "Loan not active");
        require(msg.value > 0, "Payment must be greater than 0");
        require(msg.value <= loan.totalAmountDue - loan.repaidAmount, "Payment exceeds remaining amount");

        loan.repaidAmount += msg.value;
        loan.nextPaymentDue = block.timestamp + 30 days;
        loan.status = LoanStatus.REPAYING;

        // Record payment
        Payment memory payment = Payment({
            amount: msg.value,
            timestamp: block.timestamp,
            remainingBalance: loan.totalAmountDue - loan.repaidAmount
        });
        loanPayments[_loanId].push(payment);

        // Transfer payment to lender
        payable(loan.lender).transfer(msg.value);

        emit PaymentMade(_loanId, msg.value, loan.totalAmountDue - loan.repaidAmount);

        // Check if loan is fully repaid
        if (loan.repaidAmount >= loan.totalAmountDue) {
            completeLoan(_loanId);
        }
    }

    function completeLoan(uint256 _loanId) internal {
        LoanRequest storage loan = loans[_loanId];
        loan.status = LoanStatus.COMPLETED;
        loan.isActive = false;
        
        // Return collateral to borrower
        payable(loan.borrower).transfer(loan.collateralAmount);
        
        emit LoanCompleted(_loanId);
    }

    function defaultLoan(uint256 _loanId) external loanExists(_loanId) onlyLender(_loanId) {
        LoanRequest storage loan = loans[_loanId];
        
        require(loan.status == LoanStatus.FUNDED || loan.status == LoanStatus.REPAYING, "Invalid loan status");
        require(block.timestamp > loan.nextPaymentDue + 7 days, "Grace period not expired");

        loan.status = LoanStatus.DEFAULTED;
        loan.isActive = false;
        loan.isDefaulted = true;

        // Transfer collateral to lender
        payable(loan.lender).transfer(loan.collateralAmount);
        
        emit LoanDefaulted(_loanId);
    }

    function cancelLoan(uint256 _loanId) external loanExists(_loanId) onlyBorrower(_loanId) {
        LoanRequest storage loan = loans[_loanId];
        
        require(loan.status == LoanStatus.PENDING, "Can only cancel pending loans");
        
        loan.status = LoanStatus.CANCELLED;
        loan.isActive = false;
        
        // Return collateral to borrower
        payable(loan.borrower).transfer(loan.collateralAmount);
        
        emit LoanCancelled(_loanId);
    }

    // View functions
    function getLoan(uint256 _loanId) external view returns (
        address borrower,
        uint256 amount,
        uint256 interest,
        uint256 duration,
        uint256 collateralAmount,
        bool isActive,
        address lender,
        uint256 repaidAmount,
        uint256 nextPaymentDue,
        uint256 installmentAmount,
        uint256 totalAmountDue,
        bool isDefaulted,
        LoanStatus status,
        string memory purpose
    ) {
        LoanRequest storage loan = loans[_loanId];
        return (
            loan.borrower,
            loan.amount,
            loan.interest,
            loan.duration,
            loan.collateralAmount,
            loan.isActive,
            loan.lender,
            loan.repaidAmount,
            loan.nextPaymentDue,
            loan.installmentAmount,
            loan.totalAmountDue,
            loan.isDefaulted,
            loan.status,
            loan.purpose
        );
    }

    function getBorrowerLoans(address _borrower) external view returns (uint256[] memory) {
        return borrowerLoans[_borrower];
    }

    function getLenderLoans(address _lender) external view returns (uint256[] memory) {
        return lenderLoans[_lender];
    }

    function getLoanPayments(uint256 _loanId) external view returns (Payment[] memory) {
        return loanPayments[_loanId];
    }
}