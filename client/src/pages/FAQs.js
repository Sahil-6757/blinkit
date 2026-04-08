import React, { useState, useEffect } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorizedFaqs, setCategorizedFaqs] = useState({});

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:8000/faqs');
        const data = await response.json();

        // Group FAQs by category
        const grouped = data.reduce((acc, faq) => {
          const category = faq.category || 'General'; // Default to 'General' if no category is provided
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(faq);
          return acc;
        }, {});

        setFaqs(data);
        setCategorizedFaqs(grouped);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <div className="faq-container container my-2">
      <h2 className="text-center my-4">Frequently Asked Questions</h2>

      {loading ? (
        <div className="text-center p-5">Loading FAQs...</div>
      ) : Object.keys(categorizedFaqs).length > 0 ? (
        <div className="dynamic-faqs">
          {Object.entries(categorizedFaqs).map(([category, faqsInCategory]) => (
            <Accordion key={category} className="main-accordion mb-3">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h3>{category}</h3>
              </AccordionSummary>
              <AccordionDetails>
                {faqsInCategory.map((faq) => (
                  <Accordion key={faq.id} className="mb-2 shadow-sm border-0">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <p className="mb-0">
                        <b>{faq.question}</b>
                      </p>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p className="text-muted mb-0">{faq.answer}</p>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ) : (
        <div className="text-center p-5 text-muted">No FAQs found.</div>
      )}

      {/* Static content removed as dynamic system replaces it */}
    </div>
  );
}

export default FAQs;
