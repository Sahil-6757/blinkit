import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Blog() {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getBlogs = async () => {
    try {
      const res = await fetch('http://localhost:8000/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className='container my-5 px-3 px-md-4'>
      
      {/* Header */}
      <div className="text-center mb-4 mb-md-5">
        <h1 className="fw-bold">Our Latest Blog</h1>
        <p className="text-muted">
          Stay updated with the latest trends and stories in e-commerce.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : blogs.length > 0 ? (

        <div className='row g-4'>
          {blogs.map((blog) => (
            
            <div key={blog.id} className='col-lg-4 col-md-6 col-sm-12'>
              
              <div className='card h-100 shadow-sm border-0 blog-card'>
                
                {/* Image */}
                <img
                  src={`http://localhost:8000/uploads/${blog.blogImage}`}
                  alt={blog.blogTitle}
                  className='card-img-top img-fluid'
                />

                {/* Content */}
                <div className='card-body d-flex flex-column'>
                  <h5 className='card-title fw-bold text-success'>
                    {blog.blogTitle}
                  </h5>

                  <p className='card-text text-muted flex-grow-1'>
                    {blog.blogContent.length > 120
                      ? `${blog.blogContent.substring(0, 120)}...`
                      : blog.blogContent}
                  </p>

                  <button
                    className="btn btn-outline-success btn-sm mt-2"
                    onClick={() => navigate(`/blog/${blog.id}`)}
                  >
                    Read More
                  </button>
                </div>

              </div>

            </div>

          ))}
        </div>

      ) : (
        <div className="text-center py-5">
          <p className="text-muted">
            No blog posts found at the moment. Check back later!
          </p>
        </div>
      )}
    </div>
  )
}

export default Blog;