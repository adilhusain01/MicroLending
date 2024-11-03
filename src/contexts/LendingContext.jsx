import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contractHelpers';

const LendingContext = createContext();

export const LendingProvider = ({ children }) => {
  const { signer, account } = useWallet();
  const [contract, setContract] = useState(null);
  const [loans, setLoans] = useState([]);
  const [userLoans, setUserLoans] = useState({ borrower: [], lender: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      initializeContract();
    }
  }, [signer]);

  useEffect(() => {
    if (contract && account) {
      loadUserLoans();
    }
  }, [contract, account]);

  const initializeContract = async () => {
    try {
      const lendingContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(lendingContract);
      await loadLoans();
    } catch (error) {
      console.error('Contract initialization error:', error);
    }
  };

  const loadLoans = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const loanCount = await contract.loanCount();
      const loadedLoans = [];

      for (let i = 0; i < loanCount; i++) {
        const loan = await contract.getLoan(i);
        const payments = await contract.getLoanPayments(i);

        loadedLoans.push({
          id: i,
          borrower: loan.borrower,
          amount: ethers.utils.formatEther(loan.amount),
          interest: loan.interest.toString(),
          duration: loan.duration.toString(),
          collateralAmount: ethers.utils.formatEther(loan.collateralAmount),
          isActive: loan.isActive,
          lender: loan.lender,
          repaidAmount: ethers.utils.formatEther(loan.repaidAmount),
          nextPaymentDue: new Date(loan.nextPaymentDue * 1000),
          installmentAmount: ethers.utils.formatEther(loan.installmentAmount),
          totalAmountDue: ethers.utils.formatEther(loan.totalAmountDue),
          isDefaulted: loan.isDefaulted,
          status: loan.status,
          purpose: loan.purpose,
          payments: payments.map((p) => ({
            amount: ethers.utils.formatEther(p.amount),
            timestamp: new Date(p.timestamp * 1000),
            remainingBalance: ethers.utils.formatEther(p.remainingBalance),
          })),
        });
      }

      setLoans(loadedLoans);
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserLoans = async () => {
    try {
      const borrowerLoans = await contract.getBorrowerLoans(account);
      const lenderLoans = await contract.getLenderLoans(account);
      setUserLoans({
        borrower: borrowerLoans.map((id) => id.toString()),
        lender: lenderLoans.map((id) => id.toString()),
      });
    } catch (error) {
      console.error('Error loading user loans:', error);
    }
  };

  const requestLoan = async (
    amount,
    interest,
    duration,
    purpose,
    collateral
  ) => {
    try {
      setLoading(true);
      const tx = await contract.requestLoan(
        ethers.utils.parseEther(amount),
        interest,
        duration * 86400, // Convert days to seconds
        purpose,
        {
          value: ethers.utils.parseEther(collateral),
          gasLimit: ethers.utils.hexlify(3000000), // Set a manual gas limit
        }
      );
      await tx.wait();
      await loadLoans();
      await loadUserLoans();
    } catch (error) {
      console.error('Error requesting loan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fundLoan = async (loanId, amount) => {
    try {
      setLoading(true);
      const tx = await contract.fundLoan(loanId, {
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      await loadLoans();
      await loadUserLoans();
    } catch (error) {
      console.error('Error funding loan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // const makePayment = async (loanId, amount) => {
  //   try {
  //     setLoading(true);

  //     // Initialize provider
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();

  //     // Fetch the remaining amount due for the loan
  //     const loan = await contract.getLoan(loanId);
  //     const remainingAmount = ethers.utils.formatEther(
  //       loan.totalAmountDue.sub(loan.repaidAmount)
  //     );

  //     // Log the remaining amount
  //     console.log(
  //       `Remaining amount due for loan ${loanId}: ${remainingAmount} ETH`
  //     );

  //     // Check if the payment amount exceeds the remaining amount
  //     if (parseFloat(amount) > parseFloat(remainingAmount)) {
  //       throw new Error('Payment exceeds remaining amount');
  //     }

  //     // Estimate gas fee
  //     const gasEstimate = await contract
  //       .connect(signer)
  //       .estimateGas.makePayment(loanId, {
  //         value: ethers.utils.parseEther(amount),
  //       });
  //     const gasPrice = await provider.getGasPrice();
  //     const gasFee = gasEstimate.mul(gasPrice);

  //     // Log the gas fee
  //     console.log(
  //       `Gas fee for payment: ${ethers.utils.formatEther(gasFee)} ETH`
  //     );

  //     // Make the payment without including the gas fee in the value
  //     const tx = await contract.connect(signer).makePayment(loanId, {
  //       value: ethers.utils.parseEther(amount),
  //       gasLimit: gasEstimate, // Use the estimated gas limit
  //     });
  //     await tx.wait();
  //     await loadLoans();
  //   } catch (error) {
  //     console.error('Error making payment:', error);
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const makePayment = async (loanId) => {
    try {
      setLoading(true);

      // Fetch the remaining amount due for the loan
      const loan = await contract.getLoan(loanId);
      const remainingAmount = ethers.utils.formatEther(
        loan.totalAmountDue.sub(loan.repaidAmount)
      );

      // Log the remaining amount
      console.log(
        `Remaining amount due for loan ${loanId}: ${remainingAmount} ETH`
      );

      const tx = await contract.makePayment(loanId, {
        value: ethers.utils.parseEther(remainingAmount),
      });
      await tx.wait();
      await loadLoans();
    } catch (error) {
      console.error('Error making payment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const defaultLoan = async (loanId) => {
    try {
      setLoading(true);
      const tx = await contract.defaultLoan(loanId, {
        gasLimit: ethers.utils.hexlify(3000000), // Set a manual gas limit
      });
      await tx.wait();
      await loadLoans();
    } catch (error) {
      console.error('Error defaulting loan:', error);
      if (error.code === ethers.errors.UNPREDICTABLE_GAS_LIMIT) {
        console.error('Transaction failed:', error.reason);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelLoan = async (loanId) => {
    try {
      setLoading(true);
      const tx = await contract.cancelLoan(loanId);
      await tx.wait();
      await loadLoans();
      await loadUserLoans();
    } catch (error) {
      console.error('Error cancelling loan:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LendingContext.Provider
      value={{
        loans,
        userLoans,
        loading,
        requestLoan,
        fundLoan,
        makePayment,
        defaultLoan,
        cancelLoan,
        loadLoans,
      }}
    >
      {children}
    </LendingContext.Provider>
  );
};

export const useLending = () => useContext(LendingContext);
