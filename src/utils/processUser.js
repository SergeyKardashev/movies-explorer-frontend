const processUser = (rawUser) => ({
  userEmail: rawUser.email,
  userName: rawUser.name,
  // userId: currentUser._id, // пока айдишник не нужен.
});

export default processUser;
