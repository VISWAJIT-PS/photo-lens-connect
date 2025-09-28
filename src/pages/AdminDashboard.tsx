import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  Camera,
  TrendingUp,
  Download,
  Share2,
  Heart,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

// Import Supabase hooks
import { useEvents } from "@/hooks/useEvents";
import { useCompleteEventAnalytics } from "@/hooks/useAnalytics";
import { useEventUsers } from "@/hooks/useUsers";

const AdminDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  
  // Fetch data using Supabase hooks
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { analytics, demographics, trends, tags, isLoading: analyticsLoading } = useCompleteEventAnalytics(selectedEvent);
  const { data: eventUsers = [], isLoading: usersLoading } = useEventUsers(selectedEvent);

  // Calculate totals from Supabase data
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, event) => sum + event.registered_users, 0);
  const totalPhotos = events.reduce((sum, event) => sum + event.total_photos, 0);
  const activeEvents = events.filter(event => event.status === 'active').length;

  const StatCard = ({ title, value, description, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor event registrations, photo analytics, and user engagement
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={totalEvents}
            description="Events created"
            icon={Calendar}
            trend="+12% from last month"
          />
          <StatCard
            title="Total Registrations"
            value={totalRegistrations}
            description="Users registered"
            icon={Users}
            trend="+8% from last month"
          />
          <StatCard
            title="Total Photos"
            value={totalPhotos}
            description="Photos uploaded"
            icon={Camera}
            trend="+15% from last month"
          />
          <StatCard
            title="Active Events"
            value={activeEvents}
            description="Currently active"
            icon={Activity}
            trend={`${activeEvents} running now`}
          />
        </div>

        {/* Event Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Analytics</CardTitle>
            <CardDescription>
              Select an event to view detailed analytics and user data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div>Loading events...</div>
            ) : (
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-full md:w-96">
                  <SelectValue placeholder="Select an event to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} - {event.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {selectedEvent && analytics && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {analyticsLoading ? (
                <div>Loading analytics...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="Event Registrations"
                      value={analytics?.total_registrations || 0}
                      description="Users registered for this event"
                      icon={Users}
                    />
                    <StatCard
                      title="Photos Uploaded"
                      value={analytics?.total_photos_uploaded || 0}
                      description="Photos uploaded by users"
                      icon={Camera}
                    />
                    <StatCard
                      title="Matches Found"
                      value={analytics?.total_matches_found || 0}
                      description="Face matches identified"
                      icon={BarChart3}
                    />
                    <StatCard
                      title="Avg Match Confidence"
                      value={`${analytics?.average_match_confidence || 0}%`}
                      description="Average confidence score"
                      icon={TrendingUp}
                    />
                  </div>

                  {/* Demographics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Age Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {demographics?.map((demo) => (
                            <div key={demo.age_group} className="flex items-center justify-between">
                              <span className="text-sm">{demo.age_group} years</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{
                                      width: `${(demo.count / (analytics?.total_registrations || 1)) * 100}%`
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8">{demo.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Popular Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {tags?.slice(0, 5).map((tag) => (
                            <div key={tag.tag} className="flex items-center justify-between">
                              <span className="text-sm">{tag.tag}</span>
                              <Badge variant="secondary" className="px-2 py-1">
                                {tag.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>
                    {eventUsers.length} users registered for this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersLoading ? (
                      <div>Loading users...</div>
                    ) : (
                      eventUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.whatsapp_number} • {user.phone_number}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Registered: {new Date(user.registration_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant={user.status === 'completed' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                            <p className="text-sm">
                              {user.photos_uploaded} photos • {user.matches_found} matches
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last active: {new Date(user.last_activity).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              {analyticsLoading ? (
                <div>Loading engagement data...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Photos Downloaded"
                    value={analytics?.photos_downloaded || 0}
                    description="Photos downloaded by users"
                    icon={Download}
                  />
                  <StatCard
                    title="Photos Shared"
                    value={analytics?.photos_shared || 0}
                    description="Photos shared on social media"
                    icon={Share2}
                  />
                  <StatCard
                    title="Favorites Marked"
                    value={analytics?.favorites_marked || 0}
                    description="Photos marked as favorite"
                    icon={Heart}
                  />
                  <StatCard
                    title="Avg Session Time"
                    value={analytics?.average_session_time || 'N/A'}
                    description="Average time spent per user"
                    icon={Activity}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registration Trends</CardTitle>
                  <CardDescription>
                    Daily registration count over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trends?.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{new Date(trend.date).toLocaleDateString()}</span>
                          {new Date(trend.date).toLocaleDateString()}
                        <span className="text-sm">{new Date(trend.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(trend.count / Math.max(...(trends?.map(t => t.count) || [1]))) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{trend.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!selectedEvent && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an Event</h3>
                <p className="text-muted-foreground">
                  Choose an event from the dropdown above to view detailed analytics
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;