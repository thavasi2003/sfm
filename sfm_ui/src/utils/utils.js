export const getUserData = () => {
    const userdata = sessionStorage.getItem('userdata');
    return userdata ? JSON.parse(userdata) : null;
  };
  