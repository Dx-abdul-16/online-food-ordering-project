import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Clock, User as UserIcon } from "lucide-react";

interface UserData {
    id: number;
    username: string;
    role: string;
    name?: string;
    email?: string;
}

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        // Retrieve user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUserData(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const displayName = userData?.name || userData?.username || 'User';

    return (
        <div className="min-h-screen bg-[#1a103d] p-8 text-white font-sans">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Dashboard</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <UserIcon className="h-5 w-5 text-purple-400" />
                        <p className="text-gray-300">Welcome back, <span className="font-semibold text-white">{displayName}</span>!</p>
                    </div>
                    {userData?.username && (
                        <p className="text-sm text-gray-400 mt-1">@{userData.username}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate("/")} variant="outline" className="border-gray-600 bg-transparent text-white hover:bg-white/10">
                        Go Home
                    </Button>
                    <Button onClick={handleLogout} variant="outline" className="border-red-600 bg-transparent text-red-400 hover:bg-red-600/10">
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-[#2d1b69] border-none text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-gray-400 mb-2">Arriving soon</p>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full bg-[#5e17eb] text-white hover:bg-[#4a12bd]"
                            onClick={() => navigate('/track-order')}
                        >
                            Track Order
                        </Button>
                    </CardContent>
                </Card>
                <Card className="bg-[#2d1b69] border-none text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Favorite Restaurants</CardTitle>
                        <Star className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card className="bg-[#2d1b69] border-none text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Order History</CardTitle>
                        <Clock className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48</div>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for order list */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                <div className="rounded-lg bg-[#110c2a] p-4 text-center text-gray-400">
                    No recent orders found.
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
