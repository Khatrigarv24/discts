import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getAllProducts, getSoonToExpire } from '../services/inventoryService';
import {
    BarChart3, PackageCheck, PackageX, AlertTriangle,
    Calendar, IndianRupee, Layers, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
    const { isSignedIn } = useAuth();
    const [products, setProducts] = useState([]);
    const [expiringProducts, setExpiringProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metrics, setMetrics] = useState({
        totalItems: 0,
        totalValue: 0,
        lowStock: 0,
        expiringItems: 0,
    });

    // Fetch data for dashboard
    useEffect(() => {
        if (isSignedIn) {
            fetchDashboardData();
        }
    }, [isSignedIn]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch all products and soon to expire products in parallel
            const [allProducts, soonToExpireData] = await Promise.all([
                getAllProducts(),
                getSoonToExpire()
            ]);

            setProducts(allProducts);
            
            // Fix: The getSoonToExpire function returns the items directly, not nested in an items property
            setExpiringProducts(soonToExpireData || []);

            // Calculate metrics
            calculateMetrics(allProducts, soonToExpireData || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const calculateMetrics = (allProducts, expiringItems) => {
        // Calculate total value of inventory
        const totalValue = allProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);

        // Count items with low stock (less than 10 items)
        const lowStock = allProducts.filter(product => product.stock < 10).length;

        setMetrics({
            totalItems: allProducts.length,
            totalValue: totalValue,
            lowStock: lowStock,
            expiringItems: expiringItems.length
        });
    };

    // Group products by category for the chart
    const getTopProducts = () => {
        return products
            .sort((a, b) => (b.stock * b.price) - (a.stock * a.price))
            .slice(0, 5);
    };

    if (!isSignedIn) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-secondary/50 border border-secondary text-secondary-foreground p-4 rounded">
                    Please sign in to view your dashboard
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-foreground">Inventory Dashboard</h1>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchDashboardData} 
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {error && (
                <div className="bg-destructive/20 border border-destructive text-destructive p-4 mb-6 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array(4).fill().map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-lg p-6 shadow-sm animate-pulse">
                                <div className="flex items-start justify-between">
                                    <div className="w-full">
                                        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                                        <div className="h-8 bg-muted rounded w-1/2"></div>
                                    </div>
                                    <div className="bg-muted h-10 w-10 rounded-full"></div>
                                </div>
                                <div className="mt-4">
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {Array(2).fill().map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-lg p-6 shadow-sm animate-pulse">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="h-6 bg-muted rounded w-1/3"></div>
                                    <div className="h-5 bg-muted rounded-full w-5"></div>
                                </div>
                                <div className="space-y-4">
                                    {Array(5).fill().map((_, j) => (
                                        <div key={j} className="flex items-center">
                                            <div className="w-8 h-4 bg-muted rounded mr-2"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                                                <div className="h-3 bg-muted rounded w-1/4"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Products Card */}
                        <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Total Products</p>
                                    <h3 className="text-3xl font-bold text-foreground">{metrics.totalItems}</h3>
                                </div>
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Layers className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                                <span className="text-green-600">
                                    Total unique items in inventory
                                </span>
                            </div>
                        </div>

                        {/* Inventory Value Card */}
                        <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Total Value</p>
                                    <h3 className="text-3xl font-bold text-foreground">₹{metrics.totalValue.toFixed(2)}</h3>
                                </div>
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <IndianRupee className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                                <span className="text-blue-600">
                                    Value of current inventory
                                </span>
                            </div>
                        </div>

                        {/* Low Stock Card */}
                        <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Low Stock Items</p>
                                    <h3 className="text-3xl font-bold text-foreground">{metrics.lowStock}</h3>
                                </div>
                                <div className="bg-amber-100/50 p-2 rounded-full">
                                    <PackageX className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-amber-600">
                                <span>
                                    Products with less than 10 in stock
                                </span>
                            </div>
                        </div>

                        {/* Expiring Soon Card */}
                        <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Expiring Soon</p>
                                    <h3 className="text-3xl font-bold text-foreground">{metrics.expiringItems}</h3>
                                </div>
                                <div className="bg-red-100/50 p-2 rounded-full">
                                    <Calendar className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-red-600">
                                <span>
                                    Products expiring within 30 days
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Top Products by Value */}
                        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-foreground">Top Products by Value</h3>
                                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="space-y-4">
                                {getTopProducts().map((product, index) => (
                                    <div key={product.productId} className="flex items-center">
                                        <div className="w-8 text-muted-foreground font-mono">{index + 1}</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{product.name}</div>
                                            <div className="text-xs text-muted-foreground">₹{(product.price * product.stock).toFixed(2)}</div>
                                        </div>
                                        <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${Math.min((product.price * product.stock) / (getTopProducts()[0].price * getTopProducts()[0].stock) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expiring Soon Table */}
                        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-foreground">Expiring Soon</h3>
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>

                            {expiringProducts.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Batch</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expiry Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {expiringProducts.slice(0, 5).map((product) => (
                                                <tr key={product.productId} className="hover:bg-muted/30">
                                                    <td className="px-4 py-3 text-sm">{product.name}</td>
                                                    <td className="px-4 py-3 text-sm">{product.batchNumber}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="bg-amber-100/50 text-amber-400 px-2 py-0.5 rounded text-xs">
                                                            {new Date(product.expiryDate).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <PackageCheck className="h-12 w-12 mx-auto mb-2 text-green-500" />
                                    <p>No products expiring soon</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inventory Status Row */}
                    <div className="grid grid-cols-1 mb-8">
                        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 text-foreground">Inventory Status</h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {products.slice(0, 10).map((product) => (
                                            <tr key={product.productId} className="hover:bg-muted/30">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium">{product.name}</div>
                                                    <div className="text-xs text-muted-foreground">#{product.batchNumber}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div
                                                        className={`text-sm px-2 py-0.5 rounded inline-flex ${product.stock <= 5
                                                            ? "bg-destructive/10 text-destructive"
                                                            : product.stock <= 20
                                                                ? "bg-amber-100/30 text-amber-600"
                                                                : "bg-green-100/30 text-green-600"
                                                            }`}
                                                    >
                                                        {product.stock}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">₹{product.price.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm font-medium">₹{(product.price * product.stock).toFixed(2)}</td>
                                                <td className="px-4 py-3">
                                                    {expiringProducts.some(item => item.productId === product.productId) ? (
                                                        <span className="bg-amber-100/50 text-amber-400 px-2 py-0.5 rounded text-xs">
                                                            Expiring Soon
                                                        </span>
                                                    ) : product.stock <= 5 ? (
                                                        <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded text-xs">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="bg-green-100/30 text-green-600 px-2 py-0.5 rounded text-xs">
                                                            In Stock
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;