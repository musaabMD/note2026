"use client";

import { ArrowRight } from "lucide-react";

export function PageHeader({
  title,
  description,
  searchPlaceholder = "Search...",
  filterButtons = [],
  searchValue = "",
  onSearchChange,
  onFilterChange,
  selectedFilter
}) {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <>
      {/* Header - Centered */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-2">
          <span className="text-foreground">{title}</span>
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </div>

      {/* Search Bar - Like Home Page */}
      <div className="mb-8 sm:mb-12 w-full max-w-3xl mx-auto">
        <div className="relative bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center px-4 py-4 w-full">
            {/* Search Input */}
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="flex-1 min-w-0 outline-none text-foreground placeholder:text-muted-foreground bg-transparent"
            />

            {/* Submit Button */}
            <button className="ml-4 flex-shrink-0 p-2 rounded-full bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      {filterButtons.length > 0 && (
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 px-2">
            {filterButtons.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.name}
                  onClick={() => onFilterChange && onFilterChange(filter.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                    selectedFilter === filter.name
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary text-secondary-foreground border-border hover:bg-accent hover:border-border"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
