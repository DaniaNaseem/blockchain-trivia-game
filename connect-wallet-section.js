import { useState, useEffect } from "react";
import { BrowserWallet } from "@martifylabs/mesh";
import { useWallet } from "@martifylabs/mesh-react";
import { useRouter } from 'next/router';



export default function ConnectWallet(){

  const router = useRouter();//including router to be able to route to pages

  const { connect, connected, disconnect } = useWallet();//making a usestate to handle states

  const [wallets, setWallets] = useState([]);//the wallets to show - populated by getInstalledWallets()

  const [selectedWallet, setSelectedWallet] = useState("");//selected wallet but not the wallet that was successfully connected.


  const [cursorStyle, setCursorStyle] = useState({
    top: 0,
    left: 0,
    display: 'none',
  });

  let timeout;

  useEffect(() => {
    const handleMouseMove = (e) => {
      
      let x = e.pageX;
      let y = e.pageY;


      
      if (e.pageX !== cursorStyle.left || e.pageY !== cursorStyle.top) {
      setCursorStyle({
        top: y + 'px',
        left: x + 'px',
        display: 'block',
      });
    }

      function mouseStopped() {
        setCursorStyle({
          ...cursorStyle,
          display: 'none',
        });
      }

      // clearTimeout(timeout);
      // timeout = setTimeout(mouseStopped, 1000);
    };

    const handleMouseOut = () => {
      setCursorStyle({
        ...cursorStyle,
        display: 'none',
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorStyle]);



  function goToHomePage(){
    router.push('/');
  }

  const goToDashboard = () => {
    router.push('/dashboard');
  }

  useEffect(() => { //set installed wallets
    setWallets(BrowserWallet.getInstalledWallets());
  }, []);

  useEffect(() => {//responsible to check if wallet type exists in local storage, if it does and is not expired, gotoDashboard
    
    if (typeof window !== 'undefined'){
      setTimeout(() => {
        console.log(window);
      const walletTypeInStorage = localStorage.getItem('walletType');

      if (!walletTypeInStorage){
        console.log("condition1");
        console.log(walletTypeInStorage);
        console.log(localStorage.length);
        console.log(localStorage);
        return;
      }
      console.log("condition2");
      const { value, expiry } = JSON.parse(walletTypeInStorage);
  
      if (new Date().getTime() > expiry) {
        console.log("condition3");
        window.localStorage.clear();
        return;
      }
      console.log("condition4");
      goToDashboard();
      }, 500);
      
    }
  }, []);

  const connectWallet = async (walletName) => {
    if(walletName == "" || walletName == null || walletName == undefined)
      return;
    //name conversion:
    try {//need to hit api here to recieve token

      await BrowserWallet.enable(walletName);
      try {
        await connect(walletName);
        
          window.localStorage.setItem(
              'walletType',
              JSON.stringify({
              value: walletName,
              expiry: new Date().getTime() + 48 * 60 * 60 * 1000,
            })
          );
          goToDashboard();
      } catch (error) {
        console.log(error);
        disconnect();
        goToHomePage();
      }
    } catch (error) {
      //console.log(error);
      disconnect();
      goToHomePage();
    }
  };

  return (
    <>
        <style jsx global>{`
        body {
          cursor: none;
        }
      `}</style>
    <div className="cursor" style={cursorStyle}></div>
    <div className="pt-32 pb-32">
      <div className="bg-white p-4 rounded-lg">
        <div className="">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-8">
              {!connected && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Connect to <span className="text-yellow-500">THE BLOCKCHAIN!</span>
                  </h2>
                  <p className="text-gray-700">
                    You need to connect your wallet to be able to play the game.
                  </p>
                </>
              )}
            </div>
            <div className="wow fadeInUpX" data-wow-delay=".20s">
              {!connected && (
                <>
                  <select
                    value={selectedWallet}
                    onChange={(event) => setSelectedWallet(event.target.value)}
                    className="block w-full px-4 py-2 mb-3 border rounded-lg form-select focus:ring focus:ring-yellow-300 focus:border-yellow-300"
                  >
                    <option value="" disabled>
                      Select Wallet
                    </option>
                    {wallets.map((wallet) => (
                      <option key={wallet.name} value={wallet.name}>
                        {wallet.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-green-500 hover:bg-green-600 focus:ring focus:ring-green-300 focus:border-green-300 text-white text-lg font-semibold rounded-lg w-full h-12"
                    onClick={() => connectWallet(selectedWallet)}
                  >
                    Connect
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
  );
  
}