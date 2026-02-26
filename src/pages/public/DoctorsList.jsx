import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDoctors } from "@/hooks/queries/useDoctors";
import { useSpecialties } from "@/hooks/queries/useSpecialties";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import Footer from "@/components/shared/Footer";
import PublicNavbar from "@/components/shared/PublicNavbar";
import { ArrowRight } from "lucide-react";

export default function DoctorsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const specialty = searchParams.get("specialty") || "";

  const { data: specialties } = useSpecialties();
  const { data, isLoading } = useDoctors({
    page,
    limit: 12,
    ...(specialty && { specialty }),
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

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <PageTitle
          title="Find a Doctor"
          description="Browse our network of qualified doctors"
        />

        {/* Specialty filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleSpecialtyFilter("")}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              !specialty
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            All
          </button>
          {specialties?.map((s) => (
            <button
              key={s._id}
              onClick={() => handleSpecialtyFilter(s._id)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                specialty === s._id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : doctors.length === 0 ? (
          <EmptyState
            title="No doctors found"
            description="Try a different specialty."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <Link
                key={doc._id}
                to={`/doctors/${doc._id}`}
                className="border rounded-lg p-5 bg-card hover:shadow-md transition-shadow group"
              >
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {doc.user?.name}
                </h3>
                <p className="text-sm text-primary mt-1">
                  {doc.specialty?.name || "General"}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {doc.bio || "No bio available"}
                </p>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  {doc.availability?.length || 0} days available
                  <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>

      <Footer />
    </div>
  );
}
