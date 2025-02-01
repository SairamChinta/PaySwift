import React, { useState, useEffect } from 'react';
import { Appbar } from "./Appbar";
import { Users } from './Users';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Dashboard = () => {
  const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
      
        // Fetch user's balance
        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/v1/account/balance", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Error fetching balance:", error);
                setError("An error occurred while fetching balance. Please try again.");
            }
        };

        fetchBalance();
        
  }, []);


    return (
        <div>
            <Appbar />
            <div className='m-8'>
                <Balance value={balance} />
                {error && <div className="text-red-500">{error}</div>}
                <button
                    onClick={(e) => {navigate("/deposit")}}
                    className="mt-2 justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-30 bg-blue-500 text-white">
                    Deposit
                </button>
                <Users />
            </div>
        </div>
    );
};

export const Balance = ({ value }) => {
    return (
        <div className="flex">
            <div className="font-bold text-lg">
                Your balance
            </div>
            <div className="font-semibold ml-4 text-lg">
                Rs {value}
            </div>
        </div>
    );
};
