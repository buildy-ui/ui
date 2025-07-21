import React from "react";
import { Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
  color: "red" | "yellow" | "green" | "purple" | "emerald";
  details: Array<{
    type: "quote" | "stat" | "image";
    content: string;
    source?: string;
  }>;
}

interface HistorySectionProps {
  content: {
    title: string;
    subtitle: string;
    returnButtonText: string;
    timeline: {
      periods: Array<{
        year: string;
        color: string;
      }>;
      events: TimelineEvent[];
    };
  };
}

export default function HistorySection({ content }: HistorySectionProps) {
  const { title, subtitle, returnButtonText, timeline } = content;

  const getColorClasses = (color: string) => {
    const baseClasses = {
      red: "bg-red-500/20 border-red-500 text-red-500",
      yellow: "bg-yellow-500/20 border-yellow-500 text-yellow-500",
      green: "bg-green-500/20 border-green-500 text-green-500",
      purple: "bg-purple-500/20 border-purple-500 text-purple-500",
      emerald: "bg-emerald-500/20 border-emerald-500 text-emerald-500"
    };
    return baseClasses[color as keyof typeof baseClasses] || baseClasses.red;
  };

  return (
    <div className="border-t border-border bg-background">
      <div className="mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Archive className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              {title}
            </h2>
          </div>
          <div className="bg-primary mx-auto"></div>
          <p className="text-muted-foreground text-base mx-auto leading-relaxed px-4">
            {subtitle}
          </p>
          <button className="text-primary text-sm flex items-center gap-1 mx-auto">
            ↑ {returnButtonText}
          </button>
        </div>

        <div className="">
          <div className="">
            <div className="flex flex-col sm:flex-row text-xs text-muted-foreground">
              {timeline.periods.map((period, index) =>
              <React.Fragment key={period.year}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${getColorClasses(period.color)} rounded-full flex-shrink-0 defcon-theme-transition`}></div>
                    <span className="">{period.year}</span>
                  </div>
                  {index < timeline.periods.length - 1 &&
                <div className="hidden w-8 bg-border"></div>
                }
                </React.Fragment>
              )}
            </div>
          </div>

          {timeline.events.map((event) =>
          <div key={event.id} className="border border-border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${getColorClasses(event.color)} rounded-full p-3 sm:p-4 flex-shrink-0 self-start sm:mt-1 defcon-theme-transition`}>
                  <span className="font-bold text-sm">{event.date}</span>
                </div>
                <div className="">
                  <div className="">
                    <div>
                      <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${getColorClasses(event.color)} mb-3 sm:mb-4 leading-tight`}>
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    <div className="">
                      {event.details.map((detail, index) => {
                      if (detail.type === "quote") {
                        return (
                          <div key={index} className={`bg-secondary/20 border-l-4 ${getColorClasses(event.color)} pl-4 sm:pl-6 py-3 sm:py-4 rounded-r-lg defcon-theme-transition`}>
                              <p className="text-sm leading-relaxed text-card-foreground">
                                {detail.content}
                              </p>
                              {detail.source &&
                            <div className="text-xs text-muted-foreground">
                                  {detail.source}
                                </div>
                            }
                            </div>);

                      }
                      if (detail.type === "stat") {
                        return (
                          <div key={index} className="border border-border rounded-lg p-3">
                              <Badge variant="outline" className={`${getColorClasses(event.color)} defcon-theme-transition`}>
                                {detail.content}
                              </Badge>
                            </div>);

                      }
                      return null;
                    })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

export const historySectionTemplate = {
  id: "defconHistorySection",
  name: "Server History Timeline",
  description: "A timeline section showing server monitoring history",
  component: HistorySection,
  defaultContent: {
    title: "SERVER MONITORING HISTORY",
    subtitle: "A comprehensive timeline of server performance, incidents, and system evolution.",
    returnButtonText: "RETURN TO LIVE MONITORING",
    timeline: {
      periods: [
      { year: "2023", color: "red" },
      { year: "2024-Q1", color: "yellow" },
      { year: "2024-Q2", color: "green" },
      { year: "2024-Q3", color: "purple" },
      { year: "2024-Q4", color: "emerald" }],

      events: [
      {
        id: "event1",
        date: "MAR '24",
        title: "System Architecture Upgrade",
        description: "Major infrastructure upgrade improving system reliability and performance.",
        icon: "🔧",
        color: "green",
        details: [
        {
          type: "quote",
          content: "99.99% uptime achieved after the migration to containerized infrastructure",
          source: "System Metrics Report"
        },
        {
          type: "stat",
          content: "Response time reduced by 45%"
        }]

      },
      {
        id: "event2",
        date: "FEB '24",
        title: "Security Protocol Enhancement",
        description: "Implementation of advanced security measures and monitoring systems.",
        icon: "🔒",
        color: "purple",
        details: [
        {
          type: "quote",
          content: "Zero security incidents reported since implementation",
          source: "Security Audit Log"
        }]

      }]

    }
  }
};