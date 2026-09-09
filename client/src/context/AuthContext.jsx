// import React, { Children } from "react";

// const AuthProvider = ({ Children }) => {
//     const [user, setUser] = React.userstate(null);
//     const [loading, setLoading] = React.useState(true);

//     React.useEffect(() => {
//         const storedUser = localStorage.getItem('user');

//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }

//         setLoading(false);
//     }, []);

//     const login = async (email, password) => {
//         try {
//             const { data } = await api.post('/auth/login', { email, password });
//             setUser(data)
//             localStorage.setItem('user', json.stringify(data));
//             localStorage.setItem('token', data.token);
//             return data;
//         } catch (error) {
//             console.log('login failed',error);
//             throw error
//         }
//     };
//     const register = async (name , email , password) =>{
//         try {
//             const {data} = await api.post('/auth/register', {name, email, password})
//             setUser(data)
//             return data;
//         }catch (error) {
//             console.log('register failed',error);
//             throw error
//     }
// };
//  const verifyOtp = async () =>{
//       try {
//             const { data } = await api.post('/auth/verifyOt');
//             setUser(data)
//             localStorage.setItem('user', json.stringify(data));
//             localStorage.setItem('token', data.token);
//             return data;
//         } catch (error) {
//             console.log('Otp verification failed',error);
//             throw error
//         }

//  }

//  const logout = () =>{
//     setUser(null)
//     localStorage.removeItem('data')
//     localStorage.removeItem('token')

//  }
//  return
//  A

// import React, { Children } from "react";

// const AuthProvider = ({ Children }) => {
//     const [user, setUser] = React.userstate(null);
//     const [loading, setLoading] = React.useState(true);

//     React.useEffect(() => {
//         const storedUser = localStorage.getItem('user');

//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }

//         setLoading(false);
//     }, []);

//     const login = async (email, password) => {
//         try {
//             const { data } = await api.post('/auth/login', { email, password });
//             setUser(data);
//             localStorage.setItem('user', json.stringify(data));
//             localStorage.setItem('token', data.token);
//             return data;
//         } catch (error) {
//             console.log('login failed', error);
//             throw error;
//         }
//     };

//     const register = async (name, email, password) => {
//         try {
//             const { data } = await api.post('/auth/register', {
//                 name,
//                 email,
//                 password
//             });
//             setUser(data);
//             return data;
//         } catch (error) {
//             console.log('register failed', error);
//             throw error;
//         }
//     };

//     const verifyOtp = async () => {
//         try {
//             const { data } = await api.post('/auth/verifyOt');
//             setUser(data);
//             localStorage.setItem('user', json.stringify(data));
//             localStorage.setItem('token', data.token);
//             return data;
//         } catch (error) {
//             console.log('Otp verification failed', error);
//             throw error;
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('data');
//         localStorage.removeItem('token');
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 loading,
//                 login,
//                 register,
//                 verifyOtp,
//                 logout
//             }}
//         >
//             {Children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthProvider;

import React, { createContext } from "react";
import api from "../utils/axios"; 

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      console.log("Login failed", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setUser(data);

      return data;
    } catch (error) {
      console.log("Register failed", error);
      throw error;
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await api.post("/auth/verifyOtp");

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      console.log("OTP verification failed", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;