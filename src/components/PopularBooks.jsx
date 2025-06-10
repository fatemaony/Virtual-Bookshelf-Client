import React, { useState } from "react";
import { useLoaderData } from "react-router";
import BookShelfCard from "./BookshelfCard";

const PopularBooks = () => {
  const initialBooks = useLoaderData();

  // Sort books by upvote in descending order and take top 6
  const topBooks = [...initialBooks]
    .sort((a, b) => b.upvote - a.upvote)
    .slice(0, 6);

  const [books, setBooks] = useState(topBooks);

  return (
    <div className="py-10">
      <h1 className="text-5xl text-center font-bold text-amber-800">Popular Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto mt-12">
        {books.map((book) => (
          <BookShelfCard
            key={book._id}
            books={books}
            setBooks={setBooks}
            book={book}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularBooks;
