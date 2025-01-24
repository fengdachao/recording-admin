import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";

const Root = ({ children }) => {
  const [userInfo, setUserInfo] = useState({})
  useEffect(() => {
    const cookies = document.cookie.split(';').map((item) => item.split('='))
    const isAuth = cookies.find(item => item[0].trim() === 'isAuthUnsafe')
    const roleCookie = cookies.find(item => item[0].trim() === 'role')
    const userCookie = cookies.find(item => item[0].trim() === 'user')
    if (roleCookie) {
      setUserInfo({
        role: roleCookie[1],
        loginUser: userCookie[1]
      })
    }
    console.log('cookies in root:', cookies, isAuth)
    console.log(!Array.isArray(isAuth) || isAuth[1] !== 'true')
    // if (!Array.isArray(isAuth) || isAuth[1] !== 'true') {
    //   document.location.href = '/login'
    // } else {
    //   document.location.href = '/dashboard'
    // }
  }, [])
 return <Outlet />;
}

export default Root
