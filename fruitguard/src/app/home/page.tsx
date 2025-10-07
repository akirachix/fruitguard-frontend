"use client";
import { useState } from "react";
import { useFetchAgrovets } from "../hooks/useFetchAgrovets";
import { useFetchDevices } from "../hooks/useFetchDevices";
import { Agrovet } from "../utils/type";
import { Card } from "../utils/type";
import { PaginationControlsProps } from "../utils/type";
import { FiSearch } from "react-icons/fi";
import AdminLayout from "../sharedComponents/AdminLayout";

export default function HomePage() {
const { agrovets, agrovetsCount } = useFetchAgrovets();
const { trapsCount } = useFetchDevices();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const filteredAgrovets = agrovets.filter((m: Agrovet) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgrovets.length / itemsPerPage) || 1;

  const currentAgrovets = filteredAgrovets.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f9f6f3] flex flex-row font-sans text-black overflow-x-hidden">
        <main
          className="
            flex-1 w-full max-w-[1200px] mx-auto
            px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-36
            2xl:max-w-[1450px]
          "
        >
          <h1 className="text-3xl md:text-4xl font-semibold mb-8 mt-3">
            Home
          </h1>

          <div className="flex flex-col md:flex-row gap-6 md:gap-6 mb-12 flex-wrap justify-center ">
            <StatCard count={trapsCount} label="Total traps" />
            <StatCard count={agrovetsCount} label="Number of agrovets" />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold mb-3">
            Agrovet managers
          </h2>

          <div className="relative flex items-center w-full max-w-md mb-3">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-10 py-2 w-full text-black bg-white shadow-sm text-sm sm:text-base"
            />
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>

    
          <table
            className="w-full border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-sm text-sm sm:text-base"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-[#763B18] text-white">
                <th className="py-3 px-2 sm:py-4 sm:px-4 text-left font-bold rounded-tl-2xl border border-[#763B18] break-words">
                  Id
                </th>
                <th className="py-3 px-2 sm:py-4 sm:px-4 text-left font-bold border-y border-[#763B18] break-words">
                  Name
                </th>
                <th className="py-3 px-2 sm:py-4 sm:px-4 text-left font-bold border-y border-[#763B18] break-words">
                  Location
                </th>
                <th className="py-3 px-2 sm:py-4 sm:px-4 text-left font-bold rounded-tr-2xl border border-[#763B18] break-words">
                  Phone No
                </th>
              </tr>
            </thead>
            {filteredAgrovets.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 sm:py-10 text-base sm:text-lg text-gray-600 border border-t-0 border-b-0 border-x-0 bg-[#FFF9E6] rounded-b-2xl"
                  >
                    No agrovet manager found with that name.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {currentAgrovets.map((m: Agrovet, idx) => (
                  <tr
                    key={m.id}
                    className={idx % 2 === 0 ? "bg-[#FFF9E6]" : "bg-white"}
                  >
                    <td className="py-3 px-2 sm:py-4 sm:px-4 border border-gray-300 break-words truncate max-w-[50px]">
                      {m.id}
                    </td>
                    <td className="py-3 px-2 sm:py-4 sm:px-4 border border-gray-300 break-words truncate max-w-[150px]">
                      {m.name}
                    </td>
                    <td className="py-3 px-2 sm:py-4 sm:px-4 border border-gray-300 break-words truncate max-w-[150px]">
                      {m.location}
                    </td>
                    <td className="py-3 px-2 sm:py-4 sm:px-4 border border-gray-300 break-words truncate max-w-[120px]">
                      {m.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            setCurrentPage={setPage}
          />
        </main>
      </div>
    </AdminLayout>
  );
}

function StatCard({ count, label }: Card) {
  return (
    <div className="bg-[#FFC661] rounded-xl flex-1 min-w-[280px] max-w-[500px] px-6 sm:px-8 py-8 sm:py-10 shadow-md text-center flex flex-col items-center justify-center transition hover:scale-[1.03]">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold">{count}</div>
      <div className="text-base sm:text-lg md:text-xl mt-2 font-medium">{label}</div>
    </div>
  );
}

function PaginationControls({ currentPage, totalPages, setCurrentPage }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 text-black py-2 sm:py-4 flex-wrap  ">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 sm:px-5 py-2 rounded-lg font-bold text-sm sm:text-base transition ${
          currentPage === 1
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-[#763B18] text-white cursor-pointer hover:bg-[#94502c]"
        }`}
      >
        Previous
      </button>
      <span className="font-bold text-[#763B18] text-sm sm:text-base whitespace-nowrap">
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 sm:px-5 py-2 rounded-lg font-bold text-sm sm:text-base transition ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-[#763B18] text-white cursor-pointer hover:bg-[#94502c]"
        }`}
      >
        Next
      </button>
    </div>
  );
}