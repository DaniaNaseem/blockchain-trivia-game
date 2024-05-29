import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Import the Link component
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { BrowserWallet } from "@martifylabs/mesh";
import { useWallet } from "@martifylabs/mesh-react";


function Navbar() {

  const router = useRouter();
  
const [currentPage, setCurrentPage] = useState(router.pathname);


const { connect, connected, disconnect } = useWallet();
const [wallets, setWallets] = useState([]);
const [selectedWallet, setSelectedWallet] = useState("");

const [walletType, setWalletType] = useState(() => {
  if (typeof window !== "undefined") {
    const walletTypeInStorage = localStorage.getItem("walletType");
    if (!walletTypeInStorage) {
      return "";
    }

    const { value, expiry } = JSON.parse(walletTypeInStorage);

    if (new Date().getTime() > expiry) {
      window.localStorage.removeItem("walletType");
      window.localStorage.removeItem("token");
      return "";
    }

    return value;
  }
});

const handleDashboardClick = () => {
  // Handle dashboard button click
  router.push("/dashboard");
};

useEffect(() => {
  setCurrentPage(router.pathname);
  if (typeof window !== "undefined") {
    const walletTypeInStorage = localStorage.getItem("walletType");
    if (!walletTypeInStorage) {
      return;
    }

    const { value, expiry } = JSON.parse(walletTypeInStorage);

    if (new Date().getTime() > expiry) {
      window.localStorage.removeItem("walletType");
      window.localStorage.removeItem("token");
      return;
    }

    setWalletType(value);
    connectWallet(value);
  }
}, [router.pathname       ]);

useEffect(() => {
  setWallets(BrowserWallet.getInstalledWallets());
}, []);

const connectButtonClick = async () => {
    goToConnection();
};
const [token, setToken] = useState("true");

const getToken = async () => {
  
};

const connectWallet = async (walletName) => {
  try {
    //need to hit api here to receive token
    await connect(walletName);

    getToken().then(
      function (value) {
        //console.log(value);
      },
      function (error) {
        //console.log(error);
      }
    );

    if (token === "true") {
      window.localStorage.setItem(
        "token",
        JSON.stringify({
          value: token,
          expiry: new Date().getTime() + 48 * 60 * 60 * 1000,
        })
      );
      window.localStorage.setItem(
        "walletType",
        JSON.stringify({
          value: walletName,
          expiry: new Date().getTime() + 48 * 60 * 60 * 1000,
        })
      );

      //goToDashboard();
    } else {
      disconnect();
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  if (!connected) {
    window.localStorage.removeItem("walletType");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user_detail_token");
    disconnect();
  }
}, [connected]);

const goToDashboard = () => {
  router.push("/dashboard");
};

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const handleCloseMobileMenu = () => {
  setIsMobileMenuOpen(false);
};



useEffect(() => {
  if (typeof window !== "undefined") {
    const walletTypeInStorage = localStorage.getItem("walletType");
    if (!walletTypeInStorage) {
      return;
    }

    const { value, expiry } = JSON.parse(walletTypeInStorage);

    if (new Date().getTime() > expiry) {
      window.localStorage.removeItem("walletType");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user_detail_token");
      setWalletType("");
      disconnect();
    } else {
      setWalletType(value);
      connectWallet(value);
    }
  }
}, []);

function goToHome(){
  router.push('/');
}

function disconnectAndGotoHome(){
  disconnect();
  goToHome();
  
}
  return (
      <div className='bg-black w-full py-4 sticky top-0 z-20'>
        <div className='flex justify-between items-center mx-auto'>
          <Link href='/'>
            <button className='py-2 rounded-md mx-12 text-4xl text-gray-200 drop-shadow-sm hover:text-gray-50'>
              <img src='/images/logo/logo-white.svg' width={130}/>
            </button>
          </Link>
           {/* Navigation Links */}
            {/* <div className="hidden md:flex space-x-4">
              <Link href="/dashboard">
                <button className="hover:text-gray-300">Dashboard</button>
              </Link>
              <Link href="/challenges">
                <button className="hover:text-gray-300">Challenges</button>
              </Link>
            </div> */}
          
          
          <div className="header-btn header-btn-l1 ms-auto d-none d-xs-inline-flex">
            {!connected ? (
              <Link href="/connect">
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-700 rounded-lg group bg-gradient-to-br from-yellow-400 to-red-500 group-hover:from-yellow-400 group-hover:to-orange-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-red-800">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-white rounded-md group-hover:bg-opacity-0">
                    Connect Wallet
                    </span>
                    </button>
              </Link>
            ) : currentPage === "/dashboard" ? (
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-700 rounded-lg group bg-gradient-to-br from-yellow-400 to-red-500 group-hover:from-yellow-400 group-hover:to-orange-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-red-800" onClick={disconnectAndGotoHome}>
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-white rounded-md group-hover:bg-opacity-0">
                Disconnect
                </span>
              </button>
            ) : (
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-700 rounded-lg group bg-gradient-to-br from-yellow-400 to-red-500 group-hover:from-yellow-400 group-hover:to-orange-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-red-800" onClick={handleDashboardClick}>
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-white rounded-md group-hover:bg-opacity-0">
                Dashboard
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
  );
}

export default Navbar;
