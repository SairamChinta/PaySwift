import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const DepositMoney = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(0);
    const [depositStatus, setDepositStatus] = useState("");
    const [error, setError] = useState("");

    const handleDeposit = async () => {
        try {
            await axios.post("http://localhost:5001/api/v1/account/deposit", {
                amount
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setDepositStatus("success");
        } catch (error) {
            console.error("Error depositing money:", error);
            setError("An error occurred during the deposit. Please try again.");
        }
    };

    if (depositStatus === "success") {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-green-500 text-white space-y-8">
                <h1 className="text-4xl font-bold">Deposit Successful!</h1>
                <button 
                    onClick={() => setDepositStatus("")}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Make Another Deposit
                </button>
                <button onClick={(e) => navigate("/dashboard")}
                    className="mt-2 justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-50 bg-blue-500 text-white">
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
                        <h2 className="text-3xl font-bold text-center">Deposit Money</h2>
                    </div>
                    <div className="p-6">
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
                                onClick={handleDeposit}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                            >
                                Initiate Deposit
                            </button>
                            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
