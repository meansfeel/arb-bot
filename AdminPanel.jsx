import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);

  useEffect(() => {
    setUnapprovedUsers(getUsersAwaitingApproval());
  }, []);

  return (
    <div>
      <h2>待审核用户</h2>
      <ul>
        {unapprovedUsers.map(user => (
          <li key={user.id}>
            {user.username}
            <button onClick={() => approveUser(user.id)}>批准</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
