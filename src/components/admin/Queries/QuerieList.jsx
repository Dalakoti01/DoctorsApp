"use client";

import React, { useState } from "react";
import { Search, MessageCircle, CheckCircle, Clock } from "lucide-react";
import useGetAllQueries from "@/hooks/admin/useGetAllQueries";
import { useSelector } from "react-redux";

const QueryList = () => {
  useGetAllQueries();
  const { allQueries } = useSelector((store) => store.admin);
  console.log("All Queries:", allQueries);

  const [filter, setFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);

  const filteredQueries = allQueries.filter((query) => {
    if (filter === "all") return true;
    const hasPending = query.support.some((s) => !s.resolved);
    return filter === "pending" ? hasPending : !hasPending;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Query Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queries List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Queries List</h2>
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4d91ff] focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === "all"
                    ? "bg-[#4d91ff] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === "pending"
                    ? "bg-[#4d91ff] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === "resolved"
                    ? "bg-[#4d91ff] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("resolved")}
              >
                Resolved
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[calc(100vh-350px)] overflow-y-auto">
            {filteredQueries.map((query) => (
              <div
                key={query._id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedQuery?._id === query._id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedQuery(query)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {query.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{query.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Support Messages: {query.support.length}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Query Detail */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          {selectedQuery ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900">
                Query Details
              </h2>
              <p className="text-sm text-gray-500">
                {selectedQuery.fullName} • {selectedQuery.email}
              </p>
              <p className="text-sm text-gray-500">
                Phone: {selectedQuery.phoneNumber}
              </p>

              <div className="mt-4 space-y-4">
                {selectedQuery.support.map((supportItem, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800">{supportItem.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(supportItem.timeOfMessage).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-[#4d91ff]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No query selected
              </h3>
              <p className="text-sm text-gray-500">
                Select a query from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryList;
