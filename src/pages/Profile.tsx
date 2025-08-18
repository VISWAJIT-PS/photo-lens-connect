import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Static profiles for both photographers and videographers
const profiles = {
  "7365f749-665d-409e-b765-c01bbf55463c": {
    id: "7365f749-665d-409e-b765-c01bbf55463c",
    name: "David Park",
    specialization: "Nature & Landscape",
    type: "Photographer",
    rating: 4.9,
    reviews: 93,
    price: "$600-$1,200",
    location: "Seattle, WA",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bio: "Passionate about capturing the beauty of nature and stunning landscapes.",
    portfolio_count: 67,
    experience_years: 7,
    gallery: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    ],
    events: [
      { name: "Yosemite National Park", date: "2025-07-10", cover: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
      { name: "Grand Canyon", date: "2025-06-15", cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
      { name: "Olympic National Park", date: "2025-05-20", cover: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
      { name: "Yellowstone", date: "2025-04-05", cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }
    ]
  },
  "v1": {
    id: "v1",
    name: "Alex Kim",
    specialization: "Videographer",
    type: "Videographer",
    rating: 4.9,
    reviews: 102,
    price: "$1,000-$2,500",
    location: "Chicago, IL",
    image_url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    bio: "Award-winning videographer specializing in weddings and events.",
    portfolio_count: 40,
    experience_years: 8,
    gallery: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    ],
    events: [
      { name: "Wedding - Smith Family", date: "2025-07-10", cover: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
      { name: "Corporate Event - TechX", date: "2025-06-15", cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
      { name: "Music Video - Rising Stars", date: "2025-05-20", cover: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
      { name: "Documentary - City Life", date: "2025-04-05", cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }
    ]
  },
  "v2": {
    id: "v2",
    name: "Priya Singh",
    specialization: "Videographer",
    type: "Videographer",
    rating: 4.8,
    reviews: 88,
    price: "$1,200-$3,000",
    location: "Austin, TX",
    image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    bio: "Creative storytelling through cinematic video production.",
    portfolio_count: 35,
    experience_years: 7,
    gallery: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    ],
    events: [
      { name: "Wedding - Patel Family", date: "2025-07-10", cover: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
      { name: "Startup Launch - InnovateX", date: "2025-06-15", cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
      { name: "Short Film - The Journey", date: "2025-05-20", cover: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
      { name: "Festival - Austin Arts", date: "2025-04-05", cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }
    ]
  },
  "v3": {
    id: "v3",
    name: "John Lee",
    specialization: "Videographer",
    type: "Videographer",
    rating: 4.7,
    reviews: 75,
    price: "$900-$2,000",
    location: "Denver, CO",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    bio: "Specializes in commercial and promotional video shoots.",
    portfolio_count: 28,
    experience_years: 6,
    gallery: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    ],
    events: [
      { name: "Promo - Denver Eats", date: "2025-07-10", cover: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
      { name: "Commercial - Mountain Gear", date: "2025-06-15", cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
      { name: "Interview - Local Heroes", date: "2025-05-20", cover: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" },
      { name: "Event - Denver Startup Week", date: "2025-04-05", cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }
    ]
  }
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = profiles[id || "7365f749-665d-409e-b765-c01bbf55463c"];

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-4 text-red-600">404 Oops! Page not found</h1>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center mb-8 bg-gradient-to-r from-blue-50 via-white to-pink-50 rounded-xl shadow-lg p-6">
        <img src={profile.image_url} alt={profile.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-md" />
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-2 text-blue-900">{profile.name}</h1>
          <p className="text-lg text-pink-700 mb-2 font-semibold">{profile.type} - {profile.specialization}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary">Location: {profile.location}</Badge>
            <Badge variant="secondary">Price: {profile.price}</Badge>
            <Badge variant="secondary">Rating: {profile.rating} ★ ({profile.reviews})</Badge>
            <Badge variant="secondary">Experience: {profile.experience_years} yrs</Badge>
            <Badge variant="secondary">Portfolio: {profile.portfolio_count} works</Badge>
          </div>
          <p className="text-muted-foreground text-base mt-2">{profile.bio}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {profile.gallery.map((img, i) => (
          <img key={i} src={img} alt="Gallery" className="rounded-xl w-full h-40 object-cover border-2 border-blue-100 shadow" />
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4 text-pink-800">Recent Events Covered</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.events.slice(0, 4).map((event, i) => (
          <Card key={i} className="overflow-hidden shadow-md border border-blue-100">
            <CardHeader className="p-0">
              <img src={event.cover} alt={event.name} className="w-full h-32 object-cover" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2 text-blue-900">{event.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{event.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Profile;
