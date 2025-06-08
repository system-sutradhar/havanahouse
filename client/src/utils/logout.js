export const logout = (context, router) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  context?.setIsLogin(false);
  context?.setCartData(undefined);
  router.push('/');
};
