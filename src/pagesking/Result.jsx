import React, { useEffect, useState } from 'react';

function Result() {
  const [roll, setRoll] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = '#12f251';

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  function handleInput(e) {
    setRoll(e.target.value);
  }

  function check() {
    if (roll === "") {
      alert("Please enter Roll Number");
    } else {
      setShow(true);
    }
  }

  return (
 
    <div style={{ textAlign: 'center', paddingTop: '20px', minHeight: '100vh', backgroundColor: '#12f251' }}>
      <h1>My Result</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Enter Roll Number" 
          value={roll}
          onChange={handleInput}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button onClick={check} style={{ padding: '10px' }}>Check</button>
      </div>
      
      {show ? (
        <div>
          <h3>Name: Student 1</h3>
          <h3>Roll No: {roll}</h3>
          
          <table border="1" align="center" width="50%" style={{ backgroundColor: 'white' }}>
            <tr>
              <th style={{ backgroundColor: '#dff0ff' }}>Subject</th>
              <th style={{ backgroundColor: '#ffe7a8' }}>Marks</th>
            </tr>
            <tr>
              <td>Maths</td>
              <td>80</td>
            </tr>
            <tr>
              <td>Science</td>
              <td>75</td>
            </tr>
            <tr>
              <td>English</td>
              <td>85</td>
            </tr>
          </table>
          
          <h2>Pass</h2>
        </div>
      ) : null}
    </div>
 
  );
}

export default Result;
