import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data,  isError, isLoading } = useQuery({
    queryKey: ["posts", currentPage], // definition of data
    queryFn: () => fetchPosts(currentPage), // function that will run to get data
    staleTime: 2000, // when to trigger a refetch - if not stated, staleTime = 0ms,
  });
  
  if (isLoading) 
  { 
    return (
      <h3>Loading...</h3>
    )
  }

  if (isError)
  {
    return (
      <h3>An error has occured</h3>
    )
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button 
          disabled={currentPage <= 1} 
          onClick={() => { setCurrentPage((previousValue => previousValue - 1))}}
        >
          Previous page
        </button>

        <span>Page {currentPage + 1}</span>

        <button 
          disabled={currentPage >= maxPostPage}
          onClick={() => {setCurrentPage((previousValue => previousValue + 1))}}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
