// src/components/UserList.jsx
import React from 'react';
import './index.css';

const UserList = ({ users, onEdit, onDelete, requestSort }) => {
  return (
    <table className="userTable">
      <thead>
        <tr>
          <th className="sortable" onClick={() => requestSort('firstName')}>First Name</th>
          <th className="sortable" onClick={() => requestSort('lastName')}>Last Name</th>
          <th className="sortable" onClick={() => requestSort('email')}>Email</th>
          <th className="sortable" onClick={() => requestSort('department')}>Department</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((u) => (
            <tr key={u.id}>
              <td>{u.firstName || '-'}</td>
              <td>{u.lastName || '-'}</td>
              <td>{u.email || '-'}</td>
              <td>{u.department || '-'}</td>
              <td>
                <button onClick={() => onEdit(u)}>Edit</button>
                <button onClick={() => onDelete(u.id)}>Delete</button>
              </td>
            </tr> 
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>No users found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserList;
