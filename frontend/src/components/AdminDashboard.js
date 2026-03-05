import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, totalValue: 0 });

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3002/api/admin/dashboard", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Admin Access Denied");
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="admin-view p-4">
      <h3 className="mb-4">Admin Insights</h3>
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm p-3 border-0 bg-primary text-white">
            <p className="mb-1">Total Users</p>
            <h4>{stats.users}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3 border-0 bg-dark text-white">
            <p className="mb-1">Platform Orders</p>
            <h4>{stats.orders}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3 border-0 bg-success text-white">
            <p className="mb-1">Overall Created Value</p>
            <h4>₹{stats.totalValue}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;