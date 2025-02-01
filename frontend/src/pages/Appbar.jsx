import { useState, useEffect } from "react";

export const Appbar = () => {
    
    const [username, setUsername] = useState("");
    const [data, setData] = useState(false); // Declare the `data` state variable

    // Function to get data from localStorage
    const toggleGetData = () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            
            setUsername(userInfo.Email);
            setData(true); // Set `data` to true to display the information
        }
    };

    // Call `toggleGetData` to fetch the data when the component mounts
    useEffect(() => {
        toggleGetData();
    }, []);

    return (
        <div className="shadow h-14 flex justify-between">
            <div className="flex flex-col justify-center h-full ml-4">
                PaySwift
            </div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    
                    <div className=" text-blue italic">{username}</div>
                </div>
                <div className="rounded-full h-10 w-10 bg-slate-700 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl text-white font-bold">
                        {username && username[0].toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
};
