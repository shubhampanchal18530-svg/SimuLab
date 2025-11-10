import React, { useState } from "react";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [profilePic, setProfilePic] = useState(user.profilePic || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name, email, profilePic };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert("Profile updated successfully!");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>Profile</h2>
      <form onSubmit={handleProfileUpdate}>
        <div style={{ marginBottom: "20px" }}>
          <img
            src={profilePic || "https://via.placeholder.com/100?text=Profile"}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "10px" }}
          />
          <br />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            style={{ padding: "8px", width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ padding: "8px", width: "100%" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
