import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Instagram,
  Tag,
  Calendar,
  Plus,
  ExternalLink,
} from "lucide-react";

export default function MarketingTools() {
  // Mock campaigns data
  const campaigns = [
    {
      id: "CAM001",
      name: "Summer Collection Launch",
      type: "email",
      status: "active",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      performance: {
        sent: 1250,
        opened: 625,
        clicked: 312,
        converted: 78,
      },
    },
    {
      id: "CAM002",
      name: "Instagram Product Showcase",
      type: "social",
      status: "scheduled",
      startDate: "2023-07-15",
      endDate: "2023-07-30",
      performance: {
        impressions: 0,
        engagement: 0,
        clicks: 0,
        converted: 0,
      },
    },
    {
      id: "CAM003",
      name: "Summer Sale 25% Off",
      type: "discount",
      status: "completed",
      startDate: "2023-05-01",
      endDate: "2023-05-15",
      performance: {
        codes_used: 342,
        revenue: 8550,
        new_customers: 87,
      },
    },
    {
      id: "CAM004",
      name: "New Customer Welcome",
      type: "email",
      status: "active",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      performance: {
        sent: 450,
        opened: 315,
        clicked: 189,
        converted: 63,
      },
    },
  ];

  // Helper function to render campaign type icon
  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "social":
        return <Instagram className="h-4 w-4" />;
      case "discount":
        return <Tag className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "scheduled":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Scheduled
          </Badge>
        );
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">Marketing Tools</h2>
        <Button className="bg-purple-700 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
              <CardDescription>
                Manage your marketing campaigns across different channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">
                          {campaign.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCampaignTypeIcon(campaign.type)}
                            <span className="capitalize">{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {new Date(
                                campaign.startDate,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500">
                              to{" "}
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {campaign.status === "active" ||
                          campaign.status === "completed" ? (
                            <div className="text-sm">
                              {campaign.type === "email" && (
                                <div>
                                  Open rate:{" "}
                                  {Math.round(
                                    (campaign.performance.opened /
                                      campaign.performance.sent) *
                                      100,
                                  )}
                                  %
                                </div>
                              )}
                              {campaign.type === "discount" && (
                                <div>
                                  Revenue: ${campaign.performance.revenue}
                                </div>
                              )}
                              {campaign.type === "social" &&
                                campaign.status === "active" && (
                                  <div>In progress...</div>
                                )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              Not started
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Create and manage your email marketing templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Welcome Email",
                    description: "Sent to new customers",
                    lastEdited: "2 days ago",
                  },
                  {
                    name: "Product Launch",
                    description: "Announce new products",
                    lastEdited: "1 week ago",
                  },
                  {
                    name: "Seasonal Sale",
                    description: "Promotional discounts",
                    lastEdited: "3 weeks ago",
                  },
                  {
                    name: "Abandoned Cart",
                    description: "Reminder for customers",
                    lastEdited: "1 month ago",
                  },
                  {
                    name: "Customer Feedback",
                    description: "Request reviews",
                    lastEdited: "2 months ago",
                  },
                  {
                    name: "Monthly Newsletter",
                    description: "Regular updates",
                    lastEdited: "2 days ago",
                  },
                ].map((template, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center">
                      <Mail className="h-12 w-12 text-purple-700" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-500">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-500">
                          Edited {template.lastEdited}
                        </span>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="overflow-hidden border-dashed border-2 border-gray-300">
                  <div className="h-40 flex items-center justify-center">
                    <Plus className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold">Create New Template</h3>
                    <p className="text-sm text-gray-500">
                      Design a custom email template
                    </p>
                    <Button className="mt-4 w-full bg-purple-700 hover:bg-purple-800">
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Analytics</CardTitle>
              <CardDescription>
                Track the performance of your marketing efforts
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>Marketing analytics dashboard would appear here</p>
                <p className="text-sm">
                  (Using a charting library like Chart.js or Recharts)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
