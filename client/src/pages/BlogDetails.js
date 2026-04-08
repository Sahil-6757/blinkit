import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8000/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          console.error("Failed to fetch blog details");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container text-center py-5">
        <h2 className="text-muted">Blog not found</h2>
        <button className="btn btn-success mt-3" onClick={() => navigate('/blog')}>
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <button 
        className="btn btn-link text-success d-flex align-items-center gap-2 mb-4 p-0 text-decoration-none fw-bold" 
        onClick={() => navigate('/blog')}
      >
        <ArrowLeft size={20} /> Back to Blogs
      </button>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <img 
            src={`http://localhost:8000/uploads/${blog.blogImage}`} 
            alt={blog.blogTitle} 
            className="img-fluid rounded shadow-sm mb-4 w-100"
            style={{ maxHeight: '500px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
          />
          <h1 className="fw-bold mb-3">{blog.blogTitle}</h1>
          <hr className="my-4" />
          <div className="blog-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.1rem' }}>
            {blog.blogContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
