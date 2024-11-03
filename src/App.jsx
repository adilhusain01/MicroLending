import { WalletProvider } from './contexts/WalletContext';
import { LendingProvider } from './contexts/LendingContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <WalletProvider>
      <LendingProvider>
        <Navbar />
        <Dashboard />
      </LendingProvider>
    </WalletProvider>
  );
}

export default App;
