import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [transferStatus, setTransferStatus] = useState("");
    const [error, setError] = useState("");
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

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

    const handleTransfer = async () => {
        if (amount > balance) {
            setError("Insufficient funds. Please check your balance and try again.");
            return;
        }

        try {
            await axios.post("http://localhost:5001/api/v1/account/transfer", {
                to: id,
                amount
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setTransferStatus("success");
        } catch (error) {
            console.error("Error transferring money:", error);
            setError("An error occurred during the transfer. Please try again.");
        }
    };

    if (transferStatus === "success") {
        return (
<div className="flex flex-col justify-center items-center h-screen bg-green-500 text-white space-y-8">
    <h1 className="text-4xl font-bold">Transfer Successful!</h1>
    <button 
        onClick={() => navigate("/dashboard")}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
    >
        Go Back to Dashboard
    </button>
</div>
        );
    }

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="amount">
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <button
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                            >
                                Initiate Transfer
                            </button>
                            {error && (
                                <div className="mt-4 text-center">
                                    <div className="text-red-500">{error}</div>
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="mt-2 justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-blue-500 text-white"
                                    >
                                        Go Back to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
