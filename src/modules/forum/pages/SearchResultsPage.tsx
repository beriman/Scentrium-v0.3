import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Filter } from "lucide-react";
import SearchBar from "@/components/forum/SearchBar";
import ThreadCard from "../components/ThreadCard";
import { supabase } from "../../../../supabase/supabase";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a proper search query
        // For now, we'll simulate search results
        const { data, error } = await supabase
          .from("forum_threads")
          .select("*, author:user_id(*), category(*)")
          .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (newQuery: string) => {
    window.location.href = `/forum/search?q=${encodeURIComponent(newQuery)}`;
  };

  const filteredResults =
    activeFilter === "all"
      ? results
      : results.filter((result) => result.category?.slug === activeFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/forum" className="text-purple-700 hover:text-purple-900">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Hasil Pencarian</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <SearchBar onSearch={handleSearch} placeholder="Cari di forum..." />
        {query && (
          <div className="mt-2 text-sm text-gray-500">
            Menampilkan hasil pencarian untuk:{" "}
            <span className="font-medium text-gray-700">"{query}"</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge
          variant={activeFilter === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveFilter("all")}
        >
          Semua
        </Badge>
        <Badge
          variant={activeFilter === "perfumer" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveFilter("perfumer")}
        >
          Diskusi Perfumer
        </Badge>
        <Badge
          variant={activeFilter === "reviews" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveFilter("reviews")}
        >
          Review Parfum
        </Badge>
        <Badge
          variant={activeFilter === "inspiration" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveFilter("inspiration")}
        >
          Inspirasi Parfum
        </Badge>
        <Badge
          variant={activeFilter === "events" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveFilter("events")}
        >
          Kolaborasi & Event
        </Badge>
        <Badge
          variant={activeFilter === "business" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveFilter("business")}
        >
          Tips Bisnis
        </Badge>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Mencari...</p>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Tidak ada hasil ditemukan
          </h2>
          <p className="text-gray-500 mb-6">
            Tidak ada thread yang cocok dengan kata kunci "{query}"
          </p>
          <Button className="bg-purple-700 hover:bg-purple-800">
            Buat Thread Baru
          </Button>
        </Card>
      )}
    </div>
  );
}
