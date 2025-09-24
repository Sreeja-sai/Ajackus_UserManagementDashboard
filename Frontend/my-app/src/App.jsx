import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import { getUsers, addUser, updateUser, deleteUser } from './Services/api';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [showForm,setShowform]=useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [usersPerPage] = useState(8); // adjust per your preference


  useEffect(() => {
    fetchUsers();
  }, []);

 const fetchUsers = async () => {
  try {
    const res = await getUsers();
    // console.log("Fetched Users:", res.data);

    const defaultDepartments = ["Engineering", "HR", "Finance", "Marketing"]; // choose some defaults

    const normalized = res.data.map((u, index) => ({
      id: u.id,
      firstName: u.first_name || u.name?.split(' ')[0] || '',
      lastName: u.last_name || u.name?.split(' ')[1] || '',
      email: u.email || '',
      department: u.department || u.dept || defaultDepartments[index % defaultDepartments.length] // assign default
    }));

    setUsers(normalized);
  } catch (err) {
    alert('Error fetching users');
  }
};



const handleAdd = async (user) => {
  try {
    if (selectedUser) {
      await updateUser(selectedUser.id, user);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...user } : u));
      setSelectedUser(null);
    } else {
      const res = await addUser(user);
      setUsers([...users, { ...user, id: res.data.id }]); // backend ID
    }
  } catch (err) {
  console.error('Add/Update Error:', err);
  if (err.response) {
    // Server returned an error
    alert(err.response.data.error || 'Server error');
  } else if (err.request) {
    // Request was made but no response
    alert('No response from server. Is the backend running?');
  } else {
    // Other errors
    alert(err.message);
  }
}
};

  const handleEdit = (user) => {
    // console.log(user);
  setSelectedUser(user);
  setShowform(true); // open modal
};

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setShowform(false);
  }

const filteredUsers = users
  .filter(u => {
    const text = searchText.toLowerCase();
    return (
      (u.firstName || '').toLowerCase().includes(text) ||
      (u.lastName || '').toLowerCase().includes(text) ||
      (u.email || '').toLowerCase().includes(text) ||
      (u.department || '').toLowerCase().includes(text)
    );
  })
  .filter(u => (departmentFilter ? (u.department || '') === departmentFilter : true));


  const sortedUsers = [...filteredUsers];
  if (sortConfig.key) {
  sortedUsers.sort((a, b) => {
    let aVal = '';
    let bVal = '';

    if (sortConfig.key === 'firstName') {
      aVal = (a.firstName || '').toLowerCase();
      bVal = (b.firstName || '').toLowerCase();
    } else if (sortConfig.key === 'lastName') {
      aVal = (a.lastName || '').toLowerCase();
      bVal = (b.lastName || '').toLowerCase();
    } else if (sortConfig.key === 'email') {
      aVal = (a.email || '').toLowerCase();
      bVal = (b.email || '').toLowerCase();
    } else if (sortConfig.key === 'department') {
      aVal = (a.department || '').toLowerCase();
      bVal = (b.department || '').toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Calculate pagination indexes
const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

const totalPages = Math.ceil(sortedUsers.length / usersPerPage);



  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Extract unique departments for filter
  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];

  return (
    <div className="container">
      <h1>User Management Dashboard</h1>
      <div className="controls">
        <div className='searchContainer'>
          <img alt="searchIcon" className='searchIcon' src="https://res.cloudinary.com/dgxk9bly8/image/upload/v1757607901/fi_711319_zekqzw.png"/>
          <input
            type="text"
            placeholder="Search users..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className='searchInput'
          />
        </div>
        <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
        <button 
          onClick={() => { setShowform(true); setSelectedUser(null); }} 
          className='addUserBtn'>
          Add User
        </button>
        {showForm && (
          <div
            className="modalOverlay"
            onClick={() => handleCancel()} // close when clicking outside
          >
            <div
              className="modalContent"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            >
              <button className="closeModalBtn" onClick={handleCancel}>×</button>
              <UserForm
                selectedUser={selectedUser}
                onSubmit={handleAdd}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}
      </div>

      <UserList
        users={currentUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        requestSort={requestSort}
      />
      <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className='previousBtn'
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button 
              key={i + 1} 
              onClick={() => setCurrentPage(i + 1)} 
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default App;
