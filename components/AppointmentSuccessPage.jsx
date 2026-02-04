import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "sonner";

const AppointMentSuccessCard = ({ id, name, clinic, date }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    toast.success("Appointment Successful 👍");
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("ID Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <StyledWrapper>
      <div className="notifications-container">
        <div className="success">
          <div className="flex">
            <div className="shrink-0">
              <svg
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className="success-svg"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="success-prompt-wrap">
              <p className="success-prompt-heading">
                Appointment Placed Successfully!
              </p>
              <div className="success-prompt-prompt">
                <p>
                  Thank you for making an appointment, <strong>{name}</strong>,
                  at Dr Rahul Ghuge's Dental Clinic, <strong>{clinic}</strong> on{" "}
                  <strong>{date}</strong>.
                </p>
                <div className="appointment-id">
                  <p className="id-label">Your Appointment ID:</p>
                  <div className="id-container">
                    <span className="id-value">{id}</span>
                    <button
                      onClick={handleCopyId}
                      className="copy-button"
                      title="Copy ID"
                    >
                      {copied ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="id-label">
                    <strong>Important:</strong> Save this <strong>ID</strong> to
                    track your appointment and access your reports.
                  </p>

                  {copied && <span className="copied-message">Copied!</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .notifications-container {
    width: 100%;
    max-width: 600px;
    min-height: 300px;
    font-size: 1rem;
    line-height: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .flex {
    display: flex;
    gap: 1rem;
  }

  .flex-shrink-0 {
    flex-shrink: 0;
  }

  .success {
    padding: 2.5rem;
    border-radius: 0.75rem;
    background-color: rgb(240 253 244);
    border: 2px solid rgb(134 239 172);
    min-height: 280px;
    display: flex;
    align-items: center;
  }

  .success-svg {
    color: rgb(34 197 94);
    width: 2.5rem;
    height: 2.5rem;
  }

  .success-prompt-wrap {
    flex: 1;
  }

  .success-prompt-heading {
    font-weight: 700;
    font-size: 1.5rem;
    color: rgb(22 101 52);
    margin-bottom: 1rem;
  }

  .success-prompt-prompt {
    margin-top: 0.75rem;
    color: rgb(21 128 61);
    line-height: 1.75;
    font-size: 1.05rem;
  }

  .success-prompt-prompt p {
    margin-bottom: 0.75rem;
  }

  .success-prompt-prompt p:last-child {
    margin-bottom: 0;
  }

  .appointment-id {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid rgb(134 239 172);
  }

  .id-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: rgb(22 101 52);
    margin-bottom: 0.75rem;
  }

  .id-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: white;
    padding: 1rem 1.25rem;
    border-radius: 0.5rem;
    border: 1px solid rgb(134 239 172);
  }

  .id-value {
    font-family: "Courier New", monospace;
    font-size: 1.15rem;
    font-weight: 700;
    color: rgb(22 101 52);
    flex: 1;
    letter-spacing: 0.5px;
  }

  .copy-button {
    background-color: rgb(34 197 94);
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: 38px;
    min-height: 38px;
  }

  .copy-button:hover {
    background-color: rgb(22 163 74);
    transform: scale(1.05);
  }

  .copy-button:active {
    transform: scale(0.95);
  }

  .copied-message {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: rgb(34 197 94);
    font-weight: 600;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .notifications-container {
      max-width: 100%;
      min-height: auto;
    }

    .success {
      padding: 1.5rem;
      min-height: auto;
    }

    .success-prompt-heading {
      font-size: 1.25rem;
    }

    .success-prompt-prompt {
      font-size: 0.95rem;
    }

    .id-value {
      font-size: 1rem;
    }

    .id-container {
      padding: 0.75rem 1rem;
    }

    .success-svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

export default AppointMentSuccessCard;
