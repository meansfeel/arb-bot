function login(username, password) {
  // 验证用户名和密码
  const user = authenticateUser(username, password);
  
  if (!user) {
    return { success: false, message: "用户名或密码错误" };
  }
  
  if (user.is_admin) {
    return { success: true, message: "管理员登录成功" };
  }
  
  if (!user.is_approved) {
    return { success: false, message: "您的账号尚未被批准，请等待管理员审核" };
  }
  
  return { success: true, message: "登录成功" };
}
