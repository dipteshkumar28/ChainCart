import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const savedWallet = localStorage.getItem('chaincartWallet');
    if (savedWallet) {
      setAccount(savedWallet);
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem('chaincartWallet', accounts[0]);
        } else {
          setAccount(null);
          localStorage.removeItem('chaincartWallet');
        }
      });
    }
  }, []);


  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('chaincartUser');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Failed to parse user:", err);
      localStorage.removeItem('chaincartUser');
    }

    try {
      const storedProfile = localStorage.getItem('chaincartProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        if (profile.profilePic) setProfilePic(profile.profilePic);
        // if (profile.name) setName(profile.name); // ✅ Load saved name
      }
    } catch (err) {
      console.error("Failed to parse profile:", err);
      localStorage.removeItem('chaincartProfile');
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('chaincartUser', JSON.stringify(userData));
    setUser(userData);

    // Reload profilePic after login
    const storedProfile = localStorage.getItem('chaincartProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        if (profile.profilePic) {
          setProfilePic(profile.profilePic);
        }
        if (profile.name) { setName(profile.name); } // ✅ Reload name after login
      } catch (err) {
        console.error("Failed to parse chaincartProfile after login:", err);
      }
    }
  };



  const logout = () => {
    setUser(null);
    setProfilePic('');
    setAccount(null);
    localStorage.removeItem('chaincartUser');
    localStorage.removeItem('chaincartWallet');
  };

  const updateProfilePic = (pic) => {
    if (!user?.id) return;

    setProfilePic(pic);
    const profileKey = `chaincartProfile_${user.id}`;

    try {
      const currentProfile = localStorage.getItem(profileKey);
      const profile = currentProfile ? JSON.parse(currentProfile) : { orders: [] };

      const updatedProfile = { ...profile, profilePic: pic };
      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error("Failed to update profile pic:", error);

    }
  };

  const updatename = (newName) => {
    if (!user?.id) return;

    // Update in user object
    const updatedUser = { ...user, name: newName };
    localStorage.setItem('chaincartUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    try {
      const profileData = localStorage.getItem('chaincartProfile');
      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        const updatedProfile = {
          ...parsedProfile,
          name
        };
        localStorage.setItem('chaincartProfile', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error("Error updating profile name:", error);
    }

    return true;
  };

  const addOrder = (orderData) => {
    if (!user?.id) return;

    const profileKey = `chaincartProfile_${user.id}`;
    try {
      const currentProfile = localStorage.getItem(profileKey);
      const profile = currentProfile ? JSON.parse(currentProfile) : { orders: [] };

      const newOrder = {
        id: orderData.id,
        item: orderData.item,
        date: orderData.Date,
        status: orderData.status,
        price: orderData.price,
        quantity: orderData.quantity,
      };

      const filteredOrders = profile.orders.filter(order => order.id !== newOrder.id);

      const updatedProfile = {
        ...profile,
        orders: [...filteredOrders, newOrder],
      };

      localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  };

  const value = {
    user,
    profilePic,
    login,
    logout,
    updateProfilePic,
    updatename,
    addOrder,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
