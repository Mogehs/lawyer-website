import { Outlet } from "react-router-dom"
import Sidebar from "../../features/approvedlawyer/components/Sidebar"
import Topbar from "../../features/approvedlawyer/components/Topbar"


const ApprovedLawyerLayout = () => {
    return (
        <div className='flex h-screen bg-gray-100 gap-3'>
            <Sidebar />
            <div className='flex-1 flex flex-col'>
                <Topbar />
                <div className='flex-1 p-4 overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default ApprovedLawyerLayout
