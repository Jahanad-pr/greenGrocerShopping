import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUserMutation } from "../../../../services/User/userApi";

export default function UserProtecter({ children }) {
  const [getUser] = useGetUserMutation();
  const [userData, setData] = useState(false);
  const [checker, setChecker] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const result = await getUser().unwrap();
        if (isMounted) {
          handleUserData(result);
          setChecker(result.user);
        }
      } catch (error) {
        if (isMounted) {
          setData(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]); // Only re-run if pathname changes

  const handleUserData = (data) => {
    if (!data?.verified && data?.user?.length > 0) {
      navigate('/user/home', {
        state: { message: 'your account is blocked' },
        replace: true
      });
      setData(false);
      return;
    }

    setData(data?.user);

    // Handle routing logic
    if (location.pathname === '/user/signup' && data?.user?.length > 0) {
      navigate('/user/home', {
        state: { message: '', userData: data?.user },
        replace: true
      });
    }

    if (location.pathname.startsWith('/user/profile') && data?.user?.length <= 0) {
      navigate('/user/home', {
        state: { message: '', userData: data?.user },
        replace: true
      });
    }
  };

  // Memoize the userData being passed to children
  const memoizedUserData = useMemo(() => {
    const userDataToPass = Array.isArray(userData) ? userData[0] : userData;
    return userDataToPass;
  }, [userData]); // Only recompute if userData changes

  // Memoize the cloned children with props
  const memoizedChildren = useMemo(() => {
    return React.cloneElement(children, { userData: memoizedUserData });
  }, [children, memoizedUserData]); // Recompute only if children or memoizedUserData changes

  return memoizedChildren;
}