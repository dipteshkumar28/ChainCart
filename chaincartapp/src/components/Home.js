import { useState, useEffect } from 'react';
import { ShoppingCart, Wallet, CreditCard, Package, AlertCircle, LogOut, Settings, LogIn, HomeIcon, Copy } from 'lucide-react';
import { parseEther, toBeHex, Interface } from 'ethers';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';

// Mock product data
export const PRODUCTS = [
  { id: 1, name: "Ethereum T-Shirt", price: 0.01, image: "https://res.cloudinary.com/etherbit/image/upload/f_auto,q_auto:eco,c_limit,w_400/s/build/img/products/1x1-dcd1c4-etherbit-merch-ethereum.png", description: "Stylish crypto-themed t-shirt" },
  { id: 2, name: "Blockchain Hoodie", price: 0.02, image: "https://i.etsystatic.com/18780231/r/il/a4faaf/5157925019/il_fullxfull.5157925019_cer4.jpg", description: "Warm hoodie for coding sessions" },
  { id: 3, name: "NFT Collector Cap", price: 0.005, image: "https://i.etsystatic.com/24670763/r/il/f1eef8/3893522753/il_fullxfull.3893522753_qpyw.jpg", description: "Limited edition collector's cap" },
  { id: 4, name: "Smart Contract Mug", price: 0.008, image: "https://i.ebayimg.com/images/g/ijIAAOSwHJhk-eN7/s-l1200.jpg", description: "Perfect for your morning coffee" },
  {
    id: 5,
    name: "Bitcoin Socks",
    price: 0.003,
    image: "https://ae01.alicdn.com/kf/S5e9457a6bf194e6fa0210b924fa68dd9X.jpg",
    description: "Comfortable socks with Bitcoin pattern",
    category: "apparel"
  }, {
    id: 6,
    name: "Blockchain Notebook",
    price: 0.065,
    image: "https://customfreaks.store/wp-content/uploads/2022/02/34_fb40b1f4-8eb4-41fa-b74a-b1b1988fca57.jpg",
    description: "Premium notebook for your crypto ideas and plans",
    category: "accessories"
  },
  {
    id: 7,
    name: "NFT Creation Guide",
    price: 0.014,
    image: "https://www.whataportrait.com/media/wordpress/5f3cfbe5e12c6e5d1d323934b8f68676.jpg",
    description: "Step-by-step guide to creating and selling NFTs",
    category: "books"
  },
  {
    id: 8,
    name: "Genesis Block Commemorative Coin",
    price: 0.1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqScPO71lV_Cppaf76agkm8et-uQC_PfY7Eg&s",
    description: "Limited edition commemorative coin of Bitcoin's genesis block",
    category: "limited"
  },
  {
    id: 9,
    name: "Blockchain Art Print",
    price: 0.018,
    image: "https://iprintz.in/wp-content/uploads/2022/07/iprintz_Abstract-Bitcoin-Canvas-Print2.jpg",
    description: "Limited edition art print depicting blockchain technology",
    category: "collectibles"
  },
];

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = "0x9D4583E7aE91BcAdf7de9bc258d06e2B9FFfb3d3";

