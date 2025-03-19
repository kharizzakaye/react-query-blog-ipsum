import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  })

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  })

  useEffect(() => {
    if (currentPage < maxPostPage)
    {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({ 
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient])

  const { data,  isError, isLoading, isFetching } = useQuery({
    queryKey: ["posts", currentPage], // definition of data
    queryFn: () => fetchPosts(currentPage), // function that will run to get data
    staleTime: 2000, // when to trigger a refetch - if not stated, staleTime = 0ms,
  });
  
  // if (isFetching) 
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
            onClick={() => {
              deleteMutation.reset();
              updateMutation.reset();
              setSelectedPost(post);
            }}
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
      { selectedPost && 
        <PostDetail 
          post={selectedPost} 
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      }
    </>
  );
}
