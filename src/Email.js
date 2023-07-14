import React, { useState } from 'react';

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    content: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmailData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:8081/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
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
        type="email"
        name="recipient"
        placeholder="Recipient"
        value={emailData.recipient}
        onChange={handleInputChange}
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
