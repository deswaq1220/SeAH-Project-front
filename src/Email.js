import React, { useState } from 'react';

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    recipients: '',
    subject: '',
    content: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmailData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleRecipientChange = (event) => {
    const { value } = event.target;
    setEmailData(prevData => ({ ...prevData, recipients: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailDataWithMultipleRecipients = {
      ...emailData,
      recipients: emailData.recipients.split(',').map(recipient => recipient.trim())
    };

    fetch('http://localhost:8081/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailDataWithMultipleRecipients)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Email sent:', data);
        // 이메일 전송 성공 시 처리 로직 추가
      })
      .catch(error => {
        console.error('Error sending email:', error);
        // 이메일 전송 실패 시 처리 로직 추가
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="recipients"
        placeholder="Recipients (comma-separated)"
        value={emailData.recipients}
        onChange={handleRecipientChange}
      />
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={emailData.subject}
        onChange={handleInputChange}
      />
      <textarea
        name="content"
        placeholder="Content"
        value={emailData.content}
        onChange={handleInputChange}
      />
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
