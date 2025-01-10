import React, { useState, useEffect } from "react";
import "../App.css";

interface WeatherBlogData {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

const WeatherBlog: React.FC = () => {
  const [blogs, setBlogs] = useState<WeatherBlogData[]>([]);
  const [displayCount, setDisplayCount] = useState(5); // Number of blogs to display initially
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherBlogs = async () => {
      try {
        setIsPending(true);
        setError(null);

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=weather&apiKey=${
            import.meta.env.VITE_NEWS_API_KEY
          }`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather blogs");
        }

        const data = await response.json();
        const formattedBlogs = data.articles
          .filter(
            (article: any) =>
              article.title &&
              article.description &&
              article.publishedAt &&
              !article.title.toLowerCase().includes("removed") &&
              !article.description.toLowerCase().includes("removed")
          )
          .map((article: any, index: number) => ({
            id: index.toString(),
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name || "Unknown Source",
            publishedAt: article.publishedAt,
          }))
          .sort(
            (a: WeatherBlogData, b: WeatherBlogData) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          ); // Sort by latest

        setBlogs(formattedBlogs);
        setIsPending(false);
      } catch (err) {
        setError("Failed to fetch weather blogs.");
        setIsPending(false);
      }
    };

    fetchWeatherBlogs();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 5); // Increase display count by 5
  };

  return (
    <div>
      <h1>Weather Blogs</h1>
      {isPending && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {blogs.slice(0, displayCount).map((blog) => (
          <div key={blog.id} className="blog-preview">
            <h2>{blog.title || "Title Unavailable"}</h2>
            <p>{blog.description || "Description Unavailable"}</p>
            <p>
              Source: <strong>{blog.source || "Unknown Source"}</strong>
            </p>
            <p>
              Published At:{" "}
              <strong>{new Date(blog.publishedAt).toLocaleString()}</strong>
            </p>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url ? "Read More" : "Link Unavailable"}
            </a>
          </div>
        ))}
      </div>
      {displayCount < blogs.length && ( // Show "Load More" only if there are more blogs
        <button className="btn btn-primary mt-3" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default WeatherBlog;
