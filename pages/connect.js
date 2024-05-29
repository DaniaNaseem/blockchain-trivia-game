import ConnectWallet from "../components/connect-wallet-section";
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer'
export default function ConnectWalletPage() {
  return (
    
    <>
    <Navbar/>   
    <div className="pt-4" id="content">
    <ConnectWallet/>
    
    </div>
    <Footer/>
    </>
  )

}