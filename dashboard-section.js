  import React, { useEffect, useState } from 'react';
  import { BrowserWallet } from '@meshsdk/core';
  import Link from "next/link";
  import { useRouter } from 'next/router'
import { Elsie_Swash_Caps } from 'next/font/google';
import Footer from '@/components/Footer'


  const Dashboard = () => {
    
    const router = useRouter()
    const [walletType, setWalletType] = useState('');
    const [address, setAddress] = useState('');
    const [stake, setStake] = useState([]);
    const [lovelace, setLovelace] = useState(0)
    const [username, setUsername] = useState('rubabanam');
    const [finalUsername, setFinalUsername] = useState('rubabanam');
    const [nothingness, setNothingness] = useState(' ');

    async function updateUsername (){
      //on submit clicked, update finalUsername state with username state and then send the finalusername in the update request.
      //change the update request handler on backend to return new token after the update has been successful.
      //set token to local storage here.
      try {
        if (walletType && address && stake.length > 0) {
          console.log("All details were here!");
    
          const stakeToSend = stake[0].toString();
          
          console.log("details I am going to try to send are");
    
          console.log(finalUsername);
          console.log(address);
          console.log(stakeToSend);
    
          const response = await fetch(`http://3.134.237.219:3000/api/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: "sampleUser",
              wallet_address: address,
              stake_key: stakeToSend,
            }) // Removed unnecessary semicolon
    
          });
        }
      }catch{

      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('/api/update-username', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });
  
        if (response.ok) {
          console.log('Username updated successfully!');
          // You can handle success behavior here
        } else {
          const data = await response.json();
          console.error(`Error updating username: ${data.message}`);
          // You can handle error behavior here
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

  async function enableWallet(walletNameValue) {
      console.log(`Inside enableWallet function in dashboard ${walletNameValue}`);
      const wallet = await BrowserWallet.enable(walletNameValue);
      setAddress(await wallet.getChangeAddress());
      setLovelace(await wallet.getLovelace());
      setStake(await wallet.getRewardAddresses());
      console.log(`stake after await and before qr generation is ${stake}`);
      
  }


  useEffect(()=> {
    
    (async () => {
      try {
        const stakeRightNow = stake[0];
        if(stakeRightNow.startsWith("stake")){
          await generateQRCode();
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [stake[0]])


  async function generateQRCode() {
    try {
      if (walletType && address && stake.length > 0) {
        console.log("All details were here!");
  
        const stakeToSend = stake[0].toString();
        
        console.log("details I am going to try to send are");
  
        console.log(username);
        console.log(address);
        console.log(stakeToSend);
  
        const response = await fetch(`http://3.134.237.219:3000/api/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: "sampleUser",
            wallet_address: address,
            stake_key: stakeToSend,
          }) // Removed unnecessary semicolon
  
        });
        
        console.log("Request was sent");
        const responseText = await response.text();
        console.log(responseText);
  
        if (responseText.includes("E11000 duplicate key error collection")) {
          console.log("Response received did not have a token, i.e., old user");
          console.log("Trying to log in");
          const loginResponse = await fetch(`http://3.134.237.219:3000/api/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              wallet_address: address,
              stake_key: stake[0],
            })
          });
          
          console.log("Sent request to log in");
          
          if (loginResponse.ok) {
            console.log("login response was okay");
            console.log("Login response data:");
            console.log(loginResponse);
  
            // Parse the JSON response
            const loginResponseData = await loginResponse.json();
            console.log("Login response data:");
            console.log(loginResponseData);
  
            // Access the token from the parsed JSON
            const token = loginResponseData.token;
  
            if (token) {
              // Store the token in local storage
              console.log("Setting user detail token to local storage!");
              localStorage.setItem('user_detail_token', token);

            } else {
              console.log("Login response unexpected");
              console.log(loginResponseData);
            }
          } else {
            console.log("login response was not okay");
          }
        } else if (response.ok) {
          console.log("WOW NEW USER");
          console.log(response.headers.get('content-type'));
          
          const responseData = JSON.parse(responseText);
          
         
  
          if (responseData.token) {
            console.log("Response received had a token, i.e., the user is new");
            console.log("Setting user detail token into local storage");
            // Store the token in local storage
            localStorage.setItem('user_detail_token', responseData.token);

          } else {
            // Handle the case where the response doesn't contain a token
          }
        } else {
          console.error('Request failed with status:', response.status);
        }
      } else {
        console.log("Tried to enter too soon");
      }
    } catch (error) {
      console.log("Error here");
      console.error(error);
      console.log(error.text());
    }
  }
  

  function showConnectWalletPage() {
    router.push("/connect");
  }
    

  useEffect(() => {

    setTimeout(() => {
        const walletTypeInStorage = window.localStorage.getItem('walletType');
      
      if (!walletTypeInStorage) {
        showConnectWalletPage();
      }
      else { 
        const { value, expiry } = JSON.parse(walletTypeInStorage);
        
        if (new Date().getTime() > expiry) {
          window.localStorage.clear();
            showConnectWalletPage();
        }
        else {
          const walletTypeV = JSON.parse(walletTypeInStorage.toString()).value;
          setWalletType(walletTypeV.toString());
          (async () => {
            try {
              // Async code that may include await statements
              await enableWallet(walletTypeV);
              console.log("success");
            } catch (error) {
              console.error(error);
            }
          })();
      }
      }
    }, 500);
      
      
    }
    ,[]);

    return (
      <>
      
      {/* <!-- Card Section --> */}
      <div className="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* <!-- Card --> */}
      <div>
      <a className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition light:bg-slate-900 light:border-gray-800" href="#">
        <div className="p-4 md:p-5">
          <div className="flex">
            <svg className="mt-1 shrink-0 w-5 h-5 text-gray-800 light:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
            </svg>

            <div className="grow ml-5">
              <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 light:group-hover:text-gray-400 light:text-gray-200">
                Wallet Address
              </h3>
              <p className="text-sm text-gray-500">
                      {address && address.length > 10 ? (
                        <>
                          {address.slice(0, 7)}...{address.slice(-7)}
                        </>
                      ) : (
                        address
                      )}
                    </p>
            </div>
          </div>
        </div>
      </a>
      </div>

      {/* <!-- End Card --> */}


      {/* <!-- Card --> */}
      <div>
      <a className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition light:bg-slate-900 light:border-gray-800" href="#">
        <div className="p-4 md:p-5">
          <div className="flex">
            <svg className="mt-1 shrink-0 w-5 h-5 text-gray-800 light:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z"/>
              <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            </svg>

            <div className="grow ml-5">
              <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 light:group-hover:text-gray-400 light:text-gray-200">
                Stake Key
              </h3>
              <p className="text-sm text-gray-500">
              {stake.length > 0 ? (
                <>
                  {stake[0].length > 10 ? (
                    <>
                      {stake[0].slice(0, 5)}...{stake[0].slice(-5)}
                    </>
                  ) : (
                    stake[0]
                  )}
                </>
              ) : (
                "No stake key available"
              )}
            </p>
            </div>
          </div>
        </div>
      </a>
      </div>
      {/* <!-- End Card --> */}












      {/* <!-- Card --> */}
      <div>
      <a className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition light:bg-slate-900 light:border-gray-800" href="#">
        <div className="p-4 md:p-5">
          <div className="flex">
            <svg className="mt-1 shrink-0 w-5 h-5 text-gray-800 light:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.47 1.318a1 1 0 0 0-.94 0l-6 3.2A1 1 0 0 0 1 5.4v.817l5.75 3.45L8 8.917l1.25.75L15 6.217V5.4a1 1 0 0 0-.53-.882l-6-3.2ZM15 7.383l-4.778 2.867L15 13.117V7.383Zm-.035 6.88L8 10.082l-6.965 4.18A1 1 0 0 0 2 15h12a1 1 0 0 0 .965-.738ZM1 13.116l4.778-2.867L1 7.383v5.734ZM7.059.435a2 2 0 0 1 1.882 0l6 3.2A2 2 0 0 1 16 5.4V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5.4a2 2 0 0 1 1.059-1.765l6-3.2Z"/>
            </svg>

            <div className="grow ml-5">
              <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 light:group-hover:text-gray-400 light:text-gray-200">
                Wallet Name
              </h3>
              <p className="text-sm text-gray-500">
                {walletType}
              </p>
            </div>
          </div>
        </div>
      </a>
      </div>
      {/* <!-- End Card --> */}






      <div>
      <a className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition light:bg-slate-900 light:border-gray-800" href="#">
        <div className="p-4 md:p-5">
          <div className="flex">
            <svg className="mt-1 shrink-0 w-5 h-5 text-gray-800 light:text-gray-200" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z"/>
              <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            </svg>

            <div className="grow ml-5">
              <h3 className="group-hover:text-blue-600 font-semibold text-gray-800 light:group-hover:text-gray-400 light:text-gray-200">
                Username
              </h3>
              <p className="text-sm text-gray-500">
              {username.length > 0 ? (
                <>
                  {username.length > 10 ? (
                    <>
                      {username}
                    </>
                  ) : (
                    username
                  )}
                </>
              ) : (
                "No username"
              )}
            </p>
            </div>
          </div>
        </div>
      </a>
      </div>
      {/* end of card */}



    {/* end of card */}




    </div>
    {/* <!-- End Grid --> */}
  </div>
  {/* <!-- End Card Section --> */}


  <div className="max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
    {/* <!-- Card --> */}

  </div>
</div>









  
      </>
      
    );
  }

  export default Dashboard;