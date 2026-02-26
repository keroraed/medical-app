import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDoctors } from "@/hooks/queries/useDoctors";
import { useSpecialties } from "@/hooks/queries/useSpecialties";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/PublicNavbar";
import {
  ArrowRight,
  Search,
  ChevronDown,
  X,
  Stethoscope,
  Calendar,
  Filter,
  User,
} from "lucide-react";
import { BACKEND_URL } from "@/lib/constants";
import { getProfilePicUrl } from "@/lib/utils";

function SpecialtyDropdown({ specialties, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = specialties?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedName = specialties?.find((s) => s._id === value)?.name;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 min-w-[220px] ${
          open
            ? "border-blue-300 ring-2 ring-blue-100 bg-white shadow-md"
            : value
              ? "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm"
        }`}
      >
        <Filter className="h-4 w-4 shrink-0 text-gray-400" />
        <span className="flex-1 text-left truncate">
          {selectedName || "All Specialties"}
        </span>
        {value ? (
          <X
            className="h-4 w-4 text-gray-400 hover:text-gray-600 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setOpen(false);
            }}
          />
        ) : (
          <ChevronDown
            className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl shadow-gray-200/50 z-50 overflow-hidden animate-fade-in">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search specialties..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder:text-gray-400 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-64 overflow-y-auto py-1.5">
            <button
              onClick={() => {
                onChange("");
                setOpen(false);
                setSearch("");
              }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                !value
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Stethoscope className="h-4 w-4 shrink-0" />
              All Specialties
              {!value && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>

            {filtered?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No specialties found
              </p>
            ) : (
              filtered?.map((s) => (
                <button
                  key={s._id}
                  onClick={() => {
                    onChange(s._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                    value === s._id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${value === s._id ? "bg-blue-500" : "bg-gray-300"}`}
                    />
                  </span>
                  {s.name}
                  {value === s._id && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DoctorsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const specialty = searchParams.get("specialty") || "";
  const searchQuery = searchParams.get("search") || "";
  const [nameInput, setNameInput] = useState(searchQuery);

  const { data: specialties } = useSpecialties();
  const { data, isLoading } = useDoctors({
    page,
    limit: 12,
    ...(specialty && { specialty }),
    ...(searchQuery && { name: searchQuery }),
  });

  const doctors = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handleSpecialtyFilter = (specId) => {
    setSearchParams((prev) => {
      if (specId) {
        prev.set("specialty", specId);
      } else {
        prev.delete("specialty");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (nameInput.trim()) {
        prev.set("search", nameInput.trim());
      } else {
        prev.delete("search");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const clearSearch = () => {
    setNameInput("");
    setSearchParams((prev) => {
      prev.delete("search");
      prev.set("page", "1");
      return prev;
    });
  };

  const selectedSpecialtyName = specialties?.find(
    (s) => s._id === specialty
  )?.name;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PublicNavbar dark />

      {/* Hero banner */}
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-24 relative overflow-hidden rounded-b-[3rem] shadow-xl shadow-blue-900/20">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Find a Doctor
            </h1>
            <p className="text-blue-200 text-lg">
              Browse our network of qualified doctors across {specialties?.length || "30+"}
              {" "}specialties
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/30 p-4 sm:p-5 mb-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search by name */}
            <form onSubmit={handleSearch} className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Search by doctor name..."
                className="w-full pl-9 pr-9 py-3 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder:text-gray-400 transition-all"
              />
              {nameInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <SpecialtyDropdown
              specialties={specialties}
              value={specialty}
              onChange={handleSpecialtyFilter}
            />

            <div className="sm:ml-auto text-sm text-gray-500">
              {!isLoading && (
                <span>
                  <strong className="text-gray-700">{pagination?.total || doctors.length}</strong> doctor{doctors.length !== 1 ? "s" : ""} found
                </span>
              )}
            </div>
          </div>

          {/* Active filters */}
          {(specialty || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-500">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">
                  Name: &ldquo;{searchQuery}&rdquo;
                  <button
                    onClick={clearSearch}
                    className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {specialty && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
                  {selectedSpecialtyName}
                  <button
                    onClick={() => handleSpecialtyFilter("")}
                    className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            title="No doctors found"
            description="Try a different specialty, name, or clear your filters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {doctors.map((doc) => {
              const picUrl = getProfilePicUrl(doc.profilePicture);
              const initials =
                doc.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "DR";

              return (
                <Link
                  key={doc._id}
                  to={`/doctors/${doc._id}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-3">
                    {/* Avatar / Profile picture */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0">
                      {picUrl ? (
                        <img
                          src={picUrl}
                          alt={doc.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors truncate">
                        {doc.user?.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {doc.specialty?.name || "General"}
                      </p>
                    </div>
                  </div>

                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                  {doc.bio || "No bio available"}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {doc.availability?.length || 0} days available
                  </div>
                  <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View Profile
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
              );
            })}
          </div>
        )}

        <div className="pb-8">
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
