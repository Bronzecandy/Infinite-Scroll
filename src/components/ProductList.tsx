import React, { useEffect, useState, useRef } from "react";
import { fetchProducts, searchProducts } from "../api";
import { Product } from "../types";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const searchToken = useRef(0); // Lưu phiên bản request tìm kiếm

  const LIMIT = 20;
  const loadProducts = async (skip: number) => {
    setIsLoading(true);
    const newProducts = await fetchProducts(skip, LIMIT);
    setProducts((prev) => [...prev, ...newProducts]);
    setIsLoading(false);
  };

  useEffect(() => {
    const loadProducts = async () => {
        setIsLoading(true);
        const products = await fetchProducts(0, LIMIT);
        setProducts(products);
        setIsLoading(false);
      };
    
      loadProducts();
  }, []);

 

  const handleScroll = () => {
    if (!listRef.current || query.trim()) return; 
  
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
      const nextSkip = skip + LIMIT;
      setSkip(nextSkip);
      loadProducts(nextSkip);
    }
  };
  

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSkip(0);

    const currentToken = ++searchToken.current; // Tăng phiên bản request hiện tại
    if (value.trim()) {
      console.log("Searching for products with query:", value);
      const searchedProducts = await searchProducts(value);

      // Chỉ cập nhật danh sách nếu request này là mới nhất
      if (currentToken === searchToken.current) {
        console.log("Search results:", searchedProducts);
        setProducts(searchedProducts);
      }
    } else {
      console.log("Clearing search, reloading products...");
      setProducts([]);
      loadProducts(0);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleSearch}
        className="border p-2 mb-4 w-full"
      />

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="overflow-auto h-[500px] border"
      >
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="flex items-center gap-4 border-b pb-2">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-16 h-16 object-cover"
              />
              <div>
                <h3 className="font-bold">{product.title}</h3>
                <p>${product.price}</p>
              </div>
            </li>
          ))}
        </ul>
        {isLoading && <p className="text-center p-4">Loading...</p>}
      </div>
    </div>
  );
};

export default ProductList;
