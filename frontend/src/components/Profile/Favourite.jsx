import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const Favourite = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://book-voyager.onrender.com/favourites/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavouriteBooks(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchFavourites();
  }, []);

  const handleRemoveFavourite = async (_id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `https://book-voyager.onrender.com/favourites/remove/${_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFavouriteBooks(favouriteBooks.filter((book) => book._id !== _id));
    } catch (error) {
      console.error("Error removing favourite:", error);
    }
  };

  if (loading) {
    return <Loader />; 
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {favouriteBooks.length === 0 && (
        <div className="text-center text-gray-500 text-lg sm:text-xl">
          No Favorite Books
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl">
        {favouriteBooks?.map((item, i) => (
          <div key={i} className="relative">
            <button
              onClick={() => handleRemoveFavourite(item._id)}
              className="absolute top-2 left-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-200"
              aria-label="Remove from favorites"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
            <BookCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourite;
