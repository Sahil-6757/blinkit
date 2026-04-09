import { useState, useEffect } from "react";
import "../css/Term.css";

function Terms() {
  const [terms, setTerms] = useState("");

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const res = await fetch('http://localhost:8000/terms');
      if (res.ok) {
        const data = await res.json();
        if (data && data.terms) {
          setTerms(data.terms);
        }
      }
    } catch (err) {
      console.error("Failed to fetch terms", err);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <h2 className="mb-4 text-success fw-bold">Terms and Conditions</h2>
          {terms ? (
            <div 
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#444' }}
              dangerouslySetInnerHTML={{ __html: terms }}
            />
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Loading terms and conditions...</p>
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Terms;