import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SeedForumPage = () => {
  return (
    <div className="container mx-auto p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Seed Forum Data</h1>

      <Tabs defaultValue="categories">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="threads">Sample Threads</TabsTrigger>
          <TabsTrigger value="users">Test Users</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Forum Categories</CardTitle>
              <CardDescription>
                Create default forum categories for Scentrium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Diskusi Perfumer</h3>
                  <p className="text-sm text-muted-foreground">
                    Teknik meracik parfum, sharing formula, metode
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Review Parfum</h3>
                  <p className="text-sm text-muted-foreground">
                    Ulasan mendalam parfum lokal
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Inspirasi Parfum</h3>
                  <p className="text-sm text-muted-foreground">
                    Diskusi inspirasi dari alam/budaya
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Kolaborasi & Event</h3>
                  <p className="text-sm text-muted-foreground">
                    Mencari partner event atau proyek parfum
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Tips Bisnis Parfum</h3>
                  <p className="text-sm text-muted-foreground">
                    Branding, marketing, penjualan
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Seed Categories</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="threads">
          <Card>
            <CardHeader>
              <CardTitle>Sample Threads</CardTitle>
              <CardDescription>
                Create sample discussion threads for testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">
                    10 Sample Threads per Category
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Creates 10 threads with random content in each category
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Sample Replies</h3>
                  <p className="text-sm text-muted-foreground">
                    Adds 3-10 replies to each thread
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Generate Sample Threads</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Test Users</CardTitle>
              <CardDescription>
                Create test users with different roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Regular Users (5)</h3>
                  <p className="text-sm text-muted-foreground">
                    Creates 5 regular users with Free membership
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Business Users (3)</h3>
                  <p className="text-sm text-muted-foreground">
                    Creates 3 users with Business membership
                  </p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">Admin User (1)</h3>
                  <p className="text-sm text-muted-foreground">
                    Creates 1 admin user
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Create Test Users</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SeedForumPage;
