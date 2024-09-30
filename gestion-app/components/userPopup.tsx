// components/UserPopup.tsx
'use client';

import React from 'react';

interface UserPopupProps {
  email: string;
  role: string;
  onClose: () => void;
}

const UserPopup: React.FC<UserPopupProps> = ({ email, role, onClose }) => {
  return (
    <div className="absolute z-10 bg-black border rounded shadow-lg p-4">
      <h3 className="font-bold">Usuario</h3>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Rol:</strong> {role}</p>
    </div>
  );
};

export default UserPopup;