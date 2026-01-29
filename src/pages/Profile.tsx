// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const Profile = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: ''
//     });

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     const fetchProfile = async () => {
//         const response = await axios.get('/api/user/profile');
//         setFormData(response.data);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await axios.put('/api/user/profile', formData);
//         alert('Данные сохранены!');
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Мой профиль</h2>
//             <input
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Имя"
//             />
//             <input
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="Email"
//             />
//             <button type="submit">Сохранить</button>
//         </form>
//     );
// };

// export default Profile;