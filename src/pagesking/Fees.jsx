import React, { useEffect, useState } from 'react';
import api from '../api/client';

const styles = {
  page: {
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: 'transparent',
  },
  inputWrap: { marginBottom: '16px' },
  input: {
    padding: '8px 10px',
    width: '280px',
    maxWidth: '90%',
    border: '1px solid #999',
    borderRadius: '4px',
  },
  backBtn: { marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' },
  payAllBtn: {
    marginLeft: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#0b5ed7',
    color: '#fff',
  },
  table: { width: '80%', margin: '0 auto', borderCollapse: 'collapse', backgroundColor: 'white' },
  headRow: { backgroundColor: '#333', color: 'white' },
  cell: { padding: '10px' },
  payBtn: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  listWrap: { width: '80%', margin: '24px auto 0', textAlign: 'left' },
  list: { margin: 0, paddingLeft: '18px' },
  listItem: { marginBottom: '6px' },
};

function Fees({ setPage }) {
  const [fees, setFees] = useState([]);
  const [payerName, setPayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [payingFeeId, setPayingFeeId] = useState('');
  const [payingAll, setPayingAll] = useState(false);

  const paidList = fees.filter((fee) => fee.status === 'Paid');

  function getPaidByName(fee) {
    const name = String(fee.paidBy || '').trim();
    if (fee.status !== 'Paid') return '-';
    if (!name || name === '-') return 'Name not available';
    return name;
  }

  useEffect(() => {
    const oldBodyBackground = document.body.style.background;
    document.body.style.background = "#12f251 url('/home-bg.jpg') center/cover no-repeat fixed";

    return () => {
      document.body.style.background = oldBodyBackground;
    };
  }, []);

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    setLoading(true);
    try {
      const res = await api.get('/fees');
      setFees(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert('Unable to load fees.');
      setFees([]);
    } finally {
      setLoading(false);
    }
  }

  async function payFee(id) {
    const name = payerName.trim();
    if (!name) {
      alert('Please enter payer name first.');
      return;
    }
    if (!window.confirm('Do you want to pay this fee?')) return;

    setPayingFeeId(id);
    try {
      await api.post('/fees/pay-one', {
        feeId: id,
        method: 'UPI',
        paidBy: name,
      });
      await loadFees();
      setPayerName('');
      alert('Payment Successful!');
    } catch {
      alert('Payment failed.');
    } finally {
      setPayingFeeId('');
    }
  }

  async function payAllPending() {
    const name = payerName.trim();
    if (!name) {
      alert('Please enter payer name first.');
      return;
    }
    if (!window.confirm('Do you want to pay all pending fees?')) return;

    setPayingAll(true);
    try {
      await api.post('/fees/pay-pending', {
        method: 'UPI',
        paidBy: name,
      });
      await loadFees();
      setPayerName('');
      alert('All pending fees paid successfully!');
    } catch {
      alert('Failed to pay pending fees.');
    } finally {
      setPayingAll(false);
    }
  }

  return (
    <div style={styles.page}>
      <h1>Fees Management</h1>

      <div style={styles.inputWrap}>
        <input
          type="text"
          placeholder="Enter payer name"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          style={styles.input}
        />
        <button type="button" onClick={payAllPending} style={styles.payAllBtn} disabled={payingAll || loading}>
          {payingAll ? 'Paying...' : 'Pay Pending Fees'}
        </button>
      </div>

      <button onClick={() => setPage('Home')} style={styles.backBtn}>
        Back to Home
      </button>

      <table border="1" style={styles.table}>
        <thead>
          <tr style={styles.headRow}>
            <th style={styles.cell}>Fee Title</th>
            <th style={styles.cell}>Amount</th>
            <th style={styles.cell}>Status</th>
            <th style={styles.cell}>Paid By</th>
            <th style={styles.cell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td style={styles.cell} colSpan="5">
                Loading...
              </td>
            </tr>
          ) : fees.length === 0 ? (
            <tr>
              <td style={styles.cell} colSpan="5">
                No fee records found
              </td>
            </tr>
          ) : (
            fees.map((fee) => (
              <tr key={fee._id}>
                <td style={styles.cell}>{fee.feeName}</td>
                <td style={styles.cell}>Rs. {fee.amount}</td>
                <td style={{ ...styles.cell, color: fee.status === 'Paid' ? 'green' : 'red', fontWeight: 'bold' }}>
                  {fee.status}
                </td>
                <td style={styles.cell}>{getPaidByName(fee)}</td>
                <td style={styles.cell}>
                  {fee.status === 'Pending' ? (
                    <button onClick={() => payFee(fee._id)} style={styles.payBtn} disabled={payingFeeId === fee._id}>
                      {payingFeeId === fee._id ? 'Paying...' : 'Pay Now'}
                    </button>
                  ) : (
                    <span>Paid</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={styles.listWrap}>
        <h3 style={styles.listItem}>Payment List (Kisne Payment Kiya)</h3>
        {paidList.length === 0 ? (
          <p>No payment yet.</p>
        ) : (
          <ul style={styles.list}>
            {paidList.map((fee) => (
              <li key={fee._id} style={styles.listItem}>
                {fee.feeName} - Rs. {fee.amount} - Paid by: {getPaidByName(fee)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Fees;