const Home = () => {
  const [cart, setCart] = useState([]);
  const [account, setAccount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);


  const { profilePic, addOrder, user } = useAuth();

  // Check for wallet connection from localStorage on component mount



  useEffect(() => {
    // Example: Trigger success message after order completion
    if (orderComplete) {
      const timer = setTimeout(() => {
        setOrderComplete(false); // Hide message after 5 seconds
      }, 5000); // 5000ms = 5 seconds

      return () => clearTimeout(timer); // Cleanup on component unmount or message hide
    }
  }, [orderComplete]);

  useEffect(() => {
    let timer;
    if (showWelcomeMessage) {
      timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showWelcomeMessage]);

  useEffect(() => {
    let timer;
    if (showLoginPrompt) {
      timer = setTimeout(() => {
        setShowLoginPrompt(false);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showLoginPrompt]);



  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('chainCartUser');
    if (storedUser) {
      const parseduserData = JSON.parse(storedUser);
      setUserData(parseduserData);
      setIsLoggedIn(true);

      // Check for login success flag in URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const justLoggedIn = urlParams.get('loginsuccess') === 'true' || localStorage.getItem('justLoggedIn') === 'true';

      if (justLoggedIn) {
        setShowWelcomeMessage(true);
        // Remove the flag from localStorage
        localStorage.removeItem('justLoggedIn');
        // Clean up URL parameter
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);


  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isLoggedIn) {
      // Show login prompt if trying to connect wallet without being logged in
      setShowLoginPrompt(true);
      return;
    }
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        localStorage.setItem('chaincartWallet', accounts[0]); // 🔥 Save wallet
        setError(null);
      } else {
        setError("Please install MetaMask to use ChainCart");
      }
    } catch (err) {
      setError("Failed to connect wallet: " + (err.message || "Unknown error"));
    }
  };



  const handleLogout = () => {
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.removeItem('chainCartUser');
    localStorage.removeItem('chaincartWallet');
    setAccount(null);
    setDropdownOpen(false);
    navigate("/login")
    window.location.reload();
  };

  const handleProfileClick = () => {
    console.log("Navigate to profile");
    setDropdownOpen(false);
    navigate("/profile");
    window.location.reload();
  };
  const navigateToLogin = () => {
    console.log("Navigating to login page");
    setTimeout(() => {
      handleLogin();
    }, 1000);

  };
  const handleLogin = () => {
    // In a real app, this would be after successful authentication
    setIsLoggedIn(true);
    navigate("/login");
    window.location.reload();

  };


  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    }
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Process payment
  const checkout = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create a random order ID with timestamp for uniqueness
      const timestamp = Date.now();
      const orderId = Date.now(); // pure number, safe for BigInt

      // Convert price to wei (1 ETH = 10^18 wei)
      const totalPriceWei = toBeHex(parseEther(totalPrice.toString()));

      // Send transaction via MetaMask
      const transactionParameters = {
        to: CONTRACT_ADDRESS,
        from: account,
        value: totalPriceWei,
        data: encodeProcessPaymentData(orderId)
      };

      // Execute the transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      // Wait for transaction confirmation
      await waitForTransaction(txHash);

      // Save order to profile with transaction hash for reference
      saveOrderToProfile(orderId, txHash);

      setOrderComplete(true);
      setCart([]);
    } catch (err) {
      setError("Payment failed: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };


  const saveOrderToProfile = (orderId) => {
    if (!isLoggedIn) return;

    try {
      // Get current profile data
      let profileData = {};
      const storedProfile = localStorage.getItem('chaincartProfile');

      if (storedProfile) {
        profileData = JSON.parse(storedProfile);
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];



      // Create new order objects from cart items
      const newOrders = cart.map(item => {
        return {
          id: `${orderId}-${item.id}`,
          item: item.name,
          date: formattedDate,
          status: 'Processing', // Initial status
          quantity: item.quantity,
          price: item.price,
          totalPrice: (item.price * item.quantity).toFixed(4),
          image: item.image,
          timestamp: Date.now() // For sorting by most recent
        };
      });

      // Update profile orders
      const updatedOrders = [...(profileData.orders || []), ...newOrders];

      // Save updated profile
      const updatedProfile = {
        ...profileData,
        orders: updatedOrders
      };



      localStorage.setItem('chaincartProfile', JSON.stringify(updatedProfile));

    } catch (error) {
      console.error("Error saving order:", error);
    }
  };



  // Encode function call data for processPayment(uint256)
  // This is a simplified version - in production, use a library or more robust encoding
  const iface = new Interface([
    "function processPayment(uint256 orderId)"
  ]);

  function encodeProcessPaymentData(orderId) {
    return iface.encodeFunctionData("processPayment", [orderId]);
  }

  // Simple transaction confirmation - in production use event listeners
  async function waitForTransaction(txHash) {
    return new Promise((resolve, reject) => {
      const checkTx = async () => {
        try {
          const receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });

          if (receipt) {
            resolve(receipt);
          } else {
            setTimeout(checkTx, 2000); // Check again in 2 seconds
          }
        } catch (err) {
          reject(err);
        }
      };

      checkTx();
    });
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white backdrop-blur-sm bg-opacity-90 p-5 shadow-lg rounded-xl mb-8 flex justify-between items-center border-l-4 border-indigo-600">
          <div className="flex items-center">
            <ShoppingCart className="h-9 w-9 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ChainCart</h1>
          </div>

          <div className="flex items-center space-x-5">
            {cart.length > 0 && (
              <div className="flex items-center text-gray-700 bg-indigo-100 py-2 px-4 rounded-full">
                <Package className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="font-medium">{cart.reduce((total, item) => total + item.quantity, 0)} items</span>
              </div>
            )}

            {!isLoggedIn ? (
              <button
                onClick={navigateToLogin}
                className="flex items-center px-5 py-2 rounded-full shadow-md transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center px-5 py-2 rounded-full shadow-md transition-all duration-300 bg-green-100 text-green-800 border border-green-300"
                >
                  {profilePic && (
                    <img
                      src={profilePic}
                      alt="User"
                      className="w-7 h-6 mr-2 rounded-full border border-green-400"
                    />
                  )}
                  {isLoggedIn ?

                    (user ? user.name : "User") : (
                      userData ? userData.name : "User"
                    )
                  }
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left"
                    >
                      <Settings size={16} className="mr-2 text-indigo-600" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 w-full text-left"
                    >
                      <LogOut size={16} className="mr-2 text-indigo-600" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={connectWallet}
              className={`flex items-center px-5 py-2 rounded-full shadow-md transition-all duration-300 ${account
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
            >
              <Wallet className="h-5 w-5 mr-2" />
              {account
                ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                : "Connect Wallet"}
            </button>


          </div>
        </header>

        {/* Welcome back message */}
        {showWelcomeMessage && isLoggedIn (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-md transition-all duration-300">
            <div className="flex items-center">
              <HomeIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-800 font-medium">Welcome back, {userData.name}!</span>
            </div>
          </div>
        )}

        {showLoginPrompt && (
          <div className="absolute top-24 right-48 bg-amber-50 border-l-4 border-amber-500 p-4 rounded shadow-md transition-all duration-300 animate-fade-in">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-amber-800 font-medium">Please login before connecting your wallet</span>
            </div>
          </div>
        )}


        {/* Error display */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-md animate-pulse">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Order complete message */}
        {orderComplete && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              <span>Order completed successfully! Thank you for your purchase.</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Products */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="bg-indigo-600 w-2 h-8 rounded mr-3 inline-block"></span>
              Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {PRODUCTS.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.price} ETH
                    </div>
                  </div>

                  {/* FLEX CONTAINER FOR CONTENT */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center mt-auto"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6 mt-14">
              {cart.length === 0 ? (<h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Your Cart
              </h2>) : (
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Cart ({cart.length})
                </h2>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-gray-400 mb-3">
                    <ShoppingCart className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="py-3 flex justify-between bg-gray-50 p-3 rounded-lg">
                        <div className='flex space-x-2 '>
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                          <div className='mt-2'>
                            <h3 className="font-medium text-gray-800 text-sm ">{item.name}</h3>
                            <p className="text-indigo-600 text-sm font-medium">{item.price} ETH × {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex border rounded-lg overflow-hidden">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 px-3 py-1 transition-colors duration-200"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 bg-white">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-1 transition-colors duration-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-6 pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total to pay:</span>
                      <span className="text-indigo-600">{totalPrice.toFixed(4)} ETH</span>
                    </div>

                    <button
                      onClick={checkout}
                      disabled={!account || isProcessing}
                      className={`w-full mt-6 py-3 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ${!account || isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        } text-white font-medium`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>

                          <CreditCard className="h-5 w-5 mr-2" />
                          Checkout with ETH
                        </>
                      )}
                    </button>

                    {!account && (
                      <p className="text-red-500 text-sm mt-3 text-center flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Please connect your wallet to checkout
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;