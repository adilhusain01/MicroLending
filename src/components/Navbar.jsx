import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Wallet2, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { account, connectWallet } = useWallet();

  const isConnected = !!account;

  return (
    <nav className='bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <Wallet2 className='w-5 h-5 text-white' />
            </div>
            <h1 className='text-xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent'>
              Micro Lending
            </h1>
          </div>

          {isConnected ? (
            <button
              onClick={connectWallet}
              className='flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900'
            >
              <span className='mr-2'>
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className='px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-purple-500/20'
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
