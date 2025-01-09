import React, { useState } from "react";
import useFetch from "./useFetch"; // Adjust the path if necessary
import "../App.css";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const JsonTest: React.FC = () => {
  const { data, isPending, error } = useFetch<Post[]>({
    url: "https://jsonplaceholder.typicode.com/posts",
  });

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleItemClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  return (
    <div
      className={selectedPost ? "disable-hover" : ""}
      style={{ padding: "20px" }}
    >
      <h1>JSON Test</h1>
      {isPending && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!selectedPost && data && (
        <div>
          {data.map((post) => (
            <div
              key={post.id}
              className="blog-preview"
              onClick={() => handleItemClick(post)}
              style={{ cursor: "pointer" }}
            >
              <h2>{post.title}</h2>
              <p>{post.body.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
      {selectedPost && (
        <div className="blog-preview">
          <button onClick={handleBack} className="btn btn-secondary mb-3">
            Back
          </button>
          <h2>{selectedPost.title}</h2>
          <p>
            <strong>ID:</strong> {selectedPost.id}
          </p>
          <p>
            <strong>User ID:</strong> {selectedPost.userId}
          </p>
          <p>{selectedPost.body}</p>
        </div>
      )}
    </div>
  );
};

export default JsonTest;
