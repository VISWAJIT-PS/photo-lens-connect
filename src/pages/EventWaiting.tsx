import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Clock } from "lucide-react";

const EventWaiting = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate processing time
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isComplete) {
      // Auto navigate after completion
      const timer = setTimeout(() => {
        navigate(`/event/${eventId}/results`);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isComplete, navigate, eventId]);

  const handleViewResults = () => {
    navigate(`/event/${eventId}/results`);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              {!isComplete ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing Your Photos
                </>
              ) : (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Processing Complete!
                </>
              )}
            </CardTitle>
            <CardDescription className="text-center">
              {!isComplete
                ? "We're analyzing your photos and searching for matches in the event collection..."
                : "Your photos have been processed successfully. You can now view your results."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isComplete ? (
              <>
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Analyzing photos...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Processing Steps */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      progress >= 20 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {progress >= 20 && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${progress >= 20 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Uploading photos to server
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      progress >= 40 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {progress >= 40 && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${progress >= 40 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Extracting facial features
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      progress >= 60 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {progress >= 60 && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${progress >= 60 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Searching event photo database
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      progress >= 80 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {progress >= 80 && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${progress >= 80 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Finding face matches
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      progress >= 100 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {progress >= 100 && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span className={`text-sm ${progress >= 100 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Preparing results
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    This usually takes 30-60 seconds...
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600">
                  <CheckCircle className="mx-auto h-12 w-12 mb-2" />
                  <p className="text-lg font-medium">Ready to view results!</p>
                </div>

                <Button onClick={handleViewResults} size="lg">
                  View My Photo Matches
                </Button>

                <p className="text-sm text-muted-foreground">
                  Redirecting automatically in a few seconds...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventWaiting;