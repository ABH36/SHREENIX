'use client';

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, LogOut, Settings, MessageSquare, TicketPercent,
  Search, Bell, ChevronDown, Phone, MapPin, Clock, Download
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

/* ================= TYPES ================= */
interface OrderType {
  _id: string;
  customerDetails: { 
    name: string; phone: string; city: string; address: string; pincode: string; state: string;
  };
  orderItems: { name: string; qty: number }[];
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

/* ================= COMPONENT ================= */
export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [filter, setFilter] = useState('');
  const [stats, setStats] = useState({ revenue: 0, orders: 0, pending: 0 });
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  /* ================= SECURITY ================= */
  useEffect(()=>{
    fetch('/api/admin/orders').then(r=>{
      if(r.status===401) router.replace('/admin/login');
    });
  },[]);

  /* ================= LOAD & POLL ================= */
  useEffect(()=>{
    fetchOrders();
    const i=setInterval(checkForNewOrders,15000);
    return ()=>clearInterval(i);
  },[]);

  /* ================= DATA ================= */
  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    if(data.success){
      setOrders(data.orders);
      setLastCount(data.orders.length);
      calculateStats(data.orders);
    }
  };

  const checkForNewOrders = async () => {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    if(data.success && data.orders.length>lastCount){
      setHasNewNotification(true);
      setOrders(data.orders);
      setLastCount(data.orders.length);
      calculateStats(data.orders);
    }
  };

  const calculateStats = (data:OrderType[])=>{
    const revenue=data.filter(o=>o.orderStatus!=='Cancelled').reduce((a,o)=>a+o.totalPrice,0);
    setStats({
      revenue,
      orders:data.length,
      pending:data.filter(o=>o.orderStatus==='Processing').length
    });
  };

  /* ================= ACTIONS ================= */
  const handleStatusChange = async (orderId:string,status:string)=>{
    setOrders(prev=>prev.map(o=>o._id===orderId?{...o,orderStatus:status}:o));
    await fetch('/api/admin/update-status',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,status})});
    fetchOrders();
  };

  const sendWhatsApp=(phone:string,name:string,status:string)=>{
    const map:any={
      Processing:`Namaste ${name}, apka order confirm ho gaya hai.`,
      Shipped:`Namaste ${name}, apka order ship ho gaya hai.`,
      Delivered:`Namaste ${name}, apka order deliver ho chuka hai.`,
      Cancelled:`Namaste ${name}, apka order cancel ho gaya hai.`
    };
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(map[status]||map.Processing)}`);
  };

  const handleExport=()=>{
    const headers=["Date","Name","Phone","City","Pincode","Amount","Status"];
    const rows=filteredOrders.map(o=>[
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerDetails.name}"`,
      o.customerDetails.phone,
      o.customerDetails.city,
      o.customerDetails.pincode,
      o.totalPrice,
      o.orderStatus
    ]);
    const csv=[headers.join(','),...rows.map(r=>r.join(','))].join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='orders.csv';
    a.click();
  };

  const handleLogout=()=>router.push('/admin/login');

  const SidebarItem=({icon:Icon,label,path}:any)=>{
    const active=pathname===path;
    return(
      <button onClick={()=>router.push(path)} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${active?'bg-emerald-50 text-emerald-700':'text-gray-500 hover:bg-gray-50'}`}>
        <Icon size={18}/> {label}
      </button>
    );
  };

  const filteredOrders=orders.filter(o=>o.customerDetails.name.toLowerCase().includes(filter.toLowerCase())||o.customerDetails.phone.includes(filter));

  return(
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center px-8 font-serif text-2xl font-bold text-emerald-900">Shreenix.</div>
          <nav className="p-4 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/admin/dashboard"/>
            <SidebarItem icon={ShoppingBag} label="Products" path="/admin/products"/>
            <SidebarItem icon={Users} label="Customers" path="/admin/customers"/>
            <SidebarItem icon={MessageSquare} label="Reviews" path="/admin/reviews"/>
            <SidebarItem icon={TicketPercent} label="Coupons" path="/admin/coupons"/>
            <SidebarItem icon={Settings} label="Settings" path="/admin/settings"/>
          </nav>
        </div>
        <button onClick={handleLogout} className="m-4 text-red-500 hover:bg-red-50 rounded-xl p-3 flex items-center gap-2">
          <LogOut size={18}/> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between">
          <h2 className="font-bold text-xl">Overview</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
              <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none"/>
            </div>
            <button onClick={()=>setHasNewNotification(false)} className="p-2 bg-gray-100 rounded-full relative">
              <Bell size={18}/>
              {hasNewNotification&&<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/>}
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-emerald-700 text-white p-6 rounded-xl">Revenue ₹{stats.revenue}</div>
            <div className="bg-white p-6 rounded-xl">Orders {stats.orders}</div>
            <div className="bg-white p-6 rounded-xl">Pending {stats.pending}</div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border">
            <div className="p-4 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Orders</h3>
              <button onClick={handleExport} className="text-emerald-700 font-bold flex items-center gap-2"><Download size={16}/>Export</button>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100"><tr><th className="p-3">Customer</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filteredOrders.map(o=>(
                  <tr key={o._id} className="border-t">
                    <td className="p-3">
                      <div className="font-bold">{o.customerDetails.name}</div>
                      <div className="text-xs text-gray-400">{o.customerDetails.phone}</div>
                    </td>
                    <td>
                      <select value={o.orderStatus} onChange={e=>handleStatusChange(o._id,e.target.value)}
                        className="bg-yellow-100 px-3 py-1 rounded-lg text-xs">
                        <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={()=>sendWhatsApp(o.customerDetails.phone,o.customerDetails.name,o.orderStatus)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg"><Phone size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
