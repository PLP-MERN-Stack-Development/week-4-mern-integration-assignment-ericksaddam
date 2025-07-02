import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-6">Welcome to the PLP MERN Blog Assignment 4!</h1>
      <p className="text-lg mb-8 text-gray-600">
        A modern blogging platform built with MongoDB, Express, React, and Node.js with love from PLP Academy.
      </p>
      <Link
        to="/posts"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        View Posts
      </Link>
    </div>
  );
}

export default Home;
