import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Calendar, Star, Download, Filter } from 'lucide-react';

// Mock earnings data
const recentWork = [
  {
    id: 1,
    title: "Sunset Wedding Photography",
    client: "Emma & Mike Johnson",
    date: "2024-01-20",
    category: "Wedding",
    rating: 5,
    earnings: 1200,
    status: "completed",
    paymentStatus: "paid"
  },
  {
    id: 2,
    title: "Corporate Headshots",
    client: "Fashion Brand Co",
    date: "2024-01-18",
    category: "Portrait",
    rating: 4.8,
    earnings: 800,
    status: "completed",
    paymentStatus: "paid"
  },
  {
    id: 3,
    title: "Product Photography",
    client: "Tech Startup Inc",
    date: "2024-01-15",
    category: "Product",
    rating: 4.9,
    earnings: 650,
    status: "in_progress",
    paymentStatus: "pending"
  },
  {
    id: 4,
    title: "Birthday Party Coverage",
    client: "Sarah Williams",
    date: "2024-01-12",
    category: "Event",
    rating: 4.7,
    earnings: 400,
    status: "completed",
    paymentStatus: "paid"
  }
];

const monthlyStats = {
  totalEarnings: 3050,
  completedJobs: 12,
  averageRating: 4.8,
  totalHours: 48
};

export function PhotographerEarnings() {
  const [filterPeriod, setFilterPeriod] = useState("this_month");
  const [filterCategory, setFilterCategory] = useState("all");

  const getFilteredWork = () => {
    let filtered = recentWork;
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(work => work.category.toLowerCase() === filterCategory);
    }
    
    // Add date filtering logic here based on filterPeriod
    return filtered;
  };

  const renderWorkCard = (work: any) => (
    <Card key={work.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{work.title}</h3>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={work.status === "completed" ? "default" : "secondary"}
                >
                  {work.status.replace('_', ' ')}
                </Badge>
                <Badge 
                  variant={work.paymentStatus === "paid" ? "default" : "destructive"}
                >
                  {work.paymentStatus}
                </Badge>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-2">{work.client}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {work.date}
              </span>
              <Badge variant="outline">{work.category}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{work.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-xl">${work.earnings}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recent Work & Earnings</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${monthlyStats.totalEarnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                <p className="text-2xl font-bold">{monthlyStats.completedJobs}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{monthlyStats.averageRating}</p>
              </div>
              <Star className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{monthlyStats.totalHours}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="wedding">Wedding</SelectItem>
            <SelectItem value="portrait">Portrait</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Recent Work</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {getFilteredWork().length > 0 ? (
            getFilteredWork().map(renderWorkCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No work found</h3>
                <p className="text-muted-foreground">Completed work will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Wedding</span>
                    <span className="font-medium">$1,600</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Portrait</span>
                    <span className="font-medium">$800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Product</span>
                    <span className="font-medium">$650</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Event</span>
                    <span className="font-medium">$400</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>January</span>
                    <span className="font-medium">$3,050</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>December</span>
                    <span className="font-medium">$2,800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>November</span>
                    <span className="font-medium">$2,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}