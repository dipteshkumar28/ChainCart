import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Package } from 'lucide-react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';




function ProfilePage() {
    const navigate = useNavigate();
    const { user, login, updateProfilePic, addOrder, updatename } = useAuth();

    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        dob: '',
        profilePic: '',
        orders: [],
    });

    // Sample avatars
    const avatarOptions = [
        'https://miro.medium.com/v2/resize:fit:1400/0*1WJiB8mUJKcylomi.jpg',
        'https://imgcdn.stablediffusionweb.com/2024/4/19/e5510883-8b1e-4fdf-91e8-9667befe75c1.jpg',
        'https://unchainedcrypto.com/wp-content/uploads/2023/07/pfp-nft.png',
        'https://nfts.wtf/wp-content/uploads/2021/07/CryptoPunk6825-Margaret-Corvid-7fad9c0b9a93adaf0382dda875660fa4.jpg',
        'https://static.vecteezy.com/ti/vetor-gratis/p1/8079777-nft-non-fungible-tokens-crypto-art-nft-blockchain-pixel-art-character-on-background-gratis-vetor.jpg',
        'https://i.seadn.io/gae/F_F-_oMr41wGnuc2tPPxmXCPNBpktcdr7huzWoVCNNZxlSAYCU9jSEkgpvfxaoc39Mag6zzlRPuc95pVOMN0lAGagUqW0uAITUYO?auto=format&dpr=1&w=1000',
        ' https://i.seadn.io/gae/AzBt5e46vqe5Xy-0IbWJczNjzYzfM9Aib1NY9ibaZ1GdTY2tIbyWSuonOYKvSTHznYtDd7kedzAd3NEI0cp44Tsj-0bdlzraU5T3kw?auto=format&dpr=1&w=1000',
        ' https://cnews24.ru/uploads/276/276076a19e26266f15166b0068490f421744f8a3.webp',
        ' https://i.seadn.io/gae/VK2heUly5DMUwMLdIa05rv-pIP-2iS8fVW-18GOGRRL5_jRbB5oQ_W9VboRyyvDZ-26cpij90LfEO8ymRou8jslr8jrAw_XjHxrs?auto=format&dpr=1&w=1000'
    ];


    useEffect(() => {
        const userData = localStorage.getItem('chainCartUser');
        if (!userData) {
            navigate('/login');
            return;
        }

        let parsedUser;
        try {
            parsedUser = JSON.parse(userData);
        } catch (err) {
            console.error("Invalid chainCartUser in localStorage:", err);
            navigate('/login');
            return;
        }

        setProfile({
            name: parsedUser.name || '',
            phone: '',
            dob: '',
            profilePic: '',
            orders: [],
        });
        const profileKey = `chaincartProfile_${parsedUser.id}`;
        const store = localStorage.getItem(profileKey);
        if (store) {
            try {
                const parsedProfile = JSON.parse(stored);
                setProfile({
                    ...parsedProfile,
                    name: parsedUser.name,
                    profilePic: parsedUser.profilePic || parsedProfile.profilePic || '',
                });
            } catch (err) {
                console.error("Invalid profile data:", err);
            }
        } else {
            setProfile({
                name: parsedUser.name,
                phone: '',
                dob: '',
                profilePic: '',
                orders: [],
            });
        }

        const stored = localStorage.getItem('chaincartProfile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setProfile({
                    ...parsed,
                    name: parsedUser.name || parsed.name,
                    profilePic: parsed.profilePic || parsedUser.profilePic || '',
                    phone: parsed.phone || '',
                    dob: parsed.dob || '',
                    orders: parsed.orders || [],
                });
            } catch (err) {
                console.error("Invalid chaincartProfile in localStorage:", err);
                // fallback to default profile
                setProfile({
                    name: parsedUser.name,
                    phone: '',
                    dob: '',
                    profilePic: '',
                    orders: [],
                });
            }
        } else {
            setProfile({
                name: parsedUser.name,
                phone: '',
                dob: '',
                profilePic: '',
                orders: [],
            });
        }
    }, [navigate]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, profilePic: reader.result }));
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleSave = () => {
        localStorage.setItem('chaincartProfile', JSON.stringify(profile));

        login({
            ...user,
            profilePic: profile.profilePic,
        });

        if (profile.profilePic) {
            updateProfilePic(profile.profilePic); // ✅ Sync to AuthContext
        }
      
        // if (profile.orders) {
        //     addOrder(profile.orders);
        // }

        // alert('Profile saved successfully!');
        updatename(profile.name);
        toast.success('Profile saved successfully!');
    };

    const handledashboard = () => {
        navigate('/');
        window.location.reload();
    }


    return (
        <div className='bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen p-6'>

            <div className="max-w-5xl mx-auto p-6 ">
                <div className="flex items-center mb-6">
                    <User className="h-9 w-9 text-indigo-600 mr-3" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My ChainCart Profile</h1>
                </div>

                <div className="bg-gradient-to-tr from-blue-50 to-white rounded-xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Left Side */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-300 shadow-md mb-4">
                            {profile.profilePic ? (
                                <div>
                                    <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />

                                </div>
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-6xl">
                                    ?
                                </div>
                            )}
                        </div>
                        <label className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2  hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 rounded-lg">
                            Choose Photo
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                        {profile.profilePic && (
                            <button
                                onClick={() => setProfile(prev => ({ ...prev, profilePic: '' }))}
                                className="mt-2 text-sm text-red-500 font-semibold"
                            >
                                Remove photo
                            </button>
                        )}

                        <div className="mt-6 w-full">
                            <p className="font-medium mb-2 text-center">Or choose a Blockchain Avatar</p>
                            <div className="grid grid-cols-3 gap-4 justify-items-center">
                                {avatarOptions.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Avatar ${idx}`}
                                        onClick={() => setProfile(prev => ({ ...prev, profilePic: img }))}
                                        className={`w-20 h-20 rounded-full border-4 cursor-pointer hover:scale-105 transition ${profile.profilePic === img ? 'border-blue-500' : 'border-transparent'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>



                    {/* Profile Info */}
                    <div className="space-y-8 mt-10">
                        <h1 className='text-3xl font-semibold ml-40 mb-14 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>About You</h1>
                        <div>
                            <label className="block font-medium mb-1 ml-10">Name</label>
                            <input
                                type="name"
                                name='name'
                                value={profile.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    handleInputChange(e);      // update local state in the form
                                    updatename(value);         // update in context + localStorage
                                }}
                                className="w-96 ml-10 border rounded px-3 py-2 shadow-sm0"
                                placeholder='Your Name'

                            // readOnly
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1 ml-10">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleInputChange}
                                className="w-96 ml-10 border rounded px-3 py-2 shadow-sm"
                                placeholder="e.g. +1234567890"
                            />
                        </div>
                        <div >
                            <label className="block font-medium mb-1 ml-10">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={profile.dob}
                                onChange={handleInputChange}
                                className="w-96 ml-10 border rounded px-3 py-2 shadow-sm"
                            />
                        </div>
                        <div className='flex'>

                            <button
                                onClick={handleSave}
                                className="ml-5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-300 text-white px-4 py-2 rounded-lg "
                            >
                                Save Profile
                            </button>

                            <button
                                onClick={handledashboard}
                                className="ml-[160px] cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2  hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 rounded-lg"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="mt-10">
                    <div className='flex'>
                        <Package className='h-9 w-9 text-indigo-600 mr-3' />
                        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            My Orders</h2>
                    </div>
                    {profile.orders && profile.orders.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {(() => {
                                // Track already displayed order IDs to prevent duplicates
                                const displayedOrderIds = new Set();
                                const uniqueOrders = [];

                                // First filter unique orders
                                (profile.orders || []).forEach((order) => {
                                    if (order && typeof order === 'object' && !displayedOrderIds.has(order.id)) {
                                        displayedOrderIds.add(order.id);
                                        uniqueOrders.push(order);
                                    }
                                });

                                // Then render them
                                return uniqueOrders.map((order) => (
                                    <div key={order.id} className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition ">
                                        <div className='flex'>
                                            <div>
                                                <p className="text-lg font-medium">{order.item}</p>
                                                <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                                                <p className="text-sm text-gray-600">Date: {order.date}</p>
                                                {order.price && (
                                                    <p className="text-sm text-gray-600">Price: {order.price} ETH</p>
                                                )}
                                                {order.quantity && (
                                                    <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                                                )}
                                                <span className={`text-sm inline-block mt-2 px-3 py-1 rounded-full ${order.status === 'Delivered'
                                                    ? 'bg-green-100 text-green-600'
                                                    : order.status === 'Shipped'
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <img src={order.image} alt={order.name} className="w-36 h-36 object-cover ml-28" />

                                        </div>
                                    </div>
                                ));
                            })()}

                            {/* <button
                                onClick={handleClearAllOrders}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            >
                                Clear All Orders
                            </button> */}
                        </div>
                    ) : (
                        <div className="bg-white border rounded-lg p-6 shadow text-center">
                            <p className="text-gray-500">No orders found. Start shopping to see your orders here!</p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                                Browse Products
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default ProfilePage;
