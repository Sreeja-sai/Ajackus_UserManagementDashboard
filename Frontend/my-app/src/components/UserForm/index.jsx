// src/components/UserForm.jsx
import React, { useState, useEffect } from 'react';
import './index.css'
const UserForm = ({ selectedUser, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ firstName: '',lastName:'', email: '', department: '' });
  // console.log(formData);

useEffect(() => {
  if (selectedUser) {
    setFormData({
      id:selectedUser.id || '',
      firstName: selectedUser.firstName || '',
      lastName: selectedUser.lastName || '',
      email: selectedUser.email || '',
      department: selectedUser.department || ''   
    });
  }
}, [selectedUser]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try{
      if (!formData.firstName || !formData.lastName || !formData.department || !formData.email) {
        alert("All Fields are required");
        return;
      }
      // console.log(formData);
        onSubmit(formData);
        setFormData({ firstName: '',lastName:'', email: '', department: '' });
        onCancel();
    }catch(err){
      alert(err.response.data.error);
    }
    
  };

  return (
    <form className='newUserAddform' onSubmit={handleSubmit}>
      <p >Add New User Details:</p>
      <input
        name="firstName"
        className='formInputs'
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        className='formInputs'
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        name="email"
        className='formInputs'
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        type='email'
      />
      <input
        name="department"
        className='formInputs'
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />
      <button className='addBtn' type="submit">{selectedUser ? 'Update' : 'Add'}</button>
      {selectedUser && <button className='cancelBtn' onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default UserForm;