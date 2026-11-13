/**
 * Toppers whose real mains answer copies are inside the Answer Copies Compilation (63 scans, 27 toppers).
 * Kept in step with the files on the VPS. If a copy is added, add the line here so the AI can say so.
 */
export const COPY_PRODUCT_SLUG = "answer-copies-compilation";

export const COPY_TOPPERS: { name: string; air: number; year: number; files: number }[] = [
  { name: "Abhishek Sharma", air: 38, year: 2024, files: 1 },
  { name: "Ayan Jain", air: 16, year: 2023, files: 5 },
  { name: "Banna Venkatesh", air: 15, year: 2025, files: 1 },
  { name: "Bharat Jai Prakash Meena", air: 85, year: 2022, files: 2 },
  { name: "Dabholkar Vasant Prasad", air: 76, year: 2022, files: 1 },
  { name: "Divya Tanwar", air: 105, year: 2022, files: 1 },
  { name: "Divyank Gupta", air: 21, year: 2024, files: 1 },
  { name: "Garima Lohia", air: 2, year: 2022, files: 5 },
  { name: "Garima Mundra", air: 80, year: 2023, files: 4 },
  { name: "Ishita Kishore", air: 1, year: 2022, files: 3 },
  { name: "Kritika Goyal", air: 14, year: 2022, files: 1 },
  { name: "Kunal Rastogi", air: 15, year: 2023, files: 5 },
  { name: "Kush Motwani", air: 11, year: 2023, files: 4 },
  { name: "Mayur Hazarika", air: 5, year: 2022, files: 1 },
  { name: "Preeti Kumari", air: 130, year: 2022, files: 1 },
  { name: "Priya Rani", air: 69, year: 2023, files: 4 },
  { name: "Saloni Chhabra", air: 29, year: 2023, files: 4 },
  { name: "Saumya Mishra", air: 18, year: 2024, files: 1 },
  { name: "Shakti Dubey", air: 1, year: 2024, files: 1 },
  { name: "Shivani Ettaboyina", air: 11, year: 2024, files: 1 },
  { name: "Shivansh Subhash Jagade", air: 26, year: 2024, files: 1 },
  { name: "Shubhanshu Katiyar", air: 70, year: 2023, files: 4 },
  { name: "Smriti Mishra", air: 4, year: 2022, files: 2 },
  { name: "Swati Sharma", air: 17, year: 2023, files: 4 },
  { name: "Trilok Singh", air: 20, year: 2024, files: 1 },
  { name: "Uma Harathi", air: 3, year: 2022, files: 3 },
  { name: "Vaishali Chopra", air: 23, year: 2022, files: 1 },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

export function copyFor(name: string) {
  const n = norm(name);
  if (!n) return null;
  return COPY_TOPPERS.find((c) => norm(c.name) === n || norm(c.name).includes(n) || n.includes(norm(c.name))) || null;
}
