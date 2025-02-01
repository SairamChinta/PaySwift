import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button"
import axios from "axios";
export const Users = () => {
    const [users,setUsers]=useState([]);
    const [filter,setFilter]=useState("");

//if you want add debouncing

    useEffect(()=>{
       axios.get("http://localhost:5001/api/v1/user/bulk?filter="+ filter)
       .then(response =>{
            setUsers(response.data.users)
       })
    },[filter])

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e)=>{
                setFilter(e.target.value);
            }}
            type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {users.map(user => <User user={user} />)}
        </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();
    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-full">
            <Button onClick={(e)=>{
               navigate("/send?id="+user._id+"&name="+user.firstName);
            }}
            label={"Send Money"} />
        </div>
    </div>
}
// Key differences:

// Frontend filtering:

// All data loaded at once
// Filtering happens in browser memory
// Quick but not scalable for large datasets


// Backend filtering:

// Only filtered data is sent
// Database handles the search
// More scalable
// Better for large datasets
// Network request on each search