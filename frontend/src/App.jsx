import { useState } from 'react'
import './App.css'

function App() {
  const [input1, setInput1] = useState('50253479851');
  const [input2, setInput2] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleInputChange = (e, setInput) => {
    const value = e.target.value;
    setInput(value);

    // Validation logic for Input 1 to accept only numbers
    if (setInput === setInput1) {
      setIsButtonDisabled(!/^\d+$/.test(value) || input2.trim() === '');
    } else {
      setIsButtonDisabled(input1.trim() === '' || value.trim() === '');
    }
  };


  const handleFormSubmit = async(e) => {
    e.preventDefault();
    // Do something with the form data, for example, log it to the console
    console.log('Input 1:', input1);
    console.log('Input 2:', input2);

    // Assuming you have an API endpoint where you want to send the data
    const apiUrl = 'http://127.0.0.1:3001/sms';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: input1,
          description: input2,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      // Handle the success response here if needed
      alert('Form submitted successfully!');
    } catch (error) {
      alert('Error submitting form:', error.message);
    }
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Send SMS!</h1>
      <form onSubmit={handleFormSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        <label>
          Phone Number:
          <input
            type="number"
            value={input1}
            onChange={(e) => handleInputChange(e, setInput1)}
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </label>
        <br />
        <label>
          Text:
          <textarea
            value={input2}
            onChange={(e) => handleInputChange(e, setInput2)}
            style={{ width: '100%', padding: '8px', margin: '8px 0', resize: 'vertical' }}
          />
        </label>
        <br />
        <button
          type="submit"
          disabled={isButtonDisabled}
          style={{
            background: isButtonDisabled ? 'grey' : '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default App
