import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "error";
  metrics?: Array<{
    label: string;
    value: string;
  }>;
}

interface TimelineSectionProps {
  content: {
    events: TimelineEvent[];
  };
}

export default function TimelineSection({ content }: TimelineSectionProps) {
  const { events } = content;

  const getEventIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "warning":
        return "defcon-status-degraded";
      case "success":
        return "defcon-status-online";
      case "error":
        return "defcon-status-offline";
      default:
        return "bg-blue-500/10 border-blue-500 text-blue-500";
    }
  };

  return (
    <div className="border-t border-border bg-background">
      <div className="mx-auto px-4 py-8">
        <div className="">
          {events.map((event) =>
          <div
            key={event.id}
            className={`p-4 rounded-lg border defcon-theme-transition ${getEventColor(event.type)}`}>
            
              <div className="flex items-start">
                <div className="">{getEventIcon(event.type)}</div>
                <div className="">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.timestamp}
                    </Badge>
                  </div>
                  <p className="text-sm">{event.description}</p>
                  {event.metrics &&
                <div className="grid grid-cols-2">
                      {event.metrics.map((metric, index) =>
                  <div
                    key={index}
                    className="p-2 border border-border">
                    
                          <div className="text-xs text-muted-foreground">
                            {metric.label}
                          </div>
                          <div className="text-sm text-foreground">{metric.value}</div>
                        </div>
                  )}
                    </div>
                }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

export const timelineSectionTemplate = {
  id: "defconTimelineSection",
  name: "Server Event Timeline",
  description: "A timeline of server events and incidents",
  component: TimelineSection,
  defaultContent: {
    events: [
    {
      id: "event1",
      timestamp: "2024-03-20 10:45:00",
      title: "High CPU Usage Alert",
      description: "CPU usage exceeded 90% threshold on production server",
      type: "warning",
      metrics: [
      {
        label: "CPU Usage",
        value: "92%"
      },
      {
        label: "Process Count",
        value: "234"
      },
      {
        label: "Load Average",
        value: "4.52"
      },
      {
        label: "Duration",
        value: "5m 30s"
      }]

    },
    {
      id: "event2",
      timestamp: "2024-03-20 10:30:00",
      title: "Backup Completed",
      description: "Daily backup completed successfully",
      type: "success",
      metrics: [
      {
        label: "Size",
        value: "42.5 GB"
      },
      {
        label: "Duration",
        value: "12m 15s"
      },
      {
        label: "Files",
        value: "12,453"
      },
      {
        label: "Speed",
        value: "58 MB/s"
      }]

    },
    {
      id: "event3",
      timestamp: "2024-03-20 10:15:00",
      title: "Service Restart",
      description: "Nginx service restarted due to configuration update",
      type: "info",
      metrics: [
      {
        label: "Downtime",
        value: "3s"
      },
      {
        label: "Connections",
        value: "1,234"
      },
      {
        label: "Workers",
        value: "8"
      },
      {
        label: "Cache Hit",
        value: "94.5%"
      }]

    }]

  }
};