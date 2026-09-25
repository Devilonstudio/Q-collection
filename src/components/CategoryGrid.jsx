import { useAsync } from "../hooks/useAsync";
import { getCategoriesWithCover } from "../lib/api";
import { DataGate } from "./DataState";
import CategoryCard from "./CategoryCard";
import SectionTitle from "./SectionTitle";
import "./CategoryGrid.css";

export default function CategoryGrid() {
  const { data: categories, loading, error } = useAsync(getCategoriesWithCover, []);

  return (
    <section id="categories" className="section cat-grid-section">
      <div className="container">
        <SectionTitle
          eyebrow="The collection, in order"
          title="Seven rooms, considered one at a time."
        >
          Each room in the collection is designed as its own considered
          chapter — browse in sequence, or jump straight to the one you need.
        </SectionTitle>

        <DataGate loading={loading} error={error} label="Loading the collection…">
          <div className="cat-grid">
            {(categories || []).map((category, index) => (
              <CategoryCard
                key={category.slug}
                index={index}
                wide={index === categories.length - 1}
                category={category}
              />
            ))}
          </div>
        </DataGate>
      </div>
    </section>
  );
}
