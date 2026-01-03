import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Eye,
  CircleFadingPlus,
  Trash2
} from 'lucide-react';
import { /* allProducts, */ Order, updatedProduct } from '../data/products';
import Navbar from './Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getMethod, postMethod } from '../api/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'add-product', name: 'Add Product', icon: CircleFadingPlus },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    // { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white">
      <div className="flex">
        <Navbar 
          currentPage={activeTab}
          onNavigate={(page) => setActiveTab(page)}
        />
        <aside className="w-56 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-charcoal/5 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all text-xs font-normal tracking-wider uppercase ${
                    activeTab === tab.id
                      ? 'bg-gold text-white'
                      : 'hover:bg-pearl/30 text-charcoal'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="ml-56 flex-1 p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'products' && <ProductsView onAddProduct={() => setActiveTab('add-product')} />}
          {activeTab === 'orders' && <OrdersView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'add-product' && <AddProduct onAdded={() => setActiveTab('products')}/>}
        </main>
      </div>
    </div>
  );
}

function DashboardView() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMethod({ url: "/admin/stats" });
        if (data?.success && data?.stats) {
          setStats({
            totalRevenue: data.stats.revenue || 0,
            totalOrders: data.stats.orders || 0,
            totalProducts: data.stats.products || 0,
            activeUsers: data.stats.users || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5%'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: '+8.3%'
    },
    {
      label: 'Products',
      value: stats.totalProducts,
      icon: Package,
      change: '+3 new'
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      change: '+23.1%'
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Dashboard</h1>
          <p className="text-xs text-charcoal/50 uppercase tracking-widest">Admin Panel Overview</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-charcoal/60">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Dashboard</h1>
        <p className="text-xs text-charcoal/50 uppercase tracking-widest">Admin Panel Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-charcoal/5 p-5 animate-fade-in-up hover:border-gold/20 transition-all"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-5 h-5 text-gold" />
                <span className="text-[10px] text-green-600 font-medium">{stat.change}</span>
              </div>
              <p className="text-[10px] text-charcoal/50 mb-1 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-light text-charcoal">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-lg font-serif font-light text-charcoal mb-6 tracking-wide">Weekly Sales</h2>
          <div className="h-64 flex items-end justify-between gap-3">
            {[4200, 5800, 4900, 7200, 6300, 8500, 7800].map((value, index) => {
              const maxValue = 8500;
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[10px] text-charcoal/60 font-light mb-1">
                    ${(value / 1000).toFixed(1)}k
                  </div>
                  <div
                    className="w-full bg-gold/80 transition-all hover:bg-gold"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-charcoal/40">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-lg font-serif font-light text-charcoal mb-6 tracking-wide">Category Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-charcoal/70">Luxury Healing</span>
                <span className="text-charcoal font-light">6 items (19%)</span>
              </div>
              <div className="h-2 bg-pearl/30 overflow-hidden">
                <div className="h-full bg-gold" style={{ width: '19%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-charcoal/70">Fashion Bracelets</span>
                <span className="text-charcoal font-light">25 items (81%)</span>
              </div>
              <div className="h-2 bg-pearl/30 overflow-hidden">
                <div className="h-full bg-champagne" style={{ width: '81%' }} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-charcoal/5">
            <h3 className="text-xs text-charcoal/50 uppercase tracking-wider mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                'New order #3428 received',
                'Crystal Tennis Bracelet restocked',
                '12 new users registered',
                'Rose Quartz bracelet review added'
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-xs text-charcoal/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {activity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsView({ onAddProduct }: { onAddProduct: () => void }) {
    const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this product?")) return;
      console.log(id);
      try {
        await postMethod({ url: "/product/remove", body: { id } });
        // remove deleted product from UI
        setAllProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Product deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete product");
      }
    };

    const [allProducts, setAllProducts] = useState<updatedProduct[]>([]);
    
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const data = await getMethod({ url: "/product/list" });
          setAllProducts(data?.product);  
  
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      };
  
      fetchProducts();
    }, []);

    console.log(allProducts);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Products</h1>
          <p className="text-xs text-charcoal/50">{allProducts.length} items in catalog</p>
        </div>
        {/* Add Product Button */}
        <button
          className="px-4 py-2 rounded-lg text-sm font-light bg-gold text-white hover:bg-gold/90 transition-colors tracking-wide"
          onClick={onAddProduct}
        >
          + Add Product
        </button>
      </div>
      {/* <div>
        <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Products</h1>
        <p className="text-xs text-charcoal/50">{allProducts.length} items in catalog</p>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {allProducts.length == 0 && <div>No product present at a moment!</div>}
        {[...allProducts].reverse().map((product) => (
          <div
            key={product?._id}
            className="relative bg-white border border-charcoal/5 p-4 hover:border-gold/20 transition-all"
          >
            {/* Delete Button - Top Right */}
            <button
              onClick={() => handleDelete(product?._id)}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center 
                        rounded-full border border-gold text-gold hover:bg-gold 
                   hover:text-white transition"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex gap-4">
        <img
          src={product.image[0]}
          alt={product.name}
          className="w-24 h-24 object-cover border border-charcoal/5"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-light text-charcoal mb-1 truncate">
            {product.name}
          </h3>

          <p className="text-xs text-charcoal/60 mb-2">
            {product.category}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-light text-gold">
              ${product.price}
            </span>

            <span className="text-[10px] text-charcoal/50 uppercase tracking-wider bg-green-50 px-2 py-0.5">
              Stock: {product.stock_count}
            </span>
          </div>

          {product.stone_type && (
            <p className="text-[10px] text-charcoal/40 mt-2">
              {product.stone_type}
            </p>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

      
    </div>
  );
}

function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([
    // { id: '#3428', customer: 'Sarah Johnson', items: 2, total: 2870, status: 'Processing', date: '2025-11-13' },
    // { id: '#3427', customer: 'Michael Chen', items: 1, total: 89, status: 'Shipped', date: '2025-11-13' },
    // { id: '#3426', customer: 'Emma Williams', items: 3, total: 267, status: 'Delivered', date: '2025-11-12' },
    // { id: '#3425', customer: 'James Brown', items: 1, total: 2450, status: 'Processing', date: '2025-11-12' },
    // { id: '#3424', customer: 'Olivia Davis', items: 2, total: 178, status: 'Shipped', date: '2025-11-11' },
    // { id: '#3423', customer: 'William Miller', items: 1, total: 95, status: 'Delivered', date: '2025-11-11' },
    // { id: '#3422', customer: 'Sophia Garcia', items: 4, total: 352, status: 'Delivered', date: '2025-11-10' },
    // { id: '#3421', customer: 'Benjamin Wilson', items: 1, total: 2650, status: 'Processing', date: '2025-11-10' },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await postMethod({ url: "/order/list",body:"" });
        setOrders(data?.orders);  

      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

 


    const getStatusColor = (status: Order["status"]) => {
      switch (status) {
        case 'Order Placed': return 'bg-gray-100 text-gray-700';
        case 'Processing':    return 'bg-yellow-50 text-yellow-700';
        case 'Shipped':       return 'bg-blue-50 text-blue-700';
        case 'Delivered':     return 'bg-green-50 text-green-700';
        default:              return 'bg-gray-50 text-gray-700';
      }
    };


  const handleStatusChange = (id: string, newStatus: Order["status"]) => {
    const updated = orders.map(order =>
      order._id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updated);

    // OPTIONAL: Hit API to update in backend
    // await axios.put(`/orders/${id}`, { status: newStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Orders</h1>
        <p className="text-xs text-charcoal/50">{orders.length} recent orders</p>
      </div>

      <div className="bg-white border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pearl/20 border-b border-charcoal/5">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {[...orders].map((order) => (
                <tr key={order?._id} className="hover:bg-pearl/10 transition-colors">
                  <td className="px-4 py-3 text-xs font-light text-charcoal">{order._id}</td>
                  <td className="px-4 py-3 text-xs text-charcoal/80">{order?.firstName + " "+ order?.lastName}</td>
                  <td className="px-4 py-3 text-xs text-charcoal/60"> {order.items?.reduce((sum, item) => sum + item.quantity, 0)}</td>
                  <td className="px-4 py-3 text-xs font-light text-gold">${order?.total || 0}</td>
                  <td className="px-4 py-3">
                    {/* ⭐ REPLACED STATIC STATUS WITH SELECT */}
                  <td className="px-4 py-3">
                    <select
                     value={order.status}
                     onChange={(e) =>
                        handleStatusChange(order._id, e.target.value as Order["status"])
                      }
                      className={`px-2 py-1 text-[10px] uppercase border rounded ${getStatusColor(order.status)} focus:outline-none`}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  </td>
                  <td className="px-4 py-3 text-xs text-charcoal/50">{new Date(order?.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const metrics = [
    { label: 'Conversion Rate', value: '3.24%', trend: '+0.5%', icon: TrendingUp },
    { label: 'Average Order Value', value: '$430', trend: '+12%', icon: DollarSign },
    { label: 'Page Views', value: '24,532', trend: '+18%', icon: Eye },
    { label: 'Cart Abandonment', value: '68.5%', trend: '-3.2%', icon: ShoppingCart },
  ];

  const topProducts = [
    { name: 'Celestial Amethyst Healing Bracelet', sales: 45, revenue: 129150 },
    { name: 'Crystal Tennis Bracelet', sales: 128, revenue: 11392 },
    { name: 'Rose Quartz Divine Love Bracelet', sales: 38, revenue: 93100 },
    { name: 'Pearl Strand Bracelet', sales: 96, revenue: 9120 },
    { name: 'Jade Prosperity Bracelet', sales: 31, revenue: 82150 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Analytics</h1>
        <p className="text-xs text-charcoal/50 uppercase tracking-widest">Performance Metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white border border-charcoal/5 p-5"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-5 h-5 text-gold" />
                <span className="text-[10px] text-green-600 font-medium">{metric.trend}</span>
              </div>
              <p className="text-[10px] text-charcoal/50 mb-1 uppercase tracking-wider">{metric.label}</p>
              <p className="text-2xl font-light text-charcoal">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-charcoal/5 p-6">
        <h2 className="text-lg font-serif font-light text-charcoal mb-6 tracking-wide">Top Selling Products</h2>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-charcoal/5 last:border-0">
              <div className="flex-1">
                <p className="text-xs text-charcoal/80 mb-1">{product.name}</p>
                <p className="text-[10px] text-charcoal/50">{product.sales} units sold</p>
              </div>
              <p className="text-sm font-light text-gold">${product.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-lg font-serif font-light text-charcoal mb-6 tracking-wide">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: 'Organic Search', percentage: 42, visitors: 10305 },
              { source: 'Direct', percentage: 28, visitors: 6869 },
              { source: 'Social Media', percentage: 18, visitors: 4416 },
              { source: 'Email', percentage: 12, visitors: 2944 },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-charcoal/70">{item.source}</span>
                  <span className="text-charcoal font-light">{item.percentage}% ({item.visitors.toLocaleString()})</span>
                </div>
                <div className="h-2 bg-pearl/30 overflow-hidden">
                  <div className="h-full bg-gold" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-lg font-serif font-light text-charcoal mb-6 tracking-wide">Customer Insights</h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-3">New vs Returning</p>
              <div className="flex gap-4">
                <div className="flex-1 bg-pearl/20 p-4 text-center">
                  <p className="text-2xl font-light text-charcoal mb-1">37%</p>
                  <p className="text-[10px] text-charcoal/60 uppercase tracking-wider">New</p>
                </div>
                <div className="flex-1 bg-gold/10 p-4 text-center">
                  <p className="text-2xl font-light text-charcoal mb-1">63%</p>
                  <p className="text-[10px] text-charcoal/60 uppercase tracking-wider">Returning</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-3">Average Session Duration</p>
              <p className="text-3xl font-light text-charcoal">4m 32s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserWithStats {
  _id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  status: 'VIP' | 'Regular' | 'New';
  profileImage?: string;
}

function UsersView() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    vipUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getMethod({ url: "/admin/users" });
        if (data?.success) {
          setUsers(data.users || []);
          setStats({
            totalUsers: data.stats?.totalUsers || 0,
            activeUsers: data.stats?.activeUsers || 0,
            vipUsers: data.stats?.vipUsers || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP': return 'bg-gold/20 text-gold';
      case 'Regular': return 'bg-blue-50 text-blue-700';
      case 'New': return 'bg-green-50 text-green-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const vipPercentage = stats.totalUsers > 0 
    ? ((stats.vipUsers / stats.totalUsers) * 100).toFixed(1)
    : '0';

  const activePercentage = stats.totalUsers > 0
    ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Users</h1>
          <p className="text-xs text-charcoal/50">Loading users...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-charcoal/60">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Users</h1>
        <p className="text-xs text-charcoal/50">{stats.totalUsers.toLocaleString()} registered users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-charcoal/5 p-5">
          <p className="text-[10px] text-charcoal/50 mb-2 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-light text-charcoal">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-[10px] text-green-600 mt-1">Registered users</p>
        </div>
        <div className="bg-white border border-charcoal/5 p-5">
          <p className="text-[10px] text-charcoal/50 mb-2 uppercase tracking-wider">VIP Members</p>
          <p className="text-2xl font-light text-charcoal">{stats.vipUsers.toLocaleString()}</p>
          <p className="text-[10px] text-gold mt-1">{vipPercentage}% of users</p>
        </div>
        <div className="bg-white border border-charcoal/5 p-5">
          <p className="text-[10px] text-charcoal/50 mb-2 uppercase tracking-wider">Active Users</p>
          <p className="text-2xl font-light text-charcoal">{stats.activeUsers.toLocaleString()}</p>
          <p className="text-[10px] text-charcoal/60 mt-1">{activePercentage}% activity rate</p>
        </div>
      </div>

      <div className="bg-white border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pearl/20 border-b border-charcoal/5">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Orders</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Total Spent</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-normal text-charcoal/60 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-charcoal/50">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-pearl/10 transition-colors">
                    <td className="px-4 py-3 text-xs font-light text-charcoal">{user.name}</td>
                    <td className="px-4 py-3 text-xs text-charcoal/60">{user.email}</td>
                    <td className="px-4 py-3 text-xs text-charcoal/60">{user.orders}</td>
                    <td className="px-4 py-3 text-xs font-light text-gold">${user.spent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-normal uppercase tracking-wider ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal/50">{user.joined}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-serif font-light text-charcoal mb-1 tracking-wide">Settings</h1>
        <p className="text-xs text-charcoal/50 uppercase tracking-widest">Store Configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-sm font-light text-charcoal mb-4 tracking-wide">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-charcoal/60 uppercase tracking-wider mb-2">Store Name</label>
              <input
                type="text"
                defaultValue="Crystal Casting Jewelers"
                className="w-full px-3 py-2 border border-charcoal/10 text-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-charcoal/60 uppercase tracking-wider mb-2">Store Email</label>
              <input
                type="email"
                defaultValue="info@ccjewelers.com"
                className="w-full px-3 py-2 border border-charcoal/10 text-xs focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-charcoal/60 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-charcoal/10 text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-sm font-light text-charcoal mb-4 tracking-wide">Business Hours</h2>
          <div className="space-y-3">
            {[
              { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
              { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
              { day: 'Sunday', hours: '12:00 PM - 5:00 PM' },
            ].map((schedule, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-charcoal/5 last:border-0">
                <span className="text-xs text-charcoal/70">{schedule.day}</span>
                <span className="text-xs text-charcoal font-light">{schedule.hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-sm font-light text-charcoal mb-4 tracking-wide">Shipping Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-charcoal/5">
              <span className="text-xs text-charcoal/70">Free Shipping Threshold</span>
              <span className="text-xs text-charcoal font-light">$100</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-charcoal/5">
              <span className="text-xs text-charcoal/70">Standard Shipping</span>
              <span className="text-xs text-charcoal font-light">$9.99</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-charcoal/5">
              <span className="text-xs text-charcoal/70">Express Shipping</span>
              <span className="text-xs text-charcoal font-light">$24.99</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-charcoal/70">International Shipping</span>
              <span className="text-xs text-charcoal font-light">Calculated</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-charcoal/5 p-6">
          <h2 className="text-sm font-light text-charcoal mb-4 tracking-wide">Categories</h2>
          <div className="space-y-3">
            {[
              { name: 'Luxury Healing', count: 6, active: true },
              { name: 'Fashion', count: 25, active: true },
              { name: 'Necklaces', count: 0, active: false },
              { name: 'Earrings', count: 0, active: false },
            ].map((category, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-charcoal/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${category.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs text-charcoal/70">{category.name}</span>
                </div>
                <span className="text-xs text-charcoal/50">{category.count} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-charcoal/5 p-6">
        <h2 className="text-sm font-light text-charcoal mb-4 tracking-wide">SEO Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-charcoal/60 uppercase tracking-wider mb-2">Meta Title</label>
            <input
              type="text"
              defaultValue="Crystal Casting Jewelers - Premium Healing & Fashion Bracelets"
              className="w-full px-3 py-2 border border-charcoal/10 text-xs focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-[10px] text-charcoal/60 uppercase tracking-wider mb-2">Meta Description</label>
            <textarea
              rows={3}
              defaultValue="Discover our exquisite collection of luxury healing crystal bracelets and affordable AAA quality fashion bracelets. Hand-selected gemstones, premium materials, and timeless designs."
              className="w-full px-3 py-2 border border-charcoal/10 text-xs focus:outline-none focus:border-gold resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-charcoal/60 uppercase tracking-wider mb-2">Keywords</label>
            <input
              type="text"
              defaultValue="healing bracelets, crystal jewelry, fashion bracelets, gemstone bracelets, luxury jewelry"
              className="w-full px-3 py-2 border border-charcoal/10 text-xs focus:outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AddProduct({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    description: "",
    price: "",
    sizes: "",
    bestseller: "false",
    image1: null as File | null,
    image2: null as File | null,
    image3: null as File | null,
    image4: null as File | null,
  });
  
  const [loading, setLoading] = useState(false);

  const categories = [
    "Luxury Healing",
    "Fashion",
    "Rings", 
    "Necklaces", 
    "Bracelets", 
    "Earrings", 
    "Bangles", 
    "Anklets"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageNumber: number) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, [`image${imageNumber}`]: file } as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name || !form.description || !form.price || !form.category) {
      toast.error("Please fill all required fields (Name, Description, Price, Category)");
      return;
    }

    // Validate at least one image
    if (!form.image1) {
      toast.error("Please upload at least one product image");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      
      // Required fields
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("description", form.description);
      fd.append("price", form.price);
      
      // Optional fields
      if (form.subCategory) {
        fd.append("subCategory", form.subCategory);
      }
      if (form.sizes) {
        fd.append("sizes", form.sizes); // Comma-separated string
      }
      fd.append("bestseller", form.bestseller);

      // Images (backend expects image1, image2, image3, image4)
      if (form.image1) {
        fd.append("image1", form.image1);
      }
      if (form.image2) {
        fd.append("image2", form.image2);
      }
      if (form.image3) {
        fd.append("image3", form.image3);
      }
      if (form.image4) {
        fd.append("image4", form.image4);
      }

      // Use the same URL pattern as api.tsx
      const URL = "https://ccjewllery-backend.onrender.com/api" ;

      const res = await axios.post(
        `${URL}/product/add`,
        fd,
        {
          headers: { 
            "Content-Type": "multipart/form-data"
          },
        }
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "Product added successfully!");
        onAdded();
        
        // Reset form
        setForm({
          name: "",
          category: "",
          subCategory: "",
          description: "",
          price: "",
          sizes: "",
          bestseller: "false",
          image1: null,
          image2: null,
          image3: null,
          image4: null,
        });
      } else {
        throw new Error(res.data?.message || "Failed to add product");
      }

    } catch (error: any) {
      console.error("Add product error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-serif text-charcoal tracking-wide">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border border-charcoal/10 shadow-sm">

        {/* Name - Required */}
        <div>
          <label className="text-sm font-medium">Product Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border border-charcoal/20 rounded-md focus:outline-none focus:border-gold focus:ring-0"
            placeholder="e.g., Celestial Amethyst Healing Bracelet"
          />
        </div>

        {/* Category - Required */}
        <div>
          <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Sub Category - Optional */}
        <div>
          <label className="text-sm font-medium">Sub Category (Optional)</label>
          <input
            type="text"
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-charcoal/20 rounded-md focus:outline-none focus:border-gold focus:ring-0"
            placeholder="e.g., Healing Crystals, Fashion Accessories"
          />
        </div>

        {/* Description - Required */}
        <div>
          <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0"
            rows={4}
            placeholder="Describe the product features, materials, and benefits..."
          ></textarea>
        </div>

        {/* Price - Required */}
        <div>
          <label className="text-sm font-medium">Price ($) <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="price"
            value={form.price}
            min="0"
            step="0.01"
            required
            onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.00"
          />
        </div>

        {/* Sizes - Optional */}
        <div>
          <label className="text-sm font-medium">Sizes (Optional)</label>
          <input
            type="text"
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-charcoal/20 rounded-md focus:outline-none focus:border-gold focus:ring-0"
            placeholder="Comma-separated: Small, Medium, Large"
          />
          <p className="text-xs text-charcoal/50 mt-1">Separate multiple sizes with commas</p>
        </div>

        {/* Bestseller */}
        <div>
          <label className="text-sm font-medium">Bestseller</label>
          <select
            name="bestseller"
            value={form.bestseller}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {/* Image Uploads */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Product Image 1 <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 1)}
              required
              className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0"
            />
            {form.image1 && (
              <p className="text-xs text-green-600 mt-1">✓ {form.image1.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Product Image 2 (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 2)}
              className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0"
            />
            {form.image2 && (
              <p className="text-xs text-green-600 mt-1">✓ {form.image2.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Product Image 3 (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 3)}
              className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0"
            />
            {form.image3 && (
              <p className="text-xs text-green-600 mt-1">✓ {form.image3.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Product Image 4 (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 4)}
              className="w-full mt-1 p-2 border rounded-md border-charcoal/20 focus:outline-none focus:border-gold focus:ring-0"
            />
            {form.image4 && (
              <p className="text-xs text-green-600 mt-1">✓ {form.image4.name}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white py-2 rounded-md text-sm tracking-wider hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>

      </form>
    </div>
  );
}